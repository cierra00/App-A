require('dotenv').config();  
const axios = require('axios');
const express = require('express');
const path = require('path');
const movieRoutes = require('./routes/movies');  
const app = express();

const PORT = process.env.PORT || 8000;


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});


app.use(express.static(path.join(__dirname, 'public')));


app.use('/movies', movieRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
