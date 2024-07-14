const cityService = require('../services/city.Services');

exports.createCity = async function (req, res, next) 
{
    try 
    {
        const cityData = req.body;
        const createCity = await cityService.createCity(cityData);
        return res.status(200).json({ status: 200, data: createCity, message: 'City created successfully' });
    } 
    catch (error) 
    {
        return res.status(500).json({ status: 500, message: error.message });
    }
};

exports.getCity = async function (req, res, next) 
{
    try 
    {
        const city = await cityService.getCity();
        return res.status(200).json({ status: 200, data: city, message: 'City retrived successfully' });
    } 
    catch (error) 
    {
        return res.status(500).json({ status: 500, message: error.message });
    }
};