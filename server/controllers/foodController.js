import Food from '../models/Food.js';
import ApiError from '../utils/ApiError.js';

const SORT_MAP = {
  newest: { createdAt: -1 },
  'price-asc': { price: 1 },
  'price-desc': { price: -1 },
  name: { name: 1 },
};

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export async function listFoods(req, res) {
  const { page = 1, limit = 12, search, category, featured, sort = 'name' } = req.query;

  const filter = { isAvailable: true };

  if (search) {
    const pattern = new RegExp(escapeRegex(search), 'i');
    filter.$or = [{ name: pattern }, { description: pattern }, { category: pattern }];
  }
  if (category) filter.category = category;
  if (featured) filter.isPopular = true;

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Food.find(filter).sort(SORT_MAP[sort]).skip(skip).limit(limit).lean(),
    Food.countDocuments(filter),
  ]);

  res.json({
    success: true,
    message: 'Foods fetched successfully',
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.max(Math.ceil(total / limit), 1),
    },
  });
}

export async function getFoodById(req, res) {
  const food = await Food.findOne({ _id: req.params.id, isAvailable: true }).lean();
  if (!food) throw new ApiError(404, 'Food item not found');

  res.json({ success: true, message: 'Food fetched successfully', data: food });
}