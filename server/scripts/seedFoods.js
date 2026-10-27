import { env } from '../config/env.js';
import { connectDB, disconnectDB } from '../config/db.js';
import Food from '../models/Food.js';

// Each dish has its own photo. Verify the URLs load, then replace any that don't.
const img = (photoId) =>
  `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=800&q=80`;

const MENU = [
  // Starters
  { name: 'Garlic Bruschetta', description: 'Toasted sourdough with garlic, ripe tomatoes and fresh basil.', price: 6.5, category: 'Starters', image: img('1572695157366-5e585ab2b69f'), isVegetarian: true, isPopular: true },
  { name: 'Crispy Calamari', description: 'Lightly fried squid rings served with lemon aioli.', price: 9.5, category: 'Starters', image: img('1599487488170-d11ec9c172f0') },
  { name: 'Caprese Salad', description: 'Fresh mozzarella, heirloom tomatoes and basil with balsamic glaze.', price: 8, category: 'Starters', image: img('1608897013039-887f21d8c804'), isVegetarian: true },
  { name: 'Seasonal Pumpkin Soup', description: 'Roasted pumpkin with cream and toasted seeds.', price: 7, category: 'Starters', image: img('1476718406336-bb5a9690ee2a'), isVegetarian: true, isAvailable: false },

  // Mains
  { name: 'Grilled Chicken with Saffron Rice', description: 'Herb-marinated chicken breast with saffron rice and seasonal vegetables.', price: 16.5, category: 'Mains', image: img('1532550907401-a500c9a57435'), isPopular: true },
  { name: 'Herb-Crusted Salmon', description: 'Oven-baked salmon with a herb crust, lemon butter and steamed greens.', price: 19, category: 'Mains', image: img('1467003909585-2f8a72700288') },
  { name: 'Creamy Alfredo Fettuccine', description: 'Fettuccine tossed in parmesan cream sauce with fresh parsley.', price: 13.5, category: 'Mains', image: img('1645112411341-6c4fd023714a'), isVegetarian: true },
  { name: 'Chicken Biryani', description: 'Fragrant basmati rice layered with spiced chicken and caramelized onions.', price: 15, category: 'Mains', image: img('1563379091339-03b21ab4a4f8') },

  // Pizza
  { name: 'Margherita Pizza', description: 'San Marzano tomato, fresh mozzarella and basil on a thin crust.', price: 12, category: 'Pizza', image: img('1574071318508-1cdbad80ad38'), isVegetarian: true, isPopular: true },
  { name: 'Pepperoni Pizza', description: 'Tomato sauce, mozzarella and crispy pepperoni.', price: 13.5, category: 'Pizza', image: img('1628840042765-356cda07504e') },
  { name: 'Four Cheese Pizza', description: 'A blend of mozzarella, gorgonzola, parmesan and fontina.', price: 13, category: 'Pizza', image: img('1513104890138-7c749659a591'), isVegetarian: true },

  // Burgers
  { name: 'Classic Cheeseburger', description: 'Beef patty, aged cheddar, pickles and house sauce on a brioche bun.', price: 11, category: 'Burgers', image: img('1568901346375-23c9450c58cd'), isPopular: true },
  { name: 'Veggie Burger', description: 'Chickpea and herb patty with avocado, lettuce and tomato.', price: 10.5, category: 'Burgers', image: img('1550547660-d9450f859349'), isVegetarian: true },

  // Desserts
  { name: 'Chocolate Lava Cake', description: 'Warm dark chocolate cake with a molten center and vanilla ice cream.', price: 7.5, category: 'Desserts', image: img('1624353365286-3f8d62daaf51'), isVegetarian: true, isPopular: true },
  { name: 'New York Cheesecake', description: 'Creamy classic cheesecake with a buttery biscuit base.', price: 6.5, category: 'Desserts', image: img('1533134242443-d4fd215305ad'), isVegetarian: true },

  // Drinks
  { name: 'Fresh Lemonade', description: 'Freshly squeezed lemons with mint and a touch of honey.', price: 4, category: 'Drinks', image: img('1621263764928-df1444c5e917'), isVegetarian: true },
  { name: 'Mango Lassi', description: 'Chilled yogurt drink blended with ripe mango.', price: 4.5, category: 'Drinks', image: img('1553530979-7ee52a2cd0c3'), isVegetarian: true },
  { name: 'Iced Latte', description: 'Double espresso over milk and ice.', price: 4.75, category: 'Drinks', image: img('1461023058943-07fcbe16d735'), isVegetarian: true },
];

async function seed() {
  await connectDB(env.mongoUri);

  // Upsert by name: new dishes are created, existing dishes get their latest details (including images).
  // Safe to run repeatedly. It never creates duplicates.
  const result = await Food.bulkWrite(
    MENU.map((item) => ({
      updateOne: {
        filter: { name: item.name },
        update: { $set: item },
        upsert: true,
      },
    }))
  );

  console.log(
    `Seed complete: ${result.upsertedCount} added, ${result.modifiedCount} updated, ${MENU.length} dishes total.`
  );
  await disconnectDB();
}

seed().catch(async (error) => {
  console.error('Seed failed:', error.message);
  await disconnectDB();
  process.exit(1);
});