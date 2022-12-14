function CompareDate(date) {
    let today = new Date().toLocaleDateString();
    date = new Date(date).getTime();
    today = new Date(today).getTime();

    return date > today
}

module.exports = CompareDate;