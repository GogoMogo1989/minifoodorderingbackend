# Mini Food Ordering Backend

Backend API for a small fullstack food ordering application.

Built with:

- NestJS
- TypeScript
- MongoDB
- Mongoose
- JWT authentication
- Swagger
- Jest

## Features

- Customer registration
- Customer login with JWT
- Authenticated user endpoint
- Restaurant listing
- Restaurant details with menu
- Customer order creation
- Customer order details
- Swagger API documentation
- Minimal Jest unit test coverage

## Setup

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root:

```env
PORT=3001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Example local MongoDB URL:

```env
MONGODB_URI=mongodb+srv://nest:nest12345@cluster0.zjzoxrr.mongodb.net/?appName=Cluster0
```

## Run locally

```bash
npm run start:dev
```

API base URL:

```txt
http://localhost:3001
```

Swagger documentation:

```txt
http://localhost:3001/api/docs
```

## Build

```bash
npm run build
```

## Tests

```bash
npm run test
```

## Docker

Build the Docker image:

```bash
docker build -t mini-food-backend .
```

Run the container:

```bash
docker run --name mini-food-backend --env-file .env -p 3001:3001 mini-food-backend
```

## API Endpoints

### Auth

| Method | Endpoint         | Description            |
| ------ | ---------------- | ---------------------- |
| POST   | `/auth/register` | Register customer      |
| POST   | `/auth/login`    | Login customer         |
| GET    | `/auth/who-am-i` | Get authenticated user |

### Restaurants

| Method | Endpoint           | Description                      |
| ------ | ------------------ | -------------------------------- |
| GET    | `/restaurants`     | List restaurants                 |
| GET    | `/restaurants/:id` | Get restaurant details with menu |
| POST   | `/restaurants`     | Create restaurant test data      |

### Orders

| Method | Endpoint      | Description                          |
| ------ | ------------- | ------------------------------------ |
| POST   | `/orders`     | Create order for logged-in user      |
| GET    | `/orders/:id` | Get order details for logged-in user |

## Database Initialization

This project uses MongoDB with Mongoose.

Collections are created automatically when data is inserted.

To add restaurant test data, use:

```txt
POST /restaurants
```

Example body:

```json
{
  "name": "Bella Napoli",
  "description": "Italian restaurant with pizza and pasta.",
  "address": "Budapest, Fő utca 12.",
  "menu": [
    {
      "name": "Margherita Pizza",
      "description": "Tomato sauce, mozzarella and fresh basil.",
      "price": 2890
    },
    {
      "name": "Pepperoni Pizza",
      "description": "Tomato sauce, mozzarella and spicy pepperoni.",
      "price": 3290
    }
  ]
}
```

## Notes

- Passwords are stored as bcrypt hashes.
- JWT is used for protected endpoints.
- Orders are linked to the authenticated customer.
- Customers can only fetch their own orders.
- Order status is initialized as `PENDING`.
- No restaurant admin panel is implemented.
