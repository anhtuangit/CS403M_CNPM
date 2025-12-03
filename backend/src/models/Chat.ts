import { Schema, model, Document, Types } from 'mongoose';

export interface IChat extends Document {
  participants: Types.ObjectId[];
  property: Types.ObjectId;
  lastMessage?: string;
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMessage extends Document {
  chat: Types.ObjectId;
  sender: Types.ObjectId;
  content: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const chatSchema = new Schema<IChat>(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
    property: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    lastMessage: { type: String },
    lastMessageAt: { type: Date }
  },
  {
    timestamps: true
  }
);

const messageSchema = new Schema<IMessage>(
  {
    chat: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, trim: true },
    read: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);

// Indexes
chatSchema.index({ participants: 1, property: 1 });
chatSchema.index({ lastMessageAt: -1 });
messageSchema.index({ chat: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });

const Chat = model<IChat>('Chat', chatSchema);
const Message = model<IMessage>('Message', messageSchema);

export default Chat;
export { Message };

