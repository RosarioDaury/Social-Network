function HasPhoto(object) {
    if (object.image !== null) return true;

    return false;
}

module.exports = HasPhoto;