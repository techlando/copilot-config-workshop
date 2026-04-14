# Task Manager CLI Project Plan

## 1. Project overview
Task Manager CLI is a small Node.js 20+ command-line application for managing personal tasks entirely in memory during runtime. Users can create, list, update, and delete tasks, then narrow results with filters and ordering options, including task categories such as work, personal, and urgent. The project is intentionally scoped for a workshop exercise, uses only built-in Node.js modules, and focuses on clean command parsing, predictable task lifecycle behavior, and testable domain logic.

## 2. User stories
1. As a user, I can create a task so that I can track work items.
Acceptance criteria:
- Given valid input, running a create command adds a task with title, description, status, priority, category, createdAt, and updatedAt.
- Default status is todo when not provided.
- Default priority is medium when not provided.
- Default category is general when not provided.
- createdAt and updatedAt are set to the current ISO timestamp at creation.

2. As a user, I can list tasks so that I can view current work.
Acceptance criteria:
- Running a list command returns all tasks in a readable CLI format.
- If no tasks exist, the CLI shows a clear empty-state message.
- Each listed task includes id, title, status, priority, category, createdAt, and updatedAt.

3. As a user, I can update an existing task so that task details stay accurate.
Acceptance criteria:
- Updating title, description, status, and priority is supported.
- Invalid status or priority values are rejected with a validation error.
- updatedAt changes on successful update, while createdAt remains unchanged.
- Updating a missing task id returns a not-found message.

4. As a user, I can delete a task so that completed or obsolete work is removed.
Acceptance criteria:
- Deleting by id removes the task from in-memory storage.
- Deleting a missing id returns a not-found message.
- Subsequent list output no longer includes the deleted task.

5. As a user, I can filter listed tasks by status, priority, or category so that I can focus on relevant items.
Acceptance criteria:
- List command supports filtering by status value: todo, in-progress, done.
- List command supports filtering by priority value: low, medium, high.
- List command supports filtering by category value such as work, personal, urgent, and general.
- Filters can be used individually or together.
- Invalid status and priority filter values return a validation error.
- Category filter comparison is case-insensitive after trimming.

6. As a user, I can sort listed tasks by priority or creation date so that I can prioritize work.
Acceptance criteria:
- List command supports sorting by priority with a defined order: high, medium, low.
- List command supports sorting by createdAt in ascending or descending order.
- If no sort option is provided, tasks are shown in insertion order.

## 3. Data model

### Entity: Task
- id: string
- title: string
- description: string
- status: "todo" | "in-progress" | "done"
- priority: "low" | "medium" | "high"
- category: string (defaults to "general")
- createdAt: string (ISO 8601 timestamp)
- updatedAt: string (ISO 8601 timestamp)

### In-memory store
- tasks: Task[]
- nextId: number

## 4. File structure
Proposed layout under src/:

```text
src/
  index.js
  cli/
    parseArgs.js
    helpText.js
  domain/
    taskModel.js
    validators.js
    priorityOrder.js
  services/
    taskService.js
  store/
    memoryStore.js
  format/
    taskFormatter.js
  utils/
    dateTime.js
```

## 5. Implementation phases
1. Foundation and CLI shell
- Initialize entrypoint and argument parser in src/index.js and src/cli/parseArgs.js.
- Add help and usage text for all commands and options.
- Define command contract: create, list, update, delete.

2. Domain and validation
- Implement Task shape and default values.
- Add validators for required title, valid status, valid priority, and optional category.
- Centralize priority ordering and enum-like constants.

3. In-memory persistence and CRUD operations
- Implement memory store with tasks array and id generation.
- Add service methods: createTask, listTasks, updateTask, deleteTask.
- Ensure createdAt and updatedAt behavior is correct.
- Persist normalized category values, defaulting to general when omitted.

4. Filtering and sorting
- Add list options for status, priority, and category filters.
- Add sorting by priority and createdAt with direction support.
- Keep logic in service layer so CLI parsing remains thin.

5. Output formatting and error handling
- Format task list and single-task responses for readability.
- Return consistent validation and not-found messages.
- Ensure non-zero process exit code for invalid commands or options.

6. Test coverage with built-in tooling
- Add unit tests using node:test and assert for validators and task service.
- Add command-level smoke tests for parsing and expected outputs.
- Cover edge cases: empty list, invalid enums, missing id, combined filters, case-insensitive category filtering, default category behavior, each sort mode.

## 6. Error handling conventions and input validation rules

### Error handling conventions
- Use structured error objects with fields: code, message, details.
- Keep domain errors in the service layer and CLI concerns in the command layer.
- Print user-facing errors to stderr and normal results to stdout.
- Return exit code 0 for success and 1 for any validation, command, or runtime error.
- Use consistent, machine-readable error codes:
  - INVALID_COMMAND
  - INVALID_ARGUMENT
  - VALIDATION_ERROR
  - TASK_NOT_FOUND
  - INTERNAL_ERROR
- For unexpected exceptions, return INTERNAL_ERROR with a generic message and avoid leaking stack traces by default.

### Input validation rules
- Command validation:
  - Command must be one of create, list, update, delete.
  - Unknown flags are rejected.
- Field validation:
  - title is required for create and must be a non-empty trimmed string.
  - description is optional and defaults to an empty string.
  - status must be one of todo, in-progress, done.
  - priority must be one of low, medium, high.
  - category is optional, must be a non-empty trimmed string when provided, and defaults to general.
  - id for update and delete must be a non-empty string.
- Filter validation:
  - status filter accepts only todo, in-progress, done.
  - priority filter accepts only low, medium, high.
  - category filter accepts non-empty strings and compares values case-insensitively.
- Sort validation:
  - sortBy accepts only priority or createdAt.
  - sortDir accepts only asc or desc and defaults to asc.
- Timestamp rules:
  - createdAt and updatedAt are generated by the system.
  - Inputs that attempt to set createdAt or updatedAt directly are rejected.

### Validation flow
1. Parse command and raw args.
2. Validate command and option names.
3. Validate and normalize field values.
4. Execute service operation only after validation passes.
5. Map thrown errors to standard error codes and messages.