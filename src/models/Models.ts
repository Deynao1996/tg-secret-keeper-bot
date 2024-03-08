import mongoose from 'mongoose'
import { TRY_COUNT } from '../store/data.js'

const userSchema = new mongoose.Schema(
  {
    chatId: {
      type: String,
      required: true
    },
    firstName: {
      type: String
    },
    lastName: {
      type: String
    },
    userName: {
      type: String
    },
    tryCount: {
      type: Number,
      default: TRY_COUNT
    }
  },
  { timestamps: true }
)

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: String,
      required: true
    },
    message: {
      type: String
    },
    reason: {
      type: String,
      enum: ['contact', 'callback']
    }
  },
  { timestamps: true }
)

export const User = mongoose.models?.User || mongoose.model('User', userSchema)
export const Message =
  mongoose.models?.Message || mongoose.model('Message', messageSchema)
