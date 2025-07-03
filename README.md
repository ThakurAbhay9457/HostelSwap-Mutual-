# Hostel Swap Backend

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file in the backend directory (see `.env.example` for required variables):
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Secret for JWT signing
3. Start the server:
   ```bash
   npm start
   ```

## Folder Structure
- `models/` - Mongoose schemas
- `controllers/` - Route logic
- `routes/` - Express route definitions
- `middlewares/` - Auth and admin middlewares

## API Endpoints

### Auth
- `POST /api/auth/student/signup` - Student signup
- `POST /api/auth/student/signin` - Student signin
- `POST /api/auth/admin/signin` - Admin signin

### Admin (JWT required, admin only)
- `POST /api/admin/increase-rooms` - Increase rooms in a hostel
- `POST /api/admin/decrease-rooms` - Decrease rooms in a hostel

### Swap (JWT required)
- `POST /api/swap/request` - Request a swap with another student
- `POST /api/swap/accept` - Accept a swap request
- `GET /api/swap/list` - List your swap requests

---

**Note:**
- Use the JWT token in the `Authorization: Bearer <token>` header for protected routes.
- The swap system uses in-memory storage for requests (for demo). For production, use a database. 