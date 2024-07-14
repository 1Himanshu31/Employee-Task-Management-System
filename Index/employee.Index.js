const express = require('express');
const app = express();

const employeeRoutes = require('./routes/employee.Routes');

app.use(express.json());
app.use('/employee', employeeRoutes);

try 
{
    app.listen(6767, () => 
    {
        console.log('Connected');
    });
}
catch (error) 
{
    console.error('Error connecting to MongoDB:', error.message);
};