import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import { createOrder } from '../services/orderService';
import Order from '../models/Order';

export const createOrderHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.authUser) throw createHttpError(401, 'Not authenticated');
    const order = await createOrder(req.authUser.userId, req.body.packageSlug);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

export const myOrdersHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.authUser) throw createHttpError(401, 'Not authenticated');
    const orders = await Order.find({ user: req.authUser.userId }).populate('package');
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

