import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
    name: string;
    description?: string;
    owner: mongoose.Types.ObjectId;
    created_at: Date;
}

const projectSchema: Schema<IProject> = new Schema({
    name: {
        type: String,
        required: [true, 'Project name is required'],
    },
    description: {
        type: String,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Project owner is required'],
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

const Project = mongoose.model<IProject>('Project', projectSchema);

export default Project;