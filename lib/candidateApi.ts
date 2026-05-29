import type {
  CandidateMeResponse,
  CandidateOpportunityDetail,
  CandidateOpportunityListResponse,
  CandidateActionResult,
  LiveChatResponse,
} from "./types";

const API_BASE = "http://localhost:8000";

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(
  path: string,
  _token?: string,
  options: RequestInit = {},
): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new ApiError(res.status, `API error ${res.status}: ${body}`);
  }
  return res.json();
}

export async function candidateMe(
  _token: string,
): Promise<CandidateMeResponse> {
  return {
    candidate_id: "default",
    name: "Demo Candidate",
    title: "Software Engineer",
  };
}

export async function listCandidateOpportunities(
  _token: string,
): Promise<CandidateOpportunityListResponse> {
  return {
    items: [
      {
        conversation_id: "default",
        stage: "chatting",
        updated_at: new Date().toISOString(),
        requirement: { role_title: "AI Chat Demo", skills: [] },
      },
    ],
  };
}

export async function getCandidateOpportunity(
  _token: string,
  conversationId: string,
): Promise<CandidateOpportunityDetail> {
  return {
    conversation_id: conversationId,
    client_name: "AI Assistant",
    conversation_stage: "chatting",
    updated_at: new Date().toISOString(),
    requirement: { role_title: "AI Chat Demo", skills: [] },
    messages: [],
    calls: [],
  };
}

export async function sendCandidateMessage(
  _token: string,
  conversationId: string,
  message: string,
): Promise<CandidateActionResult & { liveResponse?: LiveChatResponse }> {
  const liveRes = await request<LiveChatResponse>("/chat", undefined, {
    method: "POST",
    body: JSON.stringify({
      question: message,
      session_id: conversationId || "default",
    }),
  });
  
  return { ok: true, liveResponse: liveRes };
}

export async function sendCandidateAttachment(
  _token: string,
  _conversationId: string,
  _file: File,
  _message?: string | null,
  _onProgress?: (percent: number) => void,
): Promise<CandidateActionResult> {
  return { ok: true };
}
