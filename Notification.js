const mongoose = require('mongoose');

// ✅ ENHANCED NOTIFICATION SCHEMA
const notificationSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true,
        index: true
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
            'exchange_rejected', // ✅ ADDED: Missing type
            'exchange_completed',
            'exchange_cancelled',
            'rating_received',
            'time_tokens_added',
            'profile_updated',
            'welcome', // ✅ ADDED: Welcome notification
            'achievement' // ✅ ADDED: Achievement unlocked
        ],
        required: true 
    },
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    message: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
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
            enum: ['requested', 'accepted', 'rejected', 'ended', 'missed', 'timeout'] // ✅ ADDED: timeout
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
    actionUrl: {
        type: String,
        trim: true
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed, // ✅ CHANGED: Better than Object
        default: {}
    },
    expiresAt: {
        type: Date,
        default: function() {
            // Notifications expire after 30 days by default
            return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        }
    },
    // ✅ ADDED: Notification category for grouping
    category: {
        type: String,
        enum: ['social', 'learning', 'system', 'transaction', 'achievement'],
        default: 'system'
    },
    // ✅ ADDED: Notification icon
    icon: {
        type: String,
        default: 'fas fa-bell'
    },
    // ✅ ADDED: Badge count for grouped notifications
    badgeCount: {
        type: Number,
        default: 1
    }
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// ✅ COMPOUND INDEXES FOR BETTER PERFORMANCE
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, isRead: 1, isArchived: 1 });
notificationSchema.index({ user: 1, type: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
notificationSchema.index({ user: 1, isArchived: 1, category: 1 });
notificationSchema.index({ createdAt: 1 }); // For time-based queries

// ✅ VIRTUAL FIELDS
notificationSchema.virtual('timeAgo').get(function() {
    return this.constructor.calculateTimeAgo(this.createdAt);
});

notificationSchema.virtual('isExpired').get(function() {
    return this.expiresAt && new Date() > this.expiresAt;
});

notificationSchema.virtual('isActionable').get(function() {
    const actionableTypes = [
        'exchange_request', 
        'message', 
        'video_call',
        'exchange_accepted',
        'exchange_rejected'
    ];
    return actionableTypes.includes(this.type);
});

// ✅ STATIC METHODS

/**
 * Create notification with automatic content generation and validation
 */
notificationSchema.statics.createNotification = async function(notificationData) {
    try {
        // Validate required fields
        if (!notificationData.user) {
            throw new Error('User ID is required');
        }
        if (!notificationData.type) {
            throw new Error('Notification type is required');
        }

        // Generate title and message if not provided
        if (!notificationData.title || !notificationData.message) {
            const generated = this.generateNotificationContent(notificationData.type, notificationData);
            notificationData.title = notificationData.title || generated.title;
            notificationData.message = notificationData.message || generated.message;
        }

        // Set category based on type
        if (!notificationData.category) {
            notificationData.category = this.getCategoryFromType(notificationData.type);
        }

        // Set icon based on type
        if (!notificationData.icon) {
            notificationData.icon = this.getIconFromType(notificationData.type);
        }

        const notification = new this(notificationData);
        await notification.save();
        
        // Populate references for immediate use
        await notification.populate([
            { path: 'fromUser', select: 'name profilePicture email' },
            { path: 'skill', select: 'name category' },
            { path: 'exchange' }
        ]);
        
        return notification;
    } catch (error) {
        console.error('❌ Error creating notification:', error);
        throw error;
    }
};

/**
 * Create multiple notifications efficiently
 */
notificationSchema.statics.createNotifications = async function(notificationsData) {
    try {
        const processedNotifications = notificationsData.map(data => {
            // Generate content if not provided
            if (!data.title || !data.message) {
                const generated = this.generateNotificationContent(data.type, data);
                data.title = data.title || generated.title;
                data.message = data.message || generated.message;
            }

            // Set category and icon
            data.category = data.category || this.getCategoryFromType(data.type);
            data.icon = data.icon || this.getIconFromType(data.type);

            return data;
        });

        const notifications = await this.insertMany(processedNotifications);
        return notifications;
    } catch (error) {
        console.error('❌ Error creating multiple notifications:', error);
        throw error;
    }
};

/**
 * Generate notification content based on type
 */
notificationSchema.statics.generateNotificationContent = function(type, data = {}) {
    const templates = {
        exchange_request: {
            title: '📚 New Exchange Request',
            message: `${data.fromUserName || 'Someone'} wants to learn "${data.skillName || 'a skill'}" from you`
        },
        message: {
            title: '💬 New Message',
            message: `${data.fromUserName || 'Someone'} sent you a message`
        },
        video_call: {
            title: '📞 Video Call Request',
            message: `${data.fromUserName || 'Someone'} wants to start a video call`
        },
        system: {
            title: '⚙️ System Notification',
            message: data.message || 'You have a new system notification'
        },
        skill_approved: {
            title: '✅ Skill Approved',
            message: `Your skill "${data.skillName || ''}" has been approved and is now visible to others`
        },
        skill_rejected: {
            title: '❌ Skill Needs Review',
            message: `Your skill "${data.skillName || ''}" needs some modifications before it can be published`
        },
        exchange_accepted: {
            title: '🎉 Exchange Accepted!',
            message: `${data.fromUserName || 'Someone'} accepted your exchange request for "${data.skillName || 'a skill'}"`
        },
        exchange_rejected: {
            title: '😔 Exchange Declined',
            message: `${data.fromUserName || 'Someone'} declined your exchange request`
        },
        exchange_completed: {
            title: '🏆 Exchange Completed',
            message: `Your exchange for "${data.skillName || 'a skill'}" has been completed`
        },
        exchange_cancelled: {
            title: '🔴 Exchange Cancelled',
            message: `An exchange has been cancelled`
        },
        rating_received: {
            title: '⭐ New Rating',
            message: `You received a ${data.rating || ''} star rating for your teaching`
        },
        time_tokens_added: {
            title: '💰 Time Tokens Added',
            message: `You received ${data.tokens || ''} time tokens`
        },
        profile_updated: {
            title: '👤 Profile Updated',
            message: 'Your profile has been updated successfully'
        },
        welcome: {
            title: '👋 Welcome to LocalLink!',
            message: 'Thank you for joining our community. Start exploring skills now!'
        },
        achievement: {
            title: '🏅 Achievement Unlocked!',
            message: data.message || 'You unlocked a new achievement!'
        }
    };

    return templates[type] || {
        title: '🔔 New Notification',
        message: 'You have a new notification'
    };
};

/**
 * Get category from notification type
 */
notificationSchema.statics.getCategoryFromType = function(type) {
    const categoryMap = {
        exchange_request: 'learning',
        exchange_accepted: 'learning',
        exchange_rejected: 'learning',
        exchange_completed: 'learning',
        exchange_cancelled: 'learning',
        message: 'social',
        video_call: 'social',
        skill_approved: 'system',
        skill_rejected: 'system',
        rating_received: 'achievement',
        time_tokens_added: 'transaction',
        profile_updated: 'system',
        welcome: 'system',
        achievement: 'achievement',
        system: 'system'
    };
    
    return categoryMap[type] || 'system';
};

/**
 * Get icon from notification type
 */
notificationSchema.statics.getIconFromType = function(type) {
    const iconMap = {
        exchange_request: 'fas fa-handshake',
        message: 'fas fa-comment',
        video_call: 'fas fa-video',
        system: 'fas fa-cog',
        skill_approved: 'fas fa-check-circle',
        skill_rejected: 'fas fa-exclamation-triangle',
        exchange_accepted: 'fas fa-check',
        exchange_rejected: 'fas fa-times',
        exchange_completed: 'fas fa-trophy',
        exchange_cancelled: 'fas fa-ban',
        rating_received: 'fas fa-star',
        time_tokens_added: 'fas fa-coins',
        profile_updated: 'fas fa-user-edit',
        welcome: 'fas fa-party-horn',
        achievement: 'fas fa-medal'
    };
    
    return iconMap[type] || 'fas fa-bell';
};

/**
 * Get unread count for user
 */
notificationSchema.statics.getUnreadCount = async function(userId) {
    return await this.countDocuments({
        user: userId,
        isRead: false,
        isArchived: false,
        expiresAt: { $gt: new Date() }
    });
};

/**
 * Get notifications for user with advanced filtering
 */
notificationSchema.statics.getUserNotifications = async function(userId, options = {}) {
    const {
        page = 1,
        limit = 20,
        unreadOnly = false,
        type = null,
        category = null,
        archived = false,
        days = 30 // Default to last 30 days
    } = options;

    const query = { 
        user: userId, 
        isArchived: archived,
        expiresAt: { $gt: new Date() }
    };
    
    // Date filter
    if (days) {
        const dateLimit = new Date();
        dateLimit.setDate(dateLimit.getDate() - days);
        query.createdAt = { $gte: dateLimit };
    }
    
    if (unreadOnly) {
        query.isRead = false;
    }
    
    if (type) {
        query.type = type;
    }
    
    if (category) {
        query.category = category;
    }

    const [notifications, total] = await Promise.all([
        this.find(query)
            .populate('fromUser', 'name profilePicture email')
            .populate('skill', 'name category')
            .populate('exchange')
            .sort({ priority: -1, createdAt: -1 })
            .limit(limit)
            .skip((page - 1) * limit)
            .lean(),
        this.countDocuments(query)
    ]);

    // Add virtual fields
    const enhancedNotifications = notifications.map(notification => ({
        ...notification,
        timeAgo: this.calculateTimeAgo(notification.createdAt),
        isExpired: new Date() > new Date(notification.expiresAt),
        isActionable: this.isActionableType(notification.type)
    }));

    return {
        notifications: enhancedNotifications,
        pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
        }
    };
};

/**
 * Mark multiple notifications as read
 */
notificationSchema.statics.markAllAsRead = async function(userId, notificationIds = null) {
    const query = { 
        user: userId, 
        isRead: false 
    };
    
    if (notificationIds) {
        query._id = { $in: notificationIds };
    }
    
    const result = await this.updateMany(query, {
        $set: { isRead: true }
    });
    
    return result.modifiedCount;
};

/**
 * Clean up expired notifications
 */
notificationSchema.statics.cleanupExpired = async function() {
    const result = await this.deleteMany({
        expiresAt: { $lte: new Date() }
    });
    
    console.log(`🧹 Cleaned up ${result.deletedCount} expired notifications`);
    return result.deletedCount;
};

/**
 * Calculate time ago (helper method)
 */
notificationSchema.statics.calculateTimeAgo = function(date) {
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);

    if (diffSecs < 60) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffWeeks < 4) return `${diffWeeks}w ago`;
    
    return new Date(date).toLocaleDateString();
};

/**
 * Check if notification type is actionable
 */
notificationSchema.statics.isActionableType = function(type) {
    const actionableTypes = [
        'exchange_request', 
        'message', 
        'video_call',
        'exchange_accepted',
        'exchange_rejected',
        'skill_approved',
        'skill_rejected'
    ];
    return actionableTypes.includes(type);
};

// ✅ INSTANCE METHODS

/**
 * Mark as read
 */
notificationSchema.methods.markAsRead = async function() {
    if (!this.isRead) {
        this.isRead = true;
        await this.save();
    }
    return this;
};

/**
 * Archive notification
 */
notificationSchema.methods.archive = async function() {
    this.isArchived = true;
    await this.save();
    return this;
};

/**
 * Get action URL based on type
 */
notificationSchema.methods.getActionUrl = function() {
    if (this.actionUrl) return this.actionUrl;
    
    const baseUrls = {
        exchange_request: `/exchanges?skill=${this.skill}`,
        message: `/messages?skill=${this.skill}&user=${this.fromUser}`,
        video_call: `/video-call?callId=${this.videoCall?.callId}`,
        skill_approved: `/skills/${this.skill}`,
        skill_rejected: `/skills/${this.skill}/edit`,
        exchange_accepted: `/exchanges/${this.exchange}`,
        exchange_rejected: `/skills`,
        exchange_completed: `/profile/ratings`,
        rating_received: `/profile/ratings`,
        welcome: `/skills`
    };

    return baseUrls[this.type] || '/notifications';
};

/**
 * Check if notification is valid and not expired
 */
notificationSchema.methods.isValid = function() {
    return !this.isExpired && !this.isArchived;
};

// ✅ PRE-SAVE MIDDLEWARE
notificationSchema.pre('save', function(next) {
    // Set priority based on type
    const priorityMap = {
        'video_call': 'urgent',
        'exchange_request': 'high',
        'message': 'medium',
        'system': 'low',
        'welcome': 'medium'
    };
    
    if (!this.priority) {
        this.priority = priorityMap[this.type] || 'medium';
    }
    
    // Truncate long messages
    if (this.message.length > 500) {
        this.message = this.message.substring(0, 497) + '...';
    }
    
    if (this.title.length > 100) {
        this.title = this.title.substring(0, 97) + '...';
    }
    
    next();
});

// ✅ POST-SAVE MIDDLEWARE (for real-time updates)
notificationSchema.post('save', async function(doc) {
    // Emit real-time update via WebSocket if available
    if (process.emit && doc.user) {
        try {
            const unreadCount = await doc.constructor.getUnreadCount(doc.user);
            process.emit('notification:new', {
                notification: doc,
                unreadCount,
                userId: doc.user.toString()
            });
        } catch (error) {
            console.error('Error emitting notification event:', error);
        }
    }
});

// ✅ CREATE AND EXPORT MODEL
const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
