const express = require('express');
const cnpjRoutes = require('./cnpjRoutes')


const app = express();
app.use('/cnpj', cnpjRoutes);
app.listen(3000, () => {
    console.log('app now listening for requests on port 3000');
});