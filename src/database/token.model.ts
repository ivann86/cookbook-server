import { Schema, model } from 'mongoose';
import { token } from 'morgan';

const tokenSchema = new Schema(
  {
    token: String,
    expireAt: Date,
  },
  { timestamps: true }
);

tokenSchema.index({ token: 1 });
tokenSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });

export const Token = model('Token', tokenSchema);
