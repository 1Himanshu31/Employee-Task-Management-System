const State = require('../model/state.Model');

exports.createState = async function (stateData) 
{
    try 
    {
        const newState = new State(stateData);
        const savedState = await newState.save();
        return savedState;
    } 
    catch (error) 
    {
        throw new Error('Error while creating State:' + error.message);
    }
};

exports.getState = async function () 
{
    try 
    {
        const state = await State.find();
        return state;
    } 
    catch (error) 
    {
        throw new Error('Error while retrieving state:' + error.message);
    }
};