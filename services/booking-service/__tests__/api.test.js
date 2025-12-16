const request = require("supertest");
const app = require("../app");
const { generateToken, setupBookingMocks } = require("../test_helpers/helpers");
const axios = require("axios");
const token = generateToken({ role: "admin" });

jest.mock("axios");

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Booking Services", () => {
    it("Should return 401 when getting bookings without auth", async () => {
        const res = await request(app)
            .get("/api/bookings")

        expect(res.statusCode).toEqual(401);
    });

    it("Should return 200 when getting bookings with auth", async () => {
        const res = await request(app)
            .get("/api/bookings")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toEqual(200)
    });

    it("Should create booking and return status code 200 with auth", async () => {
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

    it("Should return 401 when creating booking without auth", async () => {
        const bookingData = {
            room: "693ebb3b894bc4f1c01d48fd",
            date: new Date("2025-12-20")
        };

        const res = await request(app)
            .post("/api/bookings")
            .send(bookingData);

        expect(res.statusCode).toEqual(401);
    });
});