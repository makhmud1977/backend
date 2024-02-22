const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcrypt'); // Import bcrypt
const jwt = require('jsonwebtoken');
const ObjectId = mongoose.Types.ObjectId;




// Connection URI for your MongoDB database
const uri = process.env.MONGO_URI;

// Connect to the MongoDB server
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Create a Mongoose schema for your product
const productSchema = new mongoose.Schema({
  productName: String,
  turkum: String,
  olchovBirligi: String,
  oramlarNomi: String,
  oramlarSoni: Number,
  sotishNarxi: String,
  ulgurjiNarxi: String,
  sotibOlinganNarxi: String,
  id: String,
  creationDateTime: { type: Date, default: Date.now },
});

// Create a Mongoose model based on the schema
const Product = mongoose.model('Product', productSchema);

// Route to create a product
router.post('/products', async (req, res) => {
  try {
    const newProduct = new Product(req.body);

    // Save the new product to the database
    const savedProduct = await newProduct.save();

    // Sending a 200 OK response with the created product
    res.status(200).json({ success: true, product: savedProduct });
  } catch (error) {
    console.error('Error in creating a product:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Route to fetch all products
router.get('/products', async (req, res) => {
  try {
    // Fetch all products from the database
    const allProducts = await Product.find();

    // Sending a 200 OK response with the fetched products
    res.status(200).json({ success: true, products: allProducts });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});
router.delete('/products/:id', async (req, res) => {
  const productId = req.params.id;

  try {
    console.log('Deleting product with ID:', productId);
    // Find the product by ID and remove it
    const deletedProduct = await Product.findOneAndRemove({ id: productId });

    if (!deletedProduct) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.status(200).json({ success: true, product: deletedProduct });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Route to update a product

router.put('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const updatedProductData = req.body;

    // Find the product by ID and update its fields
    const updatedProduct = await Product.findOneAndUpdate(
      { id: productId },
      { $set: updatedProductData },
      { new: true }
    );

    if (!updatedProduct) {
      // If the product is not found, return a 404 Not Found response
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // Sending a 200 OK response with the updated product
    res.status(200).json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error('Error in updating a product:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

/////////////////////////////////////////////////
const salesSchema = new mongoose.Schema({
  productNameValue: String,
  productNumber: String,
  clientName: String,
  workman: String,
  clientValue: String,
  plasticValue: String,
  creationDateTime: { type: Date, default: Date.now },
});

// Create a Mongoose model based on the schema
const Sales = mongoose.model('Sales', salesSchema);

// Route to create sales data
router.post('/resultSales', async (req, res) => {
  try {
    const { productNameValue, productNumber } = req.body;

    // Find the corresponding product by productName
    const correspondingProduct = await Product.findOne({ productName: productNameValue });

    if (!correspondingProduct) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // Calculate the resultNumber
    const resultNumber = correspondingProduct.oramlarSoni - productNumber;

    // Update the corresponding product's oramlarSoni field
    correspondingProduct.oramlarSoni = resultNumber;


    // Save the updated product to the database
    const updatedProduct = await correspondingProduct.save();

    // Create a new Sales object with the found product and additional sales data
    const newSales = new Sales({
      productNameValue,
      productNumber,
      productId: updatedProduct._id, // assuming you have an _id field in Product model
    });

    // Save the new sales data to the database
    const savedSales = await newSales.save();

    console.log(savedSales);

    // Sending a 200 OK response with the created sales data
    res.status(200).json({ success: true, sales: savedSales });
  } catch (error) {
    console.error('Error in creating sales data:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

//////////////////////////////////////////////////////

// Assuming you have a client schema defined like this:
const clientSchema = new mongoose.Schema({
  clientName: String,
  dataValue: String, // Adjust according to your client data structure
  productNameValue: String,
  workman: String,
  clientValue: String,
  productNumber: String,
  newPrice: Number,
  newPriceNumber: Number,
  id: String,
  plasticValue: String,
  creationDateTime: { type: Date, default: Date.now },
  // Add any other fields as needed
});

// Create a Mongoose model based on the schema
const Client = mongoose.model('Client', clientSchema);
///////////////////////////////////////////////////////////////////////////////////////

router.post('/clients', async (req, res) => {
  try {
    const { clientData } = req.body;

    // Create a new client document
    const newClient = {
      clientName: clientData.clientName,
      dataValue: clientData.dataValue,
      productNameValue: clientData.productNameValue,
      workman: clientData.workman,
      clientValue: clientData.clientValue,
      newPrice: clientData.newPrice,
      newPriceNumber: clientData.newPriceNumber,
      id: clientData.id,
      creationDateTime: clientData.creationDateTime,
      productNumber: clientData.productNumber,
      plasticValue: clientData.plasticValue,
      // Add any other fields as needed
    };
console.log(newClient);
    // Save the new client to the database
    const savedClient = await Client.create(newClient);

    // Sending a 200 OK response with the created client
    res.status(200).json({ success: true, client: savedClient });
  } catch (error) {
    console.error('Error in creating a client:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

/////////////////////////////////////////////////////



/////////////////////////////////////////////////////////////////////////////

router.get('/clients', async (req, res) => {
  try {
    // Fetch all clients from the database
    const allClients = await Client.find();

    // Sending a 200 OK response with the fetched clients
    res.status(200).json({ success: true, clients: allClients });
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

/////////////////////////////////////////////
const userSchema = new mongoose.Schema({
  text: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Add other fields as needed
});

// Hash the password before saving
userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
  }
  next();
});

const User = mongoose.model('User', userSchema);

router.post('/login', async (req, res) => {
  try {
    const { text, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ text });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if the password is correct
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Create and sign a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ success: true, token, userId: user._id });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

//////////////////////////////
router.delete('/clients/:id', async (req, res) => {
  const clientId = req.params.id;

  try {
    console.log('Deleting client with ID:', clientId);
    // Find the client by ID and remove it
    const deletedClient = await Client.findOneAndRemove({ id: clientId });

    if (!deletedClient) {
      return res.status(404).json({ success: false, error: 'Client not found' });
    }

    res.status(200).json({ success: true, client: deletedClient });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});
///////////////////////////////////////////////
// Assuming you have a supplier schema defined like this:
const supplierSchema = new mongoose.Schema({
  id: String,
  name: String,
  debt: String,
  information: String,
  phoneNumber: String,
  // Add any other fields as needed
});

// Create a Mongoose model based on the schema
const Supplier = mongoose.model('Supplier', supplierSchema);

// Route to create a supplier
router.post('/suppliers', async (req, res) => {
  try {
    const {id, name, debt, information, phoneNumber } = req.body;

    // Create a new supplier document
    const newSupplier = {
      id,
      name,
      debt,
      information,
      phoneNumber,
      // Add any other fields as needed
    };

    // Save the new supplier to the database
    const savedSupplier = await Supplier.create(newSupplier);

    // Sending a 200 OK response with the created supplier
    res.status(200).json({ success: true, supplier: savedSupplier });
  } catch (error) {
    console.error('Error in creating a supplier:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Route to fetch all suppliers
router.get('/suppliers', async (req, res) => {
  try {
    // Fetch all suppliers from the database
    const allSuppliers = await Supplier.find();

    // Sending a 200 OK response with the fetched suppliers
    res.status(200).json({ success: true, suppliers: allSuppliers });
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

router.put('/suppliers/:id', async (req, res) => {
  try {
    const supplierId = req.params.id;
    const updatedSupplierData = req.body;

    
    const updatedSupplier = await Supplier.findOneAndUpdate(
      { id: supplierId },
      { $set: updatedSupplierData },
      { new: true }
    );

    if (!updatedSupplier) {
      // If the supplier is not found, return a 404 Not Found response
      return res.status(404).json({ success: false, error: 'Supplier not found' });
    }

    // Sending a 200 OK response with the updated supplier
    res.status(200).json({ success: true, supplier: updatedSupplier });
  } catch (error) {
    console.error('Error in updating a supplier:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

router.delete('/suppliers/:id', async (req, res) => {
  try {
    const supplierId = req.params.id;

    // Find the supplier by ID and delete
    const deletedSupplier = await Supplier.findOneAndDelete({ id: supplierId });

    if (!deletedSupplier) {
      // If the supplier is not found, return a 404 Not Found response
      return res.status(404).json({ success: false, error: 'Supplier not found' });
    }

    // Return a success response with the deleted supplier
    res.status(200).json({ success: true, supplier: deletedSupplier });
  } catch (error) {
    console.error('Error in deleting a supplier:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

module.exports = router;
