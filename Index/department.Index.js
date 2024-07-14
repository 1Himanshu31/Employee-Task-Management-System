
const express = require('express');
const app = express();
const departmentRoutes = require('./routes/department.Routes');
// app.use(departmentRoutes);
app.use(express.json());
app.use('/department', departmentRoutes);
    try
    {
        app.listen(8982, ()=>
        {
            console.log('Connected');
        }); 
    }
    catch(error)
    {
        console.error('Error connecting to MongoDB:', error.message);
    };
