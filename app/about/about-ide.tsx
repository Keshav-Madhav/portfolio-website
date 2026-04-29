"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ChevronRight,
  File,
  Folder,
  FolderOpen,
  Code,
  Eye,
} from "lucide-react";
import { useState, useCallback } from "react";
import { profile, projects, experience, education, stack } from "@/lib/data";

type FileItem = {
  name: string;
  type: "file" | "folder";
  id: string;
  children?: FileItem[];
};

const fileTree: FileItem[] = [
  {
    name: "about",
    type: "folder",
    id: "about",
    children: [
      { name: "intro.md", type: "file", id: "intro" },
      { name: "now.md", type: "file", id: "now" },
      { name: "before.md", type: "file", id: "before" },
      { name: "projects.md", type: "file", id: "projects" },
      { name: "stack.json", type: "file", id: "stack" },
      { name: "contact.md", type: "file", id: "contact" },
    ],
  },
];

const featuredProjects = projects.filter((p) => p.featured).slice(0, 5);

export default function AboutIDE() {
  const [activeFile, setActiveFile] = useState("intro");
  const [expandedFolders, setExpandedFolders] = useState<string[]>(["about"]);
  const [viewMode, setViewMode] = useState<"raw" | "rendered">("raw");

  const toggleFolder = (id: string) => {
    setExpandedFolders((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const handleInternalLink = useCallback((fileId: string) => {
    setActiveFile(fileId);
  }, []);

  const fileNames: Record<string, string> = {
    intro: "intro.md",
    now: "now.md",
    before: "before.md",
    projects: "projects.md",
    stack: "stack.json",
    contact: "contact.md",
  };

  return (
    <div className="h-[calc(100vh-4rem)] min-h-[500px] pt-16 pb-4 px-3 sm:h-[calc(100vh-5rem)] sm:pt-20 sm:pb-6 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mx-auto h-full max-w-6xl flex flex-col overflow-hidden rounded-xl border border-edge bg-surface/60 backdrop-blur-sm"
      >
        {/* Title bar */}
        <div className="flex items-center justify-between border-b border-edge bg-canvas/80 px-3 py-2 shrink-0 sm:px-4 sm:py-2.5">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-red-500/80 sm:h-3 sm:w-3" />
              <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80 sm:h-3 sm:w-3" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-500/80 sm:h-3 sm:w-3" />
            </div>
            <span className="ml-2 font-mono text-[10px] text-muted sm:ml-3 sm:text-xs">
              ~/{fileNames[activeFile]}
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs text-muted font-mono">
            <span>UTF-8</span>
            <span>{activeFile === "stack" ? "JSON" : "Markdown"}</span>
          </div>
        </div>

        <div className="flex flex-1 min-h-0">
          {/* Sidebar - File Tree */}
          <div className="hidden lg:flex w-52 shrink-0 flex-col border-r border-edge bg-canvas/40">
            <div className="p-2 text-[10px] font-semibold uppercase tracking-widest text-muted shrink-0">
              Explorer
            </div>
            <nav 
              className="flex-1 min-h-0 overflow-y-auto pb-4" 
              data-lenis-prevent
              style={{ overscrollBehavior: "contain" }}
            >
              {fileTree.map((item) => (
                <FileTreeItem
                  key={item.id}
                  item={item}
                  depth={0}
                  activeFile={activeFile}
                  expandedFolders={expandedFolders}
                  onFileClick={setActiveFile}
                  onFolderToggle={toggleFolder}
                />
              ))}
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-h-0 min-w-0">
            {/* Tabs */}
            <div className="flex items-center gap-px border-b border-edge bg-canvas/60 overflow-x-auto shrink-0 scrollbar-none">
              {Object.entries(fileNames).map(([id, name]) => (
                <button
                  key={id}
                  onClick={() => setActiveFile(id)}
                  className={`flex min-h-[44px] items-center gap-1 px-2.5 py-2.5 text-[10px] font-mono transition-colors whitespace-nowrap sm:gap-1.5 sm:px-3 sm:py-2 sm:text-xs ${
                    activeFile === id
                      ? "bg-surface/80 text-ink border-t-2 border-t-violet-500"
                      : "text-muted hover:text-ink hover:bg-surface/40"
                  }`}
                >
                  <File className="h-3 w-3 shrink-0" />
                  <span className="hidden xs:inline sm:inline">{name}</span>
                  <span className="xs:hidden sm:hidden">{name.split('.')[0]}</span>
                </button>
              ))}
            </div>

            {/* Editor Content with line numbers - scrollable */}
            <div 
              className="flex-1 min-h-0 overflow-y-scroll"
              data-lenis-prevent
              style={{ overscrollBehavior: "contain" }}
            >
              <EditorContent 
                activeFile={activeFile} 
                onFileClick={handleInternalLink} 
                viewMode={viewMode}
              />
            </div>
          </div>
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between border-t border-edge bg-canvas/80 px-3 py-1 text-[9px] text-muted font-mono shrink-0 sm:px-4 sm:py-1.5 sm:text-[10px]">
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 sm:h-2 sm:w-2" />
              Ready
            </span>
            <span className="hidden sm:inline">Ln 1, Col 1</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {/* View mode toggle */}
            <button
              onClick={() => setViewMode(viewMode === "raw" ? "rendered" : "raw")}
              className={`flex min-h-[36px] items-center gap-1 px-2 py-1 rounded transition-colors sm:min-h-0 sm:gap-1.5 sm:py-0.5 ${
                viewMode === "rendered" 
                  ? "bg-violet-500/20 text-violet-300" 
                  : "hover:bg-surface/60 hover:text-ink"
              }`}
            >
              {viewMode === "raw" ? (
                <>
                  <Eye className="h-3 w-3" />
                  <span className="hidden sm:inline">Preview</span>
                </>
              ) : (
                <>
                  <Code className="h-3 w-3" />
                  <span className="hidden sm:inline">Raw</span>
                </>
              )}
            </button>
            <span className="hidden sm:inline">main</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function FileTreeItem({
  item,
  depth,
  activeFile,
  expandedFolders,
  onFileClick,
  onFolderToggle,
}: {
  item: FileItem;
  depth: number;
  activeFile: string;
  expandedFolders: string[];
  onFileClick: (id: string) => void;
  onFolderToggle: (id: string) => void;
}) {
  const isExpanded = expandedFolders.includes(item.id);
  const isActive = activeFile === item.id;
  const paddingLeft = 8 + depth * 12;

  if (item.type === "folder") {
    return (
      <div>
        <button
          onClick={() => onFolderToggle(item.id)}
          style={{ paddingLeft }}
          className="flex min-h-[36px] w-full items-center gap-1.5 py-1.5 pr-2 text-xs text-muted hover:bg-surface/60 hover:text-ink transition-colors font-mono"
        >
          <ChevronRight
            className={`h-3 w-3 transition-transform ${isExpanded ? "rotate-90" : ""}`}
          />
          {isExpanded ? (
            <FolderOpen className="h-3.5 w-3.5 text-amber-400" />
          ) : (
            <Folder className="h-3.5 w-3.5 text-amber-400" />
          )}
          <span>{item.name}</span>
        </button>
        {isExpanded && item.children && (
          <div>
            {item.children.map((child) => (
              <FileTreeItem
                key={child.id}
                item={child}
                depth={depth + 1}
                activeFile={activeFile}
                expandedFolders={expandedFolders}
                onFileClick={onFileClick}
                onFolderToggle={onFolderToggle}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={() => onFileClick(item.id)}
      style={{ paddingLeft: paddingLeft + 16 }}
      className={`flex min-h-[36px] w-full items-center gap-1.5 py-1.5 pr-2 text-xs transition-colors font-mono ${
        isActive
          ? "bg-violet-500/15 text-violet-300"
          : "text-muted hover:bg-surface/60 hover:text-ink"
      }`}
    >
      <File className="h-3.5 w-3.5 text-sky-400" />
      <span>{item.name}</span>
    </button>
  );
}

function EditorContent({ 
  activeFile, 
  onFileClick,
  viewMode,
}: { 
  activeFile: string;
  onFileClick: (fileId: string) => void;
  viewMode: "raw" | "rendered";
}) {
  const content: Record<string, string[]> = {
    intro: getIntroContent(),
    now: getNowContent(),
    before: getBeforeContent(),
    projects: getProjectsContent(),
    stack: getStackContent(),
    contact: getContactContent(),
  };

  const lines = content[activeFile] || [];

  if (viewMode === "rendered") {
    return (
      <motion.div
        key={`${activeFile}-rendered`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.15 }}
        className="p-3 sm:p-6 max-w-2xl"
      >
        <RenderedContent activeFile={activeFile} onFileClick={onFileClick} />
      </motion.div>
    );
  }

  return (
    <motion.div
      key={`${activeFile}-raw`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15 }}
      className="font-mono text-sm leading-relaxed py-2"
    >
      {lines.map((line, i) => (
        <div key={i} className="flex hover:bg-surface/30 group">
          <span className="w-10 sm:w-12 shrink-0 pr-2 sm:pr-4 text-right text-muted/50 select-none text-xs leading-relaxed">
            {i + 1}
          </span>
          <span className="flex-1 min-w-0 pr-3 sm:pr-4 break-words">
            <MarkdownLine line={line} onFileClick={onFileClick} />
          </span>
        </div>
      ))}
    </motion.div>
  );
}

function RenderedContent({
  activeFile,
  onFileClick,
}: {
  activeFile: string;
  onFileClick: (fileId: string) => void;
}) {
  const views: Record<string, React.ReactNode> = {
    intro: <RenderedIntro onFileClick={onFileClick} />,
    now: <RenderedNow onFileClick={onFileClick} />,
    before: <RenderedBefore onFileClick={onFileClick} />,
    projects: <RenderedProjects onFileClick={onFileClick} />,
    stack: <RenderedStack />,
    contact: <RenderedContact onFileClick={onFileClick} />,
  };

  return views[activeFile] || null;
}

function RenderedIntro({ onFileClick }: { onFileClick: (id: string) => void }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 text-3xl">
          👋
        </div>
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">{profile.name}</h1>
          <p className="font-mono text-sm text-violet-400">{profile.handle}</p>
        </div>
      </div>

      {/* Quick facts */}
      <div className="flex flex-wrap gap-2">
        <Pill>{profile.role} @ {profile.company}</Pill>
        <Pill>{profile.location}</Pill>
        <Pill>{profile.githubStats.repos} repos</Pill>
      </div>

      {/* The 5-second read — headline + proof points */}
      <div className="rounded-lg border border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-cyan-500/5 p-4 sm:p-5">
        <p className="font-display text-base font-semibold leading-snug text-ink sm:text-lg">
          {profile.headline}
        </p>
        <div className="mt-4 grid grid-cols-2 gap-2">
          {profile.proofPoints.map((p) => (
            <div
              key={p.label}
              className="rounded-md border border-edge/60 bg-canvas/60 p-2.5"
            >
              <div className="font-display text-base font-semibold text-violet-300">
                {p.value}
              </div>
              <div className="mt-0.5 font-mono text-[9px] uppercase tracking-wider text-muted">
                {p.label}
              </div>
              <div className="mt-0.5 text-[11px] leading-snug text-ink/70">
                {p.detail}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Capabilities — the 30-second read */}
      <div>
        <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted">
          What I actually build
        </p>
        <div className="grid gap-2">
          {profile.capabilities.map((c) => (
            <div
              key={c.title}
              className="rounded-md border border-edge/60 bg-surface/30 p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-ink">{c.title}</p>
                <span className="shrink-0 rounded-full border border-edge/60 bg-canvas/60 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted">
                  {c.tag}
                </span>
              </div>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">{c.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* The longer read */}
      <div>
        <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted">
          The longer read
        </p>
        <p className="text-sm leading-relaxed text-ink/80">{profile.extendedBio.intro}</p>
      </div>

      {/* Philosophy */}
      <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-4">
        <p className="text-sm italic text-ink/70">&ldquo;{profile.extendedBio.philosophy}&rdquo;</p>
      </div>

      {/* Nav cards */}
      <div className="grid gap-2 sm:grid-cols-2">
        <NavCard onClick={() => onFileClick("now")} label="now.md" desc="Current work" />
        <NavCard onClick={() => onFileClick("before")} label="before.md" desc="Previous experience" />
        <NavCard onClick={() => onFileClick("projects")} label="projects.md" desc="Side projects" />
        <NavCard onClick={() => onFileClick("contact")} label="contact.md" desc="Get in touch" />
      </div>

      {/* Site links */}
      <div className="flex flex-wrap gap-2 pt-2">
        <SiteLink href="/">Home</SiteLink>
        <SiteLink href="/#work">Work</SiteLink>
        <SiteLink href="/#projects">Projects</SiteLink>
        <SiteLink href="/#contact">Contact</SiteLink>
      </div>
    </div>
  );
}

function RenderedNow({ onFileClick }: { onFileClick: (id: string) => void }) {
  const vf = experience[0];
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-mono text-muted uppercase tracking-wider mb-1">Current</p>
        <h1 className="font-display text-2xl font-semibold text-ink">{vf.role}</h1>
        <p className="text-sm text-muted mt-1">
          <a href={vf.companyUrl} target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">
            {vf.company}
          </a>
          {" · "}{vf.period}
        </p>
      </div>

      <p className="text-ink/80 leading-relaxed">{vf.summary}</p>

      {/* Key areas */}
      <div className="space-y-3">
        <p className="text-xs font-mono text-muted uppercase tracking-wider">Key areas</p>
        <div className="grid gap-2">
          {vf.highlights.map((h) => (
            <div key={h.title} className="rounded-lg border border-edge/60 bg-surface/30 p-3">
              <p className="font-medium text-ink text-sm">{h.title}</p>
              <p className="text-xs text-muted mt-1">{h.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-ink/70 text-sm leading-relaxed">{profile.extendedBio.current}</p>

      {/* Nav */}
      <div className="flex flex-wrap gap-2 pt-4 border-t border-edge/40">
        <NavCard onClick={() => onFileClick("before")} label="before.md" desc="Previous" small />
        <NavCard onClick={() => onFileClick("projects")} label="projects.md" desc="Projects" small />
        <NavCard onClick={() => onFileClick("intro")} label="intro.md" desc="Intro" small />
      </div>
      <SiteLink href="/#work">View full work section →</SiteLink>
    </div>
  );
}

function RenderedBefore({ onFileClick }: { onFileClick: (id: string) => void }) {
  const pb = experience[1];
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-mono text-muted uppercase tracking-wider mb-1">Previously</p>
        <h1 className="font-display text-2xl font-semibold text-ink">{pb.role}</h1>
        <p className="text-sm text-muted mt-1">
          <a href={pb.companyUrl} target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">
            {pb.company}
          </a>
          {" · "}{pb.period}
        </p>
      </div>

      <p className="text-ink/80 leading-relaxed">{pb.summary}</p>

      {/* Highlights */}
      <div className="space-y-3">
        <p className="text-xs font-mono text-muted uppercase tracking-wider">Highlights</p>
        <div className="grid gap-2">
          {pb.highlights.map((h) => (
            <div key={h.title} className="rounded-lg border border-edge/60 bg-surface/30 p-3">
              <p className="font-medium text-ink text-sm">{h.title}</p>
              <p className="text-xs text-muted mt-1">{h.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-ink/70 text-sm leading-relaxed">{profile.extendedBio.past}</p>

      {/* Nav */}
      <div className="flex flex-wrap gap-2 pt-4 border-t border-edge/40">
        <NavCard onClick={() => onFileClick("now")} label="now.md" desc="Current" small />
        <NavCard onClick={() => onFileClick("projects")} label="projects.md" desc="Projects" small />
        <NavCard onClick={() => onFileClick("intro")} label="intro.md" desc="Intro" small />
      </div>
    </div>
  );
}

function RenderedProjects({ onFileClick }: { onFileClick: (id: string) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink">Side quests</h1>
        <p className="text-sm text-muted mt-2 leading-relaxed">{profile.extendedBio.sideProjects}</p>
      </div>

      {/* Featured projects */}
      <div className="grid gap-3">
        {featuredProjects.map((p) => (
          <a
            key={p.slug}
            href={p.links[0]?.href || "/#projects"}
            target={p.links[0]?.href?.startsWith("http") ? "_blank" : undefined}
            rel={p.links[0]?.href?.startsWith("http") ? "noopener noreferrer" : undefined}
            className="group block rounded-lg border border-edge/60 bg-surface/30 p-4 transition-colors hover:border-violet-500/40 hover:bg-surface/50"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-ink group-hover:text-violet-300 transition-colors">{p.title}</p>
                <p className="text-xs font-mono text-muted mt-0.5">{p.kind}</p>
              </div>
              {p.stat && (
                <span className="shrink-0 text-xs font-mono text-violet-400">{p.stat.value}</span>
              )}
            </div>
            <p className="text-xs text-muted mt-2 line-clamp-2">{p.description}</p>
            <div className="flex flex-wrap gap-1 mt-3">
              {p.stack.slice(0, 4).map((s) => (
                <span key={s} className="px-1.5 py-0.5 rounded bg-canvas/60 text-[10px] text-muted">{s}</span>
              ))}
            </div>
          </a>
        ))}
      </div>

      {/* Links */}
      <div className="flex flex-wrap gap-3 pt-2">
        <SiteLink href="/#projects">All projects →</SiteLink>
        <SiteLink href={profile.github} external>GitHub →</SiteLink>
      </div>

      {/* Nav */}
      <div className="flex flex-wrap gap-2 pt-4 border-t border-edge/40">
        <NavCard onClick={() => onFileClick("stack")} label="stack.json" desc="Tech stack" small />
        <NavCard onClick={() => onFileClick("now")} label="now.md" desc="Current work" small />
        <NavCard onClick={() => onFileClick("intro")} label="intro.md" desc="Intro" small />
      </div>
    </div>
  );
}

function RenderedStack() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-ink">Tech Stack</h1>

      <div className="grid gap-4 sm:grid-cols-2">
        {stack.map((group) => (
          <div key={group.group} className="rounded-lg border border-edge/60 bg-surface/30 p-4">
            <p className="text-xs font-mono text-violet-400 uppercase tracking-wider mb-3">{group.group}</p>
            <div className="flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <span key={item} className="px-2 py-1 rounded-md bg-canvas/60 text-xs text-ink/80">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <SiteLink href="/#stack">Full stack breakdown →</SiteLink>
    </div>
  );
}

function RenderedContact({ onFileClick }: { onFileClick: (id: string) => void }) {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-semibold text-ink">Get in touch</h1>

      {/* Contact cards */}
      <div className="grid gap-2 sm:grid-cols-2">
        <ContactCard href={`mailto:${profile.email}`} label="Email" value={profile.email} />
        <ContactCard href={profile.github} label="GitHub" value="Keshav-Madhav" external />
        <ContactCard href={profile.linkedin} label="LinkedIn" value="keshav-madhav" external />
        <ContactCard href={profile.resume} label="Resume" value="Download PDF" download />
      </div>

      {/* Location */}
      <div className="rounded-lg border border-edge/60 bg-surface/30 p-4">
        <p className="text-sm text-ink/80">
          Based in <span className="text-ink font-medium">{profile.location}</span>. 
          Typical response within 24 hours.
        </p>
      </div>

      {/* Topics */}
      <div>
        <p className="text-xs font-mono text-muted uppercase tracking-wider mb-2">Happy to chat about</p>
        <div className="flex flex-wrap gap-2">
          <Pill>AI systems</Pill>
          <Pill>Creative coding</Pill>
          <Pill>Developer tooling</Pill>
        </div>
      </div>

      <SiteLink href="/#contact">Use contact form →</SiteLink>

      {/* Nav */}
      <div className="flex flex-wrap gap-2 pt-4 border-t border-edge/40">
        <NavCard onClick={() => onFileClick("intro")} label="intro.md" desc="About me" small />
        <NavCard onClick={() => onFileClick("projects")} label="projects.md" desc="My work" small />
      </div>
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-edge/60 bg-surface/40 px-2.5 py-1 text-xs text-muted">
      {children}
    </span>
  );
}

function NavCard({ 
  onClick, 
  label, 
  desc, 
  small 
}: { 
  onClick: () => void; 
  label: string; 
  desc: string;
  small?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`group flex min-h-[44px] items-center gap-2 rounded-lg border border-edge/60 bg-surface/30 transition-colors hover:border-violet-500/40 hover:bg-surface/50 text-left ${
        small ? "px-3 py-2" : "p-3"
      }`}
    >
      <File className={`text-sky-400 ${small ? "h-3.5 w-3.5" : "h-4 w-4"}`} />
      <div>
        <p className={`font-mono text-ink group-hover:text-violet-300 transition-colors ${small ? "text-xs" : "text-sm"}`}>
          {label}
        </p>
        {!small && <p className="text-xs text-muted">{desc}</p>}
      </div>
    </button>
  );
}

function SiteLink({ 
  href, 
  children, 
  external 
}: { 
  href: string; 
  children: React.ReactNode;
  external?: boolean;
}) {
  if (external || href.startsWith("http")) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-violet-400 hover:text-violet-300 hover:underline"
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className="text-sm text-violet-400 hover:text-violet-300 hover:underline">
      {children}
    </Link>
  );
}

function ContactCard({
  href,
  label,
  value,
  external,
  download,
}: {
  href: string;
  label: string;
  value: string;
  external?: boolean;
  download?: boolean;
}) {
  const props = external
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : download
    ? { download: true }
    : {};

  return (
    <a
      href={href}
      {...props}
      className="group flex min-h-[48px] items-center gap-3 rounded-lg border border-edge/60 bg-surface/30 p-3 transition-colors hover:border-violet-500/40 hover:bg-surface/50"
    >
      <div>
        <p className="text-xs text-muted">{label}</p>
        <p className="text-sm font-medium text-ink group-hover:text-violet-300 transition-colors">{value}</p>
      </div>
    </a>
  );
}

function MarkdownLine({ 
  line, 
  onFileClick 
}: { 
  line: string;
  onFileClick: (fileId: string) => void;
}) {
  if (!line) return <span className="text-transparent select-none">.</span>;

  // Headers
  if (line.startsWith("# ")) {
    return (
      <span>
        <span className="text-violet-400"># </span>
        <span className="text-ink font-semibold">{line.slice(2)}</span>
      </span>
    );
  }
  if (line.startsWith("## ")) {
    return (
      <span>
        <span className="text-violet-400">## </span>
        <span className="text-ink">{line.slice(3)}</span>
      </span>
    );
  }
  if (line.startsWith("### ")) {
    return (
      <span>
        <span className="text-violet-400">### </span>
        <span className="text-ink/90">{renderInline(line.slice(4), onFileClick)}</span>
      </span>
    );
  }

  // Horizontal rule
  if (line === "---") {
    return <span className="text-muted">---</span>;
  }

  // Blockquote
  if (line.startsWith("> ")) {
    return (
      <span>
        <span className="text-emerald-400">&gt; </span>
        <span className="text-muted italic">{line.slice(2)}</span>
      </span>
    );
  }

  // List items
  if (line.startsWith("- ")) {
    return (
      <span>
        <span className="text-cyan-400">- </span>
        <span className="text-ink/80">{renderInline(line.slice(2), onFileClick)}</span>
      </span>
    );
  }

  // Numbered list
  const numberedMatch = line.match(/^(\d+)\. /);
  if (numberedMatch) {
    return (
      <span>
        <span className="text-cyan-400">{numberedMatch[1]}. </span>
        <span className="text-ink/80">{renderInline(line.slice(numberedMatch[0].length), onFileClick)}</span>
      </span>
    );
  }

  // JSON-like lines
  if (line.trim().startsWith('"') || line.trim().startsWith('{') || line.trim().startsWith('}') || line.trim().startsWith('[') || line.trim().startsWith(']')) {
    return <span className="text-ink/80">{renderJson(line)}</span>;
  }

  // Italic standalone
  if (line.startsWith("*") && line.endsWith("*") && !line.startsWith("**")) {
    return <span className="text-muted italic">{renderInline(line, onFileClick)}</span>;
  }

  // Regular text
  return <span className="text-ink/70">{renderInline(line, onFileClick)}</span>;
}

function renderInline(text: string, onFileClick: (fileId: string) => void): React.ReactNode {
  const parts: React.ReactNode[] = [];
  let remaining = text;
  let key = 0;

  // Map of internal file references
  const internalFiles: Record<string, string> = {
    "intro.md": "intro",
    "now.md": "now",
    "before.md": "before",
    "projects.md": "projects",
    "stack.json": "stack",
    "contact.md": "contact",
  };

  while (remaining.length > 0) {
    // Links [text](url)
    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      const [full, linkText, url] = linkMatch;
      const internalFileId = internalFiles[url];
      const isExternal = url.startsWith("http");
      
      const shortUrl = url.length > 25 ? url.slice(0, 22) + "..." : url;
      parts.push(
        <span key={key++} className="inline">
          <span className="text-muted">[</span>
          {internalFileId ? (
            <button
              onClick={() => onFileClick(internalFileId)}
              className="text-cyan-400 hover:underline hover:text-cyan-300"
            >
              {linkText}
            </button>
          ) : isExternal ? (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline hover:text-cyan-300"
            >
              {linkText}
            </a>
          ) : (
            <Link href={url} className="text-cyan-400 hover:underline hover:text-cyan-300">
              {linkText}
            </Link>
          )}
          <span className="text-muted">](</span>
          <span className="text-violet-400/50 text-xs break-all">{shortUrl}</span>
          <span className="text-muted">)</span>
        </span>
      );
      remaining = remaining.slice(full.length);
      continue;
    }

    // Bold **text**
    const boldMatch = remaining.match(/^\*\*([^*]+)\*\*/);
    if (boldMatch) {
      parts.push(
        <span key={key++}>
          <span className="text-muted">**</span>
          <span className="text-ink font-medium">{boldMatch[1]}</span>
          <span className="text-muted">**</span>
        </span>
      );
      remaining = remaining.slice(boldMatch[0].length);
      continue;
    }

    // Italic *text*
    const italicMatch = remaining.match(/^\*([^*]+)\*/);
    if (italicMatch) {
      parts.push(
        <span key={key++}>
          <span className="text-muted">*</span>
          <span className="italic">{italicMatch[1]}</span>
          <span className="text-muted">*</span>
        </span>
      );
      remaining = remaining.slice(italicMatch[0].length);
      continue;
    }

    // Inline code `text`
    const codeMatch = remaining.match(/^`([^`]+)`/);
    if (codeMatch) {
      parts.push(
        <span key={key++}>
          <span className="text-muted">`</span>
          <span className="text-amber-300">{codeMatch[1]}</span>
          <span className="text-muted">`</span>
        </span>
      );
      remaining = remaining.slice(codeMatch[0].length);
      continue;
    }

    // Regular character
    parts.push(<span key={key++}>{remaining[0]}</span>);
    remaining = remaining.slice(1);
  }

  return <>{parts}</>;
}

function renderJson(line: string): React.ReactNode {
  const trimmed = line.trim();
  const indent = line.length - line.trimStart().length;
  const spaces = "  ".repeat(indent / 2);

  if (trimmed === "{" || trimmed === "}" || trimmed === "{}" || trimmed === "[" || trimmed === "]" || trimmed === "},") {
    return <span className="text-muted">{spaces}{trimmed}</span>;
  }

  // Key-value pair
  const kvMatch = trimmed.match(/^"([^"]+)":\s*(.+)$/);
  if (kvMatch) {
    const [, key, value] = kvMatch;
    return (
      <span>
        {spaces}
        <span className="text-cyan-400">&quot;{key}&quot;</span>
        <span className="text-muted">: </span>
        <span className="text-amber-300">{value}</span>
      </span>
    );
  }

  // Array item
  if (trimmed.startsWith('"')) {
    return <span>{spaces}<span className="text-amber-300">{trimmed}</span></span>;
  }

  return <span className="text-ink/70">{line}</span>;
}

function getIntroContent(): string[] {
  return [
    `# ${profile.name}`,
    ``,
    `> ${profile.handle} · ${profile.role} @ [${profile.company}](https://www.verbaflo.ai/)`,
    ``,
    `## TL;DR`,
    ``,
    `**${profile.headline}**`,
    ``,
    ...profile.proofPoints.map((p) => `- **${p.value}** ${p.label} — ${p.detail}`),
    ``,
    `## What I actually build`,
    ``,
    ...profile.capabilities.flatMap((c) => [
      `### ${c.title} \`${c.tag}\``,
      ``,
      c.detail,
      ``,
    ]),
    `## Quick facts`,
    ``,
    `- **Role:** ${profile.role} @ [${profile.company}](https://www.verbaflo.ai/)`,
    `- **Location:** ${profile.location}`,
    `- **Education:** ${education.degree}`,
    `- **GitHub:** [${profile.githubStats.repos} repos](${profile.github})`,
    ``,
    `## The longer read`,
    ``,
    profile.extendedBio.intro,
    ``,
    `## Philosophy`,
    ``,
    `> ${profile.extendedBio.philosophy}`,
    ``,
    `---`,
    ``,
    `## Navigate`,
    ``,
    `- [now.md](now.md) — Current work`,
    `- [before.md](before.md) — Previous experience`,
    `- [projects.md](projects.md) — Side projects`,
    `- [stack.json](stack.json) — Tech stack`,
    `- [contact.md](contact.md) — Get in touch`,
    ``,
    `**Site:** [Home](/) · [Work](/#work) · [Projects](/#projects) · [Contact](/#contact)`,
  ];
}

function getNowContent(): string[] {
  const vf = experience[0];
  return [
    `# What I'm doing now`,
    ``,
    `## ${vf.role}`,
    ``,
    `**[${vf.company}](${vf.companyUrl})** · ${vf.period}`,
    ``,
    vf.summary,
    ``,
    `## Key areas`,
    ``,
    ...vf.highlights.map((h) => `- **${h.title}** — ${h.detail}`),
    ``,
    `## Focus`,
    ``,
    profile.extendedBio.current,
    ``,
    `---`,
    ``,
    `## Navigate`,
    ``,
    `- [before.md](before.md) — Previous at PrudentBit`,
    `- [projects.md](projects.md) — Side projects`,
    `- [intro.md](intro.md) — Back to intro`,
    ``,
    `**Site:** [Work](/#work)`,
  ];
}

function getBeforeContent(): string[] {
  const pb = experience[1];
  return [
    `# Before this`,
    ``,
    `## ${pb.role}`,
    ``,
    `**[${pb.company}](${pb.companyUrl})** · ${pb.period}`,
    ``,
    pb.summary,
    ``,
    `## Highlights`,
    ``,
    ...pb.highlights.map((h) => `- **${h.title}** — ${h.detail}`),
    ``,
    `## The story`,
    ``,
    profile.extendedBio.past,
    ``,
    `---`,
    ``,
    `## Navigate`,
    ``,
    `- [now.md](now.md) — Current at VerbaFlo`,
    `- [projects.md](projects.md) — Side projects`,
    `- [intro.md](intro.md) — Back to intro`,
    ``,
    `**Site:** [Work](/#work)`,
  ];
}

function getProjectsContent(): string[] {
  return [
    `# Side quests`,
    ``,
    profile.extendedBio.sideProjects,
    ``,
    `## Featured`,
    ``,
    ...featuredProjects.flatMap((p) => [
      `### [${p.title}](${p.links[0]?.href || "/#projects"})`,
      ``,
      `\`${p.kind}\``,
      ``,
      p.description,
      ``,
      `- **Stack:** ${p.stack.slice(0, 4).join(", ")}`,
      ...(p.stat ? [`- **${p.stat.label}:** ${p.stat.value}`] : []),
      ``,
    ]),
    `---`,
    ``,
    `## Navigate`,
    ``,
    `- [stack.json](stack.json) — Tech stack`,
    `- [now.md](now.md) — Current work`,
    `- [intro.md](intro.md) — Back to intro`,
    ``,
    `**Site:** [Projects](/#projects) · [GitHub](${profile.github})`,
  ];
}

function getStackContent(): string[] {
  return [
    `{`,
    ...stack.flatMap((group, gi) => [
      `  "${group.group.toLowerCase().replace(/ \/ /g, "_").replace(/ /g, "_")}": [`,
      ...group.items.map((item, ii) => 
        `    "${item}"${ii < group.items.length - 1 ? "," : ""}`
      ),
      `  ]${gi < stack.length - 1 ? "," : ""}`,
    ]),
    `}`,
    ``,
    `// See full breakdown: /#stack`,
  ];
}

function getContactContent(): string[] {
  return [
    `# Get in touch`,
    ``,
    `## Links`,
    ``,
    `- **Email:** [${profile.email}](mailto:${profile.email})`,
    `- **GitHub:** [Keshav-Madhav](${profile.github})`,
    `- **LinkedIn:** [keshav-madhav](${profile.linkedin})`,
    `- **Resume:** [Download PDF](${profile.resume})`,
    ``,
    `## Location`,
    ``,
    `Based in **${profile.location}**. Typical response within 24h.`,
    ``,
    `## Chat about`,
    ``,
    `- AI systems and agentic pipelines`,
    `- Creative coding and simulations`,
    `- Developer tooling`,
    ``,
    `---`,
    ``,
    `## Navigate`,
    ``,
    `- [intro.md](intro.md) — About me`,
    `- [projects.md](projects.md) — My work`,
    `- [now.md](now.md) — Current role`,
    ``,
    `**Site:** [Contact](/#contact) · [Home](/)`,
  ];
}
