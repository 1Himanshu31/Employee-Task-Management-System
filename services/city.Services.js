const City = require('../model/city.Model');
 
exports.createCity = async function (cityData) 
{
    try 
    {
        const newCity = new City(cityData);
        const savedCity = await newCity.save();
        return savedCity;
    } 
    catch (error) 
    {
        throw new Error('Error while creating City:' + error.message);
    }
};

exports.getCity = async function () 
{
    try 
    {
        const city = await City.find();
        return city;
    } 
    catch (error) 
    {
        throw new Error('Error while retrieving city:' + error.message);
    }
};