"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, generateId } from "ai";
import { supabase } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { DashboardHeader } from "./DashboardHeader";

type ProposalRecord = {
  id: string;
  clientName: string;
  projectType: string;
  generatedDate: string;
  status: "Draft" | "Sent" | "Accepted";
};

const INITIAL_AI_MESSAGE =
  "Hi! I'm your discovery agent. I'll help gather all the details needed for your project proposal. Let's start - what type of project are you looking to build?";

function getDisplayName(user: User | null): string {
  if (!user) return "there";
  const meta = user.user_metadata as Record<string, unknown> | undefined;
  const company = meta?.company_name as string | undefined;
  if (company) return company;
  const email = user.email ?? "";
  const name = email.split("@")[0];
  return name ? name.replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "there";
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isSendingTranscript, setIsSendingTranscript] = useState(false);
  const [transcriptError, setTranscriptError] = useState<string | null>(null);
  const [transcriptSuccess, setTranscriptSuccess] = useState(false);
  const [proposalPdfUrl, setProposalPdfUrl] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const proposalPreviewRef = useRef<HTMLDivElement>(null);

  const discoveryTransport = useMemo(
    () => new DefaultChatTransport({ api: "/api/discovery/chat" }),
    []
  );
  const {
    messages,
    sendMessage,
    status,
    setMessages,
  } = useChat({
    transport: discoveryTransport,
  });

  const [isFirefliesModalOpen, setIsFirefliesModalOpen] = useState(false);
  const [firefliesLink, setFirefliesLink] = useState("");
  const [firefliesError, setFirefliesError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<
    "idle" | "analyzing" | "extracting" | "generating" | "success"
  >("idle");
  const [firefliesPdfUrl, setFirefliesPdfUrl] = useState<string | null>(null);
  const firefliesPreviewRef = useRef<HTMLDivElement>(null);

  const [proposals] = useState<ProposalRecord[]>([]);

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.replace("/login");
          return;
        }
        setUser(session.user);
      } catch {
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };
    getSession();
  }, [router]);

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace("/login");
      else setUser(session.user);
    });
  }, [router]);

  const scrollChatToBottom = useCallback(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isAgentModalOpen && messages.length === 0) {
      setMessages([
        {
          id: generateId(),
          role: "assistant",
          parts: [{ type: "text", text: INITIAL_AI_MESSAGE }],
        },
      ]);
    }
  }, [isAgentModalOpen, messages.length, setMessages]);

  useEffect(() => {
    scrollChatToBottom();
  }, [messages, scrollChatToBottom]);

  useEffect(() => {
    if (proposalPdfUrl && proposalPreviewRef.current) {
      proposalPreviewRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [proposalPdfUrl]);

  useEffect(() => {
    if (firefliesPdfUrl && firefliesPreviewRef.current) {
      firefliesPreviewRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [firefliesPdfUrl]);

  const handleLaunchAgent = () => {
    setTranscriptError(null);
    setTranscriptSuccess(false);
    if (proposalPdfUrl) {
      URL.revokeObjectURL(proposalPdfUrl);
      setProposalPdfUrl(null);
    }
    setIsAgentModalOpen(true);
    setMessages([]);
  };

  const closeAgentModal = () => {
    setIsAgentModalOpen(false);
    if (proposalPdfUrl) {
      URL.revokeObjectURL(proposalPdfUrl);
      setProposalPdfUrl(null);
    }
    setTranscriptError(null);
    setTranscriptSuccess(false);
  };

  const isChatBusy = status === "submitted" || status === "streaming";

  const handleSendMessage = () => {
    const text = chatInput.trim();
    if (!text || isChatBusy) return;
    sendMessage({ text });
    setChatInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMessageText = (msg: (typeof messages)[number]) =>
    msg.parts
      .filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("");

  const buildTranscript = () =>
    messages
      .map((msg) => {
        const label = msg.role === "user" ? "User" : "Assistant";
        return `${label}: ${getMessageText(msg)}`;
      })
      .join("\n\n");

  const handleGenerateProposal = async () => {
    setTranscriptError(null);
    setTranscriptSuccess(false);
    if (proposalPdfUrl) {
      URL.revokeObjectURL(proposalPdfUrl);
      setProposalPdfUrl(null);
    }
    const transcript = buildTranscript();
    if (!transcript.trim()) {
      setTranscriptError("No conversation to send.");
      return;
    }
    setIsSendingTranscript(true);
    try {
      const res = await fetch("/api/discovery/send-transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript }),
      });
      const blob = await res.blob();
      if (res.ok && blob.size > 100) {
        const pdfBlob =
          blob.type === "application/pdf" ? blob : new Blob([blob], { type: "application/pdf" });
        const url = URL.createObjectURL(pdfBlob);
        setProposalPdfUrl(url);
        setTranscriptSuccess(true);
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setTranscriptError((data.error as string) || data.details || "Failed to send transcript.");
        return;
      }
      setTranscriptSuccess(true);
    } catch (err) {
      setTranscriptError(err instanceof Error ? err.message : "Failed to send transcript.");
    } finally {
      setIsSendingTranscript(false);
    }
  };

  const handleLogout = async () => {
    setUserMenuOpen(false);
    await supabase.auth.signOut();
    router.refresh();
    router.push("/login");
  };

  const isValidFirefliesUrl = (url: string): boolean => {
    try {
      const u = new URL(url.trim());
      return (
        u.hostname.includes("fireflies") ||
        u.hostname.includes("app.fireflies.ai")
      );
    } catch {
      return false;
    }
  };

  const handleFirefliesSubmit = async () => {
    setFirefliesError(null);
    if (firefliesPdfUrl) {
      URL.revokeObjectURL(firefliesPdfUrl);
      setFirefliesPdfUrl(null);
    }
    const link = firefliesLink.trim();
    if (!link) {
      setFirefliesError("Please enter a Fireflies recording link.");
      return;
    }
    if (!isValidFirefliesUrl(link)) {
      setFirefliesError(
        "Please enter a valid Fireflies URL (e.g. https://app.fireflies.ai/view/...)"
      );
      return;
    }

    setIsProcessing(true);
    setProcessingStep("analyzing");

    try {
      const res = await fetch("/api/discovery/fireflies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: link }),
      });
      const blob = await res.blob();
      if (res.ok && blob.size > 100) {
        const pdfBlob =
          blob.type === "application/pdf" ? blob : new Blob([blob], { type: "application/pdf" });
        const url = URL.createObjectURL(pdfBlob);
        setFirefliesPdfUrl(url);
        setProcessingStep("success");
        setIsProcessing(false);
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setFirefliesError((data.error as string) || data.details || "Failed to process recording.");
        setProcessingStep("idle");
        return;
      }
      setProcessingStep("success");
    } catch (err) {
      setFirefliesError(err instanceof Error ? err.message : "Failed to process recording.");
      setProcessingStep("idle");
    } finally {
      setIsProcessing(false);
    }
  };

  const closeFirefliesModal = () => {
    if (!isProcessing) {
      if (firefliesPdfUrl) {
        URL.revokeObjectURL(firefliesPdfUrl);
        setFirefliesPdfUrl(null);
      }
      setIsFirefliesModalOpen(false);
      setFirefliesLink("");
      setFirefliesError(null);
      setProcessingStep("idle");
    }
  };

  const canShowGenerateProposal =
    messages.filter((m) => m.role === "user").length >= 2;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-navy border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <DashboardHeader
        user={user}
        userMenuOpen={userMenuOpen}
        setUserMenuOpen={setUserMenuOpen}
        onLogout={handleLogout}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome */}
        <section className="mb-10">
          <h1 className="font-heading text-3xl tracking-wide text-navy sm:text-4xl">
            Welcome back, {getDisplayName(user)}!
          </h1>
          <p className="mt-2 text-lg text-navy/80">
            Ready to turn your next discovery call into a winning proposal?
          </p>
          {proposals.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-6">
              <div className="rounded-xl bg-white px-5 py-3 shadow-sm border border-beige-dark">
                <p className="text-2xl font-heading text-navy">
                  {proposals.length}
                </p>
                <p className="text-sm text-navy/70">Proposals this month</p>
              </div>
              <div className="rounded-xl bg-white px-5 py-3 shadow-sm border border-beige-dark">
                <p className="text-2xl font-heading text-navy">94%</p>
                <p className="text-sm text-navy/70">Success rate</p>
              </div>
              <div className="rounded-xl bg-white px-5 py-3 shadow-sm border border-beige-dark">
                <p className="text-2xl font-heading text-navy">12h</p>
                <p className="text-sm text-navy/70">Time saved</p>
              </div>
            </div>
          )}
        </section>

        {/* Main action cards */}
        <section className="mb-12 grid gap-8 lg:grid-cols-2">
          {/* Discovery Agent card */}
          <div className="overflow-hidden rounded-2xl bg-navy text-white shadow-xl">
            <div className="p-8">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/20">
                <svg
                  className="h-7 w-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0V8m0 7V4m0 7h4m-4 0h-4"
                  />
                </svg>
              </div>
              <h2 className="font-heading text-2xl tracking-wide sm:text-3xl">
                Start Discovery Agent
              </h2>
              <p className="mt-3 text-white/80 text-lg">
                Launch an AI-powered conversation with your client. Get instant
                proposals from live chat and voice interactions.
              </p>
              <button
                type="button"
                onClick={handleLaunchAgent}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 font-semibold text-navy transition hover:bg-white/90"
              >
                Launch Agent
              </button>
            </div>
            <div className="border-t border-white/20 bg-white/5 p-4">
              <div className="flex gap-2">
                <div className="h-2 w-2 rounded-full bg-green-400" />
                <div className="h-8 flex-1 rounded bg-white/10" />
                <div className="h-8 w-16 rounded bg-white/10" />
              </div>
              <p className="mt-2 text-xs text-white/60">Chat preview</p>
            </div>
          </div>

          {/* Fireflies card */}
          <div className="overflow-hidden rounded-2xl border-2 border-navy/20 bg-white shadow-xl">
            <div className="p-8">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-navy/10 text-navy">
                <svg
                  className="h-7 w-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
              </div>
              <h2 className="font-heading text-2xl tracking-wide text-navy sm:text-3xl">
                Upload Fireflies Recording
              </h2>
              <p className="mt-3 text-navy/80 text-lg">
                Already had a discovery call? Paste your Fireflies link and get
                an instant proposal from any meeting recording.
              </p>
              <button
                type="button"
                onClick={() => setIsFirefliesModalOpen(true)}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 font-semibold text-white transition hover:bg-navy/90"
              >
                Upload Recording
              </button>
            </div>
            <div className="border-t border-beige-dark bg-beige/30 p-4">
              <p className="text-sm font-medium text-navy/80">
                fireflies.ai
              </p>
              <p className="text-xs text-navy/60">Paste link to analyze</p>
            </div>
          </div>
        </section>

        {/* Recent proposals */}
        <section>
          <h2 className="font-heading text-2xl tracking-wide text-navy sm:text-3xl">
            Recent Proposals
          </h2>

          {proposals.length === 0 ? (
            <div className="mt-8 rounded-2xl border-2 border-dashed border-beige-dark bg-beige/20 p-12 text-center">
              <p className="font-heading text-xl text-navy">
                Let&apos;s Create Your First Proposal!
              </p>
              <p className="mt-2 text-navy/80">
                Choose how you&apos;d like to start — live discovery call or
                upload an existing recording.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                <button
                  type="button"
                  onClick={handleLaunchAgent}
                  className="rounded-lg bg-navy px-5 py-2.5 font-semibold text-white hover:bg-navy/90"
                >
                  Start Discovery Agent
                </button>
                <button
                  type="button"
                  onClick={() => setIsFirefliesModalOpen(true)}
                  className="rounded-lg border-2 border-navy px-5 py-2.5 font-semibold text-navy hover:bg-navy/5"
                >
                  Upload Fireflies Recording
                </button>
              </div>
            </div>
          ) : (
            <ul className="mt-6 space-y-4">
              {proposals.map((p) => (
                <li
                  key={p.id}
                  className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-beige-dark bg-white p-4 shadow-sm"
                >
                  <div>
                    <p className="font-medium text-navy">{p.clientName}</p>
                    <p className="text-sm text-navy/70">{p.projectType}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-navy/70">{p.generatedDate}</span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        p.status === "Accepted"
                          ? "bg-green-100 text-green-800"
                          : p.status === "Sent"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-beige text-navy/80"
                      }`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="rounded-lg border border-navy/30 px-3 py-1.5 text-sm font-medium text-navy hover:bg-navy/5"
                    >
                      View
                    </button>
                    {p.status === "Draft" && (
                      <button
                        type="button"
                        className="rounded-lg bg-navy px-3 py-1.5 text-sm font-medium text-white hover:bg-navy/90"
                      >
                        Send
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      {/* Discovery Agent Modal */}
      {isAgentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
            onClick={closeAgentModal}
            aria-hidden="true"
          />
          <div className="relative flex h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-beige-dark bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-beige-dark bg-beige/40 px-6 py-4">
              <div>
                <h3 className="font-heading text-xl tracking-wide text-navy">
                  Discovery Agent Chat
                </h3>
                <p className="text-sm text-navy/70">
                  Your AI agent is ready to conduct a discovery call
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 text-sm text-green-700">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Online
                </span>
                <button
                  type="button"
                  onClick={closeAgentModal}
                  className="rounded-lg p-2 text-navy/70 hover:bg-navy/10 hover:text-navy"
                  aria-label="Close"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {isSendingTranscript && (
              <div className="border-b border-beige-dark bg-beige/30 px-6 py-5">
                <p className="text-sm font-medium text-navy">Generating your proposal…</p>
                <p className="mt-1 text-xs text-navy/70">Waiting for response from the server.</p>
                <div className="mt-3 flex justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-navy border-t-transparent" />
                </div>
              </div>
            )}

            {proposalPdfUrl && (
              <div
                ref={proposalPreviewRef}
                className="border-b border-beige-dark bg-beige/30 p-4"
              >
                <p className="mb-3 text-sm font-medium text-navy">Your proposal is ready</p>
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={proposalPdfUrl}
                    download="proposal.pdf"
                    className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy/90"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download PDF
                  </a>
                </div>
                <div className="mt-3 h-[360px] overflow-hidden rounded-lg border border-beige-dark bg-white">
                  <iframe
                    src={proposalPdfUrl}
                    title="Proposal PDF preview"
                    className="h-full w-full"
                  />
                </div>
              </div>
            )}

            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      msg.role === "assistant"
                        ? "bg-navy text-white"
                        : "bg-beige text-navy"
                    }`}
                  >
                    <p className="text-sm sm:text-base whitespace-pre-wrap">
                      {getMessageText(msg)}
                    </p>
                  </div>
                </div>
              ))}
              {isChatBusy && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-navy/80 px-4 py-3 text-white">
                    <span className="animate-pulse">AI is thinking...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="border-t border-beige-dark bg-white p-4">
              {transcriptError && (
                <p className="mb-3 text-sm text-red-600">{transcriptError}</p>
              )}
              {transcriptSuccess && (
                <p className="mb-3 text-sm text-green-700">
                  Transcript sent. Your proposal is being generated.
                </p>
              )}
              {canShowGenerateProposal && (
                <div className="mb-3">
                  <button
                    type="button"
                    onClick={handleGenerateProposal}
                    disabled={isSendingTranscript}
                    className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy/90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSendingTranscript ? "Sending…" : "Generate Proposal"}
                  </button>
                </div>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsVoiceMode(!isVoiceMode)}
                  className={`rounded-lg p-2.5 ${isVoiceMode ? "bg-navy text-white" : "bg-beige/50 text-navy"} hover:opacity-90`}
                  aria-label={isVoiceMode ? "Voice on" : "Voice off"}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0V8m0 7V4m0 7h4m-4 0h-4" />
                  </svg>
                </button>
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="flex-1 rounded-lg border border-beige-dark bg-white px-4 py-2.5 text-navy placeholder:text-navy/50 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                  disabled={isVoiceMode}
                />
                <button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={!chatInput.trim() || isChatBusy}
                  className="rounded-lg bg-navy px-4 py-2.5 font-medium text-white hover:bg-navy/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fireflies Modal */}
      {isFirefliesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
            onClick={closeFirefliesModal}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-beige-dark bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-beige-dark bg-beige/40 px-6 py-4">
              <h3 className="font-heading text-xl tracking-wide text-navy">
                Upload Fireflies Recording
              </h3>
              <button
                type="button"
                onClick={closeFirefliesModal}
                disabled={isProcessing}
                className="rounded-lg p-2 text-navy/70 hover:bg-navy/10 disabled:opacity-50"
                aria-label="Close"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {!isProcessing && processingStep === "idle" ? (
                <>
                  <label htmlFor="fireflies-link" className="block text-sm font-medium text-navy">
                    Fireflies recording link
                  </label>
                  <textarea
                    id="fireflies-link"
                    value={firefliesLink}
                    onChange={(e) => {
                      setFirefliesLink(e.target.value);
                      setFirefliesError(null);
                    }}
                    placeholder="https://app.fireflies.ai/view/..."
                    rows={3}
                    className="mt-2 w-full rounded-lg border border-beige-dark bg-white px-4 py-3 text-navy placeholder:text-navy/50 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                  />
                  {firefliesError && (
                    <p className="mt-2 text-sm text-red-600">{firefliesError}</p>
                  )}
                  <p className="mt-2 text-xs text-navy/60">
                    Example: https://app.fireflies.ai/view/...
                  </p>
                  <button
                    type="button"
                    onClick={handleFirefliesSubmit}
                    className="mt-6 w-full rounded-lg bg-navy px-4 py-3 font-semibold text-white hover:bg-navy/90"
                  >
                    Analyze Recording
                  </button>
                </>
              ) : processingStep === "success" ? (
                <div className="p-6">
                  {firefliesPdfUrl ? (
                    <div ref={firefliesPreviewRef}>
                      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h4 className="font-heading text-xl text-navy">Proposal generated successfully!</h4>
                      <p className="mt-2 text-sm text-navy/80">Your proposal is ready to view or download.</p>
                      <div className="mt-4 flex flex-wrap gap-3">
                        <a
                          href={firefliesPdfUrl}
                          download="proposal.pdf"
                          className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white hover:bg-navy/90"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Download PDF
                        </a>
                        <button
                          type="button"
                          onClick={closeFirefliesModal}
                          className="rounded-lg border border-navy px-4 py-2 text-sm font-medium text-navy hover:bg-navy/5"
                        >
                          Close
                        </button>
                      </div>
                      <div className="mt-4 h-[360px] overflow-hidden rounded-lg border border-beige-dark bg-white">
                        <iframe
                          src={firefliesPdfUrl}
                          title="Proposal PDF preview"
                          className="h-full w-full"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h4 className="font-heading text-xl text-navy">Proposal generated successfully!</h4>
                      <p className="mt-2 text-navy/80">Your proposal is ready to view or send.</p>
                      <div className="mt-6 flex gap-3 justify-center">
                        <button
                          type="button"
                          onClick={closeFirefliesModal}
                          className="rounded-lg border border-navy px-4 py-2 font-medium text-navy hover:bg-navy/5"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-8">
                  <p className="text-center font-medium text-navy">
                    {processingStep === "analyzing" && "Analyzing your meeting recording..."}
                    {processingStep === "extracting" && "Extracting requirements and scope..."}
                    {processingStep === "generating" && "Generating your proposal..."}
                  </p>
                  <div className="mt-6 flex justify-center">
                    <div className="h-10 w-10 animate-spin rounded-full border-2 border-navy border-t-transparent" />
                  </div>
                  <div className="mt-6 space-y-2">
                    {(["analyzing", "extracting", "generating"] as const).map((step) => (
                      <div
                        key={step}
                        className={`flex items-center gap-2 text-sm ${processingStep === step ? "text-navy font-medium" : "text-navy/60"}`}
                      >
                        {processingStep === step ? (
                          <span className="h-2 w-2 rounded-full bg-navy animate-pulse" />
                        ) : (
                          <span className="h-2 w-2 rounded-full bg-navy/30" />
                        )}
                        {step === "analyzing" && "Speech recognition"}
                        {step === "extracting" && "Requirement extraction"}
                        {step === "generating" && "Proposal generation"}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
