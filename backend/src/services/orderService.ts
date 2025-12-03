import createHttpError from 'http-errors';
import Order from '../models/Order';
import Package from '../models/Package';
import User from '../models/User';

export const createOrder = async (userId: string, packageSlug: string) => {
  const pkg = await Package.findOne({ slug: packageSlug, isActive: true });
  if (!pkg) throw createHttpError(404, 'Package not found');

  const order = await Order.create({
    user: userId,
    package: pkg._id,
    amount: pkg.price
  });
  return order.populate('package');
};

export const markOrderPaid = async (orderId: string, staffId: string) => {
  const order = await Order.findById(orderId).populate('package');
  if (!order) throw createHttpError(404, 'Order not found');
  if (order.status === 'paid') return order;

  const pkg = await Package.findById(order.package);
  if (!pkg) throw createHttpError(404, 'Package missing');

  const user = await User.findById(order.user);
  if (!user) throw createHttpError(404, 'User missing');

  order.status = 'paid';
  order.markedBy = staffId;
  await order.save();

  user.paidListingsRemaining += pkg.listingCredits;
  await user.save();

  return order;
};

