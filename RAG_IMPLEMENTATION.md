# RAG Implementation for BrainlyCode

This document outlines the implementation of Retrieval-Augmented Generation (RAG), fine-tuning, and vector embeddings for the BrainlyCode platform.

## 🏗️ Architecture Overview

### Components

1. **Vector Database**: PostgreSQL with pgvector extension
2. **Embeddings Service**: OpenAI text-embedding-3-small model
3. **RAG Service**: Retrieval-augmented generation with context
4. **Data Ingestion**: Automated content processing
5. **Fine-tuning**: Custom model training pipeline

### Database Schema

```sql
-- Knowledge Base for vector storage
CREATE TABLE knowledge_base (
  id SERIAL PRIMARY KEY,
  title VARCHAR NOT NULL,
  content TEXT NOT NULL,
  type VARCHAR NOT NULL, -- 'course', 'lesson', 'challenge', 'resource'
  source_id INTEGER,
  source_type VARCHAR,
  embedding vector(1536), -- OpenAI embedding dimension
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Chat Sessions for context
CREATE TABLE chat_sessions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  session_id VARCHAR UNIQUE,
  messages JSONB,
  context JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Fine-tuning Jobs
CREATE TABLE fine_tuning_jobs (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,
  status VARCHAR NOT NULL, -- 'pending', 'running', 'completed', 'failed'
  model_id VARCHAR, -- OpenAI fine-tuned model ID
  training_data JSONB,
  results JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🚀 Setup Instructions

### 1. Database Setup

```bash
# Update docker-compose.yml to use pgvector
# Already done - using pgvector/pgvector:pg15

# Run migrations
npm run prisma:dev:deploy
```

### 2. Install Dependencies

```bash
npm install @langchain/openai @langchain/community @langchain/core langchain pgvector
```

### 3. Environment Variables

Ensure your `.env` file includes:

```env
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=postgresql://postgres:123@localhost:5432/nest
```

### 4. Initial Data Ingestion

```bash
# Run the setup script
npx ts-node scripts/setup-rag.ts

# Or use the API endpoint
POST /ai/ingest
```

## 📡 API Endpoints

### Chat with RAG

```http
POST /ai/chat
Content-Type: application/json

{
  "messages": "How do I create a React component?",
  "userId": 1,
  "sessionId": "session-123",
  "history": [
    {
      "role": "user",
      "content": "Previous message"
    },
    {
      "role": "assistant", 
      "content": "Previous response"
    }
  ]
}
```

**Response:**
```json
{
  "reply": "To create a React component...",
  "sources": [
    {
      "id": 1,
      "title": "React Fundamentals",
      "type": "lesson",
      "sourceId": 123,
      "sourceType": "Lesson"
    }
  ],
  "context": [
    {
      "id": 1,
      "title": "React Fundamentals",
      "content": "React components are...",
      "distance": 0.2
    }
  ]
}
```

### Search Platform Content

```http
GET /ai/search?query=javascript&type=lesson&limit=5
```

### Get Personalized Recommendations

```http
GET /ai/recommendations/1?limit=3
```

### Fine-tuning Operations

```http
# Create fine-tuning job
POST /ai/fine-tuning
{
  "name": "BrainlyCode Custom Model",
  "trainingData": [
    {
      "system": "You are BrainlyCode AI...",
      "user": "How do I debug JavaScript?",
      "assistant": "To debug JavaScript, you can..."
    }
  ]
}

# Get job status
GET /ai/fine-tuning/1

# List all jobs
GET /ai/fine-tuning
```

## 🔧 Services

### EmbeddingsService

- **generateEmbedding()**: Create vector embeddings
- **storeContentWithEmbedding()**: Store content with vectors
- **findSimilarContent()**: Vector similarity search
- **updateEmbedding()**: Update existing embeddings
- **batchProcessContent()**: Bulk processing

### RagService

- **generateRagResponse()**: Main RAG pipeline
- **searchPlatformContent()**: Content search
- **getPersonalizedRecommendations()**: User-specific recommendations
- **storeChatSession()**: Session management

### DataIngestionService

- **ingestCourses()**: Process all courses
- **ingestLessons()**: Process all lessons
- **ingestChallenges()**: Process all challenges
- **ingestCourseResources()**: Process resources
- **updateContent()**: Update specific content

### FineTuningService

- **createFineTuningJob()**: Create training jobs
- **getFineTuningJobStatus()**: Monitor progress
- **generateTrainingDataFromPlatform()**: Extract training data
- **useFineTunedModel()**: Use custom models

## 🎯 Usage Examples

### 1. Basic Chat with RAG

```typescript
const response = await aiService.askTutor(
  "How do I implement authentication in my app?",
  undefined, // history
  1, // userId
  "session-123" // sessionId
);

console.log(response.response); // AI response with context
console.log(response.sources); // Sources used
```

### 2. Content Search

```typescript
const results = await aiService.searchContent(
  "React hooks",
  "lesson", // content type
  5 // limit
);
```

### 3. Personalized Recommendations

```typescript
const recommendations = await aiService.getRecommendations(1, 3);
```

### 4. Data Ingestion

```typescript
// Ingest all content
await aiService.ingestData();

// Update specific content
await aiService.updateContent("Course", 123);
```

## 🔄 Workflow

### RAG Pipeline

1. **User Query** → Vector embedding generation
2. **Vector Search** → Find similar content in knowledge base
3. **Context Retrieval** → Gather relevant platform content
4. **LLM Generation** → Generate response with context
5. **Response** → Return answer with sources

### Fine-tuning Pipeline

1. **Data Collection** → Gather platform interactions
2. **Data Preparation** → Format for OpenAI fine-tuning
3. **Job Creation** → Submit to OpenAI
4. **Monitoring** → Track training progress
5. **Model Usage** → Deploy custom model

## 🎛️ Configuration

### Vector Search Parameters

- **Similarity Threshold**: 0.7 (70% similarity)
- **Context Limit**: 3 documents
- **Embedding Model**: text-embedding-3-small
- **Vector Dimension**: 1536

### Fine-tuning Parameters

- **Base Model**: gpt-3.5-turbo
- **Training Data**: Platform interactions
- **Temperature**: 0.7
- **Max Tokens**: 1000

## 🚨 Error Handling

All services include comprehensive error handling:

- **OpenAI API errors**: Rate limiting, quota exceeded
- **Database errors**: Connection issues, query failures
- **Vector search errors**: Invalid embeddings, missing data
- **Fine-tuning errors**: Job failures, model issues

## 📊 Monitoring

### Key Metrics

- **Vector Search Performance**: Query response time
- **Embedding Generation**: API call success rate
- **RAG Quality**: Context relevance scores
- **Fine-tuning Progress**: Job completion status

### Logging

All services log:
- API calls and responses
- Database operations
- Error conditions
- Performance metrics

## 🔮 Future Enhancements

1. **Multi-modal Support**: Images, videos, code snippets
2. **Advanced Retrieval**: Hybrid search (vector + keyword)
3. **Real-time Updates**: WebSocket-based content sync
4. **Analytics Dashboard**: Usage metrics and insights
5. **A/B Testing**: Compare RAG vs fine-tuned models

## 🛠️ Troubleshooting

### Common Issues

1. **Vector Extension Not Found**
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```

2. **Embedding Generation Fails**
   - Check OpenAI API key
   - Verify API quota
   - Monitor rate limits

3. **Poor Search Results**
   - Adjust similarity threshold
   - Improve content quality
   - Update embeddings

4. **Fine-tuning Job Fails**
   - Check training data format
   - Verify OpenAI account limits
   - Monitor job status

### Debug Commands

```bash
# Check vector extension
psql -d nest -c "SELECT * FROM pg_extension WHERE extname = 'vector';"

# Test embedding generation
curl -X POST http://localhost:3000/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": "test query"}'

# Check knowledge base
psql -d nest -c "SELECT COUNT(*) FROM knowledge_base;"
```

## 📚 Resources

- [OpenAI Embeddings](https://platform.openai.com/docs/guides/embeddings)
- [pgvector Documentation](https://github.com/pgvector/pgvector)
- [LangChain RAG](https://python.langchain.com/docs/use_cases/question_answering/)
- [NestJS Documentation](https://docs.nestjs.com/)
