const Location = require("../models/Location");
const mongoose = require("mongoose");
const axios = require('axios')
require("dotenv").config();

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
            return res.status(200).json(location);
        } 
        res.status(404).json({ message: "Location not found"});
    } catch (err) {
        res.status(400).json({ error: err.message });
        console.error(`Couldn't get location by id: ${err}`);
    }
}

exports.editLocationById = async (req, res) => {
    try {
        const { role } = req.user;

        if (role !== "admin") {
            return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
        }

        const id = new mongoose.Types.ObjectId(req.params.id);
        const location = await Location.findOneAndUpdate(id, req.body, {new: true});
        if (location) {
            return res.status(200).json({ message: "location updated", location: location });
        } 
        res.status(404).json({ message: "couldn't find location"})
    } catch (err) {
        console.error(`Couldn't update location: ${err}`);
        res.status(400).json({ err: err.message });
    }
}

exports.createNewLocation = async (req, res) => {
    try {
        const { role } = req.user;

        if (role !== "admin") {
            return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
        }

        const params = req.body;
        const geocodeData = await axios.get(`${process.env.GEOCODING_URL}/search?name=${params.city}&count=1&language=en&format=json`)
        let newLocation;
        if (geocodeData.data.results.length > 0) {
            const lat = geocodeData.data.results[0].latitude;
            const lng = geocodeData.data.results[0].longitude;
            newLocation = await Location.create({...params, lat, lng});
        } else {
            newLocation = await Location.create(params);
        }
        res.status(201).json({message: "New Location created", location: newLocation});
    } catch (err) {
        res.status(400).json({ error: err.message });
        console.error(`Couldn't create new location: ${err}`);
    }
}

exports.getAllRoomsForLocation = async (req, res) => {
    try {
        const locationId = new mongoose.Types.ObjectId(req.params.id);
        const url = `${process.env.ROOM_SERVICE_URL}?location=${locationId}`;
        console.log('Calling room service at:', url);
        console.log('ROOM_SERVICE_URL env var:', process.env.ROOM_SERVICE_URL);
        
        const rooms = await axios.get(url);
        if (!rooms) {
            return res.status(404).json("Couldn't fetch rooms for location")
        }
        res.status(200).json(rooms.data);
    } catch (err) {
        res.status(400).json({ error: err.message });
        console.error(`Couldn't fetch rooms for location: ${err}`);
    }

    console.log("Test commit")
}

exports.deleteLocation = async (req, res) => {
    try {
        const { role } = req.user

        if (role !== "admin") {
            return res.status(403).json({ message: "Forbidden: Insufficient permissions" });
        }

        const id = new mongoose.Types.ObjectId(req.params.id);
        const location = await Location.findByIdAndDelete(id);
        if (!location) {
            return res.status(404).json("Couldn't delete location")
        } 
        res.status(200).json({message: `Location with id: ${id} deleted`, location: location});
    } catch (error) {
        console.error(`Couldn't delete locations: ${error}`);
        res.status(400).json({ error: error.message });
    }
}

exports.health = async (req, res) => {
    try {
        return res.status(200).json({ message: "Location service is healthy"})
    } catch {
        return res.status(404).json({ message: "Uh-oh! Location controller is dead."})
    };
}