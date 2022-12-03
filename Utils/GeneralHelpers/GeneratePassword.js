function GeneratePassword() {
    return String(parseInt((Math.random() * 10000) * 127))
}

module.exports = GeneratePassword;