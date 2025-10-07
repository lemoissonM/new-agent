import { UserMessageContent, InferenceOptions } from './thread.types';

export interface ThreadItemBase {
  id: string;
  thread_id: string;
  created_at: Date;
}

export interface Attachment {
  id: string;
  name: string;
  mime_type: string;
  upload_url?: string;
  type: 'file' | 'image';
  preview_url?: string;
}

export interface UserMessageItem extends ThreadItemBase {
  type: 'user_message';
  content: UserMessageContent[];
  attachments: Attachment[];
  quoted_text?: string;
  inference_options: InferenceOptions;
}

export interface Annotation {
  type: 'annotation';
  source: URLSource | FileSource | EntitySource;
  index?: number;
}

export interface URLSource {
  type: 'url';
  url: string;
  title: string;
  description?: string;
  timestamp?: string;
  group?: string;
  attribution?: string;
}

export interface FileSource {
  type: 'file';
  filename: string;
  title: string;
  description?: string;
  timestamp?: string;
  group?: string;
}

export interface EntitySource {
  type: 'entity';
  id: string;
  title: string;
  icon?: string;
  preview?: 'lazy';
  description?: string;
  timestamp?: string;
  group?: string;
}

export interface AssistantMessageContent {
  annotations: Annotation[];
  text: string;
  type: 'output_text';
}

export interface AssistantMessageItem extends ThreadItemBase {
  type: 'assistant_message';
  content: AssistantMessageContent[];
}

export interface ClientToolCallItem extends ThreadItemBase {
  type: 'client_tool_call';
  status: 'pending' | 'completed';
  call_id: string;
  name: string;
  arguments: Record<string, any>;
  output?: any;
}

export interface WidgetItem extends ThreadItemBase {
  type: 'widget';
  widget: any; // WidgetRoot
  copy_text?: string;
}

export interface Task {
  type: 'custom' | 'web_search' | 'thought' | 'file' | 'image';
  title?: string;
  content?: string;
  status_indicator?: 'none' | 'loading' | 'complete';
  [key: string]: any;
}

export interface TaskItem extends ThreadItemBase {
  type: 'task';
  task: Task;
}

export interface WorkflowSummary {
  title?: string;
  icon?: string;
  duration?: number;
}

export interface Workflow {
  type: 'custom' | 'reasoning';
  tasks: Task[];
  summary?: WorkflowSummary;
  expanded?: boolean;
}

export interface WorkflowItem extends ThreadItemBase {
  type: 'workflow';
  workflow: Workflow;
}

export interface EndOfTurnItem extends ThreadItemBase {
  type: 'end_of_turn';
}

export interface HiddenContextItem extends ThreadItemBase {
  type: 'hidden_context_item';
  content: any;
}

export type ThreadItem =
  | UserMessageItem
  | AssistantMessageItem
  | ClientToolCallItem
  | WidgetItem
  | WorkflowItem
  | TaskItem
  | HiddenContextItem
  | EndOfTurnItem;