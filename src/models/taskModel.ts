import mongoose, { Schema, Document } from 'mongoose';

enum TaskStatus {
    PENDING = 'pending',
    IN_PROGRESS = 'in-progress',
    COMPLETED = 'completed',
}

export interface ITask extends Document {
    _id: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    status: TaskStatus;
    due_date?: Date;
    project: mongoose.Types.ObjectId;
    created_at: Date;
}

const taskSchema: Schema<ITask> = new Schema({
    title: {
        type: String,
        required: [true, 'Task title is required'],
    },
    description: {
        type: String,
        default: '',
    },
    status: {
        type: String,
        enum: Object.values(TaskStatus),
        required: [true, 'Task status is required'],
    },
    due_date: {
        type: Date,
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: [true, 'Task must belong to a project'],
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

const Task = mongoose.model<ITask>('Task', taskSchema);

export default Task;
