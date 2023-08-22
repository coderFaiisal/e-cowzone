import { Schema, model } from 'mongoose';
import { Breed, Category, Label, Location } from './cow.constant';
import { ICow, ICowModel } from './cow.interface';

const cowSchema = new Schema<ICow, ICowModel>(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    price: { type: Number, required: true },
    location: { type: String, enum: Location, required: true },
    breed: { type: String, enum: Breed, required: true },
    weight: { type: Number, required: true },
    label: { type: String, enum: Label, required: true },
    category: { type: String, enum: Category, required: true },
    seller: { type: Schema.Types.ObjectId, required: true },
  },
  {
    timestamps: true,
  },
);

export const Cow = model<ICow, ICowModel>('Cow', cowSchema);
