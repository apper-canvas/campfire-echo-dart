// Service exports
export { default as projectService } from './api/projectService';
export { default as messageService } from './api/messageService';
export { default as todoService } from './api/todoService';
export { default as fileService } from './api/fileService';

// Utility function for simulating API delays
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));