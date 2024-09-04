Sure! Here’s a concise **`README.md`** for your backend project:

```markdown
# Family API

A Node.js/Express backend for managing family members and their relationships, with a MySQL database and API documentation using Swagger.

## Features

- **CRUD operations** for family members and relationships
- **Validation** for member creation (e.g., birth and death dates)
- **Swagger UI** for API documentation and testing
- MySQL database integration using **Sequelize ORM**

## Requirements

- Node.js (v14+)
- MySQL
- npm

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/family-api.git
   ```

2. Install dependencies:
   ```bash
   cd family-api
   npm install
   ```

3. Set up the `.env` file with your MySQL credentials:
   ```bash
   DB_NAME=your_db_name
   DB_USER=your_db_user
   DB_PASS=your_db_password
   DB_HOST=localhost
   ```

4. Run the MySQL service and set up your database:
   ```bash
   sudo service mysql start
   ```

5. Run migrations or sync models (if applicable):
   ```bash
   # If using Sequelize migrations
   npx sequelize-cli db:migrate
   ```

6. Start the server:
   ```bash
   npm start
   ```

7. Access the API at:
   ```
   http://localhost:3000/api/family
   ```

8. Access the API documentation (Swagger UI) at:
   ```
   http://localhost:3000/api-docs
   ```

## API Endpoints

- **GET** `/api/family/members` - Retrieve all family members
- **POST** `/api/family/members` - Create a new family member
- **GET** `/api/family/relationships` - Retrieve all relationships
- **POST** `/api/family/relationships` - Create a new relationship

## Running Tests

To run the unit tests:
```bash
npm test
```

## Folder Structure

- **`src/controllers/`**: Contains route handler logic (interacts with services).
- **`src/services/`**: Business logic layer (interacts with models).
- **`src/models/`**: Defines Sequelize models for the MySQL database.
- **`src/routes/`**: Defines API routes and applies middleware.
- **`src/middleware/`**: Request validation and other middleware logic.
- **`src/config/`**: Configuration files (e.g., database, Swagger).
- **`src/tests/unit/`**: Unit tests in JEST.
