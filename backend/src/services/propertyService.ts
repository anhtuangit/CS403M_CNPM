import createHttpError from 'http-errors';
import Property, { IProperty, PropertyStatus } from '../models/Property';
import User from '../models/User';

interface PropertyFilters {
  location?: string;
  propertyType?: string;
  status?: PropertyStatus;
  minPrice?: number;
  maxPrice?: number;
  listingType?: string;
  q?: string;
}

export const createProperty = async (payload: Partial<IProperty>, userId: string) => {
  const user = await User.findById(userId);
  if (!user) throw createHttpError(404, 'User not found');
  if (user.status === 'locked') throw createHttpError(403, 'Account locked');

  if (user.freeListingsRemaining <= 0 && user.paidListingsRemaining <= 0) {
    throw createHttpError(402, 'Need to purchase package for more listings');
  }

  const property = await Property.create({
    ...payload,
    owner: userId,
    status: 'pending'
  });

  if (user.freeListingsRemaining > 0) {
    user.freeListingsRemaining -= 1;
  } else {
    user.paidListingsRemaining -= 1;
  }
  await user.save();

  return property;
};

export const listProperties = async (filters: PropertyFilters, currentUserRole?: string) => {
  const query: Record<string, any> = {};
  if (filters.location) query.location = new RegExp(filters.location, 'i');
  if (filters.propertyType) query.propertyType = filters.propertyType;
  if (filters.status) query.status = filters.status;
  if (filters.listingType) query.listingType = filters.listingType;
  if (filters.minPrice || filters.maxPrice) {
    query.price = {};
    if (filters.minPrice) query.price.$gte = filters.minPrice;
    if (filters.maxPrice) query.price.$lte = filters.maxPrice;
  }
  if (!filters.status && currentUserRole !== 'admin' && currentUserRole !== 'staff') {
    query.status = 'approved';
  }
  if (filters.q) {
    query.$text = { $search: filters.q };
  }

  return Property.find(query).sort({ createdAt: -1 }).populate('owner', 'name email phone role');
};

export const listMyProperties = async (ownerId: string) => {
  return Property.find({ owner: ownerId }).sort({ createdAt: -1 });
};

export const getPropertyById = async (id: string) => {
  const property = await Property.findById(id).populate('owner', 'name email phone avatar role');
  if (!property) throw createHttpError(404, 'Property not found');
  return property;
};

export const updateProperty = async (id: string, payload: Partial<IProperty>, userId: string, role: string) => {
  const property = await Property.findById(id);
  if (!property) throw createHttpError(404, 'Not found');
  if (role !== 'admin' && property.owner.toString() !== userId) {
    throw createHttpError(403, 'Cannot edit this property');
  }
  Object.assign(property, payload);
  property.status = 'pending';
  property.approvedAt = undefined;
  property.rejectionReason = undefined;
  await property.save();
  return property;
};

export const deleteProperty = async (id: string, userId: string, role: string) => {
  const property = await Property.findById(id);
  if (!property) throw createHttpError(404, 'Not found');
  if (role !== 'admin' && property.owner.toString() !== userId) {
    throw createHttpError(403, 'Cannot delete this property');
  }
  await property.deleteOne();
};

export const moderateProperty = async (id: string, status: PropertyStatus, reason?: string) => {
  if (!['approved', 'rejected'].includes(status)) {
    throw createHttpError(400, 'Invalid moderation status');
  }
  const property = await Property.findById(id).populate('owner', 'email name');
  if (!property) throw createHttpError(404, 'Property not found');
  property.status = status;
  property.rejectionReason = status === 'rejected' ? reason : undefined;
  property.approvedAt = status === 'approved' ? new Date() : undefined;
  await property.save();
  return property;
};

