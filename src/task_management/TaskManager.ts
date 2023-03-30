// TaskManager.ts

import { Task, TaskStatus } from './Task'
import { Gpt4Client } from '../gpt4/Gpt4Client'
import { PineconeClient } from '../pinecone/PineconeClient'
import { LangChainClient } from '../langchain/LangChainClient'

export class TaskManager {
  private gpt4Client: Gpt4Client
  private pineconeClient: PineconeClient
  private langChainClient: LangChainClient
  private tasks: Task[] = []
  private pendingTasks: Task[] = []
  constructor(
    gpt4Client: Gpt4Client,
    pineconeClient: PineconeClient,
    langChainClient: LangChainClient
  ) {
    this.gpt4Client = gpt4Client
    this.pineconeClient = pineconeClient
    this.langChainClient = langChainClient
  }

  public addTask(task: Task): void {
    const foundTask = this.getTask(task.id)
    if (foundTask) {
      throw new Error(`Task with id: ${task.id} already exists`)
    }
    this.tasks.push(task)
    if (task.status === TaskStatus.PENDING) {
      this.pendingTasks.push(task)
      this.sortTasks()
    }
  }

  public removeTask(taskId: string): boolean {
    const initialLength = this.tasks.length
    this.tasks = this.tasks.filter((task) => task.id !== taskId)
    return initialLength !== this.tasks.length
  }

  public getPendingTasks(): Task[] {
    return this.pendingTasks
  }

  public getTask(taskId: string): Task | null {
    return this.tasks.find((task) => task.id === taskId) || null
  }

  public updateTask(updatedTask: Task): boolean {
    const taskIndex = this.tasks.findIndex((task) => task.id === updatedTask.id)

    if (taskIndex === -1) {
      return false
    }

    this.tasks[taskIndex] = updatedTask
    return true
  }

  public getTaskStatus(taskId: string): TaskStatus | null {
    const task = this.getTask(taskId)
    return task ? task.status : null
  }

  public get inProgressTasks(): Task[] {
    return this.tasks.filter((task) => task.status === TaskStatus.IN_PROGRESS)
  }

  public get completedTasks(): Task[] {
    return this.tasks.filter((task) => task.status === TaskStatus.COMPLETED)
  }

  public get failedTasks(): Task[] {
    return this.tasks.filter((task) => task.status === TaskStatus.FAILED)
  }

  private sortTasks(): void {
    this.pendingTasks.sort((a, b) => {
      if (a.isOverdue() && !b.isOverdue()) {
        return -1
      }
      if (!a.isOverdue() && b.isOverdue()) {
        return 1
      }
      if (a.dependencies.length !== b.dependencies.length) {
        return a.dependencies.length - b.dependencies.length
      }
      if (a.priority !== b.priority) {
        return b.priority - a.priority
      }
      if (a.deadline && b.deadline) {
        return a.deadline.getTime() - b.deadline.getTime()
      }
      return 0
    })
  }

  public async prioritizeTasks(tasks: Task[]): Promise<Task[]> {
    this.pendingTasks = tasks
    this.sortTasks()
    return this.pendingTasks
  }
  public sortTasksForTesting(): void {
    this.sortTasks()
  }

  public async processTask(task: Task): Promise<void> {
    // Implement task processing logic here
  }

  public async handleTaskError(task: Task, error: Error): Promise<void> {
    // Implement error handling logic here
  }

  public async fetchTaskDependenciesStatus(task: Task): Promise<void> {
    // Implement fetching task dependencies' status from an external service
  }

  public async storeTaskResult(task: Task, result: any): Promise<void> {
    // Implement storing the task result in an external service
  }

  public async createNewTasksBasedOnResult(task: Task, result: any): Promise<void> {
    // Implement creating new tasks based on the result of a completed task
  }

  public async processNextTask(): Promise<void> {
    if (this.pendingTasks.length === 0) {
      return
    }

    const task = this.pendingTasks.shift()
    if (!task) {
      return
    }

    try {
      await this.processTask(task)
      task.status = TaskStatus.COMPLETED
    } catch (error) {
      await this.handleTaskError(task, error as unknown as Error)
      task.status = TaskStatus.FAILED
    }

    this.updateTask(task)
  }
}
