import test from 'node:test';
import assert from 'node:assert/strict';

import { Task } from '../src/models/task.js';

function makeBaseTaskData(overrides = {}) {
  const now = new Date().toISOString();
  return {
    title: 'Write tests',
    description: 'Cover model behavior',
    status: 'todo',
    priority: 'medium',
    createdAt: now,
    updatedAt: now,
    ...overrides
  };
}

test('Task constructor creates a valid task with generated id', () => {
  const task = new Task(makeBaseTaskData());

  assert.match(task.id, /^[1-9][0-9]*$/);
  assert.equal(task.title, 'Write tests');
  assert.equal(task.description, 'Cover model behavior');
  assert.equal(task.status, 'todo');
  assert.equal(task.priority, 'medium');
});

test('Task constructor uses provided valid id', () => {
  const task = new Task(makeBaseTaskData({ id: '42' }));

  assert.equal(task.id, '42');
});

test('Task constructor supports missing optional description field', () => {
  const now = new Date().toISOString();
  const task = new Task({
    id: '10',
    title: 'Only required and timestamps',
    createdAt: now,
    updatedAt: now
  });

  assert.equal(task.description, '');
  assert.equal(task.status, 'todo');
  assert.equal(task.priority, 'medium');
});

test('Task constructor accepts very long title and description', () => {
  const longTitle = 'T'.repeat(5000);
  const longDescription = 'D'.repeat(20000);
  const task = new Task(
    makeBaseTaskData({
      id: '11',
      title: longTitle,
      description: longDescription
    })
  );

  assert.equal(task.title, longTitle);
  assert.equal(task.description, longDescription);
});

test('Task constructor rejects non-object data', () => {
  assert.throws(() => new Task(null), {
    name: 'TypeError',
    message: 'data must be a plain object.'
  });
});

test('Task constructor validates required title', () => {
  assert.throws(() => new Task(makeBaseTaskData({ title: '   ' })), {
    name: 'TypeError',
    message: 'title cannot be empty.'
  });
});

test('Task constructor rejects non-string id type', () => {
  assert.throws(() => new Task(makeBaseTaskData({ id: 12 })), {
    name: 'TypeError',
    message: 'id must be a numeric string like "1" or "42".'
  });
});

test('Task constructor rejects non-string title type', () => {
  assert.throws(() => new Task(makeBaseTaskData({ title: 100 })), {
    name: 'TypeError',
    message: 'title must be a string.'
  });
});

test('Task constructor validates status values', () => {
  assert.throws(() => new Task(makeBaseTaskData({ status: 'blocked' })), {
    name: 'TypeError',
    message: 'status must be one of: todo, in-progress, done.'
  });
});

test('Task constructor validates priority values', () => {
  assert.throws(() => new Task(makeBaseTaskData({ id: '9', priority: 'urgent' })), {
    name: 'TypeError',
    message: 'priority must be one of: low, medium, high.'
  });
});

test('Task constructor validates createdAt timestamp', () => {
  assert.throws(() => new Task(makeBaseTaskData({ createdAt: 'not-a-date' })), {
    name: 'TypeError',
    message: 'createdAt must be a valid ISO 8601 timestamp string.'
  });
});

test('Task constructor validates updatedAt timestamp', () => {
  assert.throws(() => new Task(makeBaseTaskData({ updatedAt: 123 })), {
    name: 'TypeError',
    message: 'updatedAt must be a valid ISO 8601 timestamp string.'
  });
});

test('Task.toJSON returns plain object snapshot', () => {
  const input = makeBaseTaskData({ id: '7' });
  const task = new Task(input);
  const serialized = task.toJSON();

  assert.deepEqual(serialized, {
    id: '7',
    title: 'Write tests',
    description: 'Cover model behavior',
    status: 'todo',
    priority: 'medium',
    createdAt: input.createdAt,
    updatedAt: input.updatedAt
  });

  serialized.title = 'Mutated';
  assert.equal(task.title, 'Write tests');
});
