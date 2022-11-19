import Joi from 'joi';
import { ValidationError } from '../errors';

const userSchema = Joi.object({
  id: Joi.string().uuid(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
});

/**
 * Validates a User object's fields
 * @param user A User object to validate
 * @returns The User object on succesfull validation. Throws on validation error.
 */
export function validate(user: User | null) {
  const { value, error } = userSchema.validate(user, { abortEarly: false });
  if (error) {
    const validationError = new ValidationError(error.message);
    validationError.details = error.details.map((item) => ({
      path: item.path[0].toString() || '',
      message: item.message,
    }));
    throw validationError;
  }

  return value;
}
