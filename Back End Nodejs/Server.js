const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./Routes/userRoutes');
const loginRoutes = require('./Routes/loginRoutes');
const cors = require('cors');
const app = express();

app.use(cors({
    origin: 'http://localhost:3000'
  }));

app.use(express.json());
mongoose.connect('mongodb://localhost/data')

app.use('/api/users', userRoutes);
app.use('/api/login', loginRoutes);

const PORT = process.env.PORT || 3005;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
