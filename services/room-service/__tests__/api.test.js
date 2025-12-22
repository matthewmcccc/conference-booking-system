const request = require("supertest");
const app = require("../app");
const axios = require("axios");
const Room = require("../models/Room");
jest.mock("axios");
const { generateToken } = require("../test_helpers/helpers");

const token = generateToken({ role: "admin" })

describe("Room Service", () => {
    it("Should get all rooms", async () => {
        const res = await request(app)
            .get("/api/rooms")

        expect(res.statusCode).toEqual(201);
    })

    it("Should get a specific room given a room ID", async () => {
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
            .set("Authorization", `Bearer ${token}`)
        
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
            .set("Authorization", `Bearer ${token}`)

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
            .set("Authorization", `Bearer ${token}`)
        
        expect(res.statusCode).toEqual(200);
    })
})

describe("DELETE /api/rooms/:locationid", () => {
    it("Should delete all rooms for a given location ID", async () => {
        const locationId = "6940460dae8e9d9e36e6a0ae";

        const res = await request(app)
            .delete(`/api/rooms/location/${locationId}`)
            .set("Authorization", `Bearer ${token}`)
        
        expect(res.statusCode).toEqual(200);
    })

    it("Should return 500 when there is an error deleting rooms by location ID", async () => {
        const locationId = "randomlocationid"

        const res = await request(app)
            .delete(`/api/rooms/location/${locationId}`)
            .set("Authorization", `Bearer ${token}`)
        
        expect(res.statusCode).toEqual(500);
    })
})

describe("GET /health", () => {
    it("Should return a healthy status", async () => {
        const res = await request(app)
            .get("/api/rooms/health")

        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toEqual("Room service is healthy");
    })
})