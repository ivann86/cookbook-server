import Joi from 'joi';
import { ValidationError } from '../errors';

// Ingredient schema
const ingredientSchema = Joi.object({
  name: Joi.string().trim().min(1).message('Ingredient name cannot be empty'),
  quantity: Joi.number().positive().message('Ingredient quantity must be a positive number'),
  units: Joi.string().trim().min(1).message('Ingredient quantity units cannot be empty'),
}).options({ abortEarly: false, stripUnknown: { arrays: true, objects: true } });

// Recipe schema
const recipeSchema = Joi.object({
  id: Joi.string().trim().lowercase().uuid().message('ID must be a valid UUID').required(),
  name: Joi.string().trim().min(3).message('Name must be at least 3 characters long').required(),
  imgUrl: Joi.string().trim().uri().message('Image must be a valid url'),
  ingredients: Joi.array().items(ingredientSchema).required(),
  steps: Joi.array().items(Joi.string().trim().min(3).message('Cooking step must be at least 3 characters long')),
  prepTime: Joi.number().positive().min(1).message('Cooking time must be more than 1 second'),
  portions: Joi.number().positive().min(1).message('Meal cannot be less than 1 portion'),
  nationality: Joi.string().trim(),
  mealTypes: Joi.array().items(Joi.string()),
  tags: Joi.array().items(Joi.string()),
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
