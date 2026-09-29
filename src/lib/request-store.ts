import { nanoid } from "nanoid";
import { getDb } from "@/lib/d1";

export type DocumentRequest = {
  id: string;
  email: string;
  document: string;
  company: string;
  message?: string;
  status: "pending" | "responded";
  createdAt: string;
};

type NewRequestPayload = {
  email: string;
  document: string;
  company: string;
  message?: string;
};

type RequestRow = {
  id: string;
  email: string;
  document: string;
  company: string;
  message: string | null;
  status: string;
  created_at: string;
};

export async function listRequests(): Promise<DocumentRequest[]> {
  const db = await getDb();
  const { results } = await db
    .prepare(
      `SELECT id, email, document, company, message, status, created_at
       FROM document_requests
       ORDER BY created_at DESC`
    )
    .all<RequestRow>();

  return (results ?? []).map((item) => ({
    id: item.id,
    email: item.email,
    document: item.document,
    company: item.company,
    message: item.message ?? undefined,
    status: (item.status as DocumentRequest["status"]) ?? "pending",
    createdAt: item.created_at,
  }));
}

export async function addRequest(
  payload: NewRequestPayload
): Promise<DocumentRequest> {
  const db = await getDb();
  const newRequest: DocumentRequest = {
    id: nanoid(10),
    email: payload.email,
    document: payload.document,
    company: payload.company,
    message: payload.message,
    status: "pending",
    createdAt: new Date().toISOString(),
  };

  await db
    .prepare(
      `INSERT INTO document_requests
        (id, email, document, company, message, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .bind(
      newRequest.id,
      newRequest.email,
      newRequest.document,
      newRequest.company,
      newRequest.message ?? null,
      newRequest.status,
      newRequest.createdAt
    )
    .run();

  return newRequest;
}
