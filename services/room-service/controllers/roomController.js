const { default: mongoose } = require("mongoose");
const Room = require("../models/Room")

exports.getAllRooms = async (req, res) => {
    try {
        const filter = {};
        if (req.query.location) {
            filter.location = req.query.location;
        }

        const rooms = await Room.find(filter);
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

exports.getRoomById = async (req, res) => {
    try {
        const id = mongoose.Types.ObjectId(req.params.id);
        const room = await Room.findById(id)
        if (!room) {
            res.status(404).json("Couldn't find room by ID")
        }
        res.status(200).json(room);
    } catch (err) {
        console.error(`Couldn't fetch room by ID: ${err}`);
        res.status(400).json({ error: err.message })
    }
}

exports.editRoomById = async (req, res) => {
    try {
        const id = new mongoose.Types.ObjectId(req.params.id);
        const body = req.body;
        const room = await Room.findOneAndUpdate(id, body, {new: true});
        if (!room) {
            res.status(404).json("Couldn't find and update room")
        } else {
            res.status(200).json(room);
        }
    } catch (err) {
        console.error(`Couldn't update room: ${err}`);
        res.status(400).json({ error: err.message });
    }
} 

exports.deleteRoom = async (req, res) => {
    try {
        const id = new mongoose.Types.ObjectId(req.params.id);
        const room = await Room.findByIdAndDelete(id);
        if (!room){
            res.status(404).json("Couldn't delete room")
        } else {
            res.status(200).json(`Deleted room with id: ${id}`);
        }
    } catch (err) {
        console.error(`Couldn't delete room: ${err}`);
        res.status(400).json({ error: err.message });
    }
}