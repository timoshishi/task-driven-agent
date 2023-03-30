// Task.ts

import { TaskManager } from './TaskManager'

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface TaskMetadata {
  [key: string]: any
}

export interface TaskDependency {
  taskId: string
  requiredStatus: TaskStatus
}

export class Task {
  public id: string
  public description: string
  public priority: number
  public deadline: Date | null
  public status: TaskStatus
  public metadata: TaskMetadata
  public dependencies: TaskDependency[]

  constructor(
    id: string,
    description: string,
    priority: number,
    deadline: Date | null = null,
    status: TaskStatus = TaskStatus.PENDING,
    metadata: TaskMetadata = {},
    dependencies: TaskDependency[] = []
  ) {
    this.id = id
    this.description = description
    this.priority = priority
    this.deadline = deadline
    this.status = status
    this.metadata = metadata
    this.dependencies = dependencies
  }

  /**
   * Starts the task and updates its status to IN_PROGRESS.
   */
  public startTask(): void {
    // Update the task status to IN_PROGRESS
    this.status = TaskStatus.IN_PROGRESS
  }

  /**
   * Marks the task as completed and updates its status to COMPLETED.
   */
  public completeTask(): void {
    this.status = TaskStatus.COMPLETED
  }

  /**
   * Marks the task as failed and updates its status to FAILED.
   */
  public failTask(): void {
    this.status = TaskStatus.FAILED
  }

  /**
   * Checks if the task has met all its dependencies.
   * @param {TaskManager} taskManager - The task manager to use to check dependencies.
   * @returns {boolean} True if all dependencies are met, false otherwise.
   */
  public dependenciesMet(taskManager: TaskManager): boolean {
    return this.dependencies.every((dependency) => {
      const task = taskManager.getTask(dependency.taskId)
      return task && task.status === dependency.requiredStatus
    })
  }

  /**
   * Adds or updates a metadata entry for the task.
   * @param {string} key - The key for the metadata entry.
   * @param {any} value - The value for the metadata entry.
   */
  public setMetadata(key: string, value: any): void {
    this.metadata[key] = value
  }

  /**
   * Retrieves a metadata entry for the task.
   * @param {string} key - The key for the metadata entry.
   * @returns {any} The value of the metadata entry, or null if not found.
   */
  public getMetadata(key: string): any {
    return this.metadata.hasOwnProperty(key) ? this.metadata[key] : null
  }

  /**
   * Adds a dependency to the task.
   * @param {TaskDependency} dependency - The dependency to add.
   */
  public addDependency(dependency: TaskDependency): void {
    this.dependencies.push(dependency)
  }

  /**
   * Removes a dependency from the task.
   * @param {string} taskId - The ID of the task to remove as a dependency.
   * @returns {boolean} True if the dependency was removed, false if not found.
   */
  public removeDependency(taskId: string): boolean {
    const initialLength = this.dependencies.length
    this.dependencies = this.dependencies.filter(
      (dependency) => dependency.taskId !== taskId
    )
    return initialLength !== this.dependencies.length
  }

  public isOverdue(): boolean {
    if (!this.deadline) {
      return false
    }
    const now = new Date()
    return now > this.deadline
  }
}
