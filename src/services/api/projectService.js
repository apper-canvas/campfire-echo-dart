import { delay } from '../index';
import projectsData from '../mockData/projects.json';

class ProjectService {
  constructor() {
    this.projects = [...projectsData];
  }

  async getAll() {
    await delay(300);
    return [...this.projects];
  }

  async getById(id) {
    await delay(250);
    const project = this.projects.find(p => p.id === id);
    if (!project) {
      throw new Error('Project not found');
    }
    return { ...project };
  }

  async create(projectData) {
    await delay(400);
    const newProject = {
      id: Date.now().toString(),
      ...projectData,
      createdAt: new Date().toISOString()
    };
    this.projects.unshift(newProject);
    return { ...newProject };
  }

  async update(id, updateData) {
    await delay(350);
    const index = this.projects.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Project not found');
    }
    this.projects[index] = { ...this.projects[index], ...updateData };
    return { ...this.projects[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.projects.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Project not found');
    }
    this.projects.splice(index, 1);
    return true;
  }
}

export default new ProjectService();