import { Request, Response, NextFunction } from 'express';
import createHttpError from 'http-errors';
import Chat, { Message } from '../models/Chat';
import Property from '../models/Property';
import User from '../models/User';

// Lấy hoặc tạo chat giữa 2 người về một property
export const getOrCreateChat = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.authUser) throw createHttpError(401, 'Not authenticated');
    
    const { propertyId } = req.params;
    const property = await Property.findById(propertyId).populate('owner');
    if (!property) throw createHttpError(404, 'Property not found');
    
    const ownerId = (property.owner as any)._id.toString();
    const currentUserId = req.authUser.userId;
    
    // Không cho phép chat với chính mình
    if (ownerId === currentUserId) {
      throw createHttpError(400, 'Cannot chat with yourself');
    }
    
    // Tìm chat đã tồn tại
    let chat = await Chat.findOne({
      property: propertyId,
      participants: { $all: [ownerId, currentUserId] }
    });
    
    // Nếu chưa có, tạo mới
    if (!chat) {
      chat = await Chat.create({
        participants: [ownerId, currentUserId],
        property: propertyId
      });
    }
    
    await chat.populate('participants', 'name email avatar');
    await chat.populate('property', 'title location price images');
    
    res.json(chat);
  } catch (error) {
    next(error);
  }
};

// Lấy thông tin một chat theo ID
export const getChatById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.authUser) throw createHttpError(401, 'Not authenticated');
    
    const { chatId } = req.params;
    const chat = await Chat.findById(chatId);
    
    if (!chat) throw createHttpError(404, 'Chat not found');
    
    // Kiểm tra user có trong participants không
    if (!chat.participants.includes(req.authUser.userId as any)) {
      throw createHttpError(403, 'Not authorized to view this chat');
    }
    
    await chat.populate('participants', 'name email avatar');
    await chat.populate('property', 'title location price images');
    
    res.json(chat);
  } catch (error) {
    next(error);
  }
};

// Lấy danh sách chat của user
export const getMyChats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.authUser) throw createHttpError(401, 'Not authenticated');
    
    const chats = await Chat.find({
      participants: req.authUser.userId
    })
      .populate('participants', 'name email avatar')
      .populate('property', 'title location price images')
      .sort({ lastMessageAt: -1, updatedAt: -1 });
    
    // Đếm số tin nhắn chưa đọc cho mỗi chat
    const userId = req.authUser.userId;
    const chatsWithUnread = await Promise.all(
      chats.map(async (chat) => {
        const unreadCount = await Message.countDocuments({
          chat: chat._id,
          sender: { $ne: userId },
          read: false
        });
        return {
          ...chat.toObject(),
          unreadCount
        };
      })
    );
    
    res.json(chatsWithUnread);
  } catch (error) {
    next(error);
  }
};

// Lấy messages của một chat
export const getMessages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.authUser) throw createHttpError(401, 'Not authenticated');
    
    const { chatId } = req.params;
    const chat = await Chat.findById(chatId);
    
    if (!chat) throw createHttpError(404, 'Chat not found');
    
    // Kiểm tra user có trong participants không
    if (!chat.participants.includes(req.authUser.userId as any)) {
      throw createHttpError(403, 'Not authorized to view this chat');
    }
    
    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'name email avatar')
      .sort({ createdAt: 1 })
      .limit(100);
    
    // Đánh dấu messages là đã đọc
    await Message.updateMany(
      { chat: chatId, sender: { $ne: req.authUser.userId }, read: false },
      { read: true }
    );
    
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

// Gửi message
export const sendMessage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.authUser) throw createHttpError(401, 'Not authenticated');
    
    const { chatId } = req.params;
    const { content } = req.body;
    
    if (!content || !content.trim()) {
      throw createHttpError(400, 'Message content is required');
    }
    
    const chat = await Chat.findById(chatId);
    if (!chat) throw createHttpError(404, 'Chat not found');
    
    // Kiểm tra user có trong participants không
    if (!chat.participants.includes(req.authUser.userId as any)) {
      throw createHttpError(403, 'Not authorized to send message in this chat');
    }
    
    // Tạo message
    const message = await Message.create({
      chat: chatId,
      sender: req.authUser.userId,
      content: content.trim()
    });
    
    // Cập nhật lastMessage của chat
    chat.lastMessage = content.trim();
    chat.lastMessageAt = new Date();
    await chat.save();
    
    await message.populate('sender', 'name email avatar');
    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};
