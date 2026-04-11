import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    originalName: {
        type: String,
        required: true
    },
    storedName: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    mimeType: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

const fileModel = mongoose.model('File', fileSchema);

export default fileModel;