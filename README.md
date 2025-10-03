# LocalLink Backend

## Overview
This directory contains the backend implementation for LocalLink using Node.js, Fastify, and PostgreSQL.

## Quick Start
1. Install dependencies: `npm install`
2. Set up your PostgreSQL database
3. Copy `.env.example` to `.env` and configure your environment variables
4. Run database migrations: `npm run migrate`
5. Start the server: `npm run dev`

## API Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/users/me` - Get current user profile
- `GET /api/skills` - Get available skills
- `POST /api/exchanges` - Request skill exchange
- `POST /api/ratings` - Submit rating

## Database Schema
See `database/schema.sql` for the complete database structure.

## Environment Variables
```
DATABASE_URL=postgresql://username:password@localhost:5432/locallink
JWT_SECRET=your-secret-key
PORT=5000
NODE_ENV=development
```
