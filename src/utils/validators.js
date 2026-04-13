const TASK_STATUSES = ['todo', 'in-progress', 'done'];
const TASK_PRIORITIES = ['low', 'medium', 'high'];

/**
 * Ensures a value is a plain object.
 * @param {unknown} value Value to validate.
 * @param {string} name Argument name for error messages.
 * @returns {Record<string, unknown>} The validated object.
 * @example
 * assertPlainObject({ title: 'Write docs' }, 'input');
 * @example
 * assertPlainObject({ id: '1', status: 'todo' }, 'task');
 */
export function assertPlainObject(value, name) {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new TypeError(`${name} must be a plain object.`);
  }

  return value;
}

/**
 * Validates a task id in numeric string form.
 * @param {unknown} value Id value.
 * @param {string} name Argument name for error messages.
 * @returns {string} Normalized id.
 * @example
 * assertTaskId('1', 'id');
 * @example
 * assertTaskId('42', 'taskId');
 */
export function assertTaskId(value, name = 'id') {
  if (typeof value !== 'string' || !/^[1-9][0-9]*$/.test(value)) {
    throw new TypeError(`${name} must be a numeric string like "1" or "42".`);
  }

  return value;
}

/**
 * Validates a required non-empty title.
 * @param {unknown} value Title value.
 * @param {string} name Argument name for error messages.
 * @returns {string} Trimmed title.
 * @example
 * assertTitle('Ship workshop', 'title');
 * @example
 * assertTitle('  Write tests  ', 'task.title');
 */
export function assertTitle(value, name = 'title') {
  if (typeof value !== 'string') {
    throw new TypeError(`${name} must be a string.`);
  }

  const trimmed = value.trim();
  if (trimmed.length === 0) {
    throw new TypeError(`${name} cannot be empty.`);
  }

  return trimmed;
}

/**
 * Validates an optional description value.
 * @param {unknown} value Description value.
 * @param {string} name Argument name for error messages.
 * @returns {string} Description value or empty string.
 * @example
 * assertDescription('Draft intro section', 'description');
 * @example
 * assertDescription(undefined, 'task.description');
 */
export function assertDescription(value, name = 'description') {
  if (value === undefined) {
    return '';
  }

  if (typeof value !== 'string') {
    throw new TypeError(`${name} must be a string when provided.`);
  }

  return value;
}

/**
 * Validates task status.
 * @param {unknown} value Status value.
 * @param {string} name Argument name for error messages.
 * @returns {'todo'|'in-progress'|'done'} Valid status.
 * @example
 * assertStatus('todo', 'status');
 * @example
 * assertStatus('done', 'task.status');
 */
export function assertStatus(value, name = 'status') {
  if (typeof value !== 'string' || !TASK_STATUSES.includes(value)) {
    throw new TypeError(`${name} must be one of: ${TASK_STATUSES.join(', ')}.`);
  }

  return value;
}

/**
 * Validates task priority.
 * @param {unknown} value Priority value.
 * @param {string} name Argument name for error messages.
 * @returns {'low'|'medium'|'high'} Valid priority.
 * @example
 * assertPriority('medium', 'priority');
 * @example
 * assertPriority('high', 'task.priority');
 */
export function assertPriority(value, name = 'priority') {
  if (typeof value !== 'string' || !TASK_PRIORITIES.includes(value)) {
    throw new TypeError(`${name} must be one of: ${TASK_PRIORITIES.join(', ')}.`);
  }

  return value;
}

/**
 * Validates an ISO timestamp string.
 * @param {unknown} value Timestamp value.
 * @param {string} name Argument name for error messages.
 * @returns {string} Valid ISO timestamp.
 * @example
 * assertIsoTimestamp('2026-04-13T12:00:00.000Z', 'createdAt');
 * @example
 * assertIsoTimestamp(new Date().toISOString(), 'updatedAt');
 */
export function assertIsoTimestamp(value, name) {
  if (typeof value !== 'string' || Number.isNaN(Date.parse(value))) {
    throw new TypeError(`${name} must be a valid ISO 8601 timestamp string.`);
  }

  return value;
}

/**
 * Returns true if the field is mutable through updates.
 * @param {unknown} key Field name to check.
 * @returns {boolean} True when mutable.
 * @example
 * isMutableTaskField('title');
 * @example
 * isMutableTaskField('createdAt');
 */
export function isMutableTaskField(key) {
  if (typeof key !== 'string') {
    throw new TypeError('key must be a string.');
  }

  return ['title', 'description', 'status', 'priority'].includes(key);
}

export { TASK_PRIORITIES, TASK_STATUSES };