const zipcodeService = require('../services/zipcode.Services');
exports.createZipcode = async function (req, res, next) 
{
    try 
    {
        const zipcodeData = req.body;
        const createZipcode = await zipcodeService.createZipcode(zipcodeData);
        return res.status(200).json({ status: 200, data: createZipcode, message: 'Zipcode created successfully' });
    } 
    catch (error) 
    {
        return res.status(500).json({ status: 500, message: error.message });
    }
};
exports.getZipcode = async function (req, res, next) 
{
    try 
    {
        const zipcode = await zipcodeService.getZipcode(req);
        return res.status(200).json({ status: 200, data: zipcode, message: 'Zipcode retrived successfully' });
    } 
    catch (error) 
    {
        return res.status(500).json({ status: 500, message: error.message });
    }
};