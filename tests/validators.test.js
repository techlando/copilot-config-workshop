import test from 'node:test';
import assert from 'node:assert/strict';

import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  assertCategory,
  assertDescription,
  assertIsoTimestamp,
  assertPlainObject,
  assertPriority,
  assertStatus,
  assertTaskId,
  assertTitle,
  isMutableTaskField
} from '../src/utils/validators.js';

test('assertPlainObject returns provided plain object', () => {
  const input = { a: 1 };
  assert.equal(assertPlainObject(input, 'input'), input);
});

test('assertPlainObject throws for array input', () => {
  assert.throws(() => assertPlainObject([], 'input'), {
    name: 'TypeError',
    message: 'input must be a plain object.'
  });
});

test('assertTaskId accepts numeric string', () => {
  assert.equal(assertTaskId('27', 'id'), '27');
});

test('assertTaskId accepts max safe integer as string', () => {
  assert.equal(assertTaskId(String(Number.MAX_SAFE_INTEGER), 'id'), String(Number.MAX_SAFE_INTEGER));
});

test('assertTaskId throws for non-numeric value', () => {
  assert.throws(() => assertTaskId('02', 'id'), {
    name: 'TypeError',
    message: 'id must be a numeric string like "1" or "42".'
  });
});

test('assertTaskId throws for numeric type input', () => {
  assert.throws(() => assertTaskId(Number.MAX_SAFE_INTEGER, 'id'), {
    name: 'TypeError',
    message: 'id must be a numeric string like "1" or "42".'
  });
});

test('assertTitle trims valid title', () => {
  assert.equal(assertTitle('  Build feature  ', 'title'), 'Build feature');
});

test('assertTitle accepts very long string', () => {
  const longTitle = 'a'.repeat(30000);
  assert.equal(assertTitle(longTitle, 'title').length, 30000);
});

test('assertTitle throws for non-string', () => {
  assert.throws(() => assertTitle(10, 'title'), {
    name: 'TypeError',
    message: 'title must be a string.'
  });
});

test('assertDescription returns empty string for undefined', () => {
  assert.equal(assertDescription(undefined, 'description'), '');
});

test('assertDescription throws for invalid type', () => {
  assert.throws(() => assertDescription(99, 'description'), {
    name: 'TypeError',
    message: 'description must be a string when provided.'
  });
});

test('assertCategory normalizes trimmed category to lowercase', () => {
  assert.equal(assertCategory('  Work  ', 'category'), 'work');
});

test('assertCategory throws for non-string category type', () => {
  assert.throws(() => assertCategory(7, 'category'), {
    name: 'TypeError',
    message: 'category must be a string when provided.'
  });
});

test('assertCategory throws for empty category string', () => {
  assert.throws(() => assertCategory('   ', 'category'), {
    name: 'TypeError',
    message: 'category cannot be empty when provided.'
  });
});

test('assertStatus accepts known statuses', () => {
  assert.equal(assertStatus('todo', 'status'), 'todo');
  assert.equal(assertStatus('in-progress', 'status'), 'in-progress');
  assert.equal(assertStatus('done', 'status'), 'done');
});

test('assertStatus throws for unknown status', () => {
  assert.throws(() => assertStatus('blocked', 'status'), {
    name: 'TypeError',
    message: 'status must be one of: todo, in-progress, done.'
  });
});

test('assertStatus throws for non-string status type', () => {
  assert.throws(() => assertStatus(1, 'status'), {
    name: 'TypeError',
    message: 'status must be one of: todo, in-progress, done.'
  });
});

test('assertPriority accepts known priorities', () => {
  assert.equal(assertPriority('low', 'priority'), 'low');
  assert.equal(assertPriority('medium', 'priority'), 'medium');
  assert.equal(assertPriority('high', 'priority'), 'high');
});

test('assertPriority throws for unknown priority', () => {
  assert.throws(() => assertPriority('urgent', 'priority'), {
    name: 'TypeError',
    message: 'priority must be one of: low, medium, high.'
  });
});

test('assertPriority throws for non-string priority type', () => {
  assert.throws(() => assertPriority(2, 'priority'), {
    name: 'TypeError',
    message: 'priority must be one of: low, medium, high.'
  });
});

test('assertIsoTimestamp accepts valid timestamp', () => {
  const timestamp = new Date().toISOString();
  assert.equal(assertIsoTimestamp(timestamp, 'createdAt'), timestamp);
});

test('assertIsoTimestamp throws for invalid timestamp', () => {
  assert.throws(() => assertIsoTimestamp('no-date', 'createdAt'), {
    name: 'TypeError',
    message: 'createdAt must be a valid ISO 8601 timestamp string.'
  });
});

test('isMutableTaskField returns true for mutable fields', () => {
  assert.equal(isMutableTaskField('title'), true);
  assert.equal(isMutableTaskField('description'), true);
  assert.equal(isMutableTaskField('status'), true);
  assert.equal(isMutableTaskField('priority'), true);
  assert.equal(isMutableTaskField('category'), true);
});

test('isMutableTaskField returns false for immutable fields', () => {
  assert.equal(isMutableTaskField('id'), false);
  assert.equal(isMutableTaskField('createdAt'), false);
  assert.equal(isMutableTaskField('updatedAt'), false);
});

test('isMutableTaskField throws for non-string key', () => {
  assert.throws(() => isMutableTaskField(1), {
    name: 'TypeError',
    message: 'key must be a string.'
  });
});

test('exported constants include expected statuses and priorities', () => {
  assert.deepEqual(TASK_STATUSES, ['todo', 'in-progress', 'done']);
  assert.deepEqual(TASK_PRIORITIES, ['low', 'medium', 'high']);
});
