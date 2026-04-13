import { Task } from '../models/task.js';
import {
  assertDescription,
  assertPlainObject,
  assertPriority,
  assertStatus,
  assertTaskId,
  assertTitle,
  isMutableTaskField
} from '../utils/validators.js';

const store = {
  tasks: [],
  nextId: 1
};

function cloneTask(task) {
  return { ...task };
}

function findTaskIndexById(id) {
  return store.tasks.findIndex((task) => task.id === id);
}

/**
 * Creates a new task.
 * @param {object} input Task creation input.
 * @returns {object} The created task.
 */
export function createTask(input) {
  try {
    const data = assertPlainObject(input, 'input');
    const now = new Date().toISOString();

    const task = new Task({
      id: String(store.nextId),
      title: assertTitle(data.title, 'title'),
      description: assertDescription(data.description, 'description'),
      status: data.status === undefined ? 'todo' : assertStatus(data.status, 'status'),
      priority: data.priority === undefined ? 'medium' : assertPriority(data.priority, 'priority'),
      createdAt: now,
      updatedAt: now
    });

    const created = task.toJSON();
    store.tasks.push(created);
    store.nextId += 1;

    return cloneTask(created);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Invalid input while creating task.');
  }
}

/**
 * Lists all tasks.
 * @returns {object[]} Copy of all tasks.
 */
export function listTasks() {
  return store.tasks.map((task) => cloneTask(task));
}

/**
 * Updates an existing task.
 * @param {string} id Task id.
 * @param {object} updates Partial task updates.
 * @returns {object} The updated task.
 */
export function updateTask(id, updates) {
  try {
    const taskId = assertTaskId(id, 'id');
    const patch = assertPlainObject(updates, 'updates');
    const blockedFields = Object.keys(patch).filter((key) => !isMutableTaskField(key));

    if (blockedFields.length > 0) {
      throw new Error(
        `Invalid input: immutable or unknown fields provided: ${blockedFields.join(', ')}.`
      );
    }

    const index = findTaskIndexById(taskId);
    if (index === -1) {
      throw new Error(`Task not found for id ${taskId}.`);
    }

    const current = store.tasks[index];
    const nextTask = {
      ...current,
      ...(patch.title !== undefined ? { title: assertTitle(patch.title, 'title') } : {}),
      ...(patch.description !== undefined
        ? { description: assertDescription(patch.description, 'description') }
        : {}),
      ...(patch.status !== undefined ? { status: assertStatus(patch.status, 'status') } : {}),
      ...(patch.priority !== undefined
        ? { priority: assertPriority(patch.priority, 'priority') }
        : {}),
      updatedAt: new Date().toISOString()
    };

    store.tasks[index] = nextTask;
    return cloneTask(nextTask);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Invalid input while updating task.');
  }
}

/**
 * Deletes a task by id.
 * @param {string} id Task id.
 * @returns {object} The deleted task.
 */
export function deleteTask(id) {
  try {
    const taskId = assertTaskId(id, 'id');
    const index = findTaskIndexById(taskId);

    if (index === -1) {
      throw new Error(`Task not found for id ${taskId}.`);
    }

    const [deletedTask] = store.tasks.splice(index, 1);
    return cloneTask(deletedTask);
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Invalid input while deleting task.');
  }
}