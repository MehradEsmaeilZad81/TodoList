import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let authToken: string;
  let testUserId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    // Clean up test data
    if (testUserId) {
      await prismaService.todo.deleteMany({ where: { userId: testUserId } });
      await prismaService.user.delete({ where: { id: testUserId } });
    }
    await prismaService.$disconnect();
    await app.close();
  });

  describe('Authentication', () => {
    it('/auth/register (POST) - should register a new user', async () => {
      const registerData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerData)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(typeof response.body.token).toBe('string');
    });

    it('/auth/register (POST) - should fail with duplicate email', async () => {
      const registerData = {
        name: 'Test User 2',
        email: 'test@example.com',
        password: 'password123',
      };

      await request(app.getHttpServer())
        .post('/auth/register')
        .send(registerData)
        .expect(409);
    });

    it('/auth/login (POST) - should login successfully', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('token');
      authToken = response.body.token;

      // Get user ID from token for cleanup
      const user = await prismaService.user.findUnique({
        where: { email: 'test@example.com' },
      });
      testUserId = user.id;
    });

    it('/auth/login (POST) - should fail with invalid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginData)
        .expect(401);
    });
  });

  describe('Todos (Protected Routes)', () => {
    it('/todos (GET) - should fail without authentication', async () => {
      await request(app.getHttpServer())
        .get('/todos')
        .expect(401);
    });

    it('/todos (POST) - should create a new todo', async () => {
      const todoData = {
        title: 'Test Todo',
        description: 'Test Description',
      };

      const response = await request(app.getHttpServer())
        .post('/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(todoData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(todoData.title);
      expect(response.body.description).toBe(todoData.description);
      expect(response.body.userId).toBe(testUserId);
    });

    it('/todos (GET) - should return todos with pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/todos?page=1&limit=10')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('limit');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('totalPages');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('/todos/:id (GET) - should return a specific todo', async () => {
      // First create a todo
      const todoData = {
        title: 'Get Todo Test',
        description: 'Description for get test',
      };

      const createResponse = await request(app.getHttpServer())
        .post('/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(todoData);

      const todoId = createResponse.body.id;

      const response = await request(app.getHttpServer())
        .get(`/todos/${todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.id).toBe(todoId);
      expect(response.body.title).toBe(todoData.title);
    });

    it('/todos/:id (PATCH) - should update a todo', async () => {
      // First create a todo
      const todoData = {
        title: 'Update Todo Test',
        description: 'Original description',
      };

      const createResponse = await request(app.getHttpServer())
        .post('/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(todoData);

      const todoId = createResponse.body.id;

      const updateData = {
        title: 'Updated Todo Title',
        description: 'Updated description',
      };

      const response = await request(app.getHttpServer())
        .patch(`/todos/${todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.title).toBe(updateData.title);
      expect(response.body.description).toBe(updateData.description);
    });

    it('/todos/:id (DELETE) - should delete a todo', async () => {
      // First create a todo
      const todoData = {
        title: 'Delete Todo Test',
        description: 'Description for delete test',
      };

      const createResponse = await request(app.getHttpServer())
        .post('/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(todoData);

      const todoId = createResponse.body.id;

      await request(app.getHttpServer())
        .delete(`/todos/${todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify todo is deleted
      await request(app.getHttpServer())
        .get(`/todos/${todoId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('/todos (GET) - should handle search and filtering', async () => {
      // Create a todo with specific text
      const todoData = {
        title: 'Searchable Todo',
        description: 'This todo should be found by search',
      };

      await request(app.getHttpServer())
        .post('/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(todoData);

      const response = await request(app.getHttpServer())
        .get('/todos?search=Searchable&sortBy=title&sortOrder=asc')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data.some(todo => 
        todo.title.includes('Searchable') || todo.description.includes('Searchable')
      )).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent todo', async () => {
      await request(app.getHttpServer())
        .get('/todos/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);
    });

    it('should return 400 for invalid todo data', async () => {
      const invalidTodoData = {
        title: '', // Empty title should fail validation
        description: 'Valid description',
      };

      await request(app.getHttpServer())
        .post('/todos')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidTodoData)
        .expect(400);
    });
  });
});
