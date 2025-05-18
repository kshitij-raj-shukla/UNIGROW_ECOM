const { imageUploadUtil } = require('../../helpers/cloudinary');
const Product = require('../../models/Product');

const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const url = `data:${req.file.mimetype};base64,${b64}`;
    const result = await imageUploadUtil(url);

    res.json({ success: true, result });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: 'Error occurred' });
  }
};

const addProduct = async (req, res) => {
  try {
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
    } = req.body;

    const newProduct = await Product.create({
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
    });

    res.status(201).json({ success: true, data: newProduct });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Error occurred' });
  }
};

const fetchAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.status(200).json({ success: true, data: products });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Error occurred' });
  }
};

const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
    } = req.body;

    const product = await Product.findByPk(id);
    if (!product)
      return res.status(404).json({ success: false, message: 'Product not found' });

    await product.update({
      image: image ?? product.image,
      title: title ?? product.title,
      description: description ?? product.description,
      category: category ?? product.category,
      brand: brand ?? product.brand,
      price: price === '' ? 0 : price ?? product.price,
      salePrice: salePrice === '' ? 0 : salePrice ?? product.salePrice,
      totalStock: totalStock ?? product.totalStock,
      averageReview: averageReview ?? product.averageReview,
    });

    res.status(200).json({ success: true, data: product });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Error occurred' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.destroy({ where: { id } });

    if (!deleted)
      return res.status(404).json({ success: false, message: 'Product not found' });

    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (e) {
    console.error(e);
    res.status(500).json({ success: false, message: 'Error occurred' });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
};
