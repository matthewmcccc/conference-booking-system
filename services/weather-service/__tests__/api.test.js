const request = require("supertest")
const app = require("../app");
const axios = require("axios");

jest.mock("axios");

beforeEach(() => {
    jest.clearAllMocks();
})

describe("GET /weather with authentic location data to get mocked weather data", () => {
    it("Should return mock temperature data for bookings >7days away", async () => {
        axios.get.mockResolvedValueOnce({
            data: {
                id: "6940460dae8e9d9e36e6a0ae",
                latitude: 56.462,
                longitude: -2.970,
                name: "Dundee"
            }
        });
        
        const res = await request(app)
            .get("/api/weather/forecast")
            .query({ 
                locationId: "6940460dae8e9d9e36e6a0ae",
                date: "2030-12-16"
            })

        expect(res.statusCode).toEqual(200);
        expect(res.body.temperature);
    })

    it("Should return mock temperature data when no coordinates are provided", async () => {
        axios.get.mockResolvedValueOnce({
            data: {
                id: "6940460dae8e9d9e36e6a0ae",
                name: "Dundee"
            }
        });

        const res = await request(app) 
            .get("/api/weather/forecast")
            .query({
                locationId: "6940460dae8e9d9e36e6a0ae",
                date: "2025-12-20"
            })

        expect(res.statusCode).toEqual(200)
        expect(res.body.temperature)
    })

    it("Should return 400 when location service fails", async () => {
        axios.get.mockRejectedValueOnce(new Error("Location not found"));

        const res = await request(app)
            .get("/api/weather/forecast")
            .query({
                locationId: "invalid-id",
                date: "2025-12-20"
            })
        
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty("error");
    })
})
