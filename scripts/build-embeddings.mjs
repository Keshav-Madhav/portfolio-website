#!/usr/bin/env node
// =============================================================================
// build-embeddings.mjs — chunks the expanded context corpus and embeds each
// chunk using Transformers.js (all-MiniLM-L6-v2). Output is a JSON file with
// text + vector pairs that /api/chat uses for semantic search at runtime.
//
// Run as part of `prebuild` or standalone via `npm run build-embeddings`.
// First run downloads the ~30MB model to node_modules/.cache/@xenova/transformers.
//
// Reads scripts/corpus-source.mjs (ES module with ~50+ topical sections).
// Output: lib/context-embeddings.json (committed to the repo so production
// builds use the pre-computed vectors — this is what "prestored" means).
// =============================================================================

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { CORPUS_SECTIONS } from "./corpus-source.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../lib/context-embeddings.json");

// Chunk config — tuned for all-MiniLM-L6-v2 (512 token max, 384-dim vectors)
// Smaller chunks = finer retrieval granularity but more vectors to search.
// With ~45 sections and 300-token chunks, expect ~80-120 chunks total.
const CHUNK_SIZE = 300;      // tokens per chunk
const CHUNK_OVERLAP = 60;    // overlap for context continuity

// =============================================================================
// CHUNKING — splits text into overlapping segments
// =============================================================================

function chunkText(text, chunkSize = CHUNK_SIZE, overlap = CHUNK_OVERLAP) {
  const chunks = [];
  const sentences = text.split(/(?<=[.!?])\s+/);
  
  let currentChunk = "";
  let currentTokenEstimate = 0;
  
  for (const sentence of sentences) {
    const sentenceTokens = Math.ceil(sentence.length / 4); // rough estimate
    
    if (currentTokenEstimate + sentenceTokens > chunkSize && currentChunk) {
      chunks.push(currentChunk.trim());
      
      // Start new chunk with overlap from end of previous
      const words = currentChunk.split(/\s+/);
      const overlapWords = words.slice(-Math.floor(overlap / 2));
      currentChunk = overlapWords.join(" ") + " " + sentence;
      currentTokenEstimate = Math.ceil(currentChunk.length / 4);
    } else {
      currentChunk += (currentChunk ? " " : "") + sentence;
      currentTokenEstimate += sentenceTokens;
    }
  }
  
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}

// Split by markdown sections first, then chunk within each
function chunkCorpus(sections) {
  const allChunks = [];
  
  for (const section of sections) {
    const { id, title, content } = section;
    const chunks = chunkText(content);
    
    for (let i = 0; i < chunks.length; i++) {
      allChunks.push({
        id: `${id}-${i}`,
        section: title,
        text: chunks[i],
        vector: null, // filled in later
      });
    }
  }
  
  return allChunks;
}

// =============================================================================
// EMBEDDING — uses Transformers.js with all-MiniLM-L6-v2
// =============================================================================

async function embedChunks(chunks) {
  console.log("[embeddings] loading model (first run downloads ~30MB)...");
  
  // Dynamic import since @xenova/transformers is ESM-only
  const { pipeline } = await import("@xenova/transformers");
  
  const extractor = await pipeline(
    "feature-extraction",
    "Xenova/all-MiniLM-L6-v2",
    { quantized: true }
  );
  
  console.log(`[embeddings] embedding ${chunks.length} chunks...`);
  
  const batchSize = 8;
  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);
    const texts = batch.map((c) => c.text);
    
    const outputs = await extractor(texts, {
      pooling: "mean",
      normalize: true,
    });
    
    for (let j = 0; j < batch.length; j++) {
      batch[j].vector = Array.from(outputs[j].data);
    }
    
    if ((i + batchSize) % 50 === 0 || i + batchSize >= chunks.length) {
      console.log(`[embeddings] progress: ${Math.min(i + batchSize, chunks.length)}/${chunks.length}`);
    }
  }
  
  return chunks;
}

// =============================================================================
// MAIN
// =============================================================================

async function main() {
  const sections = CORPUS_SECTIONS;
  
  if (!sections || sections.length === 0) {
    console.warn("[embeddings] no sections found in corpus — check scripts/corpus-source.mjs");
    fs.writeFileSync(OUT, JSON.stringify({ chunks: [], builtAt: new Date().toISOString() }));
    return;
  }
  
  // Log corpus stats
  const totalChars = sections.reduce((sum, s) => sum + s.content.length, 0);
  console.log(`[embeddings] loaded ${sections.length} sections, ${(totalChars / 1000).toFixed(1)}K chars total`);
  
  // Chunk the corpus
  const chunks = chunkCorpus(sections);
  console.log(`[embeddings] created ${chunks.length} chunks`);
  
  // Embed all chunks
  const embeddedChunks = await embedChunks(chunks);
  
  // Write output
  const output = {
    builtAt: new Date().toISOString(),
    model: "Xenova/all-MiniLM-L6-v2",
    dimensions: embeddedChunks[0]?.vector?.length ?? 384,
    chunks: embeddedChunks.map((c) => ({
      id: c.id,
      section: c.section,
      text: c.text,
      vector: c.vector,
    })),
  };
  
  fs.writeFileSync(OUT, JSON.stringify(output));
  
  const sizeKB = (fs.statSync(OUT).size / 1024).toFixed(1);
  console.log(`[embeddings] wrote ${OUT} (${sizeKB} KB, ${embeddedChunks.length} chunks)`);
}

main().catch((err) => {
  console.error("[embeddings] error:", err.message);
  // Write empty file so build doesn't fail
  fs.writeFileSync(OUT, JSON.stringify({ chunks: [], builtAt: new Date().toISOString(), error: err.message }));
});
