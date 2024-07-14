const express = require('express');
const app = express();                                                                                                                                                                                                                                                                
const cityRoutes = require('./routes/city.Routes');

app.use(express.json());
app.use('/city', cityRoutes);

try 
{
    app.listen(2323, () => 
    {
        console.log('Connected');
    });
}
catch (error) 
{
    console.error('Error connecting to MongoDB:', error.message);
};