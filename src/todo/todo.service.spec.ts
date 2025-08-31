import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TodoService } from './todo.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoQueryDto } from './dto/todo-query.dto';

describe('TodoService', () => {
  let service: TodoService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    todo: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createTodoDto: CreateTodoDto = {
      title: 'Test Todo',
      description: 'Test Description',
    };
    const userId = 1;

    it('should create a todo successfully', async () => {
      const mockTodo = {
        id: 1,
        ...createTodoDto,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.todo.create.mockResolvedValue(mockTodo);

      const result = await service.create(createTodoDto, userId);

      expect(result).toEqual(mockTodo);
      expect(mockPrismaService.todo.create).toHaveBeenCalledWith({
        data: { ...createTodoDto, userId },
      });
    });
  });

  describe('findAll', () => {
    const userId = 1;
    const query: TodoQueryDto = { page: 1, limit: 10 };

    it('should return todos with pagination', async () => {
      const mockTodos = [
        { id: 1, title: 'Todo 1', userId },
        { id: 2, title: 'Todo 2', userId },
      ];
      const total = 2;

      mockPrismaService.todo.findMany.mockResolvedValue(mockTodos);
      mockPrismaService.todo.count.mockResolvedValue(total);

      const result = await service.findAll(query, userId);

      expect(result).toEqual({
        data: mockTodos,
        page: 1,
        limit: 10,
        total: 2,
        totalPages: 1,
      });
      expect(mockPrismaService.todo.findMany).toHaveBeenCalledWith({
        where: { userId },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
      });
    });

    it('should handle search and sorting', async () => {
      const queryWithSearch: TodoQueryDto = {
        page: 1,
        limit: 5,
        search: 'test',
        sortBy: 'title',
        sortOrder: 'asc',
      };

      const mockTodos = [{ id: 1, title: 'Test Todo', userId }];
      const total = 1;

      mockPrismaService.todo.findMany.mockResolvedValue(mockTodos);
      mockPrismaService.todo.count.mockResolvedValue(total);

      const result = await service.findAll(queryWithSearch, userId);

      expect(result.data).toEqual(mockTodos);
      expect(mockPrismaService.todo.findMany).toHaveBeenCalledWith({
        where: {
          userId,
          OR: [
            { title: { contains: 'test', mode: 'insensitive' } },
            { description: { contains: 'test', mode: 'insensitive' } },
          ],
        },
        skip: 0,
        take: 5,
        orderBy: { title: 'asc' },
      });
    });
  });

  describe('findOne', () => {
    const todoId = 1;
    const userId = 1;

    it('should return a todo if found', async () => {
      const mockTodo = {
        id: todoId,
        title: 'Test Todo',
        userId,
      };

      mockPrismaService.todo.findFirst.mockResolvedValue(mockTodo);

      const result = await service.findOne(todoId, userId);

      expect(result).toEqual(mockTodo);
      expect(mockPrismaService.todo.findFirst).toHaveBeenCalledWith({
        where: { id: todoId, userId },
      });
    });

    it('should throw NotFoundException if todo not found', async () => {
      mockPrismaService.todo.findFirst.mockResolvedValue(null);

      await expect(service.findOne(todoId, userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    const todoId = 1;
    const userId = 1;
    const updateTodoDto: UpdateTodoDto = { title: 'Updated Todo' };

    it('should update a todo successfully', async () => {
      const existingTodo = {
        id: todoId,
        title: 'Old Title',
        userId,
      };
      const updatedTodo = { ...existingTodo, ...updateTodoDto };

      mockPrismaService.todo.findFirst.mockResolvedValue(existingTodo);
      mockPrismaService.todo.update.mockResolvedValue(updatedTodo);

      const result = await service.update(todoId, updateTodoDto, userId);

      expect(result).toEqual(updatedTodo);
      expect(mockPrismaService.todo.update).toHaveBeenCalledWith({
        where: { id: todoId },
        data: updateTodoDto,
      });
    });

    it('should throw NotFoundException if todo not found', async () => {
      mockPrismaService.todo.findFirst.mockResolvedValue(null);

      await expect(
        service.update(todoId, updateTodoDto, userId),
      ).rejects.toThrow(NotFoundException);
      expect(mockPrismaService.todo.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    const todoId = 1;
    const userId = 1;

    it('should delete a todo successfully', async () => {
      const existingTodo = {
        id: todoId,
        title: 'Test Todo',
        userId,
      };

      mockPrismaService.todo.findFirst.mockResolvedValue(existingTodo);
      mockPrismaService.todo.delete.mockResolvedValue(existingTodo);

      const result = await service.remove(todoId, userId);

      expect(result).toEqual({ message: 'Todo deleted successfully' });
      expect(mockPrismaService.todo.delete).toHaveBeenCalledWith({
        where: { id: todoId },
      });
    });

    it('should throw NotFoundException if todo not found', async () => {
      mockPrismaService.todo.findFirst.mockResolvedValue(null);

      await expect(service.remove(todoId, userId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockPrismaService.todo.delete).not.toHaveBeenCalled();
    });
  });
});
