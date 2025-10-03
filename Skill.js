const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // ✅ ADDED: Provider name for frontend display
    providerName: {
        type: String,
        required: true
    },
    timeRequired: {
        type: Number,
        required: true,
        min: 1
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        trim: true
    },
    // ✅ ADDED: Price field for frontend compatibility
    price: {
        type: String
    },
    rating: {
        type: Number,
        default: 0
    },
    
    reviewsCount: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }, providerOnline: {
        type: Boolean,
        default: false
    },
    lastOnlineCheck: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// ✅ ENHANCED: Pre-save middleware to set providerName, price, and online status
skillSchema.pre('save', async function(next) {
    if ((this.isNew || this.isModified('provider')) && this.provider) {
        try {
            const User = mongoose.model('User');
            const user = await User.findById(this.provider);
            if (user) {
                this.providerName = user.name;
                // ✅ Also update online status from user
                this.providerOnline = user.isOnline || false;
                this.lastOnlineCheck = new Date();
            }
        } catch (error) {
            console.error('Error setting provider name and online status:', error);
        }
    }
    
    // Set price field based on timeRequired for frontend compatibility
    if (this.timeRequired && !this.price) {
        this.price = `${this.timeRequired} hour${this.timeRequired > 1 ? 's' : ''}`;
    }
    
    next();
});

module.exports = mongoose.model('Skill', skillSchema);