import { createTask, deleteTask, listTasks, updateTask } from './services/taskService.js';

function printHeader(title) {
  console.log(`\n=== ${title} ===`);
}

function runDemo() {
  try {
    printHeader('Create tasks');
    const taskA = createTask({
      title: 'Read docs/schema.md',
      description: 'Understand required model fields and constraints.',
      priority: 'high'
    });
    const taskB = createTask({
      title: 'Implement services',
      status: 'in-progress',
      priority: 'medium'
    });
    console.log(taskA);
    console.log(taskB);

    printHeader('List tasks');
    console.log(listTasks());

    printHeader('Update task');
    const updatedTask = updateTask(taskA.id, {
      status: 'done',
      description: 'Schema reviewed and implementation completed.'
    });
    console.log(updatedTask);

    printHeader('Delete task');
    const removedTask = deleteTask(taskB.id);
    console.log(removedTask);

    printHeader('Final state');
    console.log(listTasks());
  } catch (error) {
    console.error('Task Manager demo failed:', error);
    process.exitCode = 1;
  }
}

runDemo();