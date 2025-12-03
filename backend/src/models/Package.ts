import { Schema, model, Document } from 'mongoose';

export interface IPackage extends Document {
  name: string;
  slug: string;
  price: number;
  listingCredits: number;
  description: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const packageSchema = new Schema<IPackage>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    price: { type: Number, required: true },
    listingCredits: { type: Number, required: true },
    description: { type: String },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

packageSchema.index({ slug: 1 });

const Package = model<IPackage>('Package', packageSchema);

export default Package;

