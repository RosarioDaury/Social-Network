function FormatDate(date) {
    return new Date(date).toLocaleDateString("en-US")
}

module.exports = FormatDate;