import { Schema, model } from 'mongoose';
import { breed, category, label, location } from './cow.constant';
import { ICow, ICowModel } from './cow.interface';

const cowSchema = new Schema<ICow, ICowModel>(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    price: { type: Number, required: true },
    location: { type: String, enum: location, required: true },
    breed: { type: String, enum: breed, required: true },
    weight: { type: Number, required: true },
    label: { type: String, enum: label, required: true },
    category: { type: String, enum: category, required: true },
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export const Cow = model<ICow, ICowModel>('Cow', cowSchema);
