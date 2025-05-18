    const mongoose = require('mongoose');
    const mysql = require('mysql2/promise');

    async function migrateData() {
      // Connect to MongoDB
      await mongoose.connect('mongodb://localhost:27017/yourMongoDB', { useNewUrlParser: true, useUnifiedTopology: true });
      const Product = mongoose.model('Product', new mongoose.Schema({ title: String, description: String, price: Number, salePrice: Number, totalStock: Number }));

      // Connect to MySQL
      const connection = await mysql.createConnection({ host: 'localhost', user: 'root', database: 'yourMySQLDB' });

      // Fetch data from MongoDB
      const products = await Product.find();

      // Insert data into MySQL
      for (const product of products) {
        await connection.execute('INSERT INTO products (title, description, price, salePrice, totalStock) VALUES (?, ?, ?, ?, ?)', [product.title, product.description, product.price, product.salePrice, product.totalStock]);
      }

      // Close connections
      await connection.end();
      await mongoose.connection.close();
    }

    migrateData();
    