import Joi from 'joi';

const userSchema = Joi.object({
  id: Joi.string().uuid(),
  username: Joi.string().min(4).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
});

export function validate(user: User | null) {
  const { value, error } = userSchema.validate(user);
  if (error) {
    throw error;
  }

  return value;
}
