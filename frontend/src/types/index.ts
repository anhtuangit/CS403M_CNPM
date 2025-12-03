export type UserRole = 'user' | 'staff' | 'admin';

export type PropertyStatus = 'pending' | 'approved' | 'rejected' | 'sold';

export interface User {
  _id?: string;
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  freeListingsRemaining: number;
  paidListingsRemaining: number;
  status: 'active' | 'locked';
}

export interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  priceUnit?: 'million' | 'billion';
  listingType?: 'sell' | 'rent';
  location: string;
  propertyType: string;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  floors?: number;
  images: string[];
  status: PropertyStatus;
  rejectionReason?: string;
  metadata?: {
    facing?: string;
    amenities?: string[];
    legal?: string;
  };
  owner?: User | {
    _id?: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
  createdAt?: string;
}

export interface PackagePlan {
  _id: string;
  name: string;
  slug: string;
  price: number;
  listingCredits: number;
  description: string;
}

export interface Order {
  _id: string;
  amount: number;
  status: 'pending' | 'paid' | 'cancelled';
  package: PackagePlan;
  createdAt: string;
  user?: Pick<User, 'id' | 'email' | 'name'>;
}

export interface Chat {
  _id: string;
  participants: User[];
  property: Property;
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  chat: string;
  sender: User;
  content: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApiState<T> {
  data: T;
  loading: boolean;
  error?: string;
}
