const stateService = require('../services/state.Services');
exports.createState = async function (req, res, next) 
{
    try 
    {
        const stateData = req.body;
        const createState = await stateService.createState(stateData);
        return res.status(200).json({ status: 200, data: createState, message: 'State created successfully' });
    } 
    catch (error) 
    {
        return res.status(500).json({ status: 500, message: error.message });
    }
};
exports.getState = async function (req, res, next) 
{
    try 
    {
        const state = await stateService.getState();
        return res.status(200).json({ status: 200, data: state, message: 'State retrived successfully' });
    } 
    catch (error) 
    {
        return res.status(500).json({ status: 500, message: error.message });
    }
};