import Food from '../models/Food.js';
import ApiError from '../utils/ApiError.js';

const SORT_MAP = {
  newest: { createdAt: -1 },
  'price-asc': { price: 1 },
  'price-desc': { price: -1 },
  name: { name: 1 },
};

const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const readString = (value, maxLength) =>
  typeof value === 'string' ? value.trim().slice(0, maxLength) : '';

export async function listFoods(req, res) {
  // Parse each query value explicitly so behavior does not depend on Express version details.
  const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 12, 1), 50);
  const search = readString(req.query.search, 100);
  const category = readString(req.query.category, 50);
  const featured = req.query.featured === 'true';
  const sort = Object.hasOwn(SORT_MAP, req.query.sort) ? req.query.sort : 'name';

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