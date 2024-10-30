'use strict';
var __createBinding =
    (this && this.__createBinding) ||
    (Object.create
        ? function (o, m, k, k2) {
              if (k2 === undefined) k2 = k;
              var desc = Object.getOwnPropertyDescriptor(m, k);
              if (
                  !desc ||
                  ('get' in desc
                      ? !m.__esModule
                      : desc.writable || desc.configurable)
              ) {
                  desc = {
                      enumerable: true,
                      get: function () {
                          return m[k];
                      },
                  };
              }
              Object.defineProperty(o, k2, desc);
          }
        : function (o, m, k, k2) {
              if (k2 === undefined) k2 = k;
              o[k2] = m[k];
          });
var __setModuleDefault =
    (this && this.__setModuleDefault) ||
    (Object.create
        ? function (o, v) {
              Object.defineProperty(o, 'default', {
                  enumerable: true,
                  value: v,
              });
          }
        : function (o, v) {
              o['default'] = v;
          });
var __importStar =
    (this && this.__importStar) ||
    function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (
                    k !== 'default' &&
                    Object.prototype.hasOwnProperty.call(mod, k)
                )
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    };
Object.defineProperty(exports, '__esModule', { value: true });
const mongoose_1 = __importStar(require('mongoose'));
var TaskStatus;
(function (TaskStatus) {
    TaskStatus['PENDING'] = 'pending';
    TaskStatus['IN_PROGRESS'] = 'in-progress';
    TaskStatus['COMPLETED'] = 'completed';
})(TaskStatus || (TaskStatus = {}));
const taskSchema = new mongoose_1.Schema({
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
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Project',
        required: [true, 'Task must belong to a project'],
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    // Soft delete flag
    is_deleted: { type: Boolean, default: false },
});
const Task = mongoose_1.default.model('Task', taskSchema);
exports.default = Task;
