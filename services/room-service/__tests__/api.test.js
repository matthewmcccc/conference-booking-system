const request = require("supertest");
const app = require("../app");
const axios = require("axios");
const Room = require("../models/Room");
jest.mock("axios");

describe("Room Service", () => {
    it("Should get all rooms", async () => {
        const res = await request(app)
            .get("/api/rooms")

        expect(res.statusCode).toEqual(201);
    })

    it("Should get a specific room given a room ID", async () => {
        // axios.get.mockResolvedValueOnce({
        //     data: {
        //         id: "6940460dae8e9d9e36e6a0ae",
        //         latitude: 56.462,
        //         longitude: -2.970,
        //         name: "Dundee"
        //     }
        // });

        const room = await Room.create({
            base_price: 25,
            name: "Test Room",
            capacity: 10,
            location: "6940460dae8e9d9e36e6a0ae"
        })

        const res = await request(app)
            .get(`/api/rooms/${room._id}`)

        expect(res.statusCode).toEqual(200)
        expect(res.body.name).toEqual("Test Room")
    })

    it("Should allow existing rooms to be edited", async () => {
        const room = await Room.create({
            base_price: 25,
            name: "Test Room",
            capacity: 10,
            location: "6940460dae8e9d9e36e6a0ae"
        })

        const res = await request(app)
            .put(`/api/rooms/${room._id}`)
            .send({
                name: "Updated Test Room"
            })
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.name).toEqual("Updated Test Room");
    })

    it("Should allow for rooms to be created if user is an admin", async () => {
        const roomData = {
            base_price: 25,
            name: "Test Room",
            capacity: 10,
            location: "6940460dae8e9d9e36e6a0ae"
        }

        const res = await request(app)
            .post("/api/rooms")
            .send(roomData)

        expect(res.statusCode).toEqual(201);
        expect(res.body).toBeDefined();
        expect(res.body.name).toEqual("Test Room");
    })

    it("Should allow for existing rooms to be deletd", async () => {
        const room = await Room.create({
            base_price: 25,
            name: "Test Room",
            capacity: 10,
            location: "6940460dae8e9d9e36e6a0ae"
        })

        const res = await request(app)
            .delete(`/api/rooms/${room._id}`)
        
        expect(res.statusCode).toEqual(200);
    })
})