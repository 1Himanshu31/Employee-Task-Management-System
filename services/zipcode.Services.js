const Zipcode = require('../model/zipcode.Model');

exports.createZipcode = async function (zipcodeData) 
{
    try 
    {
        const newZipcode = new Zipcode(zipcodeData);
        const savedZipcode = await newZipcode.save();
        return savedZipcode;
    } 
    catch (error) 
    {
        throw new Error('Error while creating Zipcode:' +error.message);
    }
};

exports.getZipcode = async function (req) 
{
    try 
    {
        const sortBy = req.body.sortBy ? req.body.sortBy: 'col1' ;
        const sortOrder = req.body.sortOrder;
        const populateOption = 
        [
            {
                path: 'countryName',
                select: 'countryName'
            },
            {
                path: 'stateName',
                select: 'stateName'
            },
            {
                path: 'cityName',
                select: 'cityName'
            }
        ];

        const sortCriteria = {};
        if (sortBy === 'col1') 
        {
            sortCriteria.name = sortOrder === 'asc' ? 1 : -1;
        }
        const zipcode = await Zipcode.find().populate(populateOption).sort(sortCriteria);
        return zipcode;
    } 
    catch (error) 
    {
        throw new Error('Error while retrieving zipcode:' + error.message);
    }
};