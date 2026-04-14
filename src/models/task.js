import { randomUUID } from 'node:crypto';
import {
  assertDescription,
  assertIsoTimestamp,
  assertPriority,
  assertStatus,
  assertTaskId,
  assertTitle
} from '../utils/validators.js';

/**
 * Represents a Task domain object.
 */
export class Task {
  /**
   * Creates a validated task entity.
   * @param {object} data Task data.
   * @param {string} [data.id] Numeric string id.
   * @param {string} data.title Task title.
   * @param {string} [data.description] Task description.
   * @param {'todo'|'in-progress'|'done'} [data.status] Task status.
   * @param {'low'|'medium'|'high'} [data.priority] Task priority.
   * @param {string} data.createdAt ISO creation timestamp.
   * @param {string} data.updatedAt ISO update timestamp.
   */
  constructor(data) {
    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
      throw new TypeError('data must be a plain object.');
    }

    const randomDigits = randomUUID().replace(/[^0-9]/g, '');
    const normalizedDigits = randomDigits.replace(/^0+/, '');
    const generatedId = String(normalizedDigits.slice(0, 12) || '1');

    this.id = assertTaskId(data.id ?? generatedId, 'id');
    this.title = assertTitle(data.title, 'title');
    this.description = assertDescription(data.description, 'description');
    this.status = assertStatus(data.status ?? 'todo', 'status');
    this.priority = assertPriority(data.priority ?? 'medium', 'priority');
    this.createdAt = assertIsoTimestamp(data.createdAt, 'createdAt');
    this.updatedAt = assertIsoTimestamp(data.updatedAt, 'updatedAt');
  }

  /**
   * Returns a plain object representation of this task.
   * @returns {object} Serialized task.
   */
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      status: this.status,
      priority: this.priority,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}