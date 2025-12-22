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
        expect(res.body).toHaveProperty("temperature");
    })

    it("Should return real weather data for bookings <=7 days away", async () => {
        axios.get.mockResolvedValueOnce({
            data: {
                id: "6940460dae8e9d9e36e6a0ae",
                lat: 56.462,  
                lng: -2.970, 
                name: "Dundee"
            }
        });

        axios.get.mockResolvedValueOnce({
            data: {
                hourly: {
                    time: [
                        "2025-12-25T00:00", "2025-12-25T01:00", "2025-12-25T02:00",
                        "2025-12-25T03:00", "2025-12-25T04:00"
                    ],
                    temperature_2m: [15.5, 16.2, 14.8, 15.1, 16.0]
                }
            }
        });

        const res = await request(app) 
            .get("/api/weather/forecast")
            .query({
                locationId: "6940460dae8e9d9e36e6a0ae",
                date: "2025-12-25"
            })

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("temperature");
        expect(typeof res.body.temperature).toBe("number");
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

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("temperature");
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
        expect(res.body.error).toContain("Location not found");
    })

    it("Should return 400 when required parameters are missing", async () => {
        const res = await request(app)
            .get("/api/weather/forecast")
            .query({
                locationId: "6940460dae8e9d9e36e6a0ae"
            })
        
        expect(res.statusCode).toEqual(400);
    })

    it("Should return 400 when Open-Meteo API fails", async () => {
        axios.get.mockResolvedValueOnce({
            data: {
                id: "6940460dae8e9d9e36e6a0ae",
                lat: 56.462,
                lng: -2.970,
                name: "Dundee"
            }
        });

        axios.get.mockRejectedValueOnce(new Error("Weather API error"));

        const res = await request(app)
            .get("/api/weather/forecast")
            .query({
                locationId: "6940460dae8e9d9e36e6a0ae",
                date: "2025-12-25"
            })
        
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty("error");
        expect(res.body.error).toContain("Weather API error");
    })
})