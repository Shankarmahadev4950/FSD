const notificationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { 
        type: String, 
        enum: ['exchange_request', 'message', 'video_call', 'system'],
        required: true 
    },
    title: String,
    message: String,
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    skill: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill' },
    isRead: { type: Boolean, default: false },
    metadata: Object
}, { timestamps: true });
