```mermaid
graph LR
  A[User] -- Send Instructions --> B[Task-Driven Agent]
  B -- Create Task --> C[TaskManager]
  C -- Add Task to Queue --> D[Task List]
  C -- Prioritize Tasks --> D
  B -- Process Tasks --> E[Task Processing]
  E -- Retrieve Context --> F[Pinecone API]
  E -- Generate Response --> G[GPT-5 API]
  E -- Complete Tasks --> D
  E -- Update Task Status --> D
  E -- Create New Tasks --> C
  E -- Store Task Results --> H[Pinecone API]
  B -- Send Results --> A
  ```

```mermaid
graph LR
  A[User] -- Send Instructions --> B[Task-Driven Agent]
  B -- Create Task --> C[TaskManager]
  C -- Add Task to Queue --> D[Task List]
  C -- Prioritize Tasks --> D
  B -- Process Tasks --> E[Task Processing]
  E -- Retrieve Context --> F[Pinecone API - Memory]
  E -- Generate Response --> G[GPT-5 API]
  E -- Complete Tasks --> D
  E -- Update Task Status --> D
  E -- Create New Tasks --> C
  E -- Store Task Results --> H[Pinecone API - Memory]
  B -- Send Results --> A
  ```

  ```mermaid
graph LR
  A[User] -- Send Instructions --> B[Task-Driven Agent]
  B -- Create Task --> C[TaskManager]
  C -- Add Task to Queue --> D[Task List]
  C -- Prioritize Tasks --> D
  B -- Process Tasks --> E[Task Processing]
  E -- Retrieve Context --> F[Pinecone API - Memory]
  E -- Generate Response --> G[GPT-4 API]
  G -- Interact with LangChain --> H[LangChain Agent]
  E -- Complete Tasks --> D
  E -- Update Task Status --> D
  E -- Create New Tasks --> C
  E -- Store Task Results --> I[Pinecone API - Memory]
  B -- Send Results --> A
```