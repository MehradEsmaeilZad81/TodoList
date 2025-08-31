# 🚀 Todo List API

A production-ready RESTful API built with NestJS, featuring user authentication, JWT tokens, and complete CRUD operations for managing todo lists. This project demonstrates enterprise-grade development practices including security, validation, testing, and comprehensive documentation.

## ✨ Features

- **🔐 User Authentication & Authorization**
  - JWT-based authentication
  - Secure password hashing with bcrypt
  - User registration and login
  - Protected routes with guards

- **📝 Todo Management**
  - Create, read, update, and delete todos
  - User-specific todo ownership
  - Advanced filtering and search
  - Pagination and sorting

- **🛡️ Security & Performance**
  - Helmet security headers
  - CORS configuration
  - Rate limiting and throttling
  - Input validation and sanitization

- **🧪 Testing & Quality**
  - Comprehensive unit tests
  - End-to-end testing
  - Code coverage reporting
  - ESLint and Prettier configuration

- **📚 Documentation**
  - Interactive Swagger/OpenAPI documentation
  - Detailed API specifications
  - Request/response examples
  - Authentication guides

## 🏗️ Architecture

- **Framework**: NestJS (Node.js)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with Passport.js
- **Validation**: class-validator with DTOs
- **Testing**: Jest for unit and e2e tests
- **Documentation**: Swagger/OpenAPI

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- PostgreSQL 14+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/TodoList.git
   cd TodoList
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your database credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_NAME=your_db_name
   DATABASE_URL="postgresql://your_db_user:your_db_password@localhost:5432/your_db_name"
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

4. **Database Setup**
   ```bash
   # Create and apply migrations
   npx prisma migrate dev --name init
   
   # Seed the database with sample data
   npm run seed
   ```

5. **Start the application**
   ```bash
   # Development mode
   npm run start:dev
   
   # Production mode
   npm run start:prod
   ```

The API will be available at `http://localhost:3000`

## 📖 API Documentation

### Interactive Documentation

Access the complete API documentation at: `http://localhost:3000/api`

### Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### 🔐 Authentication

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `POST` | `/auth/register` | Register a new user | `{ "name": "string", "email": "string", "password": "string" }` |
| `POST` | `/auth/login` | Login user | `{ "email": "string", "password": "string" }` |

**Response Format:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 📝 Todo Management

| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| `POST` | `/todos` | Create a new todo | ✅ |
| `GET` | `/todos` | Get all todos with pagination | ✅ |
| `GET` | `/todos/:id` | Get a specific todo | ✅ |
| `PATCH` | `/todos/:id` | Update a todo | ✅ |
| `DELETE` | `/todos/:id` | Delete a todo | ✅ |

**Todo Creation Request:**
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread, and vegetables"
}
```

**Query Parameters for GET /todos:**
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10, max: 100)
- `search` (string): Search term for title/description
- `sortBy` (string): Sort field (title, description, createdAt, updatedAt)
- `sortOrder` (string): Sort direction (asc, desc)

**Response Format:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Buy groceries",
      "description": "Milk, eggs, bread, and vegetables",
      "userId": 1,
      "createdAt": "2025-08-31T19:02:26.313Z",
      "updatedAt": "2025-08-31T19:02:26.313Z"
    }
  ],
  "page": 1,
  "limit": 10,
  "total": 1,
  "totalPages": 1
}
```

## 🧪 Testing

### Run Tests

```bash
# Unit tests
npm test

# Unit tests with coverage
npm run test:cov

# E2E tests
npm run test:e2e

# Test in watch mode
npm run test:watch
```

### Test Coverage

The project includes comprehensive tests covering:
- Authentication service (register/login)
- Todo service (CRUD operations)
- End-to-end API testing
- Error handling scenarios

## 🛠️ Development

### Available Scripts

```bash
npm run build          # Build the application
npm run start          # Start the application
npm run start:dev      # Start in development mode with hot reload
npm run start:debug    # Start in debug mode
npm run start:prod     # Start in production mode
npm run lint           # Run ESLint
npm run format         # Format code with Prettier
npm run seed           # Seed database with sample data
npm run seed:reset     # Reset database and seed
```

### Database Management

```bash
# Generate Prisma client
npx prisma generate

# Create a new migration
npx prisma migrate dev --name <migration-name>

# Reset database (development only)
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio
```

### Code Quality

- **ESLint**: Code linting and style enforcement
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit checks
- **TypeScript**: Strict type checking

## 🔒 Security Features

- **Password Security**: Bcrypt hashing with 12 salt rounds
- **JWT Tokens**: Secure authentication with configurable expiration
- **Input Validation**: Comprehensive request validation
- **Rate Limiting**: Protection against abuse
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers for HTTP responses

## 📊 Database Schema

### User Model
```prisma
model User {
  id           Int       @id @default(autoincrement())
  name         String
  email        String    @unique
  passwordHash String
  todos        Todo[]
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}
```

### Todo Model
```prisma
model Todo {
  id          Int      @id @default(autoincrement())
  title       String
  description String
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId      Int
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([userId])
}
```

## 🚀 Deployment

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NODE_ENV` | Environment (development/production) | No | development |
| `PORT` | Server port | No | 3000 |
| `DB_HOST` | Database host | Yes | - |
| `DB_PORT` | Database port | Yes | - |
| `DB_USER` | Database username | Yes | - |
| `DB_PASSWORD` | Database password | Yes | - |
| `DB_NAME` | Database name | Yes | - |
| `DATABASE_URL` | Full database connection string | Yes | - |
| `JWT_SECRET` | JWT signing secret | Yes | - |
| `JWT_EXPIRES_IN` | JWT token expiration | No | 15m |

### Production Considerations

- Use strong, unique JWT secrets
- Enable SSL for database connections
- Set appropriate CORS origins
- Configure proper logging
- Use environment-specific configurations
- Implement monitoring and health checks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass
- Follow conventional commit messages

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Jest](https://jestjs.io/) - Testing framework
- [Swagger](https://swagger.io/) - API documentation

## 📞 Support

If you have any questions or need help:

- Create an issue on GitHub
- Check the [API documentation](http://localhost:3000/api)
- Review the test examples
- Check the Prisma schema for data structure

---

**Happy coding! 🎉**
