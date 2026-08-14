import { ensureCmsSeeded } from "./seed";
import { newId, readStore, writeStore } from "./store";
import type { CmsMessage, CmsMessageType } from "./types";

export async function appendInboxMessage(input: {
  type: CmsMessageType;
  name?: string;
  email?: string;
  phone?: string;
  body?: string;
  package?: string;
  isPrivate?: boolean;
}): Promise<CmsMessage> {
  await ensureCmsSeeded();
  const store = readStore();
  if (!Array.isArray(store.messages)) store.messages = [];
  const message: CmsMessage = {
    id: newId("msg"),
    type: input.type,
    name: input.name || "",
    email: input.email || "",
    phone: input.phone || "",
    body: input.body || "",
    package: input.package || "",
    isPrivate: Boolean(input.isPrivate),
    read: false,
    createdAt: new Date().toISOString(),
  };
  store.messages.unshift(message);
  writeStore(store);
  return message;
}
