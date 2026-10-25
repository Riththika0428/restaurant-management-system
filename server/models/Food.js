import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 500 },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, trim: true, default: '' },
    category: { type: String, required: true, trim: true },
    isAvailable: { type: Boolean, default: true },
    isVegetarian: { type: Boolean, default: false },
    isPopular: { type: Boolean, default: false },
  },
  { timestamps: true }
);

foodSchema.index({ isAvailable: 1, category: 1, name: 1 });
foodSchema.index({ isAvailable: 1, isPopular: 1 });

export default mongoose.model('Food', foodSchema);