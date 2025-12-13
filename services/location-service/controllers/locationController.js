const Location = require("../models/Location");
const mongoose = require("mongoose");

exports.getAllLocations = async (req, res) => {
    try {
        const locations = await Location.find();
        res.status(200).json(locations);
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.error(`Couldn't find locations: ${err}`)
    }
}

exports.getLocationById = async (req, res) => {
    try {
        const id = new mongoose.Types.ObjectId(req.params.id);
        const location = await Location.findById(id);
        if (location) {
            res.status(200).json(location);
        } else {
            res.status(404).json({ message: "Location not found"});
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
        console.error(`Couldn't get location by id: ${err}`);
    }
}

exports.editLocationById = async (req, res) => {
    try {
        const id = new mongoose.Types.ObjectId(req.params.id);
        console.log(req.body);
        const location = await Location.findOneAndUpdate(id, req.body, {new: true});
        if (location) {
            res.status(200).json({ message: "location updated", location: location });
        } else {
            res.status(404).json({ message: "couldn't find location"})
        }
    } catch (err) {
        console.error(`Couldn't update location: ${err}`);
        res.status(400).json({ err: err.message });
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