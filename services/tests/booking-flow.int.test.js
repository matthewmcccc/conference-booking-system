const axios = require("axios");

const BASE = process.env.GATEWAY_URL || "http://localhost:8086";

function uniqueEmail() {
  return `itest_${Date.now()}_${Math.floor(Math.random() * 1e9)}@example.com`;
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFutureDateISO() {
  const year = randomInt(2027, 2029);
  const month = randomInt(1, 12);
  const day = randomInt(1, 28);
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

describe("Integration: signup -> login -> create booking -> list bookings", () => {
  jest.setTimeout(60_000);

  it("should allow a user to signup, login, create a booking, and see it in bookings list", async () => {
    const email = uniqueEmail();
    const password = "Password123!";
    const first_name = "Test";
    const surname = "User";

    await axios.post(`${BASE}/api/auth`, {
      email,
      password,
      first_name,
      surname,
    });

    const loginRes = await axios.post(`${BASE}/api/auth/login`, { email, password });
    expect([200, 201]).toContain(loginRes.status);
    expect(loginRes.data).toHaveProperty("token");
    expect(loginRes.data).toHaveProperty("user");
    expect(loginRes.data.user).toHaveProperty("id");

    const token = loginRes.data.token;
    const userId = loginRes.data.user.id;

    const roomsRes = await axios.get(`${BASE}/api/rooms`);
    expect([200, 201]).toContain(roomsRes.status);
    expect(Array.isArray(roomsRes.data)).toBe(true);
    expect(roomsRes.data.length).toBeGreaterThan(0);

    const rooms = roomsRes.data;

    let createRes;
    let created;
    let lastErr;

    for (let attempt = 0; attempt < 8; attempt++) {
      const room = rooms[randomInt(0, rooms.length - 1)];
      const roomId = room._id || room.id;
      const date = randomFutureDateISO();

      try {
        createRes = await axios.post(
          `${BASE}/api/bookings`,
          { room: roomId, date },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        created = createRes.data.booking;
        break;
      } catch (err) {
        const status = err.response?.status;
        const data = err.response?.data;

        const msg =
          (typeof data === "string" ? data : data?.error || data?.message || "").toString();

        if (status === 400 && msg.toLowerCase().includes("already exists")) {
          lastErr = err;
          continue;
        }

        throw err;
      }
    }

    if (!createRes || !created) {
      // If we exhausted retries, rethrow the last collision error so the output is informative.
      throw lastErr || new Error("Failed to create booking after retries");
    }

    expect([200, 201]).toContain(createRes.status);
    expect(createRes.data).toHaveProperty("booking");

    const createdUser = created.user && created.user._id ? created.user._id : created.user;
    expect(String(createdUser)).toBe(String(userId));

    const listRes = await axios.get(`${BASE}/api/bookings`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    expect([200, 201]).toContain(listRes.status);
    const bookings = listRes.data;
    expect(Array.isArray(bookings)).toBe(true);

    const createdId = created._id || created.id;
    const found = bookings.find((b) => String(b._id || b.id) === String(createdId));
    expect(found).toBeTruthy();
  });
});
