import chalk from 'chalk';
import { assertPriority, assertStatus } from './validators.js';

/**
 * Returns a chalk-colored status label.
 * @param {unknown} status Status value to colorize.
 * @returns {string} Colorized status text.
 * @example
 * colorStatus('done');
 * @example
 * colorStatus('todo');
 */
export function colorStatus(status) {
  const validStatus = assertStatus(status, 'status');

  if (validStatus === 'done') {
    return chalk.green(validStatus);
  }

  if (validStatus === 'in-progress') {
    return chalk.yellow(validStatus);
  }

  return chalk.red(validStatus);
}

/**
 * Returns a chalk-colored priority label.
 * @param {unknown} priority Priority value to colorize.
 * @returns {string} Colorized priority text.
 * @example
 * colorPriority('high');
 * @example
 * colorPriority('low');
 */
export function colorPriority(priority) {
  const validPriority = assertPriority(priority, 'priority');

  if (validPriority === 'high') {
    return chalk.bold.red(validPriority);
  }

  if (validPriority === 'medium') {
    return chalk.bold.yellow(validPriority);
  }

  return chalk.dim(validPriority);
}