import { create } from 'domain';
import Joi from 'joi';
import { ValidationError } from '../errors';

const firstNameSchema = Joi.string().trim();
const lastNameSchema = Joi.string().trim();

const emailSchema = Joi.string()
  .trim()
  .lowercase()
  .email()
  .message('Invalid e-mail address')
  .required();

const passwordSchema = Joi.string()
  .min(6)
  .message('The password must be minimum 6 characters long')
  .regex(/^(?=.*\d)(?=.*[a-z]).*$/)
  .message('The password must include both letters and numbers');

const userRegistrationSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: firstNameSchema,
  lastName: lastNameSchema,
});

const userAuthenticationSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema,
});

const userSchema = Joi.object({
  id: Joi.string()
    .trim()
    .lowercase()
    .uuid()
    .message('User id must be a valid UUID string'),
  email: emailSchema,
  password: passwordSchema,
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
});

export function validateUser(user: User) {
  return validate(user, userSchema);
}

export function validateUserRegistrationData(newUser: UserRegistrationData) {
  return validate(newUser, userRegistrationSchema);
}

export function validateUserCredentials(credentials: UserCredentials) {
  return validate(credentials, userAuthenticationSchema);
}

export function validateEmail(email: string) {
  return validate(email, emailSchema);
}

export function validatePassword(password: string) {
  return validate(password, passwordSchema);
}

function validate(
  value: User | UserRegistrationData | UserCredentials | string,
  schema: Joi.Schema
) {
  const result = schema.validate(value, {
    abortEarly: false,
  });

  if (result.error) {
    const validationError = new ValidationError(result.error.message);
    validationError.details = result.error.details.map((item) => ({
      field: item.path[0].toString() || '',
      message: item.message,
    }));

    throw validationError;
  }

  return result.value;
}
