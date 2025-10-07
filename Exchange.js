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

// ✅ IMPROVED: Pre-save middleware with better error handling
exchangeSchema.pre('save', async function(next) {
    if (this.isNew) {
        try {
            const User = mongoose.model('User');
            const Skill = mongoose.model('Skill');
            
            // Populate learner name with error handling
            if (this.learner && !this.learnerName) {
                try {
                    const learner = await User.findById(this.learner);
                    if (learner) {
                        this.learnerName = learner.name;
                    } else {
                        console.warn(`⚠️ Learner not found for exchange: ${this.learner}`);
                        this.learnerName = 'Unknown User';
                    }
                } catch (error) {
                    console.error('Error populating learner:', error);
                    this.learnerName = 'Unknown User';
                }
            }
            
            // Populate provider name with error handling
            if (this.provider && !this.providerName) {
                try {
                    const provider = await User.findById(this.provider);
                    if (provider) {
                        this.providerName = provider.name;
                    } else {
                        console.warn(`⚠️ Provider not found for exchange: ${this.provider}`);
                        this.providerName = 'Unknown User';
                    }
                } catch (error) {
                    console.error('Error populating provider:', error);
                    this.providerName = 'Unknown User';
                }
            }
            
            // Populate skill details with error handling
            if (this.skill && (!this.skillName || !this.skillCategory)) {
                try {
                    const skill = await Skill.findById(this.skill);
                    if (skill) {
                        this.skillName = skill.name;
                        this.skillCategory = skill.category;
                    } else {
                        console.warn(`⚠️ Skill not found for exchange: ${this.skill}`);
                        this.skillName = 'Unknown Skill';
                        this.skillCategory = 'Unknown Category';
                    }
                } catch (error) {
                    console.error('Error populating skill:', error);
                    this.skillName = 'Unknown Skill';
                    this.skillCategory = 'Unknown Category';
                }
            }
        } catch (error) {
            console.error('Unexpected error in exchange pre-save middleware:', error);
            // Don't block the save operation
        }
    }
    next();
});

// ✅ ADD STATIC METHOD FOR SAFE EXCHANGE CREATION
exchangeSchema.statics.createWithValidation = async function(exchangeData) {
    try {
        // Validate required fields
        if (!exchangeData.skill || !exchangeData.learner || !exchangeData.provider) {
            throw new Error('Skill, learner, and provider are required');
        }

        // Check if skill exists
        const Skill = mongoose.model('Skill');
        const skill = await Skill.findById(exchangeData.skill);
        if (!skill) {
            throw new Error('Skill not found');
        }

        // Check if users exist
        const User = mongoose.model('User');
        const [learner, provider] = await Promise.all([
            User.findById(exchangeData.learner),
            User.findById(exchangeData.provider)
        ]);

        if (!learner) {
            throw new Error('Learner not found');
        }
        if (!provider) {
            throw new Error('Provider not found');
        }

        // Create the exchange
        const exchange = new this(exchangeData);
        return await exchange.save();
    } catch (error) {
        console.error('Exchange creation error:', error);
        throw error;
    }
};

module.exports = mongoose.model('Exchange', exchangeSchema);
