import { createTask, deleteTask, listTasks, updateTask } from './services/taskService.js';
import { colorPriority, colorStatus } from './utils/colors.js';

function printHeader(title) {
  console.log(`\n=== ${title} ===`);
}

function formatTask(task) {
  return {
    ...task,
    status: colorStatus(task.status),
    priority: colorPriority(task.priority)
  };
}

function printTasks(tasks) {
  console.table(tasks.map((task) => formatTask(task)));
}

function runDemo() {
  try {
    printHeader('Create tasks');
    const taskA = createTask({
      title: 'Read docs/schema.md',
      description: 'Understand required model fields and constraints.',
      priority: 'high',
      category: 'work'
    });
    const taskB = createTask({
      title: 'Implement services',
      status: 'in-progress',
      priority: 'medium',
      category: 'urgent'
    });
    const taskC = createTask({
      title: 'Buy groceries',
      description: 'Milk, eggs, fruit',
      priority: 'low'
    });
    printTasks([taskA, taskB, taskC]);

    printHeader('List tasks');
    printTasks(listTasks());

    printHeader('Filter tasks by category (work)');
    printTasks(listTasks({ category: 'WORK' }));

    printHeader('Update task');
    const updatedTask = updateTask(taskA.id, {
      status: 'done',
      description: 'Schema reviewed and implementation completed.',
      category: 'personal'
    });
    printTasks([updatedTask]);

    printHeader('Delete task');
    const removedTask = deleteTask(taskB.id);
    printTasks([removedTask]);

    printHeader('Final state');
    printTasks(listTasks());
  } catch (error) {
    console.error('Task Manager demo failed:', error);
    process.exitCode = 1;
  }
}

runDemo();