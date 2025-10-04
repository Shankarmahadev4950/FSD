const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    firstName: {
        type: String,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    location: {
        type: String,
        trim: true
    },
    bio: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        enum: ['student', 'teacher'],
        default: 'student'
    },
      
    isOnline: {
        type: Boolean,
        default: false
    },
    lastSeen: {
        type: Date,
        default: Date.now
    },
    lastActivity: {
        type: Date,
        default: Date.now
    },
    // ✅ FIXED: Ensure arrays have default values
    skillsToLearn: [{
        type: String,
        trim: true
    }],
    skillsToTeach: [{
        type: String,
        trim: true
    }],
    skillsOffered: [{
        type: String,
        trim: true
    }],
    skillsWanted: [{
        type: String,
        trim: true
    }],
    availability: {
        type: String,
        enum: ['flexible', 'weekdays', 'weekends', 'mornings', 'evenings'],
        default: 'flexible'
    },
    hourlyRate: {
        type: Number,
        default: 0
    },
    timeTokens: {
        type: Number,
        default: 20
    },
    rating: {
        type: Number,
        default: 0
    },
    profilePicture: {
        type: String,
        default: 'https://via.placeholder.com/150'
    },
    joinDate: {
        type: Date,
        default: Date.now
    },
    resetPasswordOTP: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    experience: {
        type: String,
        default: ''
    },
    contactMethods: {
        email: { type: Boolean, default: true },
        phone: { type: Boolean, default: false },
        videoCall: { type: Boolean, default: true }
    },
    exchangesCompleted: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// ✅ FIXED: Enhanced pre-save middleware to initialize arrays
userSchema.pre('save', function(next) {
    // Initialize array fields if they don't exist
    if (!this.skillsToLearn) this.skillsToLearn = [];
    if (!this.skillsToTeach) this.skillsToTeach = [];
    if (!this.skillsOffered) this.skillsOffered = [];
    if (!this.skillsWanted) this.skillsWanted = [];
    if (!this.reviews) this.reviews = [];
    
    // Only hash the password if it has been modified
    if (!this.isModified('password')) return next();
    
    bcrypt.hash(this.password, 10)
        .then(hashedPassword => {
            this.password = hashedPassword;
            next();
        })
        .catch(err => next(err));
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
};

// Generate OTP for password reset
userSchema.methods.generatePasswordResetOTP = function() {
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    this.resetPasswordOTP = otp;
    this.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    return otp;
};

// ✅ FIXED: Enhanced array methods with safety checks
userSchema.methods.addTeachingSkill = function(skill) {
    if (!this.skillsToTeach) this.skillsToTeach = [];
    if (!this.skillsOffered) this.skillsOffered = [];
    
    if (!this.skillsToTeach.includes(skill)) {
        this.skillsToTeach.push(skill);
    }
    if (!this.skillsOffered.includes(skill)) {
        this.skillsOffered.push(skill);
    }
    return this;
};

userSchema.methods.addLearningSkill = function(skill) {
    if (!this.skillsToLearn) this.skillsToLearn = [];
    if (!this.skillsWanted) this.skillsWanted = [];
    
    if (!this.skillsToLearn.includes(skill)) {
        this.skillsToLearn.push(skill);
    }
    if (!this.skillsWanted.includes(skill)) {
        this.skillsWanted.push(skill);
    }
    return this;
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    delete user.resetPasswordOTP;
    delete user.resetPasswordExpires;
    return user;
};

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ resetPasswordOTP: 1, resetPasswordExpires: 1 });
userSchema.index({ isOnline: 1 });
userSchema.index({ location: 1 });

module.exports = mongoose.model('User', userSchema);
