const request = require("supertest");
const app = require("../app");
const { generateToken, setupBookingMocks, createMockBooking } = require("../test_helpers/helpers");
const axios = require("axios");
const token = generateToken({ role: "admin" });

process.env.ROOM_SERVICE_URL = "http://localhost:3001/api/rooms";
process.env.WEATHER_SERVICE_URL = "http://localhost:3002/api/weather";

jest.mock("axios");

beforeEach(() => {
    jest.clearAllMocks();
});

describe("Booking Services", () => {
    describe("GET /api/bookings", () => {
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
    });

    describe("POST /api/bookings", () => {
        it("Should create booking and return status code 200 with auth", async () => {
            const token = generateToken({ role: "admin" });
            const res = await createMockBooking(token);

            expect(res.statusCode).toEqual(200);
            expect(res.body.booking).toHaveProperty("total_price");
            expect(res.body.booking).toHaveProperty("base_price");
            expect(res.body.booking).toHaveProperty("weather_adjustment");
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

        it("Should return 400 when creating booking without required fields", async () => {
            const token = generateToken({ role: "user" });
            setupBookingMocks();

            const res = await request(app)
                .post("/api/bookings")
                .set("Authorization", `Bearer ${token}`)
                .send({ room: "693ebb3b894bc4f1c01d48fd" });

            expect(res.statusCode).toEqual(400);
            expect(res.body.error).toBeDefined();
        });

        it("Should return 400 when creating duplicate booking", async () => {
            const token = generateToken({ role: "user" });
            
            const firstRes = await createMockBooking(token);
            expect(firstRes.statusCode).toEqual(200);

            setupBookingMocks();

            const bookingData = {
                room: "693ebb3b894bc4f1c01d48fd",
                date: new Date("2025-12-20")
            };

            const res = await request(app)
                .post("/api/bookings")
                .set("Authorization", `Bearer ${token}`)
                .send(bookingData);

            expect(res.statusCode).toEqual(400);
            expect(res.body.error).toContain("already exists");
        });
    });

    describe("DELETE /api/bookings/:id", () => {
        it("Should return 403 when deleting a booking without admin auth", async () => {
            const userToken = generateToken({ role: "user" });
            const createRes = await createMockBooking(userToken);
            
            expect(createRes.statusCode).toEqual(200);
            const bookingId = createRes.body.booking._id;

            const deleteRes = await request(app)
                .delete(`/api/bookings/${bookingId}`)
                .set("Authorization", `Bearer ${userToken}`);

            expect(deleteRes.statusCode).toEqual(403);
            expect(deleteRes.body.message).toContain("permissions");
        });

        it("Should return 200 when deleting a booking with admin auth", async () => {
            const adminToken = generateToken({ role: "admin" });
            const createRes = await createMockBooking(adminToken);
            
            expect(createRes.statusCode).toEqual(200);
            const bookingId = createRes.body.booking._id;

            const deleteRes = await request(app)
                .delete(`/api/bookings/${bookingId}`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(deleteRes.statusCode).toEqual(200);
            expect(deleteRes.body.message).toContain("successfully deleted");
            expect(deleteRes.body.booking).toBeDefined();
        });

        it("Should return 404 when deleting non-existent booking", async () => {
            const adminToken = generateToken({ role: "admin" });
            const fakeId = "507f1f77bcf86cd799439011";
            
            const res = await request(app)
                .delete(`/api/bookings/${fakeId}`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(res.statusCode).toEqual(404);
            expect(res.body.message).toContain("Couldn't find booking");
        });
    });

    describe("GET /api/bookings/:userid", () => {
        it("Should return 200 and get all bookings for a given user with admin auth", async () => {
            const adminToken = generateToken({ role: "admin" });
            const createRes = await createMockBooking(adminToken);
            
            expect(createRes.statusCode).toEqual(200);
            const userId = createRes.body.booking.user;

            const roomsRes = await request(app)
                .get(`/api/bookings/${userId}`)
                .set("Authorization", `Bearer ${adminToken}`);

            expect(roomsRes.statusCode).toEqual(200);
            expect(roomsRes.body.bookings).toBeDefined();
            expect(Array.isArray(roomsRes.body.bookings)).toBe(true);
            expect(roomsRes.body.bookings.length).toBeGreaterThan(0);
        });
    });

    describe("GET /api/bookings/calculate-price", () => {
        it("Should return 200 and calculate price with valid roomId and date", async () => {
            const token = generateToken({ role: "user" });
            
            axios.get.mockResolvedValueOnce({
                data: {
                    id: "693ebb3b894bc4f1c01d48fd",
                    name: "Conference Room A",
                    capacity: 20,
                    base_price: 100,
                    location: "673ebb3b894bc4f1c01d48fd"
                }
            });

            axios.get.mockResolvedValueOnce({
                data: { 
                    temperature: 25 
                }
            });

            const res = await request(app)
                .get("/api/bookings/calculate-price")
                .query({ 
                    roomId: "693ebb3b894bc4f1c01d48fd",
                    date: "2025-12-20"
                })
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty("final_price");
            expect(res.body.final_price).toBeGreaterThan(100); 
        });

        it("Should return 200 with no additional charge for comfortable temperature", async () => {
            const token = generateToken({ role: "user" });
            
            axios.get.mockResolvedValueOnce({
                data: {
                    id: "693ebb3b894bc4f1c01d48fd",
                    base_price: 100,
                    location: "673ebb3b894bc4f1c01d48fd"
                }
            });

            axios.get.mockResolvedValueOnce({
                data: { 
                    temperature: 21  
                }
            });

            const res = await request(app)
                .get("/api/bookings/calculate-price")
                .query({ 
                    roomId: "693ebb3b894bc4f1c01d48fd",
                    date: "2025-12-20"
                })
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.final_price).toEqual(100);
        });

        it("Should return 200 with 50% additional charge for extreme temperature", async () => {
            const token = generateToken({ role: "user" });
            
            axios.get.mockResolvedValueOnce({
                data: {
                    id: "693ebb3b894bc4f1c01d48fd",
                    base_price: 100,
                    location: "673ebb3b894bc4f1c01d48fd"
                }
            });

            axios.get.mockResolvedValueOnce({
                data: { 
                    temperature: 45 
                }
            });

            const res = await request(app)
                .get("/api/bookings/calculate-price")
                .query({ 
                    roomId: "693ebb3b894bc4f1c01d48fd",
                    date: "2025-12-20"
                })
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toEqual(200);
            expect(res.body.final_price).toEqual(150);
        });

        it("Should return 400 when roomId is missing", async () => {
            const token = generateToken({ role: "user" });

            const res = await request(app)
                .get("/api/bookings/calculate-price")
                .query({ date: "2025-12-20" })  
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toEqual(400);
        });

        it("Should return 400 when date is missing", async () => {
            const token = generateToken({ role: "user" });

            const res = await request(app)
                .get("/api/bookings/calculate-price")
                .query({ roomId: "693ebb3b894bc4f1c01d48fd" }) 
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toEqual(400);
        });

        it("Should return 401 when called without authentication", async () => {
            const res = await request(app)
                .get("/api/bookings/calculate-price")
                .query({ 
                    roomId: "693ebb3b894bc4f1c01d48fd",
                    date: "2025-12-20"
                });

            expect(res.statusCode).toEqual(401);
        });
    });
});