import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import createHttpError from 'http-errors';
import {
  createProperty,
  deleteProperty,
  getPropertyById,
  listMyProperties,
  listProperties,
  moderateProperty,
  updateProperty
} from '../services/propertyService';
import { PropertyStatus } from '../models/Property';
import { sendMail } from '../services/mailService';
import propertyStatusTemplate from '../emails/propertyStatusTemplate';
import { getImageUrl } from '../middleware/uploadMiddleware';

export const createPropertyHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.authUser) throw createHttpError(401, 'Not authenticated');
    
    // Xử lý file upload: lấy danh sách URL từ files
    const imageUrls: string[] = [];
    if (req.files && Array.isArray(req.files)) {
      imageUrls.push(...req.files.map((file: Express.Multer.File) => getImageUrl(file.filename)));
    }
    
    // Parse body (có thể là JSON hoặc form-data)
    const payload: any = {
      title: req.body.title,
      description: req.body.description,
      price: Number(req.body.price),
      priceUnit: req.body.priceUnit || 'million',
      listingType: req.body.listingType || 'sell',
      location: req.body.location,
      propertyType: req.body.propertyType,
      area: Number(req.body.area),
      images: imageUrls.length > 0 ? imageUrls : (Array.isArray(req.body.images) ? req.body.images : [])
    };
    
    // Optional fields
    if (req.body.bedrooms) payload.bedrooms = Number(req.body.bedrooms);
    if (req.body.bathrooms) payload.bathrooms = Number(req.body.bathrooms);
    if (req.body.floors) payload.floors = Number(req.body.floors);
    if (req.body.facing) {
      payload.metadata = { ...payload.metadata, facing: req.body.facing };
    }
    
    // Validation cơ bản
    if (!payload.title || payload.title.length < 5) {
      return next(createHttpError(400, 'Tiêu đề phải có ít nhất 5 ký tự'));
    }
    if (!payload.description || payload.description.length < 20) {
      return next(createHttpError(400, 'Mô tả phải có ít nhất 20 ký tự'));
    }
    if (!payload.price || payload.price <= 0) {
      return next(createHttpError(400, 'Giá phải lớn hơn 0'));
    }
    if (!payload.location) {
      return next(createHttpError(400, 'Địa điểm là bắt buộc'));
    }
    if (!payload.area || payload.area <= 0) {
      return next(createHttpError(400, 'Diện tích phải lớn hơn 0'));
    }
    
    const property = await createProperty(payload, req.authUser.userId);
    res.status(201).json(property);
  } catch (error) {
    next(error);
  }
};

export const listPropertiesHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(createHttpError(400, 'Invalid filters'));
    const requestedStatus = req.query.status as PropertyStatus | undefined;
    if (
      requestedStatus &&
      requestedStatus !== 'approved' &&
      (!req.authUser || !['admin', 'staff'].includes(req.authUser.role))
    ) {
      return next(createHttpError(403, 'Chỉ staff/admin mới xem được trạng thái này'));
    }
    const properties = await listProperties(
      {
        location: req.query.location as string | undefined,
        propertyType: req.query.propertyType as string | undefined,
        status: req.query.status as any,
        listingType: req.query.listingType as string | undefined,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        q: req.query.q as string | undefined
      },
      req.authUser?.role
    );
    res.json(properties);
  } catch (error) {
    next(error);
  }
};

export const myPropertiesHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.authUser) throw createHttpError(401, 'Not authenticated');
    const properties = await listMyProperties(req.authUser.userId);
    res.json(properties);
  } catch (error) {
    next(error);
  }
};

export const getPropertyHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const property = await getPropertyById(req.params.id);
    res.json(property);
  } catch (error) {
    next(error);
  }
};

export const updatePropertyHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.authUser) throw createHttpError(401, 'Not authenticated');
    
    // Xử lý file upload nếu có
    const imageUrls: string[] = [];
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      imageUrls.push(...req.files.map((file: Express.Multer.File) => getImageUrl(file.filename)));
    }
    
    const payload: any = {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price ? Number(req.body.price) : undefined,
      priceUnit: req.body.priceUnit,
      listingType: req.body.listingType,
      location: req.body.location,
      propertyType: req.body.propertyType,
      area: req.body.area ? Number(req.body.area) : undefined
    };
    
    // Optional fields
    if (req.body.bedrooms !== undefined) payload.bedrooms = Number(req.body.bedrooms);
    if (req.body.bathrooms !== undefined) payload.bathrooms = Number(req.body.bathrooms);
    if (req.body.floors !== undefined) payload.floors = Number(req.body.floors);
    if (req.body.facing) {
      payload.metadata = { ...(payload.metadata || {}), facing: req.body.facing };
    }
    
    // Nếu có ảnh mới upload, thay thế hoàn toàn danh sách ảnh
    // Nếu không có ảnh mới, giữ nguyên ảnh cũ (không gửi field images)
    if (imageUrls.length > 0) {
      payload.images = imageUrls;
    }
    // Nếu không có ảnh mới và không có field images trong body, giữ nguyên ảnh cũ
    
    // Loại bỏ undefined
    Object.keys(payload).forEach((key) => payload[key] === undefined && delete payload[key]);
    
    const property = await updateProperty(req.params.id, payload, req.authUser.userId, req.authUser.role);
    res.json(property);
  } catch (error) {
    next(error);
  }
};

export const deletePropertyHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.authUser) throw createHttpError(401, 'Not authenticated');
    await deleteProperty(req.params.id, req.authUser.userId, req.authUser.role);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const approvePropertyHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const property = await moderateProperty(req.params.id, 'approved');
    await sendMail({
      to: (property.owner as any).email,
      subject: 'Tin đăng của bạn đã được duyệt',
      html: propertyStatusTemplate({
        name: (property.owner as any).name,
        title: property.title,
        status: 'approved'
      })
    });
    res.json(property);
  } catch (error) {
    next(error);
  }
};

export const rejectPropertyHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reason = req.body.reason ?? 'Thông tin chưa đầy đủ';
    const property = await moderateProperty(req.params.id, 'rejected', reason);
    await sendMail({
      to: (property.owner as any).email,
      subject: 'Tin đăng cần chỉnh sửa',
      html: propertyStatusTemplate({
        name: (property.owner as any).name,
        title: property.title,
        status: 'rejected',
        reason
      })
    });
    res.json(property);
  } catch (error) {
    next(error);
  }
};

