require("./config/db");
const app = require("./app");
const PORT = 8085 || process.env.PORT;

app.listen(PORT, () => {
    console.log(`Booking service listening on port: ${PORT}`);
})
