import { env } from '../config/env.js';
import { connectDB, disconnectDB } from '../config/db.js';
import Food from '../models/Food.js';

const IMG = {
  starters: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
  mains: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
  pizza: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
  burgers: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
  desserts: 'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=800&q=80',
  drinks: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=800&q=80',
};

const MENU = [
  { name: 'Garlic Bruschetta', description: 'Toasted sourdough with garlic, ripe tomatoes and fresh basil.', price: 6.5, category: 'Starters', image: IMG.starters, isVegetarian: true, isPopular: true },
  { name: 'Crispy Calamari', description: 'Lightly fried squid rings served with lemon aioli.', price: 9.5, category: 'Starters', image: IMG.starters },
  { name: 'Caprese Salad', description: 'Fresh mozzarella, heirloom tomatoes and basil with balsamic glaze.', price: 8, category: 'Starters', image: IMG.starters, isVegetarian: true },
  { name: 'Seasonal Pumpkin Soup', description: 'Roasted pumpkin with cream and toasted seeds.', price: 7, category: 'Starters', image: IMG.starters, isVegetarian: true, isAvailable: false },
  { name: 'Grilled Chicken with Saffron Rice', description: 'Herb-marinated chicken breast with saffron rice and seasonal vegetables.', price: 16.5, category: 'Mains', image: IMG.mains, isPopular: true },
  { name: 'Herb-Crusted Salmon', description: 'Oven-baked salmon with a herb crust, lemon butter and steamed greens.', price: 19, category: 'Mains', image: IMG.mains },
  { name: 'Creamy Alfredo Fettuccine', description: 'Fettuccine tossed in parmesan cream sauce with fresh parsley.', price: 13.5, category: 'Mains', image: IMG.mains, isVegetarian: true },
  { name: 'Chicken Biryani', description: 'Fragrant basmati rice layered with spiced chicken and caramelized onions.', price: 15, category: 'Mains', image: IMG.mains },
  { name: 'Margherita Pizza', description: 'San Marzano tomato, fresh mozzarella and basil on a thin crust.', price: 12, category: 'Pizza', image: IMG.pizza, isVegetarian: true, isPopular: true },
  { name: 'Pepperoni Pizza', description: 'Tomato sauce, mozzarella and crispy pepperoni.', price: 13.5, category: 'Pizza', image: IMG.pizza },
  { name: 'Four Cheese Pizza', description: 'A blend of mozzarella, gorgonzola, parmesan and fontina.', price: 13, category: 'Pizza', image: IMG.pizza, isVegetarian: true },
  { name: 'Classic Cheeseburger', description: 'Beef patty, aged cheddar, pickles and house sauce on a brioche bun.', price: 11, category: 'Burgers', image: IMG.burgers, isPopular: true },
  { name: 'Veggie Burger', description: 'Chickpea and herb patty with avocado, lettuce and tomato.', price: 10.5, category: 'Burgers', image: IMG.burgers, isVegetarian: true },
  { name: 'Chocolate Lava Cake', description: 'Warm dark chocolate cake with a molten center and vanilla ice cream.', price: 7.5, category: 'Desserts', image: IMG.desserts, isVegetarian: true, isPopular: true },
  { name: 'New York Cheesecake', description: 'Creamy classic cheesecake with a buttery biscuit base.', price: 6.5, category: 'Desserts', image: IMG.desserts, isVegetarian: true },
  { name: 'Fresh Lemonade', description: 'Freshly squeezed lemons with mint and a touch of honey.', price: 4, category: 'Drinks', image: IMG.drinks, isVegetarian: true },
  { name: 'Mango Lassi', description: 'Chilled yogurt drink blended with ripe mango.', price: 4.5, category: 'Drinks', image: IMG.drinks, isVegetarian: true },
  { name: 'Iced Latte', description: 'Double espresso over milk and ice.', price: 4.75, category: 'Drinks', image: IMG.drinks, isVegetarian: true },
];

async function seed() {
  await connectDB(env.mongoUri);

  let inserted = 0;
  for (const item of MENU) {
    // Items are matched by name, so running the script again never creates duplicates.
    const exists = await Food.exists({ name: item.name });
    if (!exists) {
      await Food.create(item);
      inserted += 1;
    }
  }

  console.log(`Seed complete: ${inserted} added, ${MENU.length - inserted} already existed.`);
  await disconnectDB();
}

seed().catch(async (error) => {
  console.error('Seed failed:', error.message);
  await disconnectDB();
  process.exit(1);
});