import test from 'node:test';
import assert from 'node:assert/strict';

async function loadService() {
  const token = `${Date.now()}-${Math.random()}`;
  return import(`../src/services/taskService.js?token=${token}`);
}

test('createTask creates task with defaults and id sequence starts at 1', async () => {
  const { createTask, listTasks } = await loadService();
  const created = createTask({ title: 'First task' });

  assert.equal(created.id, '1');
  assert.equal(created.status, 'todo');
  assert.equal(created.priority, 'medium');
  assert.equal(created.title, 'First task');
  assert.equal(created.description, '');

  const listed = listTasks();
  assert.equal(listed.length, 1);
  assert.deepEqual(listed[0], created);
});

test('createTask rejects invalid input', async () => {
  const { createTask } = await loadService();

  assert.throws(() => createTask('bad'), {
    name: 'TypeError',
    message: 'input must be a plain object.'
  });
});

test('createTask handles missing optional fields when explicitly undefined', async () => {
  const { createTask } = await loadService();
  const created = createTask({
    title: 'Optional fields missing',
    description: undefined,
    status: undefined,
    priority: undefined
  });

  assert.equal(created.description, '');
  assert.equal(created.status, 'todo');
  assert.equal(created.priority, 'medium');
});

test('createTask supports duplicate titles as separate tasks', async () => {
  const { createTask, listTasks } = await loadService();
  const first = createTask({ title: 'Duplicate title' });
  const second = createTask({ title: 'Duplicate title' });
  const tasks = listTasks();

  assert.equal(first.title, second.title);
  assert.notEqual(first.id, second.id);
  assert.equal(tasks.length, 2);
});

test('createTask accepts very long title', async () => {
  const { createTask } = await loadService();
  const longTitle = 'x'.repeat(12000);
  const created = createTask({ title: longTitle });

  assert.equal(created.title.length, 12000);
});

test('listTasks returns cloned task objects', async () => {
  const { createTask, listTasks } = await loadService();
  createTask({ title: 'Immutable list check' });

  const firstRead = listTasks();
  firstRead[0].title = 'Mutated outside';

  const secondRead = listTasks();
  assert.equal(secondRead[0].title, 'Immutable list check');
});

test('updateTask updates mutable fields and refreshes updatedAt', async () => {
  const { createTask, updateTask } = await loadService();
  const created = createTask({ title: 'Patch me', priority: 'low' });

  const updated = updateTask(created.id, {
    title: 'Patched',
    description: 'Now with details',
    status: 'done',
    priority: 'high'
  });

  assert.equal(updated.id, created.id);
  assert.equal(updated.title, 'Patched');
  assert.equal(updated.description, 'Now with details');
  assert.equal(updated.status, 'done');
  assert.equal(updated.priority, 'high');
  assert.equal(Number.isNaN(Date.parse(updated.updatedAt)), false);
  assert.equal(
    Date.parse(updated.updatedAt) >= Date.parse(created.updatedAt),
    true
  );
});

test('updateTask rejects immutable field updates', async () => {
  const { createTask, updateTask } = await loadService();
  const created = createTask({ title: 'Cannot touch id' });

  assert.throws(() => updateTask(created.id, { id: '999' }), {
    name: 'Error',
    message: 'Invalid input: immutable or unknown fields provided: id.'
  });
});

test('updateTask rejects non-existing id', async () => {
  const { updateTask } = await loadService();

  assert.throws(() => updateTask('999', { title: 'Nope' }), {
    name: 'Error',
    message: 'Task not found for id 999.'
  });
});

test('updateTask validates update payload type', async () => {
  const { createTask, updateTask } = await loadService();
  const created = createTask({ title: 'Payload validation' });

  assert.throws(() => updateTask(created.id, null), {
    name: 'TypeError',
    message: 'updates must be a plain object.'
  });
});

test('updateTask accepts very long description update', async () => {
  const { createTask, updateTask } = await loadService();
  const created = createTask({ title: 'Long description target' });
  const longDescription = 'd'.repeat(40000);

  const updated = updateTask(created.id, { description: longDescription });
  assert.equal(updated.description.length, 40000);
});

test('listTasks iteration remains stable while adding tasks', async () => {
  const { createTask, listTasks } = await loadService();
  createTask({ title: 'Seed A' });
  createTask({ title: 'Seed B' });

  const snapshot = listTasks();
  for (const item of snapshot) {
    createTask({ title: `Spawned from ${item.id}` });
  }

  const tasks = listTasks();
  assert.equal(tasks.length, 4);
});

test('deleteTask removes and returns deleted task', async () => {
  const { createTask, deleteTask, listTasks } = await loadService();
  const created = createTask({ title: 'Delete me' });

  const deleted = deleteTask(created.id);
  assert.deepEqual(deleted, created);

  const tasks = listTasks();
  assert.equal(tasks.length, 0);
});

test('deleteTask rejects non-existing id', async () => {
  const { deleteTask } = await loadService();

  assert.throws(() => deleteTask('123'), {
    name: 'Error',
    message: 'Task not found for id 123.'
  });
});

test('deleteTask validates id format', async () => {
  const { deleteTask } = await loadService();

  assert.throws(() => deleteTask('abc'), {
    name: 'TypeError',
    message: 'id must be a numeric string like "1" or "42".'
  });
});
