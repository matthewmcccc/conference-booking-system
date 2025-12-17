const PORT = process.env.PORT || 8083
const app = require("./app");
require("./config/db");

app.listen(PORT, () => {
    console.log(`Room service listening on port: ${PORT}`)
})