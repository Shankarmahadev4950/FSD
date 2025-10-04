const sessionSchema = new mongoose.Schema({
    participants: [{ 
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        role: { type: String, enum: ['teacher', 'learner'] }
    }],
    skill: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill' },
    scheduledDuration: Number, // in minutes
    actualDuration: Number, // in minutes
    startTime: Date,
    endTime: Date,
    status: {
        type: String,
        enum: ['scheduled', 'in-progress', 'completed', 'cancelled'],
        default: 'scheduled'
    },
    videoCall: {
        callId: String,
        startedAt: Date,
        endedAt: Date
    }
}, { timestamps: true });
