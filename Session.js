const mongoose = require('mongoose');

// ✅ SESSION SCHEMA - Enhanced with all features
const sessionSchema = new mongoose.Schema({
    participants: [{ 
        user: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User',
            required: true 
        },
        role: { 
            type: String, 
            enum: ['teacher', 'learner'],
            required: true 
        },
        joinedAt: {
            type: Date,
            default: Date.now
        },
        leftAt: Date,
        status: {
            type: String,
            enum: ['invited', 'accepted', 'declined', 'joined', 'left'],
            default: 'invited'
        }
    }],
    skill: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Skill',
        required: true 
    },
    exchange: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exchange'
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    scheduledDuration: { 
        type: Number, 
        required: true,
        min: 15, // Minimum 15 minutes
        max: 480 // Maximum 8 hours
    },
    actualDuration: { 
        type: Number, 
        min: 0 
    },
    scheduledStart: {
        type: Date,
        required: true
    },
    scheduledEnd: {
        type: Date
    },
    actualStart: Date,
    actualEnd: Date,
    status: {
        type: String,
        enum: [
            'scheduled', 
            'confirmed', 
            'in-progress', 
            'completed', 
            'cancelled',
            'no-show',
            'rescheduled'
        ],
        default: 'scheduled'
    },
    videoCall: {
        callId: String,
        meetingUrl: String,
        startedAt: Date,
        endedAt: Date,
        recordingUrl: String,
        participants: [{
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            joinedAt: Date,
            leftAt: Date,
            duration: Number
        }]
    },
    location: {
        type: {
            type: String,
            enum: ['online', 'in-person', 'hybrid'],
            default: 'online'
        },
        address: String,
        meetingPoint: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    materials: [{
        name: String,
        url: String,
        type: String,
        uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],
    agenda: [{
        topic: String,
        duration: Number,
        description: String,
        completed: {
            type: Boolean,
            default: false
        }
    }],
    notes: {
        teacher: String,
        learner: String,
        shared: String
    },
    feedback: {
        teacherRating: {
            type: Number,
            min: 1,
            max: 5
        },
        learnerRating: {
            type: Number,
            min: 1,
            max: 5
        },
        teacherComment: String,
        learnerComment: String,
        submittedAt: Date
    },
    timeTokens: {
        earned: Number,
        spent: Number,
        transactionId: String
    },
    reminders: [{
        type: {
            type: String,
            enum: ['email', 'push', 'both']
        },
        sentAt: Date,
        scheduledFor: Date
    }],
    metadata: {
        type: Object,
        default: {}
    },
    cancellation: {
        cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        reason: String,
        cancelledAt: Date
    },
    rescheduledFrom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session'
    }
}, { 
    timestamps: true 
});

// ✅ INDEXES FOR PERFORMANCE
sessionSchema.index({ 'participants.user': 1, status: 1 });
sessionSchema.index({ skill: 1, status: 1 });
sessionSchema.index({ scheduledStart: 1 });
sessionSchema.index({ status: 1, scheduledStart: 1 });
sessionSchema.index({ 'videoCall.callId': 1 });
sessionSchema.index({ exchange: 1 });

// ✅ VIRTUAL FIELDS

// Check if session is upcoming
sessionSchema.virtual('isUpcoming').get(function() {
    return this.scheduledStart > new Date() && 
           ['scheduled', 'confirmed'].includes(this.status);
});

// Check if session is ongoing
sessionSchema.virtual('isOngoing').get(function() {
    const now = new Date();
    return this.actualStart && !this.actualEnd && 
           this.actualStart <= now && this.status === 'in-progress';
});

// Calculate remaining time for scheduled sessions
sessionSchema.virtual('timeUntilStart').get(function() {
    if (!this.isUpcoming) return null;
    return this.scheduledStart - new Date();
});

// Get teacher participant
sessionSchema.virtual('teacher').get(function() {
    return this.participants.find(p => p.role === 'teacher');
});

// Get learner participant
sessionSchema.virtual('learner').get(function() {
    return this.participants.find(p => p.role === 'learner');
});

// ✅ STATIC METHODS

// Create session from exchange
sessionSchema.statics.createFromExchange = async function(exchange, scheduledStart, scheduledDuration) {
    try {
        const sessionData = {
            participants: [
                {
                    user: exchange.provider,
                    role: 'teacher',
                    status: 'accepted'
                },
                {
                    user: exchange.learner,
                    role: 'learner',
                    status: 'invited'
                }
            ],
            skill: exchange.skill,
            exchange: exchange._id,
            title: `Session: ${exchange.skill.name}`,
            description: `Learning session for ${exchange.skill.name}`,
            scheduledStart,
            scheduledDuration,
            scheduledEnd: new Date(scheduledStart.getTime() + scheduledDuration * 60000),
            status: 'scheduled'
        };

        const session = new this(sessionData);
        await session.save();
        
        // Populate references
        await session.populate('participants.user', 'name email profilePicture');
        await session.populate('skill', 'name category');
        
        return session;
    } catch (error) {
        console.error('Error creating session from exchange:', error);
        throw error;
    }
};

// Find sessions for user
sessionSchema.statics.findUserSessions = async function(userId, options = {}) {
    const {
        status = null,
        role = null,
        upcoming = false,
        page = 1,
        limit = 20
    } = options;

    let query = { 'participants.user': userId };
    
    if (status) {
        query.status = status;
    }
    
    if (upcoming) {
        query.scheduledStart = { $gte: new Date() };
        query.status = { $in: ['scheduled', 'confirmed'] };
    }
    
    if (role) {
        query['participants.role'] = role;
        query['participants.user'] = userId;
    }

    const sessions = await this.find(query)
        .populate('participants.user', 'name email profilePicture location')
        .populate('skill', 'name category description')
        .populate('exchange')
        .sort({ scheduledStart: 1 })
        .limit(limit)
        .skip((page - 1) * limit)
        .lean();

    return sessions;
};

// Get upcoming sessions for user
sessionSchema.statics.getUpcomingSessions = async function(userId, limit = 5) {
    return await this.find({
        'participants.user': userId,
        scheduledStart: { $gte: new Date() },
        status: { $in: ['scheduled', 'confirmed'] }
    })
    .populate('participants.user', 'name profilePicture')
    .populate('skill', 'name category')
    .sort({ scheduledStart: 1 })
    .limit(limit)
    .lean();
};

// Check for scheduling conflicts
sessionSchema.statics.hasSchedulingConflict = async function(userId, startTime, duration, excludeSessionId = null) {
    const endTime = new Date(startTime.getTime() + duration * 60000);
    
    const query = {
        'participants.user': userId,
        status: { $in: ['scheduled', 'confirmed', 'in-progress'] },
        $or: [
            {
                scheduledStart: { $lt: endTime },
                scheduledEnd: { $gt: startTime }
            }
        ]
    };
    
    if (excludeSessionId) {
        query._id = { $ne: excludeSessionId };
    }
    
    const conflictingSession = await this.findOne(query);
    return !!conflictingSession;
};

// ✅ INSTANCE METHODS

// Start session
sessionSchema.methods.startSession = async function() {
    if (this.status !== 'scheduled' && this.status !== 'confirmed') {
        throw new Error('Session cannot be started from current status');
    }
    
    this.status = 'in-progress';
    this.actualStart = new Date();
    
    // Update participant statuses
    this.participants.forEach(participant => {
        if (participant.status === 'accepted') {
            participant.status = 'joined';
            participant.joinedAt = new Date();
        }
    });
    
    await this.save();
    return this;
};

// End session
sessionSchema.methods.endSession = async function() {
    if (this.status !== 'in-progress') {
        throw new Error('Only ongoing sessions can be ended');
    }
    
    this.status = 'completed';
    this.actualEnd = new Date();
    
    // Calculate actual duration in minutes
    if (this.actualStart) {
        this.actualDuration = Math.round((this.actualEnd - this.actualStart) / 60000);
    }
    
    // Update participant left times
    this.participants.forEach(participant => {
        if (participant.status === 'joined') {
            participant.leftAt = new Date();
        }
    });
    
    await this.save();
    return this;
};

// Cancel session
sessionSchema.methods.cancelSession = async function(userId, reason = '') {
    if (['completed', 'cancelled'].includes(this.status)) {
        throw new Error('Session cannot be cancelled');
    }
    
    this.status = 'cancelled';
    this.cancellation = {
        cancelledBy: userId,
        reason,
        cancelledAt: new Date()
    };
    
    await this.save();
    return this;
};

// Reschedule session
sessionSchema.methods.reschedule = async function(newStartTime, newDuration) {
    if (this.status === 'completed' || this.status === 'cancelled') {
        throw new Error('Completed or cancelled sessions cannot be rescheduled');
    }
    
    // Create a copy for history
    const rescheduledSession = new this.constructor({
        ...this.toObject(),
        _id: new mongoose.Types.ObjectId(),
        rescheduledFrom: this._id,
        scheduledStart: newStartTime,
        scheduledDuration: newDuration,
        scheduledEnd: new Date(newStartTime.getTime() + newDuration * 60000),
        status: 'scheduled'
    });
    
    // Update current session status
    this.status = 'rescheduled';
    
    await Promise.all([
        this.save(),
        rescheduledSession.save()
    ]);
    
    return rescheduledSession;
};

// Add participant
sessionSchema.methods.addParticipant = async function(userId, role) {
    const existingParticipant = this.participants.find(
        p => p.user.toString() === userId.toString()
    );
    
    if (existingParticipant) {
        throw new Error('User is already a participant');
    }
    
    this.participants.push({
        user: userId,
        role,
        status: 'invited'
    });
    
    await this.save();
    return this;
};

// Accept session invitation
sessionSchema.methods.acceptInvitation = async function(userId) {
    const participant = this.participants.find(
        p => p.user.toString() === userId.toString()
    );
    
    if (!participant) {
        throw new Error('User is not invited to this session');
    }
    
    if (participant.status !== 'invited') {
        throw new Error('Invitation has already been processed');
    }
    
    participant.status = 'accepted';
    
    // If all participants have accepted, confirm the session
    const allAccepted = this.participants.every(p => 
        p.status === 'accepted' || p.status === 'joined'
    );
    
    if (allAccepted && this.status === 'scheduled') {
        this.status = 'confirmed';
    }
    
    await this.save();
    return this;
};

// Join video call
sessionSchema.methods.joinVideoCall = async function(userId, callId = null) {
    const participant = this.participants.find(
        p => p.user.toString() === userId.toString()
    );
    
    if (!participant) {
        throw new Error('User is not a participant in this session');
    }
    
    participant.status = 'joined';
    participant.joinedAt = new Date();
    
    // Initialize video call data if not exists
    if (!this.videoCall) {
        this.videoCall = {
            callId: callId || this.videoCall?.callId,
            startedAt: this.videoCall?.startedAt || new Date(),
            participants: []
        };
    }
    
    // Add to video call participants
    const videoCallParticipant = this.videoCall.participants.find(
        p => p.user.toString() === userId.toString()
    );
    
    if (!videoCallParticipant) {
        this.videoCall.participants.push({
            user: userId,
            joinedAt: new Date()
        });
    }
    
    await this.save();
    return this;
};

// Leave video call
sessionSchema.methods.leaveVideoCall = async function(userId) {
    const participant = this.participants.find(
        p => p.user.toString() === userId.toString()
    );
    
    if (participant) {
        participant.leftAt = new Date();
    }
    
    // Update video call participant
    if (this.videoCall && this.videoCall.participants) {
        const videoCallParticipant = this.videoCall.participants.find(
            p => p.user.toString() === userId.toString()
        );
        
        if (videoCallParticipant && !videoCallParticipant.leftAt) {
            videoCallParticipant.leftAt = new Date();
            videoCallParticipant.duration = Math.round(
                (videoCallParticipant.leftAt - videoCallParticipant.joinedAt) / 60000
            );
        }
    }
    
    await this.save();
    return this;
};

// Add session material
sessionSchema.methods.addMaterial = async function(materialData, userId) {
    this.materials.push({
        ...materialData,
        uploadedBy: userId,
        uploadedAt: new Date()
    });
    
    await this.save();
    return this;
};

// Submit feedback
sessionSchema.methods.submitFeedback = async function(feedbackData, userId) {
    const participant = this.participants.find(
        p => p.user.toString() === userId.toString()
    );
    
    if (!participant) {
        throw new Error('Only participants can submit feedback');
    }
    
    if (this.status !== 'completed') {
        throw new Error('Feedback can only be submitted for completed sessions');
    }
    
    if (participant.role === 'teacher') {
        this.feedback.teacherRating = feedbackData.rating;
        this.feedback.teacherComment = feedbackData.comment;
    } else if (participant.role === 'learner') {
        this.feedback.learnerRating = feedbackData.rating;
        this.feedback.learnerComment = feedbackData.comment;
    }
    
    this.feedback.submittedAt = new Date();
    
    await this.save();
    return this;
};

// ✅ PRE-SAVE MIDDLEWARE
sessionSchema.pre('save', function(next) {
    // Calculate scheduledEnd if not provided
    if (this.scheduledStart && this.scheduledDuration && !this.scheduledEnd) {
        this.scheduledEnd = new Date(
            this.scheduledStart.getTime() + this.scheduledDuration * 60000
        );
    }
    
    // Auto-complete agenda items if session is completed
    if (this.status === 'completed' && this.agenda.length > 0) {
        this.agenda.forEach(item => {
            item.completed = true;
        });
    }
    
    next();
});

// ✅ POST-SAVE MIDDLEWARE (for notifications)
sessionSchema.post('save', async function(doc) {
    try {
        // Emit real-time update
        if (typeof process.emit === 'function') {
            process.emit('sessionUpdated', doc);
        }
    } catch (error) {
        console.error('Error in session post-save middleware:', error);
    }
});

// ✅ CREATE AND EXPORT MODEL
const Session = mongoose.model('Session', sessionSchema);

module.exports = Session;
