const PORT = process.env.PORT || 8080;
require('./config/db');
const app = require("./app");

app.listen(PORT, () => {
    console.log(`Weather service running on port ${PORT}`);
})