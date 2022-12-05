import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    _id: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: String,
    lastName: String,
  },
  { timestamps: true }
)
  .set('toJSON', { virtuals: true })
  .set('toObject', { virtuals: true });

export const User = model<User>('User', userSchema);
