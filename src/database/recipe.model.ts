import { Schema, model } from 'mongoose';

const recipeSchema = new Schema(
  {
    _id: String,
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    imgUrl: String,
    imgSmallUrl: String,
    description: String,
    ingredients: [{ name: String, quantity: String, units: String }],
    steps: [String],
    prepTime: Number,
    portions: Number,
    country: String,
    categories: [String],
    tags: [String],
    owner: {
      type: String,
      ref: 'User',
    },
  },
  { timestamps: true }
)
  .set('toJSON', { virtuals: true })
  .set('toObject', { virtuals: true });

recipeSchema.pre(/find/, function (next) {
  this.populate('owner');
  next();
});

export const Recipe = model<Recipe>('Recipe', recipeSchema);
