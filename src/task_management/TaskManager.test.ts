import { Task, TaskStatus } from './Task'
import { TaskManager } from './TaskManager'
import { MockGpt4Client, MockPineconeClient, MockLangChainClient } from '../mockClients'

const makeTaskManager = () => {
  const gpt4Client = new MockGpt4Client()
  const pineconeClient = new MockPineconeClient()
  const langChainClient = new MockLangChainClient()

  return new TaskManager(gpt4Client, pineconeClient, langChainClient)
}
describe('TaskManager', () => {
  let taskManager: TaskManager
  beforeEach(() => {
    const gpt4Client = new MockGpt4Client()
    const pineconeClient = new MockPineconeClient()
    const langChainClient = new MockLangChainClient()

    taskManager = new TaskManager(gpt4Client, pineconeClient, langChainClient)
  })

  test('addTask', () => {
    const task = new Task('1', 'Test task', 1)
    taskManager.addTask(task)
    expect(taskManager.getTask('1')).toEqual(task)
  })

  test('removeTask', () => {
    const task = new Task('2', 'Test task 2', 2)
    taskManager.addTask(task)
    expect(taskManager.removeTask('2')).toBeTruthy()
    expect(taskManager.getTask('2')).toBeNull()
  })

  test('getTask', () => {
    const task = new Task('3', 'Test task 3', 3)
    taskManager.addTask(task)
    expect(taskManager.getTask('3')).toEqual(task)
  })

  test('updateTask', () => {
    const task = new Task('4', 'Test task 4', 4)
    taskManager.addTask(task)
    const updatedTask = new Task('4', 'Updated test task 4', 5)
    expect(taskManager.updateTask(updatedTask)).toBeTruthy()
    expect(taskManager.getTask('4')).toEqual(updatedTask)
  })

  test('getTaskStatus', () => {
    const task = new Task('5', 'Test task 5', 5)
    taskManager.addTask(task)
    expect(taskManager.getTaskStatus('5')).toEqual(TaskStatus.PENDING)
  })
  // Write your tests here
  test('addTask with duplicate ID', () => {
    const task1 = new Task('6', 'Test task 6', 1)
    const task2 = new Task('6', 'Test task 6 duplicate', 2)
    taskManager.addTask(task1)
    expect(() => taskManager.addTask(task2)).toThrowError(
      `Task with id: 6 already exists`
    )
  })

  test('removeTask with non-existent ID', () => {
    expect(taskManager.removeTask('non_existent_id')).toBeFalsy()
  })

  test('updateTask with non-existent ID', () => {
    const nonExistentTask = new Task('non_existent_id', 'Non-existent task', 1)
    expect(taskManager.updateTask(nonExistentTask)).toBeFalsy()
  })

  test('getTaskStatus with non-existent ID', () => {
    expect(taskManager.getTaskStatus('non_existent_id')).toBeNull()
  })

  test('sortTasks', () => {
    const task1 = new Task('1', 'Test task 1', 1)
    const task2 = new Task('2', 'Test task 2', 2)
    const task3 = new Task('3', 'Test task 3', 3)
    const taskManager = makeTaskManager()
    taskManager.addTask(task1)
    taskManager.addTask(task2)
    taskManager.addTask(task3)
    taskManager.sortTasksForTesting()
    const sortedTasks = taskManager.getPendingTasks()
    expect(sortedTasks).toEqual([task3, task2, task1])
  })
  test('prioritizeTasks', async () => {
    const task1 = new Task('1', 'Test task 1', 1)
    const task2 = new Task('2', 'Test task 2', 2)
    const task3 = new Task('3', 'Test task 3', 3)

    const prioritizedTasks = await taskManager.prioritizeTasks([task1, task2, task3])
    expect(prioritizedTasks).toEqual([task3, task2, task1])
  })

  test('processNextTask', async () => {
    const task1 = new Task('1', 'Test task 1', 1)
    const taskManager = makeTaskManager()

    // Mock the processTask method to avoid actual task processing
    taskManager.processTask = jest.fn().mockResolvedValue(undefined)

    taskManager.addTask(task1)
    await taskManager.processNextTask()

    expect(taskManager.getTask('1')?.status).toEqual(TaskStatus.COMPLETED)
  })
})
