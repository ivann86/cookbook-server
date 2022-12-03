import { Schema, model } from 'mongoose';

const recipeSchema = new Schema({
  _id: String,
  name: { type: String, required: true },
  imgUrl: String,
  ingredients: [{ name: String, quantity: Number, units: String }],
  steps: [String],
  prepTime: Number,
  portions: Number,
  nationality: String,
  mealTypes: [String],
  tags: [String],
})
  .set('toJSON', { virtuals: true })
  .set('toObject', { virtuals: true });

export const Recipe = model<Recipe>('Recipe', recipeSchema);
