import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import User from '../models/User';
import Property from '../models/Property';
import Order from '../models/Order';
import { markOrderPaid } from '../services/orderService';

export const dashboardStats = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const [totalUsers, totalProperties, pendingProperties] = await Promise.all([
      User.countDocuments(),
      Property.countDocuments(),
      Property.countDocuments({ status: 'pending' })
    ]);
    res.json({ totalUsers, totalProperties, pendingProperties });
  } catch (error) {
    next(error);
  }
};

export const listUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const toggleUserStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw createHttpError(404, 'User not found');
    user.status = user.status === 'active' ? 'locked' : 'active';
    await user.save();
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const markOrderPaidHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.authUser) throw createHttpError(401, 'Not authenticated');
    const order = await markOrderPaid(req.params.id, req.authUser.userId);
    res.json(order);
  } catch (error) {
    next(error);
  }
};

export const listOrders = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const orders = await Order.find().populate('user', 'name email').populate('package');
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

