import { delay } from '../index';
import messagesData from '../mockData/messages.json';

class MessageService {
  constructor() {
    this.messages = [...messagesData];
  }

  async getAll() {
    await delay(300);
    return [...this.messages];
  }

  async getById(id) {
    await delay(250);
    const message = this.messages.find(m => m.id === id);
    if (!message) {
      throw new Error('Message not found');
    }
    return { ...message };
  }

  async create(messageData) {
    await delay(400);
    const newMessage = {
      id: Date.now().toString(),
      ...messageData,
      createdAt: new Date().toISOString(),
      comments: []
    };
    this.messages.unshift(newMessage);
    return { ...newMessage };
  }

  async update(id, updateData) {
    await delay(350);
    const index = this.messages.findIndex(m => m.id === id);
    if (index === -1) {
      throw new Error('Message not found');
    }
    this.messages[index] = { ...this.messages[index], ...updateData };
    return { ...this.messages[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.messages.findIndex(m => m.id === id);
    if (index === -1) {
      throw new Error('Message not found');
    }
    this.messages.splice(index, 1);
    return true;
  }
}

export default new MessageService();