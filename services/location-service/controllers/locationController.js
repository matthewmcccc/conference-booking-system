const Location = require("../models/Location");

exports.getAllLocations = async (req, res) => {
    try {
        const locations = await Location.find();
        res.status(200).json(locations);
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.error(`Couldn't find locations: ${err}`)
    }
}


exports.createNewLocation = async (req, res) => {
    try {
        const params = req.body;
        const newLocation = await Location.create(params)
        res.status(201).json(newLocation);
    } catch (err) {
        res.status(400).json({ error: err.message });
        console.error(`Couldn't create new location: ${err}`);
    }
}