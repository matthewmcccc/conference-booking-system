const request = require("supertest");
const app = require("../app");
const { generateToken, setupBookingMocks } = require("../test_helpers/helpers");
const axios = require("axios");
const token = generateToken({ role: "admin" });

jest.mock("axios");

beforeEach(() => {
    jest.clearAllMocks();
});

describe("GET /booking without auth", () => {
    it("Should have status code 401", async () => {
        const res = await request(app)
            .get("/api/bookings")

        expect(res.statusCode).toEqual(401);
    });
})

describe("GET /booking with auth", () => {
    it("Should get booking with status code 200 and return all bookings", async () => {
        const res = await request(app)
            .get("/api/bookings")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toEqual(200)
    })
})

describe("POST /booking with auth", () => {
    it("Should create booking and return status code 200", async () => {
        const token = generateToken({ role: "admin" });

        setupBookingMocks();
       
        const bookingData = {
            room: "693ebb3b894bc4f1c01d48fd",
            date: new Date("2025-12-20")
        };

        const res = await request(app)
            .post("/api/bookings")
            .set("Authorization", `Bearer ${token}`)
            .send(bookingData);

        expect(res.statusCode).toEqual(200);
        expect(res.body.booking).toHaveProperty("total_price");
    });
});

describe("POST /booking without auth", () => {
    it("Should not create booking and return status code 401", async () => {
        const bookingData = {
            room: "693ebb3b894bc4f1c01d48fd",
            date: new Date("2025-12-20")
        };

        const res = await request(app)
            .post("/api/bookings")
            .send(bookingData);

        expect(res.statusCode).toEqual(401);
    })
})
