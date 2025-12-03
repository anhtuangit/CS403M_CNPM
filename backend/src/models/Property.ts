import { Schema, model, Document, Types } from 'mongoose';

export type PropertyStatus = 'pending' | 'approved' | 'rejected' | 'sold';

export interface IProperty extends Document {
  owner: Types.ObjectId;
  title: string;
  description: string;
  price: number;
  priceUnit: 'million' | 'billion';
  listingType: 'sell' | 'rent';
  location: string;
  propertyType: 'apartment' | 'house' | 'land' | 'villa' | 'other';
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  floors?: number;
  images: string[];
  status: PropertyStatus;
  rejectionReason?: string;
  approvedAt?: Date;
  metadata: {
    amenities: string[];
    facing?: string;
    legal?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const propertySchema = new Schema<IProperty>(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    priceUnit: { type: String, enum: ['million', 'billion'], default: 'million' },
    listingType: { type: String, enum: ['sell', 'rent'], default: 'sell' },
    location: { type: String, required: true, trim: true },
    propertyType: {
      type: String,
      enum: ['apartment', 'house', 'land', 'villa', 'other'],
      default: 'house'
    },
    area: { type: Number, required: true, min: 0 },
    bedrooms: { type: Number, min: 0 },
    bathrooms: { type: Number, min: 0 },
    floors: { type: Number, min: 0 },
    images: { type: [String], default: [] },
    status: { type: String, enum: ['pending', 'approved', 'rejected', 'sold'], default: 'pending' },
    rejectionReason: { type: String },
    approvedAt: { type: Date },
    metadata: {
      amenities: { type: [String], default: [] },
      facing: { type: String },
      legal: { type: String }
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

propertySchema.index({ title: 'text', description: 'text', location: 'text' });
propertySchema.index({ location: 1, price: 1, propertyType: 1, area: 1, status: 1 });

propertySchema.virtual('ownerInfo', {
  ref: 'User',
  localField: 'owner',
  foreignField: '_id',
  justOne: true,
  options: { select: 'name email phone role' }
});

const Property = model<IProperty>('Property', propertySchema);

export default Property;

