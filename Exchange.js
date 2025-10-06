const mongoose = require('mongoose');

const exchangeSchema = new mongoose.Schema({
    skill: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
        required: true
    },
    learner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    hours: {
        type: Number,
        required: true,
        min: 1
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'in-progress', 'completed', 'rejected', 'cancelled'],
        default: 'pending'
    },
    scheduledDate: {
        type: Date
    },
    completedDate: {
        type: Date
    },
    // ✅ ADDED: Track when the exchange was responded to
    respondedAt: {
        type: Date
    },
    // ✅ ADDED: Reason for rejection
    rejectionReason: {
        type: String
    },
    // ✅ ADDED: Track when cancelled
    cancelledAt: {
        type: Date
    },
    skillName: {
        type: String
    },
    skillCategory: {
        type: String
    },
    learnerName: {
        type: String
    },
    providerName: {
        type: String
    },
    learnerFeedback: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Feedback'
    },
    providerFeedback: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Feedback'
    }
}, {
    timestamps: true
});

// ✅ IMPROVED: Static method to create exchange with populated data
exchangeSchema.statics.createWithPopulatedData = async function(exchangeData) {
    const User = mongoose.model('User');
    const Skill = mongoose.model('Skill');
    
    try {
        // Fetch user and skill data in parallel
        const [learner, provider, skill] = await Promise.all([
            User.findById(exchangeData.learner),
            User.findById(exchangeData.provider),
            Skill.findById(exchangeData.skill)
        ]);
        
        // Add populated data
        if (learner) exchangeData.learnerName = learner.name;
        if (provider) exchangeData.providerName = provider.name;
        if (skill) {
            exchangeData.skillName = skill.name;
            exchangeData.skillCategory = skill.category;
            // Use skill's timeRequired if hours not provided
            if (!exchangeData.hours && skill.timeRequired) {
                exchangeData.hours = skill.timeRequired;
            }
        }
        
        return this.create(exchangeData);
    } catch (error) {
        console.error('Error creating exchange with populated data:', error);
        throw error;
    }
};

// ✅ ADDED: Virtual for formatted status
exchangeSchema.virtual('statusFormatted').get(function() {
    const statusMap = {
        'pending': 'Pending',
        'accepted': 'Accepted', 
        'in-progress': 'In Progress',
        'completed': 'Completed',
        'rejected': 'Rejected',
        'cancelled': 'Cancelled'
    };
    return statusMap[this.status] || this.status;
});

// ✅ ADDED: Method to check if user can modify exchange
exchangeSchema.methods.canModify = function(userId) {
    return this.learner.toString() === userId.toString() || 
           this.provider.toString() === userId.toString();
};

// ✅ ADDED: Method to check if user is participant
exchangeSchema.methods.isParticipant = function(userId) {
    return this.learner.toString() === userId.toString() || 
           this.provider.toString() === userId.toString();
};

// ✅ ENHANCED: Pre-save middleware (simplified)
exchangeSchema.pre('save', function(next) {
    // Set respondedAt when status changes from pending
    if (this.isModified('status') && this.status !== 'pending' && !this.respondedAt) {
        this.respondedAt = new Date();
    }
    
    // Set cancelledAt when status changes to cancelled
    if (this.isModified('status') && this.status === 'cancelled' && !this.cancelledAt) {
        this.cancelledAt = new Date();
    }
    
    next();
});

module.exports = mongoose.model('Exchange', exchangeSchema);
