require("dotenv").config();
require("./config/db");
const app = require("./app");
const PORT = process.env.PORT || 8084;

app.listen(PORT, () => {
    console.log(`User auth listening on port: ${PORT}`);
})