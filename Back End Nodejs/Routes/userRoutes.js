const express = require('express');
const router = express.Router();
const User = require('../Model/Dd');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); 
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }
});

router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    res.status(201).json({ filename: req.file.originalname, path: req.file.path });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/getdata',(req,res)=>{
  User.find({})
  .then(users=>res.json(users))
  .catch(error=>res.json(error))
})

router.post('/register', async (req, res) => {
    try {
      const existingUser = await User.findOne({ phoneNumber: req.body.phoneNumber });
      if (existingUser) {
        return res.status(400).json({ message: 'Phone number already exists' });
      }
    const newUser = new User({
      name: req.body.name,
      dateOfBirth: req.body.dateOfBirth,
      gender: req.body.gender,
      state: req.body.state,
      district: req.body.district,
      city: req.body.city,
      pincode: req.body.pincode,
    //   address: req.body.address,
      landmark: req.body.landmark,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      hobbies: req.body.hobbies,
      image: req.file ? req.file.path : null,
      // password: hashedPassword
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/delete/:id', (req, res) => {
  const id = req.params.id;

  User.findByIdAndDelete(id)
    .then(deletedUser => {
      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({ message: 'User deleted successfully' });
    })
    .catch(error => res.status(500).json({ error: error.message }));
});

router.get('/search', async (req, res) => {
  const { term } = req.query;
  try {
    const users = await User.find({ name: { $regex: new RegExp(term, 'i') } }).limit(5);
    res.json(users);
  } catch (error) {
    console.error('Error fetching search results:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
