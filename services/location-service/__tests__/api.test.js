const request = require("supertest");
const app = require("../app");
const axios = require("axios");
const Location = require("../models/Location");
const { generateToken} = require("../test_helpers/helpers")
const token = generateToken({ role: "admin" });

jest.mock("axios")

describe("Location Service", () => {
    it("Should return all locations on request", async () => {
        await Location.create({
            name: "Dundee",
            address: "94 Fintry Road",
            city: "Dundee",
            postcode: "DD4 9HQ",
            country: "United Kingdom"
        })
    
        const res = await request(app)
            .get("/api/locations");

        expect(res.statusCode).toEqual(200)
        expect(res.body.city)        
    });

    it("Should create location when given valid params", async () => {
        axios.get.mockResolvedValueOnce({
            data: {
                results: [{
                    latitude: 56.4620,
                    longitude: -2.9707
                }]
            }
        });

        const locationData = {
            name: "Dundee",
            address: "103 Fintry Drive",
            city: "Dundee",
            postcode: "DD4 9HQ",
            country: "United Kingdom"
        }

        const res = await request(app)
            .post("/api/locations")
            .send(locationData)
            .set("Authorization", `Bearer ${token}`)

        expect(res.statusCode).toEqual(201);
        expect(res.body.location).toBeDefined();
        expect(res.body.location.lat).toEqual(56.4620);
        expect(res.body.location.lng).toEqual(-2.9707);
    })

    it("Should get location by id when given valid ID", async () => {
        const location = await Location.create({
            name: "Dundee",
            address: "94 Fintry Road",
            city: "Dundee",
            postcode: "DD4 9HQ",
            country: "United Kingdom"
        })

        const res = await request(app)
            .get(`/api/locations/${location._id}`)
        
        expect(res.statusCode).toEqual(200)
        expect(res.body).toBeDefined();
        expect(res.body.name).toEqual("Dundee")
    })

    it("Should allow for existing locations to be edited", async () => {

        const location = await Location.create({
            name: "Dundee",
            address: "94 Fintry Road",
            city: "Dundee",
            postcode: "DD4 9HQ",
            country: "United Kingdom"
        })

        const res = await request(app)
            .put(`/api/locations/${location._id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Scumdee"
            })

        expect(res.statusCode).toEqual(200)
        expect(res.body.location.name).toEqual("Scumdee")
    })
})


describe("DELETE /id", () => {
    it("Should delete a location when given valid ID", async () => {
        const location = await Location.create({
            name: "Dundee",
            address: "94 Fintry Road",
            city: "Dundee",
            postcode: "DD4 9HQ",
            country: "United Kingdom"
        })

        const deleteRes = await request(app)
            .delete(`/api/locations/${location._id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(deleteRes.statusCode).toEqual(200);
        expect(deleteRes.body.message).toEqual(`Location with id: ${location._id} deleted`);
    })
})

describe("GET /api/locations/:id/rooms", () => {
    it("Should get all rooms for a location", async () => {
        const location = await Location.create({
            name: "Dundee",
            address: "94 Fintry Road",
            city: "Dundee",
            postcode: "DD4 9HQ",
            country: "United Kingdom"
        })

        axios.get.mockResolvedValueOnce({
            data: []
        });

        const res = await request(app)
            .get(`/api/locations/${location._id}/rooms`)
            
        expect(res.statusCode).toEqual(200);
    })
})