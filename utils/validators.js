/**
 * Validates data for book creation.
 * @returns {boolean} - `true` if valid, `false` otherwise, with alerts.
 */
export const validateBookData = (title, author, year, genre) => {
    if (!title || !author || !year || !genre) {
        Alert.alert('Validation Error', 'All fields are required.');
        return false;
    }

    if (!/^\d{4}$/.test(year)) {
        Alert.alert('Validation Error', 'Published Year should be a valid 4-digit number.');
        return false;
    }

    return true;
};
/**
 * Validates data for restaurant creation/update.
 * @param {string} name - Restaurant name
 * @param {string} address - Restaurant address
 * @param {string} phone - Restaurant phone number
 * @returns {boolean} - `true` if valid, `false` otherwise, with alerts.
 */
export const validateRestaurantData = (name, address, phone) => {
    if (!name || !address || !phone) {
        Alert.alert('Validation Error', 'All fields are required.');
        return false;
    }

    if (!/^\+?[\d\s-]{10,}$/.test(phone)) {
        Alert.alert('Validation Error', 'Please enter a valid phone number.');
        return false;
    }

    return true;
};