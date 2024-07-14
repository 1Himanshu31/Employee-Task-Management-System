const Country = require('../model/country.Model');

exports.createCountry = async function (countryData) 
{
    try 
    { 
        const newCountry = new Country(countryData);
        const savedCountry = await newCountry.save();
        return savedCountry;
    } 
    catch (error) 
    {
        throw new Error('Error while creating Country:' + error.message);
    }
};

exports.getCountry = async function () 
{
    try 
    { 
        const country = await Country.find();
        return country;
    } 
    catch (error) 
    {
        throw new Error('Error while retrieving country:' + error.message);
    }
};