import { TaskManager } from './task_management'
import { Task } from './task_management/Task'

export class MockTaskManager {
  private tasks: Map<string, Task>

  constructor(tasks: Task[]) {
    this.tasks = new Map()
    tasks.forEach((task) => this.tasks.set(task.id, task))
  }

  getTask(taskId: string): Task | null {
    return this.tasks.get(taskId) || null
  }
}

// mockClients.ts

export class MockGpt4Client {
  public async generateText(prompt: string): Promise<string> {
    return 'Mock generated text'
  }
}

export class MockPineconeClient {
  public async storeData(key: string, value: any): Promise<void> {
    console.log(`Mock Pinecone store: ${key} - ${JSON.stringify(value)}`)
  }

  public async fetchData(key: string): Promise<any> {
    return `Mock Pinecone fetch: ${key}`
  }
}

export class MockLangChainClient {
  public async translate(text: string, targetLanguage: string): Promise<string> {
    return `Mock translation: ${text} to ${targetLanguage}`
  }
}
