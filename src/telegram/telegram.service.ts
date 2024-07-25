import { Injectable } from '@nestjs/common';
import * as TelegramBot from 'node-telegram-bot-api';
import * as fs from 'fs';

const TOKEN = process.env.TELEGRAM_TOKEN;
const SECRET_CODE = process.env.SECRET_CODE;


@Injectable()
export class TelegramService {
  private bot: TelegramBot;
  private chatIds: string[] = this.getChatIds();
  private chats ={}
  private path = 'src/telegram/conf/chat.json';
  constructor() {
    this.bot = new TelegramBot(TOKEN, { polling: true });
    this.getMessages();
  }

  getChatIds() {
    

    if (fs.existsSync(this.path)) {
        const data = fs.readFileSync(this.path, 'utf8');
        let chatIds = JSON.parse(data);
        this.chats = chatIds.chatIds;
        return Object.keys(chatIds.chatIds);
    } else {
        console.error('File not found:', this.path);
        return [];
    }
}
  putChatId(chat : any): void {
    chat['createdAt'] = new Date().toISOString();
    this.chats[chat.id] = chat;
   
    fs.writeFileSync(this.path, JSON.stringify({
      chatIds: this.chats
    
    }));
  }

  deleteChatId(chatId: string): void {
    this.chats = this.chatIds.filter((id) => id !== chatId);
    fs.writeFileSync(this.path, JSON.stringify(this.chats));
  }

  async sendMessage(message: string): Promise<void> {
    for (let chatId of this.chatIds) {
      console.log(`${new Date().toISOString()} - Sending message to chatId: ${chatId}`);
      await this.bot.sendMessage(Number.parseInt(chatId), message);
    }
  }


  private async getMessages(): Promise<void> {
    this.bot.on('message', (msg: any) => {
      console.log('Message received:', msg.text);
      const chatId : string = msg.chat.id;
      if (msg.text === SECRET_CODE) {
        this.bot.sendMessage(Number.parseInt(chatId), 'Ready to go');
        if (!this.chatIds.includes(chatId)) {
          this.putChatId(msg.chat);
          console.log(`New chatId added: ${chatId}`);
        }
      } else {
        this.bot.sendMessage(Number.parseInt(chatId), 'Provide secret code');
      }
    });
  }

  // Add more methods for handling commands, updates, etc.
}
