const express = require('express');
const app = express();
const zipcodeRoutes = require('./routes/zipcode.Routes');

app.use(express.json());
app.use('/zipcode', zipcodeRoutes);

try 
{
    app.listen(3434, () => 
    {
        console.log('Connected');
    });
}
catch (error) 
{
    console.error('Error connecting to MongoDB:', error.message);
};