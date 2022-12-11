import Joi from 'joi';
import { ValidationError } from '../errors';

const recipeOwnerSchema = Joi.object({
  id: Joi.string().trim().lowercase().uuid().message('ID must be a valid UUID').required(),
  email: Joi.string().trim().lowercase().email().message('Invalid owner e-mail address').required(),
  firstName: Joi.string().trim(),
  lastName: Joi.string().trim(),
}).options({ abortEarly: false, stripUnknown: { arrays: true, objects: true } });

// Ingredient schema
const ingredientSchema = Joi.object({
  name: Joi.string().trim().min(1).message('Ingredient name cannot be empty'),
  // quantity: Joi.number().positive().message('Ingredient quantity must be a positive number'),
  quantity: Joi.string(),
  units: Joi.string().trim().min(1).message('Ingredient quantity units cannot be empty'),
}).options({ abortEarly: false, stripUnknown: { arrays: true, objects: true } });

// Recipe schema
const recipeSchema = Joi.object({
  id: Joi.string().trim().lowercase().uuid().message('ID must be a valid UUID').required(),
  name: Joi.string()
    .trim()
    .custom((name) => name.replace(/[\n\t]/g, ' ').replace(/\s{2,}/g, ' '))
    .min(3)
    .message('Name must be at least 3 characters long')
    .required(),
  slug: Joi.string().trim().min(3).message('Name must be at least 3 characters long').required(),
  imgUrl: Joi.string().trim().uri({ allowRelative: true }).message('Image must be a valid url'),
  imgSmallUrl: Joi.string().trim().uri({ allowRelative: true }).message('Image must be a valid url'),
  description: Joi.string()
    .trim()
    .allow(null, '')
    .max(2500)
    .message('Maximum length for description is 2500 characters'),
  ingredients: Joi.array().items(ingredientSchema).required(),
  steps: Joi.array().items(Joi.string().trim().min(3).message('Cooking step must be at least 3 characters long')),
  prepTime: Joi.number().min(0).message('Cooking time must be at least 0 or more minutes'),
  portions: Joi.number().allow(null).positive().min(1).message('Meal cannot be less than 1 portion'),
  country: Joi.string().trim().allow(null, ''),
  categories: Joi.array().items(Joi.string()),
  tags: Joi.array().items(Joi.string()),
  createdAt: Joi.date(),
  updatedAt: Joi.date(),
  owner: Joi.alternatives()
    .try(Joi.string().trim().lowercase().uuid().message('ID must be a valid UUID').required(), recipeOwnerSchema)
    .required(),
}).options({ abortEarly: false, stripUnknown: { arrays: true, objects: true } });

export function validateIngredient(ingredient: Ingredient) {
  return validate(ingredient, ingredientSchema);
}

export function validateRecipe(recipe: Recipe) {
  return validate(recipe, recipeSchema);
}

function validate(value: any, schema: Joi.Schema) {
  const result = schema.validate(value);

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
