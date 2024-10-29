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
var __importDefault =
    (this && this.__importDefault) ||
    function (mod) {
        return mod && mod.__esModule ? mod : { default: mod };
    };
Object.defineProperty(exports, '__esModule', { value: true });
const mongoose_1 = __importStar(require('mongoose'));
const validator_1 = __importDefault(require('validator'));
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'Email address is required'],
        unique: true,
        lowercase: true,
        validate: [
            validator_1.default.isEmail,
            'The email address you entered is not valid',
        ],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: [8, 'Your password needs to be at least 8 characters long'],
        validate: {
            validator: function (value) {
                return (
                    /[a-z]/.test(value) && // at least one lowercase letter
                    /[A-Z]/.test(value) && // at least one uppercase letter
                    /\d/.test(value) // at least one digit
                );
            },
            message:
                'Password must contain at least one lowercase letter, one uppercase letter, and one digit',
        },
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});
const User = mongoose_1.default.model('User', userSchema);
exports.default = User;
