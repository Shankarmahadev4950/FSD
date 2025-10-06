const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    skill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000
    },
    read: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['sending', 'sent', 'delivered', 'read', 'failed'],
        default: 'sent'
    },
    // ✅ ADDED: Message type for different content types
    messageType: {
        type: String,
        enum: ['text', 'image', 'file', 'system'],
        default: 'text'
    },
    // ✅ ADDED: File attachment support
    attachment: {
        url: String,
        filename: String,
        fileType: String,
        fileSize: Number
    },
    // ✅ ADDED: Reply reference
    replyTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    // ✅ ADDED: Message metadata for easier queries
    senderName: String,
    receiverName: String,
    skillName: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// ✅ ADDED: Indexes for better performance
messageSchema.index({ skill: 1, timestamp: 1 });
messageSchema.index({ sender: 1, timestamp: 1 });
messageSchema.index({ receiver: 1, timestamp: 1 });
messageSchema.index({ skill: 1, sender: 1, receiver: 1 });

// ✅ ADDED: Static method to create message with populated data
messageSchema.statics.createWithPopulatedData = async function(messageData) {
    const User = mongoose.model('User');
    const Skill = mongoose.model('Skill');
    
    try {
        // Fetch user and skill data in parallel
        const [sender, receiver, skill] = await Promise.all([
            User.findById(messageData.sender),
            User.findById(messageData.receiver),
            Skill.findById(messageData.skill)
        ]);
        
        // Add populated data
        if (sender) messageData.senderName = sender.name;
        if (receiver) messageData.receiverName = receiver.name;
        if (skill) messageData.skillName = skill.name;
        
        return this.create(messageData);
    } catch (error) {
        console.error('Error creating message with populated data:', error);
        throw error;
    }
};

// ✅ ADDED: Method to mark message as read
messageSchema.methods.markAsRead = async function() {
    if (!this.read) {
        this.read = true;
        this.status = 'read';
        await this.save();
    }
    return this;
};

// ✅ ADDED: Method to update message status
messageSchema.methods.updateStatus = async function(status) {
    if (['sending', 'sent', 'delivered', 'read', 'failed'].includes(status)) {
        this.status = status;
        
        // Automatically mark as read when status is 'read'
        if (status === 'read' && !this.read) {
            this.read = true;
        }
        
        await this.save();
    }
    return this;
};

// ✅ ADDED: Static method to get conversation messages
messageSchema.statics.getConversation = async function(skillId, userId1, userId2, limit = 50, before = null) {
    const query = {
        skill: skillId,
        $or: [
            { sender: userId1, receiver: userId2 },
            { sender: userId2, receiver: userId1 }
        ]
    };
    
    // For pagination - get messages before a certain date
    if (before) {
        query.timestamp = { $lt: new Date(before) };
    }
    
    return this.find(query)
        .populate('sender', 'name profilePicture')
        .populate('receiver', 'name profilePicture')
        .populate('replyTo', 'content sender')
        .sort({ timestamp: -1 })
        .limit(limit)
        .lean();
};

// ✅ ADDED: Static method to mark all messages as read
messageSchema.statics.markConversationAsRead = async function(skillId, userId, otherUserId) {
    return this.updateMany(
        {
            skill: skillId,
            sender: otherUserId,
            receiver: userId,
            read: false
        },
        {
            $set: {
                read: true,
                status: 'read'
            }
        }
    );
};

// ✅ ADDED: Virtual for formatted timestamp
messageSchema.virtual('formattedTime').get(function() {
    const date = this.timestamp || this.createdAt;
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString();
    }
});

// ✅ ADDED: Virtual for isSent (convenience method)
messageSchema.virtual('isSent').get(function() {
    return this.status === 'sent' || this.status === 'delivered' || this.status === 'read';
});

// ✅ ADDED: Pre-save middleware to ensure timestamp
messageSchema.pre('save', function(next) {
    if (!this.timestamp) {
        this.timestamp = new Date();
    }
    next();
});

// ✅ ADDED: Pre-remove middleware to handle reply references
messageSchema.pre('remove', async function(next) {
    // If this message is being deleted, remove any replies that reference it
    await this.model('Message').updateMany(
        { replyTo: this._id },
        { $unset: { replyTo: 1 } }
    );
    next();
});

module.exports = mongoose.model('Message', messageSchema);
