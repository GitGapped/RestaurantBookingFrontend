import { API_BASE_URL } from '../utils/apiConfig';

/**
 * Fetches all reservations (with optional pagination).
 */
export const fetchReservations = async (limit = null, offset = 0) => {
    try {
        let url = `${API_BASE_URL}/reservations`;

        const params = [];
        if (limit !== null) params.push(`limit=${limit}`);
        if (offset > 0) params.push(`offset=${offset}`);
        if (params.length) url += `?${params.join('&')}`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || 'Failed to fetch reservations');

        return data;
    } catch (error) {
        throw new Error(`fetchReservations: ${error.message}`);
    }
};

/**
 * Fetch a single reservation by UUID.
 */
export const fetchReservationById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/reservations/${id}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || 'Reservation not found');

        return data;
    } catch (error) {
        throw new Error(`fetchReservationById: ${error.message}`);
    }
};

/**
 * Create a new reservation (requires access token).
 */
export const createReservation = async (reservation, accessToken) => {
    try {
        const response = await fetch(`${API_BASE_URL}/reservations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(reservation),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to create reservation');

        return data;
    } catch (error) {
        throw new Error(`createReservation: ${error.message}`);
    }
};

/**
 * Update an existing reservation by ID (requires access token).
 */
export const updateReservation = async (id, updatedReservation, accessToken) => {
    try {
        const response = await fetch(`${API_BASE_URL}/reservations/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(updatedReservation),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to update reservation');

        return data;
    } catch (error) {
        throw new Error(`updateReservation: ${error.message}`);
    }
};

/**
 * Delete a reservation by UUID (requires access token).
 */
export const deleteReservation = async (id, accessToken) => {
    try {
        const response = await fetch(`${API_BASE_URL}/reservations/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Failed to delete reservation');
        }

        return true;
    } catch (error) {
        throw new Error(`deleteReservation: ${error.message}`);
    }
};

/**
 * Get reservations by restaurant ID.
 */
export const getReservationsByRestaurantId = async (restaurantId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/reservations/restaurant/${restaurantId}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || 'Failed to fetch restaurant reservations');

        return data;
    } catch (error) {
        throw new Error(`getReservationsByRestaurantId: ${error.message}`);
    }
};

/**
 * Get reservations by user ID.
 */
export const getReservationsByUserId = async (userId) => {
    try {
        const response = await fetch(`${API_BASE_URL}/reservations/user/${userId}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || 'Failed to fetch user reservations');

        return data;
    } catch (error) {
        throw new Error(`getReservationsByUserId: ${error.message}`);
    }
}; 