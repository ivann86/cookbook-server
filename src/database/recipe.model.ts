import { Schema, model } from 'mongoose';

const recipeSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  imgUrl: String,
  ingredients: [
    {
      name: String,
      quantity: Number,
      units: String,
    },
  ],
  steps: [String],
  prepTime: Number,
  portions: Number,
  nationality: String,
  mealTypes: [String],
  tags: [String],
});

export const Recipe = model<Recipe>('Recipe', recipeSchema);
