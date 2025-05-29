import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReminderLog extends Document {
  clientId: Schema.Types.ObjectId;
  email: string;
  reminderType: string;
  message: string;
  sentAt: Date;
  status: string;
  error?: string;
}

const ReminderLogSchema = new Schema<IReminderLog>(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    reminderType: {
      type: String,
      enum: ['DOMAIN_EXPIRY'],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    sentAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['SENT', 'FAILED'],
      required: true,
    },
    error: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Check if model is already defined to prevent overwriting during hot reloads
const ReminderLog: Model<IReminderLog> = 
  mongoose.models.ReminderLog || 
  mongoose.model<IReminderLog>('ReminderLog', ReminderLogSchema);

export default ReminderLog; 