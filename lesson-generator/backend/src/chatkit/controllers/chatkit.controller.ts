import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  StreamableFile,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ChatKitServer } from '../server/chatkit.server';
import { TypeORMStore } from '../store/typeorm.store';
import { ThreadMetadata, UserMessageItem } from '../types';

@Controller('api/chatkit')
export class ChatKitController {
  constructor(
    private readonly server: ChatKitServer,
    private readonly store: TypeORMStore,
  ) {}

  @Post('threads/create')
  async createThread(
    @Body() body: { input: any },
    @Res() res: Response,
  ) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const threadId = this.store.generateThreadId({});
    const thread: ThreadMetadata = {
      id: threadId,
      created_at: new Date(),
      status: { type: 'active' },
    };

    await this.store.saveThread(thread, {});

    const userMessage: UserMessageItem = {
      id: this.store.generateItemId('message', thread, {}),
      thread_id: threadId,
      type: 'user_message',
      content: body.input.content,
      attachments: [],
      inference_options: body.input.inference_options || { tool_choice: null, model: null },
      created_at: new Date(),
    };

    await this.store.addThreadItem(threadId, userMessage, {});

    // Send thread created event
    res.write(`data: ${JSON.stringify({ type: 'thread.created', thread })}\n\n`);

    // Send user message
    res.write(
      `data: ${JSON.stringify({ type: 'thread.item.done', item: userMessage })}\n\n`,
    );

    // Stream response
    for await (const event of this.server.respond(thread, userMessage, {})) {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    }

    res.end();
  }

  @Post('threads/:threadId/messages')
  async addMessage(
    @Body() body: { input: any },
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const threadId = req.params.threadId;
    
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const thread = await this.store.loadThread(threadId, {});

    const userMessage: UserMessageItem = {
      id: this.store.generateItemId('message', thread, {}),
      thread_id: threadId,
      type: 'user_message',
      content: body.input.content,
      attachments: [],
      inference_options: body.input.inference_options || { tool_choice: null, model: null },
      created_at: new Date(),
    };

    await this.store.addThreadItem(threadId, userMessage, {});

    // Send user message
    res.write(
      `data: ${JSON.stringify({ type: 'thread.item.done', item: userMessage })}\n\n`,
    );

    // Stream response
    for await (const event of this.server.respond(thread, userMessage, {})) {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    }

    res.end();
  }

  @Post('threads/:threadId')
  async getThread(@Req() req: Request) {
    const threadId = req.params.threadId;
    const thread = await this.store.loadThread(threadId, {});
    const items = await this.store.loadThreadItems(threadId, null, 50, 'asc', {});
    
    return {
      ...thread,
      items,
    };
  }
}