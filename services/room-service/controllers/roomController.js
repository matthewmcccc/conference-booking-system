const Room = require("../models/Room")

exports.getAllRooms = async (req, res) => {
    try {
        const rooms = await Room.find();
        if (!rooms) {
            res.status(404).json("Couldn't find any rooms");
        }
        res.status(201).json(rooms);
    } catch (err) {
        res.status(400).json({ message: err.message });
        console.error(`Error fetching rooms: ${err}`);
    }
}

exports.createRoom = async (req, res) => {
    try {
        const params = req.body;
        const room = await Room.create(params);
        if (!room) {
            res.status(404).json("Couldn't create room");
        }
        res.status(201).json(room);
    } catch (err) {
        res.status(400).json({ error: err.message });
        console.error(`Couldn't create room: ${err}`);
    }
}