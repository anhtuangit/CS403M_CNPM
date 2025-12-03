import bcrypt from 'bcryptjs';
import { Schema, model, Document } from 'mongoose';

export type UserRole = 'user' | 'staff' | 'admin';

export interface IUser extends Document {
  name: string;
  email: string;
  googleId?: string;
  avatar?: string;
  password?: string;
  role: UserRole;
  status: 'active' | 'locked';
  phone?: string;
  freeListingsRemaining: number;
  paidListingsRemaining: number;
  lastFreeResetAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
  isAdmin: boolean;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    googleId: { type: String },
    avatar: { type: String },
    password: { type: String, select: false },
    role: { type: String, enum: ['user', 'staff', 'admin'], default: 'user' },
    status: { type: String, enum: ['active', 'locked'], default: 'active' },
    phone: { type: String },
    freeListingsRemaining: { type: Number, default: 3 },
    paidListingsRemaining: { type: Number, default: 0 },
    lastFreeResetAt: { type: Date }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

userSchema.index({ email: 1 });
userSchema.index({ name: 'text', email: 'text' });

userSchema.virtual('isAdmin').get(function (this: IUser) {
  return this.role === 'admin';
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  return next();
});

userSchema.methods.comparePassword = async function (candidate: string) {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

const User = model<IUser>('User', userSchema);

export default User;

