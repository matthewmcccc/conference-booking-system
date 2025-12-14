const bcrypt = require("bcrypt");
const saltRounds = 10;

const encryptPassword = async (plaintextPassword) => {
    const hash = await bcrypt.hash(plaintextPassword, saltRounds);
    return hash;
}

module.exports = encryptPassword;