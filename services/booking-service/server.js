require("./config/db");
const app = require("./app");
const PORT = process.env.PORT || 8085;

app.listen(PORT, () => {
    console.log(`Booking service listening on port: ${PORT}`);
})
