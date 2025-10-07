import { Page } from './base.types';
import { ThreadItem } from './thread-item.types';

export type ThreadStatus =
  | { type: 'active' }
  | { type: 'locked'; reason?: string }
  | { type: 'closed'; reason?: string };

export interface ThreadMetadata {
  id: string;
  title?: string;
  created_at: Date;
  status: ThreadStatus;
  metadata?: Record<string, any>;
}

export interface Thread extends ThreadMetadata {
  items: Page<ThreadItem>;
}

// Request types
export interface ThreadGetByIdParams {
  thread_id: string;
}

export interface ThreadCreateParams {
  input: UserMessageInput;
}

export interface ThreadListParams {
  limit?: number;
  order?: 'asc' | 'desc';
  after?: string;
}

export interface ThreadAddUserMessageParams {
  input: UserMessageInput;
  thread_id: string;
}

export interface ThreadAddClientToolOutputParams {
  thread_id: string;
  result: any;
}

export interface ThreadCustomActionParams {
  thread_id: string;
  item_id?: string;
  action: any; // Action type
}

export interface ThreadRetryAfterItemParams {
  thread_id: string;
  item_id: string;
}

export interface ThreadUpdateParams {
  thread_id: string;
  title: string;
}

export interface ThreadDeleteParams {
  thread_id: string;
}

// User message types
export type UserMessageContent =
  | { type: 'input_text'; text: string }
  | { type: 'input_tag'; id: string; text: string; data: Record<string, any>; interactive?: boolean };

export interface InferenceOptions {
  tool_choice?: { id: string } | null;
  model?: string | null;
}

export interface UserMessageInput {
  content: UserMessageContent[];
  attachments: string[];
  quoted_text?: string;
  inference_options: InferenceOptions;
}