const express = require('express');
const app = express();
const stateRoutes = require('./routes/state.Routes');

app.use(express.json());
app.use('/state', stateRoutes);

try 
{
    app.listen(4545, () => 
    {
        console.log('Connected');
    });
}
catch (error) 
{
    console.error('Error connecting to MongoDB:', error.message);
};