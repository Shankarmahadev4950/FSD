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
        // ✅ UPDATED: Align status with frontend expectations
        enum: ['pending', 'accepted', 'in-progress', 'completed', 'rejected', 'cancelled'],
        default: 'pending'
    },
    scheduledDate: {
        type: Date
    },
    completedDate: {
        type: Date
    },
    // ✅ ADDED: Skill details for easier querying
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

// ✅ ADDED: Pre-save middleware to populate names
exchangeSchema.pre('save', async function(next) {
    if (this.isNew) {
        try {
            const User = mongoose.model('User');
            const Skill = mongoose.model('Skill');
            
            // Populate learner name
            if (this.learner && !this.learnerName) {
                const learner = await User.findById(this.learner);
                if (learner) this.learnerName = learner.name;
            }
            
            // Populate provider name
            if (this.provider && !this.providerName) {
                const provider = await User.findById(this.provider);
                if (provider) this.providerName = provider.name;
            }
            
            // Populate skill details
            if (this.skill && (!this.skillName || !this.skillCategory)) {
                const skill = await Skill.findById(this.skill);
                if (skill) {
                    this.skillName = skill.name;
                    this.skillCategory = skill.category;
                }
            }
        } catch (error) {
            console.error('Error populating exchange details:', error);
        }
    }
    next();
});

module.exports = mongoose.model('Exchange', exchangeSchema);