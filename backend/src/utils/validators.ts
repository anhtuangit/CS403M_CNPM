import { body, query } from 'express-validator';

export const googleAuthValidator = [body('idToken').isString().notEmpty()];

export const propertyCreateValidator = [
  body('title').isString().isLength({ min: 5 }),
  body('description').isString().isLength({ min: 20 }),
  body('price').isNumeric().toFloat(),
  body('location').isString().notEmpty(),
  body('propertyType').isString().isIn(['apartment', 'house', 'land', 'villa', 'other']),
  body('area').isNumeric().toFloat(),
  body('images').optional().isArray()
];

export const propertyFilterValidator = [
  query('location').optional().isString(),
  query('status').optional().isIn(['pending', 'approved', 'rejected', 'sold']),
  query('propertyType').optional().isIn(['apartment', 'house', 'land', 'villa', 'other']),
  query('minPrice').optional().isNumeric(),
  query('maxPrice').optional().isNumeric()
];

