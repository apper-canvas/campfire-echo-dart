import { delay } from '../index';
import todosData from '../mockData/todos.json';

class TodoService {
  constructor() {
    this.todos = [...todosData];
  }

  async getAll() {
    await delay(300);
    return [...this.todos];
  }

  async getById(id) {
    await delay(250);
    const todo = this.todos.find(t => t.id === id);
    if (!todo) {
      throw new Error('Todo not found');
    }
    return { ...todo };
  }

  async create(todoData) {
    await delay(400);
    const newTodo = {
      id: Date.now().toString(),
      ...todoData,
      completed: false,
      order: this.todos.length
    };
    this.todos.push(newTodo);
    return { ...newTodo };
  }

  async update(id, updateData) {
    await delay(350);
    const index = this.todos.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Todo not found');
    }
    this.todos[index] = { ...this.todos[index], ...updateData };
    return { ...this.todos[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.todos.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error('Todo not found');
    }
    this.todos.splice(index, 1);
    return true;
  }
}

export default new TodoService();