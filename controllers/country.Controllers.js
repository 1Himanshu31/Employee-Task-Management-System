const countryService = require('../services/country.Services');

exports.createCountry = async function (req, res, next) 
{
    try 
    {
        const countryData = req.body;
        const createCountry = await countryService.createCountry(countryData);
        return res.status(200).json({ status: 200, data: createCountry, message: 'Country created successfully'});
    } 
    catch (error) 
    {
        return res.status(500).json({ status: 500, message: error.message });
    }
};

exports.getCountry = async function (req, res, next) 
{
    try 
    {
        const country = await countryService.getCountry();
        return res.status(200).json({ status: 200, data: country, message: 'Country retrived successfully' });
    } 
    catch (error) 
    {
        return res.status(500).json({ status:500, message: error.message });
    }
};