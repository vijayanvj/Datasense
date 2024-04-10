const express = require('express');
const router = express.Router();
const User = require('../model/Db');
const bcrypt = require('bcrypt');
const otpGenerator = require('otp-generator');

router.post('/newlogin', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const existingUser = await User.findOne({ username: email });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ username: email, password: hashedPassword });
      await newUser.save();
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Registration failed' });
    }
  });

  router.post('/check-email', async (req, res) => {
    const { email } = req.body;
  
    try {
      const existingUser = await User.findOne({  username: email });
      if (existingUser) {
        res.json({ exists: true });
      } else {
        res.json({ exists: false });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while checking email' });
    }
  });

  router.post('/forgot-password', async (req, res) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ username: email });
      if (!user) {
        return res.status(404).json({ error: 'Email not found in our database' });
      }
  
      const currentTimestamp = new Date();
      if (user.otp && user.otp.expiresAt > currentTimestamp) {
        return res.status(400).json({ error: 'An OTP is already active for this email' });
      }
  
      const otpCode = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false });
      user.otp = {
        code: otpCode,
        expiresAt: new Date(currentTimestamp.getTime() + 5 * 60 * 1000)
      };
      user.lastOTPSentAt = currentTimestamp;
      await user.save();
  
      res.status(200).json({ message: 'OTP sent successfully' });
    } catch (err) {
      console.error('Forgot password error:', err);
      res.status(500).json({ error: 'An error occurred while processing your request' });
    }
  });

module.exports = router;