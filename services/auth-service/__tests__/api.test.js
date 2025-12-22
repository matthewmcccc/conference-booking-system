const request = require("supertest");
const app = require("../app");
const bcrypt = require("bcrypt");

jest.mock("../models/User");
const User = require("../models/User");

jest.mock("bcrypt");

process.env.JWT_SECRET = "test-secret-key";

beforeEach(() => {
    jest.clearAllMocks();
});

describe("POST /api/auth/signup", () => {
    it("Should return 200 when valid user sign up details are provided", async () => {
        User.findOne.mockResolvedValue(null);
        
        bcrypt.hash = jest.fn().mockResolvedValue("$2b$10$hashedpassword");
        
        const mockUser = {
            _id: "507f1f77bcf86cd799439011",
            first_name: "Matthew",
            surname: "McConnachie",
            email: "mattmcconnachie4@gmail.com",
            role: "user",
            passwordHash: "$2b$10$hashedpassword",
            toObject: jest.fn().mockReturnValue({
                _id: "507f1f77bcf86cd799439011",
                first_name: "Matthew",
                surname: "McConnachie",
                email: "mattmcconnachie4@gmail.com",
                role: "user"
            })
        };
        
        User.create.mockResolvedValue(mockUser);

        const userData = {
            first_name: "Matthew",
            surname: "McConnachie",
            email: "mattmcconnachie4@gmail.com",
            password: "password123"
        };

        const res = await request(app)
            .post("/api/auth/") 
            .send(userData);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("user");
        expect(res.body.user).toHaveProperty("_id");
        expect(res.body.message).toBe("User created successfully");
    });

    it("Should return 400 when required fields are missing", async () => {
        bcrypt.hash = jest.fn().mockRejectedValue(new Error("data and salt arguments required"));

        const userData = {
            first_name: "Matthew",
            email: "mattmcconnachie4@gmail.com"
        };

        const res = await request(app)
            .post("/api/auth/")
            .send(userData);

        expect(res.statusCode).toBe(400);
    });
});

describe("POST /api/auth/login", () => {
    it("Should return 200 and token when valid credentials provided", async () => {
        const mockUser = {
            _id: "507f1f77bcf86cd799439011",
            email: "mattmcconnachie4@gmail.com",
            first_name: "Matthew",
            surname: "McConnachie",
            passwordHash: "$2b$10$hashedpassword"
        };

        User.findOne.mockResolvedValue(mockUser);
        bcrypt.compare = jest.fn().mockResolvedValue(true);

        const loginData = {
            email: "mattmcconnachie4@gmail.com",
            password: "password123"
        };

        const res = await request(app)
            .post("/api/auth/login")
            .send(loginData);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("token");
        expect(res.body).toHaveProperty("user");
        expect(res.body.message).toBe("Login successful");
    });

    it("Should return 401 when user doesn't exist", async () => {
        User.findOne.mockResolvedValue(null);

        const loginData = {
            email: "nonexistent@gmail.com",
            password: "password123"
        };

        const res = await request(app)
            .post("/api/auth/login")
            .send(loginData);

        expect(res.statusCode).toBe(401);
        expect(res.body.error).toContain("Invalid email or password");
    });

    it("Should return 401 when password is incorrect", async () => {
        const mockUser = {
            _id: "507f1f77bcf86cd799439011",
            email: "mattmcconnachie4@gmail.com",
            passwordHash: "$2b$10$hashedpassword"
        };

        User.findOne.mockResolvedValue(mockUser);
        bcrypt.compare = jest.fn().mockResolvedValue(false);

        const loginData = {
            email: "mattmcconnachie4@gmail.com",
            password: "wrongpassword"
        };

        const res = await request(app)
            .post("/api/auth/login")
            .send(loginData);

        expect(res.statusCode).toBe(401);
        expect(res.body.error).toContain("Invalid email or password");
    });

    it("Should return 400 when email or password is missing", async () => {
        const loginData = {
            email: "mattmcconnachie4@gmail.com"
        };

        const res = await request(app)
            .post("/api/auth/login")
            .send(loginData);

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe("Email and password are required");
    });
});
