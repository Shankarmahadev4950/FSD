const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    exchange: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exchange',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        trim: true,
        maxlength: 500
    },
    forProvider: {
        type: Boolean,
        default: true
    },
    // ✅ ADDED: User name for easier display
    userName: {
        type: String
    },
    // ✅ ADDED: Skill name for context
    skillName: {
        type: String
    }
}, {
    timestamps: true
});

// ✅ ADDED: Pre-save middleware to populate names
feedbackSchema.pre('save', async function(next) {
    if (this.isNew) {
        try {
            const User = mongoose.model('User');
            const Exchange = mongoose.model('Exchange');
            
            // Populate user name
            if (this.user && !this.userName) {
                const user = await User.findById(this.user);
                if (user) this.userName = user.name;
            }
            
            // Populate skill name from exchange
            if (this.exchange && !this.skillName) {
                const exchange = await Exchange.findById(this.exchange).populate('skill');
                if (exchange && exchange.skill) {
                    this.skillName = exchange.skill.name;
                }
            }
        } catch (error) {
            console.error('Error populating feedback details:', error);
        }
    }
    next();
});

// Ensure one feedback per user per exchange
feedbackSchema.index({ exchange: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Feedback', feedbackSchema);