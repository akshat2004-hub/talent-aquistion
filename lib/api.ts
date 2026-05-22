import type {
  CandidateContactResponse,
  ConversationResponse,
  DirectChatThreadResponse,
  ShortlistResponse,
  SwipeDirection,
  WidgetAdminConfig,
  WidgetMessageResponse,
  WidgetRotateTokenResponse,
  WidgetSessionResponse,
  WidgetSwipeRequest,
  LiveChatResponse,
  ChatMessage,
} from "./types";

const API_BASE = "http://127.0.0.1:8001";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API error ${res.status}: ${body}`);
  }
  return res.json();
}

/**
 * Maps the live backend response to the frontend's ConversationResponse structure
 * to minimize breaking changes in components.
 */
function mapLiveResponse(
  liveRes: LiveChatResponse,
  conversationId: string,
): ConversationResponse {
  const newMessage: ChatMessage = {
    id: crypto.randomUUID(),
    conversation_id: conversationId,
    role: "assistant",
    text: liveRes.message,
    stage: "collecting_requirements",
    created_at: new Date().toISOString(),
    ui_payload: liveRes.options?.length 
      ? { type: "quick_reply_chips", chips: liveRes.options.map(o => ({ label: o, value: o })) }
      : null
  };

  return {
    conversation_id: conversationId,
    stage: "collecting_requirements",
    messages: [newMessage],
  };
}

export async function sendMessage(
  text: string,
  conversationId?: string | null,
  // These parameters are ignored by the new backend
  _tenantSlug?: string | null,
  _actionId?: string | null,
): Promise<ConversationResponse> {
  const sessId = conversationId || "default";
  const liveRes = await request<LiveChatResponse>("/chat", {
    method: "POST",
    body: JSON.stringify({
      question: text,
      session_id: sessId,
    }),
  });
  
  return mapLiveResponse(liveRes, sessId);
}

// STUBBED FUNCTIONS TO PREVENT CRASHES

export async function confirmRequirements(
  conversationId: string,
  _edits?: Record<string, unknown> | null,
  _tenantSlug?: string | null,
): Promise<ConversationResponse> {
  return {
    conversation_id: conversationId,
    stage: "confirming_requirements",
    messages: [],
  };
}

export async function swipeCandidate(
  conversationId: string,
  _candidateId: string,
  _direction: SwipeDirection,
): Promise<ConversationResponse> {
  return {
    conversation_id: conversationId,
    stage: "showing_candidates",
    messages: [],
  };
}

export async function getShortlist(
  conversationId: string,
): Promise<ShortlistResponse> {
  return {
    conversation_id: conversationId,
    candidates: [],
  };
}

export async function contactCandidate(
  _conversationId: string,
  _candidateId: string,
  _message: string,
  _sender?: string,
): Promise<CandidateContactResponse> {
  return { status: "ok", note: "Stubbed" };
}

export async function contactCandidateAttachment(
  _conversationId?: string,
  _candidateId?: string,
  _file?: File | null,
  _caption?: string | null,
  _sender?: string,
  _onProgress?: (percent: number) => void,
): Promise<CandidateContactResponse> {
  return { status: "ok", note: "Stubbed" };
}

export async function getDirectChatThread(
  conversationId: string,
  candidateId: string,
): Promise<DirectChatThreadResponse> {
  return {
    conversation_id: conversationId,
    candidate_id: candidateId,
    candidate_name: "Stubbed",
    candidate_title: "Stubbed",
    messages: [],
    calls: [],
  };
}

export async function initiateDirectChatThread(
  conversationId: string,
  candidateId: string,
): Promise<DirectChatThreadResponse> {
  return getDirectChatThread(conversationId, candidateId);
}

export async function scheduleCall(
  _conversationId?: string,
  _candidateId?: string,
  _payload?: Record<string, unknown>,
): Promise<{ status: string; note: string; meeting_link?: string | null }> {
  return { status: "ok", note: "Stubbed", meeting_link: null };
}

export async function cancelCall(
  _conversationId?: string,
  _candidateId?: string,
): Promise<{ status: string }> {
  return { status: "ok" };
}

export async function createWidgetSession(
  _botId?: string,
  _embedToken?: string,
): Promise<WidgetSessionResponse> {
  return { session_token: "stub", welcome_text: "Hello" };
}

export async function sendWidgetMessage(
  _sessionToken?: string,
  _text?: string,
  _actionId?: string | null,
): Promise<WidgetMessageResponse> {
  return { conversation_id: "stub", messages: [] };
}

export async function sendWidgetConfirm(
  _sessionToken?: string,
): Promise<WidgetMessageResponse> {
  return { conversation_id: "stub", messages: [] };
}

export async function sendWidgetSwipe(
  _sessionToken?: string,
  _payload?: Record<string, unknown>,
): Promise<WidgetMessageResponse> {
  return { conversation_id: "stub", messages: [] };
}

export async function getWidgetDirectChatThread(
  _sessionToken?: string,
  _candidateId?: string,
): Promise<DirectChatThreadResponse> {
  return {
    conversation_id: "stub",
    candidate_id: "stub",
    candidate_name: "Stubbed",
    candidate_title: "Stubbed",
    messages: [],
    calls: [],
  };
}

export async function initiateWidgetDirectChatThread(
  _sessionToken?: string,
  _candidateId?: string,
): Promise<DirectChatThreadResponse> {
  return getWidgetDirectChatThread();
}

export async function contactWidgetCandidate(
  _sessionToken?: string,
  _candidateId?: string,
  _message?: string,
): Promise<CandidateContactResponse> {
  return { status: "ok", note: "Stubbed" };
}

export async function contactWidgetCandidateAttachment(
  _sessionToken?: string,
  _candidateId?: string,
  _file?: File | null,
  _caption?: string | null,
  _onProgress?: (percent: number) => void,
): Promise<CandidateContactResponse> {
  return { status: "ok", note: "Stubbed" };
}

export async function scheduleWidgetCall(
  _sessionToken?: string,
  _candidateId?: string,
  _payload?: Record<string, unknown>,
): Promise<{ status: string; note: string; meeting_link?: string | null }> {
  return { status: "ok", note: "Stubbed", meeting_link: null };
}

export async function cancelWidgetCall(
  _sessionToken?: string,
  _candidateId?: string,
): Promise<{ status: string }> {
  return { status: "ok" };
}

export async function getWidgetAdminConfig(): Promise<WidgetAdminConfig> {
  return {
    bot_id: "stub",
    name: "Stub",
    welcome_text: "Hi",
    primary_color: "#000",
    launcher_position: "right",
    allowed_domains: [],
  };
}

export async function updateWidgetAdminConfig(payload: any): Promise<WidgetAdminConfig> {
  return getWidgetAdminConfig();
}

export async function rotateWidgetEmbedToken(): Promise<WidgetRotateTokenResponse> {
  return { embed_token: "stub", last4: "0000" };
}
