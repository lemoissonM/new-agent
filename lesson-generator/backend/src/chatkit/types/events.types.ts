import { Thread, ThreadMetadata } from './thread.types';
import { ThreadItem, AssistantMessageContent, Task } from './thread-item.types';
import { IconName } from './base.types';

export interface ThreadCreatedEvent {
  type: 'thread.created';
  thread: Thread;
}

export interface ThreadUpdatedEvent {
  type: 'thread.updated';
  thread: Thread;
}

export interface ThreadItemAddedEvent {
  type: 'thread.item.added';
  item: ThreadItem;
}

export type ThreadItemUpdate =
  | { type: 'assistant_message.content_part.added'; content_index: number; content: AssistantMessageContent }
  | { type: 'assistant_message.content_part.text_delta'; content_index: number; delta: string }
  | { type: 'assistant_message.content_part.annotation_added'; content_index: number; annotation_index: number; annotation: any }
  | { type: 'assistant_message.content_part.done'; content_index: number; content: AssistantMessageContent }
  | { type: 'widget.streaming_text.value_delta'; component_id: string; delta: string; done: boolean }
  | { type: 'widget.component.updated'; component_id: string; component: any }
  | { type: 'widget.root.updated'; widget: any }
  | { type: 'workflow.task.added'; task_index: number; task: Task }
  | { type: 'workflow.task.updated'; task_index: number; task: Task };

export interface ThreadItemUpdatedEvent {
  type: 'thread.item.updated';
  item_id: string;
  update: ThreadItemUpdate;
}

export interface ThreadItemDoneEvent {
  type: 'thread.item.done';
  item: ThreadItem;
}

export interface ThreadItemRemovedEvent {
  type: 'thread.item.removed';
  item_id: string;
}

export interface ThreadItemReplacedEvent {
  type: 'thread.item.replaced';
  item: ThreadItem;
}

export interface ProgressUpdateEvent {
  type: 'progress_update';
  icon?: IconName;
  text: string;
}

export interface ErrorEvent {
  type: 'error';
  code: string;
  message?: string;
  allow_retry?: boolean;
}

export interface NoticeEvent {
  type: 'notice';
  level: 'info' | 'warning' | 'danger';
  message: string;
  title?: string;
}

export type ThreadStreamEvent =
  | ThreadCreatedEvent
  | ThreadUpdatedEvent
  | ThreadItemDoneEvent
  | ThreadItemAddedEvent
  | ThreadItemUpdatedEvent
  | ThreadItemRemovedEvent
  | ThreadItemReplacedEvent
  | ProgressUpdateEvent
  | ErrorEvent
  | NoticeEvent;