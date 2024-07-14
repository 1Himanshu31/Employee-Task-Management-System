const express = require('express');
const app = express();
const countryRoutes = require('./routes/country.Routes');

app.use(express.json());
app.use('/country', countryRoutes);

try 
{
    app.listen(9090, () => 
    {
        console.log('Connected');
    });
}
catch (error) 
{
    console.error('Error connecting to MongoDB:', error.message);
};