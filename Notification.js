const mongoose = require('mongoose');

// ✅ NOTIFICATION SCHEMA - Enhanced with all features
const notificationSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    type: { 
        type: String, 
        enum: [
            'exchange_request', 
            'message', 
            'video_call', 
            'system',
            'skill_approved',
            'skill_rejected',
            'exchange_accepted',
            'exchange_completed',
            'exchange_cancelled',
            'rating_received',
            'time_tokens_added',
            'profile_updated'
        ],
        required: true 
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    fromUser: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    skill: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Skill' 
    },
    exchange: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exchange'
    },
    videoCall: {
        callId: String,
        status: {
            type: String,
            enum: ['requested', 'accepted', 'rejected', 'ended', 'missed']
        }
    },
    isRead: { 
        type: Boolean, 
        default: false 
    },
    isArchived: {
        type: Boolean,
        default: false
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    actionUrl: String, // URL for the user to take action
    metadata: {
        type: Object,
        default: {}
    },
    expiresAt: {
        type: Date,
        default: function() {
            // Notifications expire after 30 days by default
            return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        }
    }
}, { 
    timestamps: true 
});

// ✅ INDEXES FOR PERFORMANCE
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ user: 1, type: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
notificationSchema.index({ isArchived: 1 });

// ✅ VIRTUAL FOR TIME AGO DISPLAY
notificationSchema.virtual('timeAgo').get(function() {
    const now = new Date();
    const diffMs = now - this.createdAt;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return this.createdAt.toLocaleDateString();
});

// ✅ STATIC METHODS

// Create notification with automatic title/message generation
notificationSchema.statics.createNotification = async function(notificationData) {
    try {
        // Generate title and message if not provided
        if (!notificationData.title || !notificationData.message) {
            const generated = this.generateNotificationContent(notificationData.type, notificationData);
            notificationData.title = notificationData.title || generated.title;
            notificationData.message = notificationData.message || generated.message;
        }

        const notification = new this(notificationData);
        await notification.save();
        
        // Populate references for immediate use
        await notification.populate('fromUser', 'name profilePicture');
        await notification.populate('skill', 'name category');
        
        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        throw error;
    }
};

// Generate notification content based on type
notificationSchema.statics.generateNotificationContent = function(type, data = {}) {
    const templates = {
        exchange_request: {
            title: 'New Exchange Request',
            message: `${data.fromUserName || 'Someone'} wants to learn ${data.skillName || 'a skill'} from you`
        },
        message: {
            title: 'New Message',
            message: `${data.fromUserName || 'Someone'} sent you a message`
        },
        video_call: {
            title: 'Video Call Request',
            message: `${data.fromUserName || 'Someone'} wants to start a video call`
        },
        system: {
            title: 'System Notification',
            message: data.message || 'You have a new system notification'
        },
        skill_approved: {
            title: 'Skill Approved',
            message: `Your skill "${data.skillName || ''}" has been approved and is now visible to others`
        },
        skill_rejected: {
            title: 'Skill Needs Review',
            message: `Your skill "${data.skillName || ''}" needs some modifications before it can be published`
        },
        exchange_accepted: {
            title: 'Exchange Accepted',
            message: `${data.fromUserName || 'Someone'} accepted your exchange request`
        },
        exchange_completed: {
            title: 'Exchange Completed',
            message: `Your exchange for ${data.skillName || 'a skill'} has been completed`
        },
        exchange_cancelled: {
            title: 'Exchange Cancelled',
            message: `An exchange has been cancelled`
        },
        rating_received: {
            title: 'New Rating',
            message: `You received a ${data.rating || ''} star rating for your teaching`
        },
        time_tokens_added: {
            title: 'Time Tokens Added',
            message: `You received ${data.tokens || ''} time tokens`
        },
        profile_updated: {
            title: 'Profile Updated',
            message: 'Your profile has been updated successfully'
        }
    };

    return templates[type] || {
        title: 'New Notification',
        message: 'You have a new notification'
    };
};

// Get unread count for user
notificationSchema.statics.getUnreadCount = async function(userId) {
    return await this.countDocuments({
        user: userId,
        isRead: false,
        isArchived: false
    });
};

// Get notifications for user with pagination
notificationSchema.statics.getUserNotifications = async function(userId, options = {}) {
    const {
        page = 1,
        limit = 20,
        unreadOnly = false,
        type = null,
        archived = false
    } = options;

    const query = { user: userId, isArchived: archived };
    
    if (unreadOnly) {
        query.isRead = false;
    }
    
    if (type) {
        query.type = type;
    }

    const notifications = await this.find(query)
        .populate('fromUser', 'name profilePicture email')
        .populate('skill', 'name category')
        .populate('exchange')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit)
        .lean();

    // Add virtual timeAgo to each notification
    return notifications.map(notification => ({
        ...notification,
        timeAgo: this.calculateTimeAgo(notification.createdAt)
    }));
};

// Calculate time ago (helper method)
notificationSchema.statics.calculateTimeAgo = function(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
};

// ✅ INSTANCE METHODS

// Mark as read
notificationSchema.methods.markAsRead = async function() {
    this.isRead = true;
    await this.save();
    return this;
};

// Archive notification
notificationSchema.methods.archive = async function() {
    this.isArchived = true;
    await this.save();
    return this;
};

// Get action URL based on type
notificationSchema.methods.getActionUrl = function() {
    const baseUrls = {
        exchange_request: '/exchanges',
        message: '/messages',
        video_call: '/video-call',
        skill_approved: '/skills',
        exchange_accepted: '/exchanges',
        exchange_completed: '/profile',
        rating_received: '/profile'
    };

    const baseUrl = baseUrls[this.type] || '/notifications';
    
    if (this.actionUrl) return this.actionUrl;
    
    switch (this.type) {
        case 'exchange_request':
            return `/exchanges?skill=${this.skill}`;
        case 'message':
            return `/messages?skill=${this.skill}&user=${this.fromUser}`;
        case 'video_call':
            return `/video-call?callId=${this.videoCall?.callId}`;
        default:
            return baseUrl;
    }
};

// ✅ PRE-SAVE MIDDLEWARE
notificationSchema.pre('save', function(next) {
    // Set priority based on type
    const priorityMap = {
        'video_call': 'urgent',
        'exchange_request': 'high',
        'message': 'medium',
        'system': 'low'
    };
    
    if (!this.priority) {
        this.priority = priorityMap[this.type] || 'medium';
    }
    
    next();
});

// ✅ CREATE AND EXPORT MODEL
const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
