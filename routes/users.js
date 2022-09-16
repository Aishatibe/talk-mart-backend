const { User } = require('../models/user');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//get request
router.get(`/`, async (req, res) => {
  const userList = await User.find().select('-passwordHash');
  if (!userList) {
    res.status(500).json({ success: false });
  }
  res.send(userList);
});
///
/////
/////
router.get(`/:id`, async (req, res) => {
  const singleUser = await User.findById(req.params.id).select('-passwordHash');
  if (!singleUser) {
    return res.status(404).json({ success: false, message: 'User not found' });
  } else {
    res.send(singleUser);
  }
});
//
///
////

router.put('/:id', async (req, res) => {
  const userExist = await User.findById(req.params.id);
  let newPassword;
  if (req.body.password) {
    newPassword = bcrypt.hashSync(req.body.passwordHash, 10);
  } else {
    newPassword = userExist.passwordHash;
  }

  const userUpdate = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      passwordHash: newPassword,
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    },
    { new: true }
  );
  if (!userUpdate) {
    res.status(400).json({ success: false, message: 'unable to update user' });
  } else {
    res.send(userUpdate);
  }
});
/////UPDATE A USER
/* router.put(`/:id`, async (req, res) => {
  const userUpdate = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email, */
/* passwordHash: bcrypt.hashSync(req.body.passwordHash, 10), */
/* phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    },
    { new: true }
  );
  if (!userUpdate) {
    res.status(400).json({ success: false, message: 'unable to update user' });
  } else {
    res.send(userUpdate);
  }
}); */
//
/////
/////
/// LOGIN API
router.post('/login', async (req, res) => {
  const userLogin = await User.findOne({ email: req.body.email });
  const secret = process.env.SECRET;
  if (!userLogin) {
    return res.status(400).send('User not found');
  }
  if (
    userLogin &&
    bcrypt.compareSync(req.body.passwordHash, userLogin.passwordHash)
  ) {
    const token = jwt.sign(
      {
        userId: userLogin.id,
        isAdmin: userLogin.isAdmin,
      },
      secret,
      { expiresIn: '1d' }
    );
    res.status(200).send({ user: userLogin.email, token: token });
  } else {
    res.status(400).send('Incorrect password');
  }
});
///
///
///////

router.get(`/get/count`, async (req, res) => {
  const userCount = await User.countDocuments();
  if (!userCount) {
    return res.status(500).json({ success: false });
  } else {
    res.send({ count: userCount });
  }
});
////
///
//////
/////
router.delete(`/:id`, (req, res) => {
  User.findByIdAndRemove(req.params.id)
    .then((user) => {
      if (!user) {
        res
          .status(404)
          .json({ success: false, message: 'Cannot delete product' });
      } else {
        res.send(200).send('product deleted');
      }
    })
    .catch((error) => res.status(500).json({ success: false, message: error }));
});
///
//
////
/////
router.post('/register', async (req, res) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.passwordHash, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });
  await newUser
    .save()
    .then((createdUser) => res.status(201).json(createdUser))
    .catch((err) => res.status(500).json({ error: err, success: false }));
});

////
////
//post request
router.post('/', async (req, res) => {
  let newUser = new User({
    name: req.body.name,
    email: req.body.email,
    passwordHash: bcrypt.hashSync(req.body.passwordHash, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    street: req.body.street,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });
  await newUser
    .save()
    .then((createdUser) => res.status(201).json(createdUser))
    .catch((err) => res.status(500).json({ error: err, success: false }));
});

module.exports = router;
