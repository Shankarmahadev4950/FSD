// ✅ FIXED VERSION - Load environment variables
require('dotenv').config();

// ✅ SIMPLE LOGGER CONFIGURATION
const fastify = require('fastify')({ 
    logger: {
        level: 'info'
    }
});

const path = require('path');
const fastifyStatic = require('@fastify/static');
const mongoose = require('mongoose');
// ✅ ACCURATE ONLINE STATUS TRACKING
const activeConnections = new Map();


// ✅ ADD DEBUG LOGS TO CHECK ENV VARIABLES
console.log('=== LocalLink Server Starting ===');
console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Loaded' : 'Missing');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Loaded' : 'Missing');
console.log('EMAIL_USER:', process.env.EMAIL_USER ? 'Loaded' : 'Missing');
console.log('================================');


// Serve static files from the current directory
fastify.register(require('@fastify/static'), {
  root: path.join(__dirname),
  prefix: '/',
});

// Serve the main HTML file for all routes (SPA support)
fastify.get('*', function (request, reply) {
  reply.sendFile('index.html');
});

const authenticate = async (request, reply) => {
    try {
        await request.jwtVerify();
        const user = await User.findById(request.user.id);
        if (!user) {
            return reply.status(401).send({ error: 'Invalid token' });
        }
        request.currentUser = user;
    } catch (err) {
        reply.status(401).send({ error: 'Authentication required' });
    }
};
// ✅ OFFLINE MESSAGE QUEUEING
async function deliverMessage(messageData) {
    const recipient = await User.findById(messageData.recipientId);
    
    if (recipient.isOnline) {
        // Deliver immediately via WebSocket
        const recipientWs = activeConnections.get(recipient._id.toString());
        if (recipientWs) {
            recipientWs.send(JSON.stringify({
                type: 'new_message',
                message: messageData
            }));
        }
    } else {
        // Queue message for when user comes online
        await Message.updateOne(
            { _id: messageData._id },
            { $set: { isDelivered: false } }
        );
    }
}

// Update user activity with timeout
fastify.post('/api/users/activity', { preHandler: authenticate }, async (request, reply) => {
    try {
        const user = await User.findByIdAndUpdate(
            request.currentUser._id,
            { 
                isOnline: true,
                lastActivity: new Date(),
                lastSeen: new Date()
            },
            { new: true }
        );
        
        // Set timeout to mark offline after 2 minutes of inactivity
        setTimeout(async () => {
            const currentUser = await User.findById(request.currentUser._id);
            if (currentUser && new Date() - currentUser.lastActivity > 120000) {
                currentUser.isOnline = false;
                await currentUser.save();
            }
        }, 120000);
        
        return { success: true };
    } catch (error) {
        console.error('Activity update error:', error);
    }
});

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 5001 });
wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        
        if (data.type === 'register') {
            // Register user connection
            activeConnections.set(data.userId, ws);
        }
        
        if (data.type === 'send_message') {
            // Deliver message or queue if offline
            deliverMessage(data);
        }
        
        if (data.type === 'exchange_request') {
            // Notify recipient of exchange request
            notifyExchangeRequest(data);
        }
    });
});
// ✅ ADD ERROR HANDLING TO WEBSOCKET (replace lines 45-70)
if (wss) {
    wss.on('connection', (ws) => {
        console.log('🔗 New WebSocket connection');
        
        ws.on('message', (message) => {
            try {
                const data = JSON.parse(message);
                
                if (data.type === 'register') {
                    // Register user connection
                    activeConnections.set(data.userId, ws);
                    console.log(`✅ WebSocket registered for user: ${data.userId}`);
                }
                
                if (data.type === 'send_message') {
                    // Deliver message or queue if offline
                    deliverMessage(data);
                }
                
                if (data.type === 'exchange_request') {
                    // Notify recipient of exchange request
                    notifyExchangeRequest(data);
                }
            } catch (error) {
                console.error('WebSocket message error:', error);
            }
        });
        
        ws.on('error', (error) => {
            console.error('WebSocket error:', error);
        });
        
        ws.on('close', () => {
            console.log('🔌 WebSocket connection closed');
            // Remove from active connections
            for (let [userId, connection] of activeConnections.entries()) {
                if (connection === ws) {
                    activeConnections.delete(userId);
                    console.log(`✅ Removed WebSocket for user: ${userId}`);
                    break;
                }
            }
        });
    });
}

// ✅ DYNAMIC RATINGS FROM FEEDBACK
fastify.get('/api/users/:userId/rating', async (request, reply) => {
    try {
        const feedbacks = await Feedback.find({ 
            forProvider: true,
            'exchange.provider': request.params.userId 
        }).populate('exchange');
        
        const averageRating = feedbacks.length > 0 
            ? feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / feedbacks.length 
            : 0;
            
        return { 
            rating: Math.round(averageRating * 10) / 10,
            reviewCount: feedbacks.length 
        };
    } catch (error) {
        console.error('Rating calculation error:', error);
        return { rating: 0, reviewCount: 0 };
    }
});

// ✅ ADD MISSING AUTHENTICATION ROUTES
fastify.post('/api/auth/register', async (request, reply) => {
    try {
        const { firstName, lastName, name, email, password, location } = request.body;

        // Derive first/last from "name" if missing
        let f = firstName, l = lastName;
        if ((!f || !l) && name) {
            const parts = name.trim().split(/\s+/);
            f = f || parts[0];
            l = l || parts.slice(1).join(' ') || '';
        }

        // Validate required fields
        if (!f || !l || !email || !password) {
            return reply.status(400).send({ error: 'First name, last name, email, and password are required' });
        }

        if (password.length < 6) {
            return reply.status(400).send({ error: 'Password must be at least 6 characters long' });
        }

        // Check if user already exists
        const normalizedEmail = email.toLowerCase();
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return reply.status(400).send({ error: 'User already exists with this email' });
        }

        const fullName = `${f} ${l}`.trim();

        const user = new User({
            name: fullName,
            firstName: f,
            lastName: l,
            email: normalizedEmail,
            password,
            location,
            timeTokens: 20
        });

        await user.save();

        // Generate JWT token
        const token = fastify.jwt.sign({ id: user._id });

        return {
            message: 'User registered successfully!',
            user: {
                id: user._id,
                name: user.name,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                location: user.location,
                timeTokens: user.timeTokens,
                skillsToLearn: user.skillsToLearn,
                skillsToTeach: user.skillsToTeach
            },
            token
        };
    } catch (error) {
        console.error('Registration error:', error);
        reply.status(500).send({ error: 'Registration failed. Please try again.' });
    }
});

fastify.post('/api/auth/login', async (request, reply) => {
    try {
        const { email, password } = request.body;

        if (!email || !password) {
            return reply.status(400).send({ error: 'Email and password are required' });
        }

        const normalizedEmail = email.toLowerCase();
        console.log(`🔍 Attempting login for: ${normalizedEmail}`);
        
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            console.log(`❌ User not found: ${normalizedEmail}`);
            return reply.status(400).send({ error: 'Invalid email or password' });
        }

        console.log(`✅ User found: ${user.email}, checking password...`);
        
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            console.log(`❌ Invalid password for user: ${user.email}`);
            return reply.status(400).send({ error: 'Invalid email or password' });
        }

        console.log(`✅ Login successful for: ${user.email}`);
        
        const token = fastify.jwt.sign({ id: user._id });

        return {
            message: 'Login successful!',
            user: {
                id: user._id,
                name: user.name,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                location: user.location,
                bio: user.bio,
                skillsToLearn: user.skillsToLearn,
                skillsToTeach: user.skillsToTeach,
                timeTokens: user.timeTokens,
                profilePicture: user.profilePicture
            },
            token
        };
    } catch (error) {
        console.error('Login error:', error);
        reply.status(500).send({ error: 'Login failed. Please try again.' });
    }
});

// ✅ ADD PASSWORD RESET ROUTES
fastify.post('/api/auth/forgot-password', async (request, reply) => {
    try {
        const { email } = request.body;
        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user) {
            // Don't reveal if email exists for security
            return reply.send({ message: 'If the email exists, OTP has been sent.' });
        }

        const otp = user.generatePasswordResetOTP();
        await user.save();

        console.log('📧 OTP for', email, ':', otp);
        console.log('💡 In production, this OTP would be sent via email');

        return { 
            message: 'If the email exists, OTP has been sent.',
            // For development only - remove in production
            devOtp: otp 
        };
    } catch (error) {
        console.error('Forgot password error:', error);
        reply.status(500).send({ error: 'Failed to process request' });
    }
});

fastify.post('/api/auth/reset-password', async (request, reply) => {
    try {
        const { email, otp, newPassword } = request.body;

        if (!email || !otp || !newPassword) {
            return reply.status(400).send({ error: 'Email, OTP, and new password are required' });
        }

        if (newPassword.length < 6) {
            return reply.status(400).send({ error: 'Password must be at least 6 characters long' });
        }

        const user = await User.findOne({
            email: email.toLowerCase(),
            resetPasswordOTP: otp,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return reply.status(400).send({ error: 'Invalid or expired OTP' });
        }

        user.password = newPassword;
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return { message: 'Password reset successfully' };
    } catch (error) {
        console.error('Reset password error:', error);
        reply.status(500).send({ error: 'Failed to reset password' });
    }
});
// ✅ FIXED CORS CONFIGURATION - IMPROVED CORS HANDLING
fastify.register(require('@fastify/cors'), {
    origin: [
        'https://shankarmahodov4950.github.io', // Your GitHub Pages URL
        'https://shankarmahodov4950.github.io/FSD/', // Full path if needed
        'http://localhost:5500',
        'http://127.0.0.1:5500', 
        'http://localhost:8000',
        'http://127.0.0.1:8000',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:8080',
        'http://127.0.0.1:8080',
        'http://localhost:5000',
        'http://127.0.0.1:5000'
    ],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'],
    allowedHeaders: [
        'Origin', 
        'X-Requested-With', 
        'Content-Type', 
        'Accept', 
        'Authorization',
        'X-Access-Token'
    ],
    origin: true,
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204
});

// ✅ IMPROVED CORS PREFLIGHT HANDLER
fastify.addHook('onRequest', (request, reply, done) => {
    const allowedOrigins = [
        'https://shankarmahodov4950.github.io',
        'https://shankarmahodov4950.github.io/FSD/',
        'http://localhost:5500',
        'http://127.0.0.1:5500',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
     //    'http://your-bucket-name.s3-website-us-east-1.amazonaws.com',
 // 'http://your-bucket-name.s3-website.region.amazonaws.com',
    ];
    
    const origin = request.headers.origin;
    if (allowedOrigins.includes(origin)) {
        reply.header('Access-Control-Allow-Origin', origin);
    }
    
    reply.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS, PATCH, HEAD');
    reply.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
    reply.header('Access-Control-Allow-Credentials', 'true');
    
    if (request.method === 'OPTIONS') {
        reply.header('Access-Control-Max-Age', '86400');
        return reply.send();
    }
    done();
});

fastify.register(require('@fastify/jwt'), {
    secret: process.env.JWT_SECRET
});

// ✅ FIXED: Handle empty JSON bodies gracefully
fastify.addContentTypeParser('application/json', { parseAs: 'string' }, function (req, body, done) {
    try {
        if (body === '' || body === '{}' || body === '[]') {
            return done(null, {});
        }
        const json = JSON.parse(body);
        done(null, json);
    } catch (err) {
        err.statusCode = 400;
        done(err, undefined);
    }
});

// ✅ FIXED MongoDB connection
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
    console.error('❌ MONGODB_URI is not defined in .env file');
    console.log('💡 Please make sure you have a .env file with MONGODB_URI');
    process.exit(1);
}

console.log('🔗 Attempting MongoDB connection...');
console.log('📝 Connection URI:', mongoURI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')); // Hide credentials

const mongooseOptions = {
    //useNewUrlParser: true,
    //useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000, // 10 seconds
    socketTimeoutMS: 45000,
    retryWrites: true,
    w: 'majority'
};

mongoose.connect(mongoURI, mongooseOptions)
.then(() => {
    console.log('✅ Connected to MongoDB Atlas successfully!');
    console.log('📊 Database name:', mongoose.connection.db?.databaseName);
    console.log('🏠 Host:', mongoose.connection.host);
    console.log('🔢 Port:', mongoose.connection.port);
    
    // List all collections to verify database structure
    mongoose.connection.db.listCollections().toArray()
    .then(collections => {
        console.log('📁 Available collections:', collections.map(c => c.name));
        if (collections.length === 0) {
            console.log('⚠️  No collections found - database is empty');
        }
    })
    .catch(err => {
        console.error('❌ Error listing collections:', err);
    });
})
.catch(err => {
    console.error('❌ MongoDB Atlas connection failed:', err);
    console.log('💡 Common solutions:');
    console.log('   1. Check if your IP is whitelisted in MongoDB Atlas');
    console.log('   2. Verify your username/password in the connection string');
    console.log('   3. Check your internet connection');
    console.log('   4. Make sure the cluster is running in MongoDB Atlas');
    process.exit(1);
});

// Enhanced connection events
mongoose.connection.on('connected', () => {
    console.log('🎉 MongoDB connection established successfully!');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
    console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
    console.log('🔁 MongoDB reconnected');
});

// ✅ IMPORT MODELS WITH ERROR HANDLING
let User, Skill, Exchange, Feedback, Message;
try {
    User = require('./User');
    Skill = require('./Skill');
    Exchange = require('./Exchange');
    Feedback = require('./Feedback');
    Message = require('./Message');
    console.log('✅ All models loaded successfully');
} catch (error) {
    console.error('❌ Error loading models:', error.message);
    process.exit(1);
}
// Health check route
fastify.get('/api/health', async (request, reply) => {
    return { 
        status: 'OK', 
        message: 'LocalLink API is running',
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    };
});

// ✅ IMPROVED ONLINE STATUS WITH ACTIVITY TIMEOUT
fastify.post('/api/users/online', { preHandler: authenticate }, async (request, reply) => {
    try {
        const user = await User.findByIdAndUpdate(
            request.currentUser._id,
            { 
                isOnline: true,
                lastActivity: new Date(),
                lastSeen: new Date()
            },
            { new: true }
        );
        
        return { 
            success: true,
            isOnline: user.isOnline,
            lastActivity: user.lastActivity
        };
    } catch (error) {
        console.error('Online status error:', error);
        reply.status(500).send({ error: 'Failed to update online status' });
    }
});

fastify.post('/api/users/offline', { preHandler: authenticate }, async (request, reply) => {
    try {
        console.log(`🔄 Marking user ${request.currentUser.email} as OFFLINE`);
        
        const user = await User.findByIdAndUpdate(
            request.currentUser._id,
            { 
                isOnline: false,
                lastSeen: new Date()
            },
            { 
                new: true,
                useFindAndModify: false 
            }
        );
        
        console.log(`✅ User ${user.email} marked as OFFLINE successfully`);
        
        return { 
            success: true,
            message: 'Offline status updated', 
            isOnline: user.isOnline,
            lastSeen: user.lastSeen
        };
    } catch (error) {
        console.error('❌ Offline status update error:', error);
        reply.status(500).send({ error: 'Failed to update offline status' });
    }
});

// ✅ ADD ACTIVITY TIMEOUT CHECK
setInterval(async () => {
    try {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        
        const inactiveUsers = await User.updateMany(
            {
                isOnline: true,
                lastActivity: { $lt: fiveMinutesAgo }
            },
            {
                isOnline: false,
                lastSeen: new Date()
            }
        );
        
        if (inactiveUsers.modifiedCount > 0) {
            console.log(`🔄 Auto-marked ${inactiveUsers.modifiedCount} inactive users as offline`);
        }
    } catch (error) {
        console.error('Auto offline check error:', error);
    }
}, 60000); // Check every minute

// ✅ ENHANCED HEARTBEAT ENDPOINT
fastify.post('/api/users/heartbeat', { preHandler: authenticate }, async (request, reply) => {
    try {
        console.log(`💓 Heartbeat received from user: ${request.currentUser.email}`);
        
        // Use direct update with explicit field setting
        const user = await User.findByIdAndUpdate(
            request.currentUser._id,
            { 
                $set: {
                    isOnline: true, // CRITICAL: Always set to true on heartbeat
                    lastSeen: new Date(),
                    lastActivity: new Date()
                }
            },
            { 
                new: true,
                runValidators: true
            }
        );
        
        if (!user) {
            console.error('❌ User not found during heartbeat');
            return reply.status(404).send({ error: 'User not found' });
        }
        
        console.log(`✅ Heartbeat processed - User ${user.email} isOnline: ${user.isOnline}`);
        
        return { 
            success: true,
            status: 'active',
            isOnline: user.isOnline,
            lastActivity: user.lastActivity,
            lastSeen: user.lastSeen,
            debug: {
                userId: user._id,
                updateTime: new Date()
            }
        };
    } catch (error) {
        console.error('❌ Heartbeat error:', error);
        reply.status(500).send({ error: 'Heartbeat failed: ' + error.message });
    }
});
// ✅ ADD DEBUG ENDPOINT TO CHECK USER STATUS
fastify.get('/api/users/debug-online-status/:userId', async (request, reply) => {
    try {
        const user = await User.findById(request.params.userId);
        
        if (!user) {
            return reply.status(404).send({ error: 'User not found' });
        }
        
        const status = {
            user: {
                id: user._id,
                email: user.email,
                isOnline: user.isOnline,
                lastSeen: user.lastSeen,
                lastActivity: user.lastActivity,
                updatedAt: user.updatedAt
            },
            database: {
                connection: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
                collection: 'users'
            },
            timestamps: {
                lastSeenDiff: new Date() - new Date(user.lastSeen),
                isRecent: (new Date() - new Date(user.lastSeen)) < 30000
            }
        };
        
        console.log('🔍 DEBUG ONLINE STATUS:', JSON.stringify(status, null, 2));
        
        return status;
    } catch (error) {
        console.error('Debug online status error:', error);
        reply.status(500).send({ error: 'Debug status failed' });
    }
});
/// ✅ DEBUG ENDPOINT TO CHECK REAL-TIME STATUS
fastify.get('/api/users/debug-status', { preHandler: authenticate }, async (request, reply) => {
    try {
        const user = await User.findById(request.currentUser._id);
        
        const status = {
            user: {
                id: user._id,
                email: user.email,
                isOnline: user.isOnline,
                lastSeen: user.lastSeen,
                lastActivity: user.lastActivity,
                updatedAt: user.updatedAt
            },
            server: {
                time: new Date(),
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
            },
            timestamps: {
                lastSeenDiff: new Date() - new Date(user.lastSeen),
                lastActivityDiff: new Date() - new Date(user.lastActivity),
                isRecent: (new Date() - new Date(user.lastSeen)) < 30000 // 30 seconds
            }
        };
        
        console.log('🔍 DEBUG STATUS:', JSON.stringify(status, null, 2));
        
        return status;
    } catch (error) {
        console.error('Debug status error:', error);
        reply.status(500).send({ error: 'Debug status failed' });
    }
});
// ✅ AUTO OFFLINE DETECTION ENDPOINT
fastify.get('/api/users/check-online-status', async (request, reply) => {
    try {
        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
        
        // Find users who are marked as online but haven't been active in 15 minutes
        const inactiveUsers = await User.find({
            isOnline: true,
            lastActivity: { $lt: fifteenMinutesAgo }
        });
        
        // Mark them as offline
        if (inactiveUsers.length > 0) {
            const userIds = inactiveUsers.map(user => user._id);
            await User.updateMany(
                { _id: { $in: userIds } },
                { 
                    isOnline: false,
                    lastSeen: new Date()
                }
            );
            
            console.log(`🔄 Auto-marked ${inactiveUsers.length} users as offline`);
        }
        
        return {
            checked: new Date().toISOString(),
            markedOffline: inactiveUsers.length,
            users: inactiveUsers.map(u => ({ id: u._id, email: u.email, lastActivity: u.lastActivity }))
        };
    } catch (error) {
        console.error('Auto offline check error:', error);
        reply.status(500).send({ error: 'Auto offline check failed' });
    }
});
// ✅ FIXED USER ROUTES WITH BETTER ERROR HANDLING AND DEBUGGING
fastify.post('/api/users/register', async (request, reply) => {
    try {
        const { firstName, lastName, name, email, password, location } = request.body;

        // Derive first/last from "name" if missing
        let f = firstName, l = lastName;
        if ((!f || !l) && name) {
            const parts = name.trim().split(/\s+/);
            f = f || parts[0];
            l = l || parts.slice(1).join(' ') || '';
        }

        // Validate required fields
        if (!f || !l || !email || !password) {
            return reply.status(400).send({ error: 'First name, last name, email, and password are required' });
        }

        if (password.length < 6) {
            return reply.status(400).send({ error: 'Password must be at least 6 characters long' });
        }

        // Check if user already exists
        const normalizedEmail = email.toLowerCase();
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return reply.status(400).send({ error: 'User already exists with this email' });
        }

        const fullName = `${f} ${l}`.trim();

        // ✅ FIXED: Explicitly initialize all array fields
        const user = new User({
            name: fullName,
            firstName: f,
            lastName: l,
            email: normalizedEmail,
            password,
            location,
            timeTokens: 20,
            skillsToLearn: [],
            skillsToTeach: [],
            skillsOffered: [],
            skillsWanted: [],
            reviews: []
        });

        await user.save();

        // Generate JWT token
        const token = fastify.jwt.sign({ id: user._id });

        return {
            message: 'User registered successfully!',
            user: {
                id: user._id,
                name: user.name,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                location: user.location,
                timeTokens: user.timeTokens,
                skillsToLearn: user.skillsToLearn || [],
                skillsToTeach: user.skillsToTeach || []
            },
            token
        };
    } catch (error) {
        console.error('Registration error:', error);
        reply.status(500).send({ error: 'Registration failed. Please try again.' });
    }
});

fastify.post('/api/users/login', async (request, reply) => {
    try {
        const { email, password } = request.body;

        if (!email || !password) {
            return reply.status(400).send({ error: 'Email and password are required' });
        }

        const normalizedEmail = email.toLowerCase();
        console.log(`🔍 Attempting login for: ${normalizedEmail}`);
        
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            console.log(`❌ User not found: ${normalizedEmail}`);
            return reply.status(400).send({ error: 'Invalid email or password' });
        }

        console.log(`✅ User found: ${user.email}, checking password...`);
        
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            console.log(`❌ Invalid password for user: ${user.email}`);
            return reply.status(400).send({ error: 'Invalid email or password' });
        }

        console.log(`✅ Login successful for: ${user.email}`);
        
        const token = fastify.jwt.sign({ id: user._id });

        return {
            message: 'Login successful!',
            user: {
                id: user._id,
                name: user.name,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                location: user.location,
                bio: user.bio,
                skillsToLearn: user.skillsToLearn,
                skillsToTeach: user.skillsToTeach,
                timeTokens: user.timeTokens,
                profilePicture: user.profilePicture
            },
            token
        };
    } catch (error) {
        console.error('Login error:', error);
        reply.status(500).send({ error: 'Login failed. Please try again.' });
    }
});

fastify.get('/api/users/verify', { preHandler: authenticate }, async (request, reply) => {
    try {
        const user = request.currentUser;
        return {
            valid: true,
            user: {
                id: user._id,
                name: user.name,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                location: user.location,
                bio: user.bio,
                skillsToLearn: user.skillsToLearn,
                skillsToTeach: user.skillsToTeach,
                timeTokens: user.timeTokens,
                profilePicture: user.profilePicture
            }
        };
    } catch (error) {
        return reply.status(401).send({ valid: false });
    }
});


// Simple root endpoint to verify server is running
fastify.get('/', async (request, reply) => {
  return { 
    message: 'LocalLink Server is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  };
});

// ✅ NOTIFICATION ROUTES
// Get user notifications
fastify.get('/api/notifications', { preHandler: authenticate }, async (request, reply) => {
    try {
        const { page = 1, limit = 20, unreadOnly = false, type = null } = request.query;
        
        const notifications = await Notification.getUserNotifications(
            request.currentUser._id, 
            { page: parseInt(page), limit: parseInt(limit), unreadOnly: unreadOnly === 'true', type }
        );
        
        const unreadCount = await Notification.getUnreadCount(request.currentUser._id);
        
        return {
            notifications,
            unreadCount,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                hasMore: notifications.length === parseInt(limit)
            }
        };
    } catch (error) {
        console.error('Get notifications error:', error);
        reply.status(500).send({ error: 'Failed to get notifications' });
    }
});

// Mark notification as read
fastify.patch('/api/notifications/:id/read', { preHandler: authenticate }, async (request, reply) => {
    try {
        const notification = await Notification.findOne({
            _id: request.params.id,
            user: request.currentUser._id
        });
        
        if (!notification) {
            return reply.status(404).send({ error: 'Notification not found' });
        }
        
        await notification.markAsRead();
        
        return { message: 'Notification marked as read', notification };
    } catch (error) {
        console.error('Mark as read error:', error);
        reply.status(500).send({ error: 'Failed to mark notification as read' });
    }
});

// Mark all notifications as read
fastify.patch('/api/notifications/read-all', { preHandler: authenticate }, async (request, reply) => {
    try {
        await Notification.updateMany(
            { user: request.currentUser._id, isRead: false },
            { $set: { isRead: true } }
        );
        
        const unreadCount = await Notification.getUnreadCount(request.currentUser._id);
        
        return { 
            message: 'All notifications marked as read',
            unreadCount 
        };
    } catch (error) {
        console.error('Mark all as read error:', error);
        reply.status(500).send({ error: 'Failed to mark all notifications as read' });
    }
});

// Archive notification
fastify.patch('/api/notifications/:id/archive', { preHandler: authenticate }, async (request, reply) => {
    try {
        const notification = await Notification.findOne({
            _id: request.params.id,
            user: request.currentUser._id
        });
        
        if (!notification) {
            return reply.status(404).send({ error: 'Notification not found' });
        }
        
        await notification.archive();
        
        return { message: 'Notification archived', notification };
    } catch (error) {
        console.error('Archive notification error:', error);
        reply.status(500).send({ error: 'Failed to archive notification' });
    }
});

// Get unread count
fastify.get('/api/notifications/unread-count', { preHandler: authenticate }, async (request, reply) => {
    try {
        const count = await Notification.getUnreadCount(request.currentUser._id);
        return { unreadCount: count };
    } catch (error) {
        console.error('Get unread count error:', error);
        reply.status(500).send({ error: 'Failed to get unread count' });
    }
});
// ✅ FIXED PROFILE UPDATE ROUTE - WORKING VERSION
fastify.put('/api/users/profile', { preHandler: authenticate }, async (request, reply) => {
    try {
        const updates = request.body;
        const userId = request.currentUser._id;

        console.log('🔄 Profile update request for user ID:', userId);
        console.log('📝 Update data received:', updates);

        // Find the user first
        const user = await User.findById(userId);
        if (!user) {
            console.log('❌ User not found in database');
            return reply.status(404).send({ error: 'User not found' });
        }

        console.log('✅ Found user in DB:', user.email);
        console.log('📊 Current user data:', {
            name: user.name,
            skillsToLearn: user.skillsToLearn,
            skillsToTeach: user.skillsToTeach
        });

        // Update individual fields - DON'T use object assignment
        if (updates.name !== undefined) {
            console.log('📝 Updating name:', user.name, '→', updates.name);
            user.name = updates.name;
        }
        
        if (updates.firstName !== undefined) {
            console.log('📝 Updating firstName:', user.firstName, '→', updates.firstName);
            user.firstName = updates.firstName;
        }
        
        if (updates.lastName !== undefined) {
            console.log('📝 Updating lastName:', user.lastName, '→', updates.lastName);
            user.lastName = updates.lastName;
        }
        
        if (updates.bio !== undefined) {
            console.log('📝 Updating bio');
            user.bio = updates.bio;
        }
        
        if (updates.location !== undefined) {
            console.log('📝 Updating location:', user.location, '→', updates.location);
            user.location = updates.location;
        }

        // Handle skills arrays specifically
        if (updates.skillsToLearn !== undefined) {
            console.log('📝 Updating skillsToLearn:', user.skillsToLearn, '→', updates.skillsToLearn);
            user.skillsToLearn = updates.skillsToLearn;
            user.skillsWanted = updates.skillsToLearn; // Update legacy field
        }
        
        if (updates.skillsToTeach !== undefined) {
            console.log('📝 Updating skillsToTeach:', user.skillsToTeach, '→', updates.skillsToTeach);
            user.skillsToTeach = updates.skillsToTeach;
            user.skillsOffered = updates.skillsToTeach; // Update legacy field
        }

        console.log('💾 Attempting to save user to database...');

        // Save the user with error handling
        const savedUser = await user.save();
        
        console.log('✅ User saved successfully to MongoDB!');
        console.log('📊 Updated user data:', {
            name: savedUser.name,
            skillsToLearn: savedUser.skillsToLearn,
            skillsToTeach: savedUser.skillsToTeach,
            location: savedUser.location
        });

        // Verify the save by fetching fresh data
        const verifiedUser = await User.findById(userId);
        console.log('🔍 Verification - user from DB:', {
            name: verifiedUser.name,
            skillsToLearn: verifiedUser.skillsToLearn,
            skillsToTeach: verifiedUser.skillsToTeach
        });

        return {
            message: 'Profile updated successfully!',
            user: {
                id: savedUser._id,
                name: savedUser.name,
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,
                email: savedUser.email,
                location: savedUser.location,
                bio: savedUser.bio,
                skillsToLearn: savedUser.skillsToLearn,
                skillsToTeach: savedUser.skillsToTeach,
                timeTokens: savedUser.timeTokens,
                profilePicture: savedUser.profilePicture
            }
        };
    } catch (error) {
        console.error('❌ Update profile error:', error);
        console.error('❌ Error stack:', error.stack);
        reply.status(500).send({ error: 'Failed to update profile: ' + error.message });
    }
});
// Add this to your server.js for automatic cleanup
setInterval(async () => {
    try {
        // Use the server's own endpoint for cleanup
        const response = await fetch(`http://localhost:${process.env.PORT || 5000}/api/users/check-online-status`);
        const data = await response.json();
        console.log('🔄 Auto offline check:', data);
    } catch (error) {
        console.error('Auto offline check failed:', error);
    }
}, 10 * 60 * 1000); // Run every 10 minutes // Run every 10 minutes
// ✅ TEST DATABASE OPERATIONS
fastify.post('/api/debug/init-test', async (request, reply) => {
    try {
        console.log('🧪 Testing database operations...');
        
        // Test 1: Check if we can create a user
        const testUser = new User({
            name: 'Test User',
            firstName: 'Test',
            lastName: 'User', 
            email: 'test@locallink.com',
            password: 'password123',
            location: 'Test City'
        });
        
        const savedUser = await testUser.save();
        console.log('✅ User creation test passed:', savedUser._id);
        
        // Test 2: Check if we can create a skill
        const testSkill = new Skill({
            name: 'Test Skill',
            category: 'Technology',
            provider: savedUser._id,
            providerName: savedUser.name,
            timeRequired: 1,
            description: 'Test skill description',
            location: 'Online'
        });
        
        const savedSkill = await testSkill.save();
        console.log('✅ Skill creation test passed:', savedSkill._id);
        
        // Test 3: List all users and skills
        const users = await User.find({});
        const skills = await Skill.find({});
        
        console.log('📊 Current users in DB:', users.length);
        console.log('📊 Current skills in DB:', skills.length);
        
        // Clean up test data
        await User.findByIdAndDelete(savedUser._id);
        await Skill.findByIdAndDelete(savedSkill._id);
        
        return {
            success: true,
            message: 'Database operations test completed successfully',
            stats: {
                users: users.length,
                skills: skills.length
            }
        };
        
    } catch (error) {
        console.error('❌ Database test failed:', error);
        return reply.status(500).send({
            success: false,
            error: 'Database test failed: ' + error.message,
            stack: error.stack
        });
    }
});
// Test route to verify database operations
fastify.post('/api/debug/test-save', { preHandler: authenticate }, async (request, reply) => {
    try {
        const user = request.currentUser;
        
        console.log('🧪 Testing database save operation...');
        console.log('👤 Current user:', user.email);
        
        // Make a simple update
        user.lastSeen = new Date();
        const savedUser = await user.save();
        
        console.log('✅ Save operation successful!');
        
        return {
            success: true,
            message: 'Database save test passed',
            user: {
                id: savedUser._id,
                email: savedUser.email,
                lastSeen: savedUser.lastSeen
            }
        };
    } catch (error) {
        console.error('❌ Database save test failed:', error);
        return reply.status(500).send({ 
            success: false, 
            error: 'Database save test failed: ' + error.message 
        });
    }
});
// ✅ ENHANCED SKILLS ROUTES WITH BETTER ONLINE STATUS
fastify.get('/api/skills', async (request, reply) => {
    try {
        console.log('🔄 Fetching all skills...');
        
        const skills = await Skill.find({ isActive: true })
            .populate('provider', 'name email location profilePicture isOnline lastSeen lastActivity')
            .sort({ createdAt: -1 });
        
        console.log(`✅ Found ${skills.length} skills`);

        const formattedSkills = skills.map(skill => {
            const skillObj = skill.toObject();
            const isProviderOnline = skillObj.provider?.isOnline || false;
            const lastSeen = skillObj.provider?.lastSeen || new Date();
            
            console.log(`🔍 Skill: ${skillObj.name}, Provider: ${skillObj.providerName}, Online: ${isProviderOnline}`);
            
            return {
                id: skillObj._id,
                name: skillObj.name,
                category: skillObj.category,
                providerId: skillObj.provider?._id,
                providerName: skillObj.providerName || skillObj.provider?.name,
                timeRequired: skillObj.timeRequired,
                description: skillObj.description,
                location: skillObj.location,
                price: skillObj.price || `${skillObj.timeRequired} hour${skillObj.timeRequired > 1 ? 's' : ''}`,
                rating: skillObj.rating || 4.5,
                providerOnline: isProviderOnline,
                providerLastSeen: lastSeen,
                providerActivity: skillObj.provider?.lastActivity,
                debug: {
                    populatedProvider: !!skillObj.provider,
                    providerOnline: skillObj.provider?.isOnline,
                    skillProviderOnline: skillObj.providerOnline
                }
            };
        });
        
        return formattedSkills;
    } catch (error) {
        console.error('❌ Get skills error:', error);
        reply.status(500).send({ error: 'Failed to get skills' });
    }
});
// ✅ FIXED SKILL CREATION ROUTE
fastify.post('/api/skills', { preHandler: authenticate }, async (request, reply) => {
    try {
        const { name, category, timeRequired, description, location } = request.body;
        
        console.log('🔄 Creating skill for user:', request.currentUser.email);
        console.log('📝 Skill data:', { name, category, timeRequired, description, location });

        const skillData = {
            name,
            category,
            provider: request.currentUser._id,
            providerName: request.currentUser.name,
            timeRequired: timeRequired || 1,
            description: description || `Learn ${name} from ${request.currentUser.name}`,
            location: location || request.currentUser.location,
            price: `${timeRequired || 1} hour${timeRequired > 1 ? 's' : ''}`,
            isActive: true
        };
        
        console.log('💾 Creating skill document...');
        const skill = new Skill(skillData);
        
        console.log('💾 Saving skill to database...');
        const savedSkill = await skill.save();
        
        console.log('✅ Skill saved to MongoDB with ID:', savedSkill._id);
        
        // Populate provider data
        await savedSkill.populate('provider', 'name email location profilePicture');

        // Verify the skill was saved
        const skillCount = await Skill.countDocuments();
        console.log(`📊 Total skills in database: ${skillCount}`);

        return {
            message: 'Skill created successfully!',
            skill: {
                id: savedSkill._id,
                name: savedSkill.name,
                category: savedSkill.category,
                providerId: savedSkill.provider._id,
                providerName: savedSkill.provider.name,
                timeRequired: savedSkill.timeRequired,
                description: savedSkill.description,
                location: savedSkill.location,
                price: savedSkill.price,
                rating: savedSkill.rating || 4.5,
                createdAt: savedSkill.createdAt
            }
        };
    } catch (error) {
        console.error('❌ Create skill error:', error);
        console.error('❌ Error stack:', error.stack);
        reply.status(500).send({ error: 'Failed to create skill: ' + error.message });
    }
});

// ✅ SESSION ROUTES

// Create session from exchange
fastify.post('/api/sessions/create-from-exchange', { preHandler: authenticate }, async (request, reply) => {
    try {
        const { exchangeId, scheduledStart, scheduledDuration } = request.body;
        
        const exchange = await Exchange.findById(exchangeId)
            .populate('skill')
            .populate('provider')
            .populate('learner');
            
        if (!exchange) {
            return reply.status(404).send({ error: 'Exchange not found' });
        }
        
        // Check if user is part of the exchange
        const isParticipant = [exchange.provider._id.toString(), exchange.learner._id.toString()]
            .includes(request.currentUser._id.toString());
            
        if (!isParticipant) {
            return reply.status(403).send({ error: 'Not authorized to create session for this exchange' });
        }
        
        // Check for scheduling conflicts
        const hasConflict = await Session.hasSchedulingConflict(
            exchange.provider._id, 
            new Date(scheduledStart), 
            scheduledDuration
        ) || await Session.hasSchedulingConflict(
            exchange.learner._id, 
            new Date(scheduledStart), 
            scheduledDuration
        );
        
        if (hasConflict) {
            return reply.status(400).send({ error: 'Scheduling conflict detected' });
        }
        
        const session = await Session.createFromExchange(
            exchange, 
            new Date(scheduledStart), 
            scheduledDuration
        );
        
        return {
            message: 'Session created successfully',
            session
        };
    } catch (error) {
        console.error('Create session error:', error);
        reply.status(500).send({ error: 'Failed to create session' });
    }
});

// Get user sessions
fastify.get('/api/sessions', { preHandler: authenticate }, async (request, reply) => {
    try {
        const { 
            status, 
            role, 
            upcoming, 
            page = 1, 
            limit = 20 
        } = request.query;
        
        const sessions = await Session.findUserSessions(request.currentUser._id, {
            status,
            role,
            upcoming: upcoming === 'true',
            page: parseInt(page),
            limit: parseInt(limit)
        });
        
        return {
            sessions,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                hasMore: sessions.length === parseInt(limit)
            }
        };
    } catch (error) {
        console.error('Get sessions error:', error);
        reply.status(500).send({ error: 'Failed to get sessions' });
    }
});

// Get session by ID
fastify.get('/api/sessions/:id', { preHandler: authenticate }, async (request, reply) => {
    try {
        const session = await Session.findById(request.params.id)
            .populate('participants.user', 'name email profilePicture location')
            .populate('skill', 'name category description')
            .populate('exchange')
            .populate('materials.uploadedBy', 'name');
            
        if (!session) {
            return reply.status(404).send({ error: 'Session not found' });
        }
        
        // Check if user is a participant
        const isParticipant = session.participants.some(
            p => p.user._id.toString() === request.currentUser._id.toString()
        );
        
        if (!isParticipant) {
            return reply.status(403).send({ error: 'Not authorized to view this session' });
        }
        
        return { session };
    } catch (error) {
        console.error('Get session error:', error);
        reply.status(500).send({ error: 'Failed to get session' });
    }
});

// Start session
fastify.patch('/api/sessions/:id/start', { preHandler: authenticate }, async (request, reply) => {
    try {
        const session = await Session.findById(request.params.id);
        
        if (!session) {
            return reply.status(404).send({ error: 'Session not found' });
        }
        
        // Check if user is the teacher
        const isTeacher = session.participants.some(
            p => p.user.toString() === request.currentUser._id.toString() && p.role === 'teacher'
        );
        
        if (!isTeacher) {
            return reply.status(403).send({ error: 'Only the teacher can start the session' });
        }
        
        await session.startSession();
        
        return { 
            message: 'Session started successfully',
            session 
        };
    } catch (error) {
        console.error('Start session error:', error);
        reply.status(500).send({ error: 'Failed to start session: ' + error.message });
    }
});

// End session
fastify.patch('/api/sessions/:id/end', { preHandler: authenticate }, async (request, reply) => {
    try {
        const session = await Session.findById(request.params.id);
        
        if (!session) {
            return reply.status(404).send({ error: 'Session not found' });
        }
        
        // Check if user is the teacher
        const isTeacher = session.participants.some(
            p => p.user.toString() === request.currentUser._id.toString() && p.role === 'teacher'
        );
        
        if (!isTeacher) {
            return reply.status(403).send({ error: 'Only the teacher can end the session' });
        }
        
        await session.endSession();
        
        return { 
            message: 'Session ended successfully',
            session 
        };
    } catch (error) {
        console.error('End session error:', error);
        reply.status(500).send({ error: 'Failed to end session: ' + error.message });
    }
});

// Accept session invitation
fastify.patch('/api/sessions/:id/accept', { preHandler: authenticate }, async (request, reply) => {
    try {
        const session = await Session.findById(request.params.id);
        
        if (!session) {
            return reply.status(404).send({ error: 'Session not found' });
        }
        
        await session.acceptInvitation(request.currentUser._id);
        
        return { 
            message: 'Session invitation accepted',
            session 
        };
    } catch (error) {
        console.error('Accept session error:', error);
        reply.status(500).send({ error: 'Failed to accept session: ' + error.message });
    }
});

// ✅ EXCHANGE ROUTES
fastify.post('/api/exchanges/request', { preHandler: authenticate }, async (request, reply) => {
    try {
        const { skillId } = request.body;
        
        const skill = await Skill.findById(skillId);
        if (!skill) {
            return reply.status(404).send({ error: 'Skill not found' });
        }

        if (skill.provider.toString() === request.currentUser._id.toString()) {
            return reply.status(400).send({ error: 'Cannot request your own skill' });
        }

        const exchangeData = {
            skill: skillId,
            learner: request.currentUser._id,
            provider: skill.provider,
            hours: skill.timeRequired,
            status: 'pending'
        };
        
        const exchange = new Exchange(exchangeData);
        await exchange.save();
        
        await exchange.populate('skill', 'name category timeRequired description');
        await exchange.populate('learner', 'name email location profilePicture');
        await exchange.populate('provider', 'name email location profilePicture');
        
        return {
            message: 'Exchange request sent successfully!',
            exchange
        };
    } catch (error) {
        console.error('Create exchange error:', error);
        reply.status(500).send({ error: 'Failed to create exchange request' });
    }
});

// ✅ FIXED MESSAGING ROUTES
fastify.get('/api/messages/skill/:skillId', { preHandler: authenticate }, async (request, reply) => {
    try {
        const { skillId } = request.params;
        
        // Validate skillId
        if (!skillId || skillId === 'undefined' || !mongoose.Types.ObjectId.isValid(skillId)) {
            return reply.status(400).send({ error: 'Valid skill ID is required' });
        }

        const messages = await Message.find({
            skill: skillId,
            $or: [
                { sender: request.currentUser._id },
                { receiver: request.currentUser._id }
            ]
        })
        .populate('sender', 'name profilePicture')
        .populate('receiver', 'name profilePicture')
        .sort({ timestamp: 1 });
        
        return { messages };
    } catch (error) {
        console.error('Get messages error:', error);
        reply.status(500).send({ error: 'Failed to get messages' });
    }
});

// Send message
fastify.post('/api/messages/send', { preHandler: authenticate }, async (request, reply) => {
    try {
        const { skillId, receiverId, content } = request.body;
        
        if (!skillId || !receiverId || !content) {
            return reply.status(400).send({ error: 'Skill ID, receiver ID, and content are required' });
        }
        
        const messageData = {
            skill: skillId,
            sender: request.currentUser._id,
            receiver: receiverId,
            content: content.trim()
        };
        
        const message = new Message(messageData);
        await message.save();
        
        // Populate sender info
        await message.populate('sender', 'name profilePicture');
        await message.populate('receiver', 'name profilePicture');
        
       return {
            message: 'Message sent successfully!', // ✅ This is correct
            messageData: { // ✅ Changed from 'message' to 'messageData'
                id: message._id,
                content: message.content,
                senderId: message.sender._id,
                receiverId: message.receiver._id,
                timestamp: message.timestamp,
                read: message.read
            }
        };
    } catch (error) {
        console.error('Send message error:', error);
        reply.status(500).send({ error: 'Failed to send message' });
    }
});

// ✅ CREATE SAMPLE DATA ENDPOINT
fastify.post('/api/setup/sample-data', async (request, reply) => {
    try {
        // Create sample users
        const sampleUsers = [
            {
                firstName: 'Sarah',
                lastName: 'Johnson',
                email: 'sarah@email.com',
                password: 'password123',
                location: 'Portland, OR',
                skillsToTeach: ['Graphic Design', 'Photography'],
                skillsToLearn: ['Spanish', 'Cooking']
            },
            {
                firstName: 'Mike',
                lastName: 'Chen',
                email: 'mike@email.com',
                password: 'password123',
                location: 'Austin, TX',
                skillsToTeach: ['Web Development', 'Guitar'],
                skillsToLearn: ['Yoga', 'Photography']
            },
            {
                firstName: 'Emily',
                lastName: 'Rodriguez',
                email: 'emily@email.com',
                password: 'password123',
                location: 'Denver, CO',
                skillsToTeach: ['Yoga', 'Meditation'],
                skillsToLearn: ['Web Design', 'Marketing']
            }
        ];

        const createdUsers = [];
        for (const userData of sampleUsers) {
            // Check if user already exists
            let user = await User.findOne({ email: userData.email });
            if (!user) {
                user = new User(userData);
                await user.save();
                console.log(`✅ Created user: ${userData.email}`);
            } else {
                console.log(`ℹ️  User already exists: ${userData.email}`);
            }
            createdUsers.push(user);
        }

        // Create sample skills
        const sampleSkills = [
            {
                name: "Graphic Design",
                category: "Creative",
                timeRequired: 2,
                description: "Learn the basics of graphic design including composition, color theory, and typography",
                location: "Portland, OR"
            },
            {
                name: "Web Development",
                category: "Technology", 
                timeRequired: 3,
                description: "HTML, CSS, and JavaScript fundamentals for building modern websites",
                location: "Austin, TX"
            },
            {
                name: "Guitar Lessons",
                category: "Music",
                timeRequired: 1,
                description: "Beginner to intermediate guitar lessons covering chords, strumming, and basic songs",
                location: "Austin, TX"
            },
            {
                name: "Yoga Classes", 
                category: "Wellness",
                timeRequired: 1,
                description: "Hatha yoga for beginners focusing on basic poses and breathing techniques",
                location: "Denver, CO"
            },
            {
                name: "Spanish Language",
                category: "Language",
                timeRequired: 1, 
                description: "Conversational Spanish lessons for beginners and intermediate learners",
                location: "Seattle, WA"
            }
        ];

        const createdSkills = [];
        for (let i = 0; i < sampleSkills.length; i++) {
            const skillData = sampleSkills[i];
            const provider = createdUsers[i % createdUsers.length];
            
            // Check if skill already exists
            let skill = await Skill.findOne({ 
                name: skillData.name, 
                provider: provider._id 
            });
            
            if (!skill) {
                skill = new Skill({
                    ...skillData,
                    provider: provider._id,
                    providerName: provider.name
                });
                
                await skill.save();
                console.log(`✅ Created skill: ${skillData.name}`);
            } else {
                console.log(`ℹ️  Skill already exists: ${skillData.name}`);
            }
            
            await skill.populate('provider', 'name email location profilePicture');
            createdSkills.push(skill);
        }

        return {
            message: 'Sample data created successfully!',
            users: createdUsers.length,
            skills: createdSkills.length,
            note: 'Check console for detailed creation logs'
        };
    } catch (error) {
        console.error('Create sample data error:', error);
        reply.status(500).send({ error: 'Failed to create sample data' });
    }
});

// ✅ SIMPLE PASSWORD RESET (Without email for now)
fastify.post('/api/users/forgot-password', async (request, reply) => {
    try {
        const { email } = request.body;
        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user) {
            // Don't reveal if email exists for security
            return reply.send({ message: 'If the email exists, OTP has been sent.' });
        }

        const otp = user.generatePasswordResetOTP();
        await user.save();

        console.log('📧 OTP for', email, ':', otp);
        console.log('💡 In production, this OTP would be sent via email');

        return { 
            message: 'If the email exists, OTP has been sent.',
            // For development only - remove in production
            devOtp: otp 
        };
    } catch (error) {
        console.error('Forgot password error:', error);
        reply.status(500).send({ error: 'Failed to process request' });
    }
});

fastify.post('/api/users/reset-password', async (request, reply) => {
    try {
        const { email, otp, newPassword } = request.body;

        if (!email || !otp || !newPassword) {
            return reply.status(400).send({ error: 'Email, OTP, and new password are required' });
        }

        if (newPassword.length < 6) {
            return reply.status(400).send({ error: 'Password must be at least 6 characters long' });
        }

        const user = await User.findOne({
            email: email.toLowerCase(),
            resetPasswordOTP: otp,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return reply.status(400).send({ error: 'Invalid or expired OTP' });
        }

        user.password = newPassword;
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return { message: 'Password reset successfully' };
    } catch (error) {
        console.error('Reset password error:', error);
        reply.status(500).send({ error: 'Failed to reset password' });
    }
});

// Start the server
// ✅ ENHANCED SERVER STARTUP (replace lines 1140-1165)
const start = async () => {
    try {
        const port = process.env.PORT || 5000;
        
        // Check MongoDB connection status
        if (mongoose.connection.readyState !== 1) {
            console.log('⏳ Waiting for MongoDB connection...');
            // Wait for connection with timeout
            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error('MongoDB connection timeout'));
                }, 10000);
                
                mongoose.connection.once('connected', () => {
                    clearTimeout(timeout);
                    resolve();
                });
                
                mongoose.connection.once('error', (err) => {
                    clearTimeout(timeout);
                    reject(err);
                });
            });
        }
        
        console.log('✅ MongoDB Atlas connected successfully');
        
        await fastify.listen({ port, host: '0.0.0.0' });
        console.log('\n🎉 =================================');
        console.log('🚀 LocalLink server running successfully!');
        console.log(`📍 URL: http://localhost:${port}`);
        console.log('📊 Health check: http://localhost:' + port + '/api/health');
        console.log('🔧 Create sample data: POST http://localhost:' + port + '/api/setup/sample-data');
        console.log('👤 Test login: sarah@email.com / password123');
        console.log('================================\n');
        
    } catch (err) {
        console.error('❌ Server startup error:', err.message);
        
        if (err.code === 'EADDRINUSE') {
            console.error('💡 Port 5000 is busy. Try:');
            console.error('   npx kill-port 5000');
            console.error('   Or set PORT=5001 in .env file');
        }
        
        process.exit(1);
    }
};
start();
