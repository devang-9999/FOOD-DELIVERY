import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Dish } from 'src/dishes/entities/dish.entity';

export default class ProductsSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const productsRepository = dataSource.getRepository(Dish);
    const productsData = [
      {
        id: 1,
        name: 'Leather Travel Weekender',
        description:
          'Premium full-grain leather bag with a dedicated shoe compartment and reinforced handles.',
        price: 185.0,
        category: 'Travel',
        brand: 'Universal Products',
        stock: 15,
        images: [
          'https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=1000',
        ],
        sellerId: 1,
      },
      {
        id: 2,
        name: 'Noise-Cancelling Headphones',
        description:
          'Over-ear wireless headphones with 40-hour battery life and high-fidelity audio drivers.',
        price: 249.99,
        category: 'Electronics',
        brand: 'Universal Products',
        stock: 42,
        images: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000',
        ],
        sellerId: 2,
      },
      {
        id: 3,
        name: 'Minimalist Desk Lamp',
        description:
          'Adjustable LED lamp with 3 color modes and a built-in wireless charging pad for mobile devices.',
        price: 45.5,
        category: 'Home Office',
        brand: 'Universal Products',
        stock: 80,
        images: [
          'https://images.unsplash.com/photo-1534073828943-f801091bb18c?q=80&w=1000',
        ],
        sellerId: 3,
      },
      {
        id: 4,
        name: 'Titanium Quartz Watch',
        description:
          'Water-resistant up to 50m, featuring a sapphire crystal face and premium NATO strap.',
        price: 120.0,
        category: 'Accessories',
        brand: 'Universal Products',
        stock: 25,
        images: [
          'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000',
        ],
        sellerId: 4,
      },
      {
        id: 5,
        name: 'Ergonomic Mechanical Keyboard',
        description:
          'Tenkeyless layout with hot-swappable switches and customizable RGB lighting.',
        price: 115.0,
        category: 'Electronics',
        brand: 'Universal Products',
        stock: 18,
        images: [
          'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=1000',
        ],
        sellerId: 4,
      },
      {
        id: 6,
        name: 'Smart Fitness Tracker',
        description:
          'Monitor heart rate, sleep cycles, and daily activity with this sleek, waterproof wearable.',
        price: 79.99,
        category: 'Electronics',
        brand: 'Universal Products',
        stock: 110,
        images: [
          'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?q=80&w=1000',
        ],
        sellerId: 5,
      },
      {
        id: 7,
        name: 'Cold Brew Coffee Maker',
        description:
          '1L capacity glass carafe with a fine-mesh stainless steel filter for smooth coffee.',
        price: 32.0,
        category: 'Home & Kitchen',
        brand: 'Universal Products',
        stock: 55,
        images: [
          'https://images.unsplash.com/photo-1517705008128-361805f42e86?q=80&w=1000',
        ],
        sellerId: 6,
      },
      {
        id: 8,
        name: 'Ceramic Succulent Pots',
        description:
          'Set of 3 geometric planters with drainage holes and bamboo saucers.',
        price: 24.0,
        category: 'Home Decor',
        brand: 'Universal Products',
        stock: 200,
        images: [
          'https://images.unsplash.com/photo-1485955900006-10f4d324d411?q=80&w=1000',
        ],
        sellerId: 7,
      },
      {
        id: 9,
        name: 'Waterproof Action Camera',
        description:
          'Capture 4K ultra-HD footage with advanced image stabilization for sports and travel.',
        price: 199.0,
        category: 'Electronics',
        brand: 'Universal Products',
        stock: 30,
        images: [
          'https://images.unsplash.com/photo-1526170315870-ef6856fd3aba?q=80&w=1000',
        ],
        sellerId: 8,
      },
      {
        id: 10,
        name: 'Linen Throw Pillow',
        description:
          'Soft, breathable linen cover with a premium down-alternative insert included.',
        price: 38.0,
        category: 'Home Decor',
        brand: 'Universal Products',
        stock: 65,
        images: [
          'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=1000',
        ],
        sellerId: 8,
      },
      {
        id: 11,
        name: 'Portable Power Bank',
        description:
          '20,000mAh capacity with dual USB-C ports for fast-charging phones and tablets.',
        price: 55.0,
        category: 'Electronics',
        brand: 'Universal Products',
        stock: 90,
        images: [
          'https://images.unsplash.com/photo-1609091839697-5c1411b4020c?q=80&w=1000',
        ],
        sellerId: 9,
      },
      {
        id: 12,
        name: 'Canvas Messenger Bag',
        description:
          'Durable waxed canvas with brass hardware and adjustable padded shoulder strap.',
        price: 85.0,
        category: 'Travel',
        brand: 'Universal Products',
        stock: 22,
        images: [
          'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000',
        ],
        sellerId: 10,
      },
      {
        id: 13,
        name: 'Organic Cotton Hoodie',
        description:
          'Heavyweight French terry cotton hoodie with a relaxed fit and ribbed cuffs.',
        price: 68.0,
        category: 'Apparel',
        brand: 'Universal Products',
        stock: 45,
        images: [
          'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000',
        ],
        sellerId: 16,
      },
      {
        id: 14,
        name: 'Aromatherapy Diffuser',
        description:
          'Ultrasonic oil diffuser with wood grain finish and 7 changing LED light colors.',
        price: 34.5,
        category: 'Home Decor',
        brand: 'Universal Products',
        stock: 70,
        images: [
          'https://images.unsplash.com/photo-1602928321679-560bb453f190?q=80&w=1000',
        ],
        sellerId: 13,
      },
      {
        id: 15,
        name: 'Smart Door Lock',
        description:
          'Keyless entry system with fingerprint recognition and smartphone app control.',
        price: 159.0,
        category: 'Home Office',
        brand: 'Universal Products',
        stock: 14,
        images: [
          'https://images.unsplash.com/photo-1558002038-1055907df827?q=80&w=1000',
        ],
        sellerId: 14,
      },
      {
        id: 16,
        name: 'Cast Iron Skillet',
        description:
          'Pre-seasoned 12-inch heavy-duty skillet perfect for searing, sautéing, and baking.',
        price: 45.0,
        category: 'Home & Kitchen',
        brand: 'Universal Products',
        stock: 40,
        images: [
          'https://images.unsplash.com/photo-1590158615575-27024f17937f?q=80&w=1000',
        ],
        sellerId: 15,
      },
      {
        id: 17,
        name: 'Bamboo Bath Tray',
        description:
          'Expandable luxury bath caddy with slots for a book, tablet, and wine glass.',
        price: 39.0,
        category: 'Home Decor',
        brand: 'Universal Products',
        stock: 35,
        images: [
          'https://images.unsplash.com/photo-1602671963845-ad14c2274ad7?q=80&w=1000',
        ],
        sellerId: 13,
      },
      {
        id: 18,
        name: 'Electric Gooseneck Kettle',
        description:
          'Precision pour spout and temperature control for the perfect pour-over coffee.',
        price: 89.0,
        category: 'Home & Kitchen',
        brand: 'Universal Products',
        stock: 28,
        images: [
          'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=1000',
        ],
        sellerId: 15,
      },
      {
        id: 19,
        name: 'Polarized Classic Sunglasses',
        description:
          'Hand-polished acetate frames with scratch-resistant polarized lenses.',
        price: 65.0,
        category: 'Accessories',
        brand: 'Universal Products',
        stock: 105,
        images: [
          'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1000',
        ],
        sellerId: 10,
      },
      {
        id: 20,
        name: 'Yoga Mat with Strap',
        description:
          'Extra thick 6mm eco-friendly TPE material with non-slip texture for better grip.',
        price: 29.99,
        category: 'Lifestyle',
        brand: 'Universal Products',
        stock: 150,
        images: [
          'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000',
        ],
        sellerId: 20,
      },
    ];

    for (const data of productsData) {
      await productsRepository.save(productsRepository.create(data));
    }
    console.log('Products seeded successfully');
  }
}
