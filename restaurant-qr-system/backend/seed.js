require('dotenv').config();
const pool = require('./config/database');
const { hashPassword } = require('./utils/jwt');

const seedDatabase = async () => {
  try {
    console.log('Seeding database with sample data...');

    // Create a test restaurant
    const restaurantPassword = await hashPassword('senha123');
    const restaurantResult = await pool.query(
      'INSERT INTO restaurants (name, email, password, phone, address, city) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      ['Restaurante Lisboa', 'admin@lisboa.pt', restaurantPassword, '+351 91 234 5678', 'Rua da Baixa, 25', 'Lisboa']
    );

    const restaurantId = restaurantResult.rows[0].id;
    console.log(`✅ Created restaurant with ID: ${restaurantId}`);

    // Create tables
    const tables = [];
    for (let i = 1; i <= 4; i++) {
      const qrData = JSON.stringify({
        restaurantId,
        tableId: i,
        tableNumber: i,
        sessionId: `session_${i}`,
        timestamp: new Date().toISOString(),
      });

      const tableResult = await pool.query(
        'INSERT INTO tables (restaurant_id, table_number, qr_code_data, capacity) VALUES ($1, $2, $3, $4) RETURNING id',
        [restaurantId, i, qrData, 4]
      );
      tables.push(tableResult.rows[0].id);
    }
    console.log(`✅ Created 4 tables`);

    // Create menu items
    const menuItems = [
      {
        name: 'Bacalhau à Brás',
        description: 'Bacalhau desfiado com batata palha e ovo',
        price: 15.50,
        category: 'Peixe',
      },
      {
        name: 'Francesinha',
        description: 'Sanduíche com presunto, mortadela e cobertura de cerveja',
        price: 12.00,
        category: 'Sanduiche',
      },
      {
        name: 'Arroz de Marisco',
        description: 'Arroz cremoso com camarão, mexilhão e polvo',
        price: 18.00,
        category: 'Arroz',
      },
      {
        name: 'Pastéis de Nata',
        description: 'Deliciosos pastéis com calda de canela',
        price: 3.50,
        category: 'Sobremesa',
      },
      {
        name: 'Cerveja Sagres',
        description: 'Cerveja portuguesa copo 25cl',
        price: 2.50,
        category: 'Bebidas',
      },
      {
        name: 'Vinho Tinto Douro',
        description: 'Vinho tinto da região do Douro garrafa',
        price: 8.00,
        category: 'Bebidas',
      },
      {
        name: 'Alheira',
        description: 'Alheira tradicional portuguesa com batata frita',
        price: 10.50,
        category: 'Carne',
      },
      {
        name: 'Sardinha Assada',
        description: 'Sardinha fresca assada na brasa',
        price: 9.50,
        category: 'Peixe',
      },
    ];

    for (const item of menuItems) {
      await pool.query(
        'INSERT INTO menu_items (restaurant_id, name, description, price, category) VALUES ($1, $2, $3, $4, $5)',
        [restaurantId, item.name, item.description, item.price, item.category]
      );
    }
    console.log(`✅ Created ${menuItems.length} menu items`);

    console.log('');
    console.log('✨ Database seeded successfully!');
    console.log('');
    console.log('📊 Test Credentials:');
    console.log('   Email: admin@lisboa.pt');
    console.log('   Password: senha123');
    console.log('');
    console.log('📍 Tables created: 1, 2, 3, 4');
    console.log('🍽️  Menu items: 8');
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
