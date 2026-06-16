function validatePhone(phone) {
    if (typeof phone !== 'string') {
        return false;
    }
    const regex = /^\d{10,11}$/
    return regex.test(phone)
}

module.exports = validatePhone