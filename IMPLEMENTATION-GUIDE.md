# LocalLink Implementation Guide

## Project Overview
LocalLink is a complete skill-sharing platform with frontend and backend components. This guide will help you set up and run the application.

## Architecture
- **Frontend**: HTML5, CSS3, JavaScript (Bootstrap 5)
- **Backend**: Node.js with Fastify framework
- **Database**: PostgreSQL (recommended) or MongoDB
- **Real-time**: Socket.io for chat and live updates
- **Authentication**: JWT tokens with bcrypt password hashing

## Quick Start

### 1. Frontend Setup (Immediate Use)
```bash
# Navigate to the project directory
cd locallink-website

# Start a simple web server
python -m http.server 8000
# OR
npx http-server -p 8000

# Open browser to http://localhost:8000
```

The frontend works immediately with demo data. You can:
- Browse the interface
- Sign in with demo accounts (email: sarah@email.com, password: password123)
- Test all UI functionality

### 2. Backend Setup (Full Functionality)
```bash
# Navigate to backend directory
cd locallink-website/backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Start the server
npm run dev
```

### 3. Database Setup
```sql
-- Create PostgreSQL database
CREATE DATABASE locallink_db;

-- Run the schema creation script (see backend/database/schema.sql)
```

## Features Implemented

### ✅ Frontend Features
- Responsive design with Bootstrap 5
- User authentication UI
- Skills marketplace with search/filters
- User dashboard with statistics
- Profile management
- Skill exchange requests
- Real-time notifications (UI ready)
- Rating system interface
- Mobile-friendly responsive design

### 🔄 Backend Features (Ready for Implementation)
- RESTful API structure
- JWT authentication system
- Database schema design
- Socket.io real-time communication
- File upload handling
- Rate limiting and security
- Comprehensive error handling

## Demo Accounts
```
Email: sarah@email.com | Password: password123
Email: mike@email.com  | Password: password123
Email: emily@email.com | Password: password123
Email: david@email.com | Password: password123
Email: lisa@email.com  | Password: password123
```

## API Endpoints (Backend)
```
Authentication:
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
POST /api/auth/logout      # User logout

Users:
GET    /api/users/me       # Get current user profile
PUT    /api/users/me       # Update user profile
GET    /api/users/:id      # Get user by ID
GET    /api/users/top      # Get top-rated users

Skills:
GET    /api/skills         # Get all skills
GET    /api/skills/search  # Search skills
POST   /api/skills         # Create new skill
GET    /api/skills/:id     # Get skill details

Exchanges:
GET    /api/exchanges      # Get user's exchanges
POST   /api/exchanges      # Request exchange
PUT    /api/exchanges/:id  # Update exchange status
DELETE /api/exchanges/:id  # Cancel exchange

Ratings:
POST   /api/ratings        # Submit rating
GET    /api/ratings/user/:id # Get user ratings
GET    /api/ratings/stats  # Get rating statistics
```

## Database Schema
```sql
-- Users table
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    bio TEXT,
    location VARCHAR(255),
    time_tokens_balance INTEGER DEFAULT 25,
    profile_picture_url VARCHAR(500),
    average_rating DECIMAL(3,2) DEFAULT 0,
    total_ratings INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Skills table
CREATE TABLE skills (
    skill_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- User Skills relationship
CREATE TABLE user_skills (
    user_skill_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    skill_id UUID REFERENCES skills(skill_id) ON DELETE CASCADE,
    skill_type skill_type_enum NOT NULL, -- 'offered' or 'wanted'
    experience_level experience_level_enum NOT NULL, -- 'beginner', 'intermediate', 'expert'
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, skill_id, skill_type)
);

-- Skill Exchanges
CREATE TABLE skill_exchanges (
    exchange_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES users(user_id),
    learner_id UUID REFERENCES users(user_id),
    skill_id UUID REFERENCES skills(skill_id),
    status exchange_status_enum DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancelled'
    time_tokens_cost INTEGER NOT NULL,
    scheduled_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Ratings and Reviews
CREATE TABLE ratings (
    rating_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exchange_id UUID REFERENCES skill_exchanges(exchange_id),
    rated_by UUID REFERENCES users(user_id),
    rated_user_id UUID REFERENCES users(user_id),
    rating_score INTEGER CHECK (rating_score >= 1 AND rating_score <= 5),
    feedback TEXT,
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## Deployment

### Frontend Deployment
1. **GitHub Pages**: Push to GitHub and enable Pages
2. **Netlify**: Drag and drop the folder to Netlify
3. **Vercel**: Connect your Git repository
4. **AWS S3**: Upload files to S3 bucket with static hosting

### Backend Deployment
1. **Heroku**: `git push heroku main`
2. **Railway**: Connect your Git repository
3. **DigitalOcean App Platform**: Deploy from Git
4. **AWS EC2**: Set up Node.js server with PM2

### Database Deployment
1. **ElephantSQL** (PostgreSQL): Free tier available
2. **Supabase**: PostgreSQL with real-time features
3. **AWS RDS**: Managed database service
4. **Heroku Postgres**: Add-on for Heroku apps

## Development Roadmap

### Phase 1: Frontend Enhancement (Week 1)
- [ ] Add more interactive animations
- [ ] Implement offline functionality
- [ ] Add PWA capabilities
- [ ] Improve accessibility features

### Phase 2: Backend Implementation (Week 2-3)
- [ ] Complete authentication system
- [ ] Implement all API endpoints
- [ ] Add real-time chat with Socket.io
- [ ] Set up database with migrations

### Phase 3: Advanced Features (Week 4)
- [ ] Email notifications
- [ ] Push notifications
- [ ] Advanced search and filtering
- [ ] Analytics dashboard

### Phase 4: Production Ready (Week 5-6)
- [ ] Comprehensive testing
- [ ] Performance optimization
- [ ] Security audit
- [ ] Documentation completion

## Contributing
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Support
- Email: support@locallink.community
- Documentation: https://docs.locallink.community
- Issues: https://github.com/locallink/issues

## License
This project is licensed under the MIT License - see the LICENSE file for details.
