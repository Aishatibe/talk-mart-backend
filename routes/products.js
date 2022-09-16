const { Product } = require('../models/product');
const express = require('express');
const { Category } = require('../models/category');
const router = express.Router();
const mongoose = require('mongoose');

//get request
router.get(`/`, async (req, res) => {
  const productList = await Product.find().populate('category');
  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.send(productList);
});
//
//
/* router.get(`/`, async (req, res) => {
  const productList = await Product.find().populate('category');
  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.send(productList);
}); */

//
//
//get customised fields
/* router.get(`/`, async (req, res) => {
  const productList = await Product.find().select('name image -_id');
  if (!productList) {
    res.status(500).send('unable to get products');
  } else {
    res.send(productList);
  }
}); */

//
//get by single product
//

router.get(`/:id`, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return res.status(404).send('product not found');
  } else {
    res.send(product);
  }
});

//
///

//update a product
//
router.put(`/:id`, async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    res.status(400).send('invalid product id');
  }
  const category = await Category.findById(req.body.category);
  if (!category) {
    return res.status(400).send('invalid category');
  }
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },
    { new: true }
  );

  if (!product) {
    res.status(500).send('product was not updated');
  } else {
    res
      .send(product)
      .json({ success: true, message: 'products updated succesfully' });
  }
});
//
//
//delete a product
//
//
router.delete(`/:id`, (req, res) => {
  Product.findByIdAndRemove(req.params.id)
    .then((product) => {
      if (!product) {
        res
          .status(500)
          .json({ success: false, message: 'Cannot delete product' });
      } else {
        res.send(200).send('product deleted');
      }
    })
    .catch((error) => res.status(500).json({ success: false, message: error }));
});
//
////
/////
//  API TO RETURN NUMBER OF PRODUCTS AVAILABLE
router.get(`/get/count`, async (req, res) => {
  const productCount = await Product.countDocuments();
  if (!productCount) {
    return res.status(500).json({ success: false });
  } else {
    res.send({ count: productCount });
  }
});

/////
//
//
//API FOR FEATURED PRODUCT
router.get(`/get/featured`, async (req, res) => {
  const featuredProduct = await Product.find({ isFeatured: true });
  if (!featuredProduct) {
    res.status(500).json({ success: false, message: 'no featured product' });
  } else {
    res.send(featuredProduct);
  }
});

//
////
//////
//ADDING LIMIT TO THE NUMBER OF FEATURED PRODUCT THAT SHOULD BE DISPLAYED
router.get(`/get/featured/:numlimit`, async (req, res) => {
  const count = req.params.numlimit ? req.params.numlimit : 0;
  const limitFeaturedProduct = await Product.find({ isFeatured: true }).limit(
    +count
  );
  if (!limitFeaturedProduct) {
    return res.status(500).json({ success: false });
  } else {
    res.send(limitFeaturedProduct);
  }
});
//
////
//////
/////
// FILTER BY CATEGORIES
router.get(`/`, async (req, res) => {
  let filter = {};
  if (req.query.categories) {
    filter = { categories: req.query.categories.split(',') };
  }
  const categoryList = await Product.find(filter).populate('category');
  if (!categoryList) {
    res.status(500).json({ success: false });
  } else {
    res.send(categoryList);
  }
});
//
//
///
///////
//post request
router.post(`/`, async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) {
    res.status(400).send('Invalid category');
  }
  let product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: req.body.image,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });
  product = await product.save();
  if (!product) {
    return res.status(500).send('Unable to create new product');
  } else {
    res.send(product);
  }
});

module.exports = router;
