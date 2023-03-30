// Task.test.ts

import { Task, TaskStatus } from './Task'
import { TaskManager } from './TaskManager'
import { MockTaskManager } from '../mockClients'
describe('Task', () => {
  const task = new Task('1', 'Test task', 1)

  test('startTask should set the status to IN_PROGRESS', () => {
    task.startTask()
    expect(task.status).toBe(TaskStatus.IN_PROGRESS)
  })

  test('completeTask should set the status to COMPLETED', () => {
    task.completeTask()
    expect(task.status).toBe(TaskStatus.COMPLETED)
  })

  test('failTask should set the status to FAILED', () => {
    task.failTask()
    expect(task.status).toBe(TaskStatus.FAILED)
  })

  test('dependenciesMet should return true when all dependencies are met', () => {
    const task1 = new Task('1', 'Test task 1', 1)
    const task2 = new Task('2', 'Test task 2', 2)
    const dependencies = [{ taskId: task2.id, requiredStatus: TaskStatus.COMPLETED }]
    const task3 = new Task(
      '3',
      'Test task 3',
      3,
      null,
      TaskStatus.PENDING,
      {},
      dependencies
    )

    const mockTaskManager = new MockTaskManager([
      task1,
      task2,
      task3,
    ]) as unknown as TaskManager
    expect(task1.dependenciesMet(mockTaskManager)).toBe(true)
    expect(task2.dependenciesMet(mockTaskManager)).toBe(true)
    expect(task3.dependenciesMet(mockTaskManager)).toBe(false)

    task2.completeTask()
    expect(task3.dependenciesMet(mockTaskManager)).toBe(true)
  })

  test('dependenciesMet should handle multiple dependencies correctly', () => {
    const task1 = new Task('1', 'Test task 1', 1)
    const task2 = new Task('2', 'Test task 2', 2)
    const task3 = new Task('3', 'Test task 3', 3, null, TaskStatus.COMPLETED)
    const dependencies = [
      { taskId: task2.id, requiredStatus: TaskStatus.COMPLETED },
      { taskId: task3.id, requiredStatus: TaskStatus.COMPLETED },
    ]
    const task4 = new Task(
      '4',
      'Test task 4',
      4,
      null,
      TaskStatus.PENDING,
      {},
      dependencies
    )

    const mockTaskManager = new MockTaskManager([
      task1,
      task2,
      task3,
      task4,
    ]) as unknown as TaskManager
    expect(task4.dependenciesMet(mockTaskManager)).toBe(false)

    task2.completeTask()
    expect(task4.dependenciesMet(mockTaskManager)).toBe(true)
  })

  test('dependenciesMet should handle unmet dependencies with different statuses correctly', () => {
    const task1 = new Task('1', 'Test task 1', 1)
    const task2 = new Task('2', 'Test task 2', 2, null, TaskStatus.FAILED)
    const dependencies = [{ taskId: task2.id, requiredStatus: TaskStatus.COMPLETED }]
    const task3 = new Task(
      '3',
      'Test task 3',
      3,
      null,
      TaskStatus.PENDING,
      {},
      dependencies
    )

    const mockTaskManager = new MockTaskManager([
      task1,
      task2,
      task3,
    ]) as unknown as TaskManager
    expect(task3.dependenciesMet(mockTaskManager)).toBe(false)

    task2.completeTask()
    expect(task3.dependenciesMet(mockTaskManager)).toBe(true)
  })

  test('setMetadata and getMetadata should add and retrieve metadata correctly', () => {
    const task = new Task('1', 'Test task', 1)
    task.setMetadata('testKey', 'testValue')
    expect(task.getMetadata('testKey')).toBe('testValue')
    expect(task.getMetadata('nonExistentKey')).toBeNull()
  })

  test('addDependency and removeDependency should add and remove dependencies correctly', () => {
    const task1 = new Task('1', 'Test task 1', 1)
    const task2 = new Task('2', 'Test task 2', 2)
    const dependency = { taskId: task2.id, requiredStatus: TaskStatus.COMPLETED }

    task1.addDependency(dependency)
    expect(task1.dependencies).toContainEqual(dependency)

    const result = task1.removeDependency(task2.id)
    expect(task1.dependencies).not.toContainEqual(dependency)
    expect(result).toBe(true)

    const nonExistentResult = task1.removeDependency(task2.id)
    expect(nonExistentResult).toBe(false)
  })

  test('isOverdue should return the correct overdue status', () => {
    const now = new Date()
    const pastDeadline = new Date(now.getTime() - 1000 * 60 * 60 * 24) // 1 day in the past
    const futureDeadline = new Date(now.getTime() + 1000 * 60 * 60 * 24) // 1 day in the future

    const task1 = new Task('1', 'Test task 1', 1, pastDeadline)
    const task2 = new Task('2', 'Test task 2', 2, futureDeadline)
    const task3 = new Task('3', 'Test task 3', 3)

    expect(task1.isOverdue()).toBe(true)
    expect(task2.isOverdue()).toBe(false)
    expect(task3.isOverdue()).toBe(false)
  })
})
