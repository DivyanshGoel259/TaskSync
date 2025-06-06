# TaskSync

TaskSync is a simple task management API built with Node.js, Express, TypeScript, and MongoDB. It supports user registration, login, and manager-only task creation, with JWT-based authentication and role-based access control.

---

## 🚀 Features

- User registration and login (JWT authentication)
- Role-based access (Manager, Employee)
- Managers can create tasks for employees
- Input validation and error handling

---

## 🛠️ Project Setup

### 1. Clone the Repository

```sh
git clone <your-repo-url>
cd TaskSync
```

### 2. Install Dependencies

```sh
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory (already present):

```
PORT=3000
JWT_SECRET="your_jwt_secret"
DB_URL=mongodb://root:rootpassword@localhost:27017/
```

### 4. Start MongoDB with Docker

If you don't have MongoDB locally, you can use Docker:

```sh
docker run -d \
  --name tasksync-mongo \
  -e MONGO_INITDB_ROOT_USERNAME=root \
  -e MONGO_INITDB_ROOT_PASSWORD=rootpassword \
  -p 27017:27017 \
  mongo:latest
```

### 5. Build and Run the Project

```sh
npm run dev
```

The server will start on `http://localhost:3000`.

---

## 📚 API Usage

### 1. Register User

**POST** `/api/v1/auth/register`

#### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "Manager" // or "Employee"
}
```

#### Response

```json
{
  "data": {
    "token": "<jwt_token>",
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "Manager",
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
}
```

#### Request/Response Cycle

- Validates input.
- Checks if email exists.
- Hashes password, creates user, generates JWT.
- Sets `token` cookie and returns user info (without password).

---

### 2. Login User

**POST** `/api/v1/auth/login`

#### Request Body

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Response

```json
{
  "data": {
    "token": "<jwt_token>",
    "user": {
      "_id": "...",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "Manager",
      "createdAt": "...",
      "updatedAt": "..."
    }
  }
}
```

#### Request/Response Cycle

- Validates input.
- Checks if user exists and password matches.
- Generates JWT, sets `token` cookie, returns user info.

---

### 3. Create Task (Manager Only)

**POST** `/api/v1/manager/`

#### Headers

- `Authorization: Bearer <jwt_token>` (or use the `token` cookie)

#### Request Body

```json
{
  "title": "Prepare Report",
  "description": "Prepare the monthly sales report",
  "assignedTo": "<employee_user_id>",
  "dueDate": "2024-07-01T00:00:00.000Z"
}
```

#### Response

```json
{
  "data": {
    "_id": "...",
    "title": "Prepare Report",
    "description": "Prepare the monthly sales report",
    "assignedTo": "<employee_user_id>",
    "dueDate": "2024-07-01T00:00:00.000Z",
    "createdBy": "<manager_user_id>",
    "createdAt": "...",
    "updatedAt": "...",
    "status": "Pending"
  }
}
```

#### Request/Response Cycle

- Requires authentication (`authMiddleware`).
- Requires manager role (`managerOnly` middleware).
- Validates input.
- Creates a new task assigned to an employee, with the manager as `createdBy`.
- Returns the created task.

---

### 4. Get All Employees (Manager Only)

**GET** `/api/v1/auth/employees`

#### Headers

- `Authorization: Bearer <jwt_token>` (must be a manager)

#### Response

```json
{
  "data": [
    {
      "_id": "...",
      "name": "Jane Employee",
      "email": "jane@company.com"
    }
    // ...more employees
  ]
}
```

#### Request/Response Cycle

- Requires authentication (`authMiddleware`).
- Requires manager role (`managerOnly` middleware).
- Returns a list of all users with the role "Employee" (name and email only).

---

### 5. Get User by ID

**GET** `/api/v1/auth/:id`

#### Headers

- `Authorization: Bearer <jwt_token>`

#### Response

```json
{
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Request/Response Cycle

- Requires authentication (`authMiddleware`).
- Returns the user with the specified ID (name and email only).
- Returns 404 if user is not found.

---

### 6. Get Tasks Assigned to Employee

**GET** `/api/v1/employee/my-tasks`

#### Headers

- `Authorization: Bearer <jwt_token>` (must be an employee)

#### Response

```json
{
  "data": [
    {
      "_id": "...",
      "title": "Prepare Report",
      "description": "Prepare the monthly sales report",
      "assignedTo": "<employee_user_id>",
      "dueDate": "2024-07-01T00:00:00.000Z",
      "createdBy": "<manager_user_id>",
      "createdAt": "...",
      "updatedAt": "...",
      "status": "Pending"
    }
    // ...more tasks
  ]
}
```

#### Request/Response Cycle

- Requires authentication (`authMiddleware`).
- Returns all tasks assigned to the authenticated employee, sorted by due date.

---

### 7. Employee Updates Task Status

**PATCH** `/api/v1/employee/:taskId/status`

#### Headers

- `Authorization: Bearer <jwt_token>` (must be an employee)

#### Request Body

```json
{
  "status": "Completed" // or "Pending" or "In Progress"
}
```

#### Response

```json
{
  "data": {
    "_id": "...",
    "title": "Prepare Report",
    "description": "Prepare the monthly sales report",
    "assignedTo": "<employee_user_id>",
    "dueDate": "2024-07-01T00:00:00.000Z",
    "createdBy": "<manager_user_id>",
    "createdAt": "...",
    "updatedAt": "...",
    "status": "Completed"
  }
}
```

#### Request/Response Cycle

- Requires authentication (`authMiddleware`).
- Validates `taskId` and `status` in the request.
- Checks that the task is assigned to the authenticated employee.
- Updates the status and `updatedAt` of the task.
- Returns the updated task.

---

### 8. Manager: Get All Tasks Created by Them

**GET** `/api/v1/manager/created`

#### Headers

- `Authorization: Bearer <jwt_token>` (must be a manager)

#### Response

```json
{
  "data": [
    {
      "_id": "...",
      "title": "Prepare Report",
      "description": "Prepare the monthly sales report",
      "assignedTo": "<employee_user_id>",
      "dueDate": "2024-07-01T00:00:00.000Z",
      "createdBy": "<manager_user_id>",
      "createdAt": "...",
      "updatedAt": "...",
      "status": "Pending"
    }
    // ...more tasks
  ]
}
```

#### Request/Response Cycle

- Requires authentication (`authMiddleware`).
- Requires manager role (`managerOnly` middleware).
- Returns all tasks created by the authenticated manager.

---

### 9. Manager: Update Task

**PUT** `/api/v1/manager/:taskId`

#### Headers

- `Authorization: Bearer <jwt_token>` (must be a manager)

#### Request Body (any updatable fields)

```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "status": "In Progress",
  "dueDate": "2024-08-01T00:00:00.000Z",
  "assignedTo": "<employee_user_id>"
}
```

#### Response

```json
{
  "data": {
    "_id": "...",
    "title": "Updated Title",
    "description": "Updated description",
    "assignedTo": "<employee_user_id>",
    "dueDate": "2024-08-01T00:00:00.000Z",
    "createdBy": "<manager_user_id>",
    "createdAt": "...",
    "updatedAt": "...",
    "status": "In Progress"
  }
}
```

#### Request/Response Cycle

- Requires authentication (`authMiddleware`).
- Requires manager role (`managerOnly` middleware).
- Validates `taskId` and input fields.
- Checks that the task was created by the authenticated manager.
- Updates the task and returns the updated task.

---

### 10. Manager: Delete Task

**DELETE** `/api/v1/manager/:taskId`

#### Headers

- `Authorization: Bearer <jwt_token>` (must be a manager)

#### Response

```json
{
  "data": {
    "_id": "...",
    "title": "..."
    // ...other task fields
  }
}
```

#### Request/Response Cycle

- Requires authentication (`authMiddleware`).
- Requires manager role (`managerOnly` middleware).
- Validates `taskId`.
- Checks that the task was created by the authenticated manager.
- Deletes the task and returns the deleted task.

---

## 🧩 Error Handling

All errors return a JSON response:

```json
{
  "error": {
    "message": "Error description"
  }
}
```

---

## 📝 Notes

- Use the `/api/v1/auth/register` endpoint to create both managers and employees.
- Only managers (users with role `"Manager"`) can create tasks.
- JWT token is returned and also set as a cookie for authentication.

---

## 📂 Project Structure

See the repository for a detailed folder and file structure.

---

## 🐳 Docker Compose (Optional)

You can also use a `docker-compose.yml` for MongoDB:

```yaml
version: "3"
services:
  mongo:
    image: mongo:latest
    container_name: tasksync-mongo
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: rootpassword
    ports:
      - "27017:27017"
```

Start with:

```sh
docker-compose up -d
```

---

## 🤝 Contributing

Pull requests are welcome!

---

## 📧 License

MIT
