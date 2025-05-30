import { API_BASE_URL } from '../utils/apiConfig';

/**
 * Fetches all restaurants (with optional pagination).
 */
export const fetchRestaurants = async (limit = null, offset = 0) => {
    try {
        let url = `${API_BASE_URL}/restaurants`;

        const params = [];
        if (limit !== null) params.push(`limit=${limit}`);
        if (offset > 0) params.push(`offset=${offset}`);
        if (params.length) url += `?${params.join('&')}`;

        const response = await fetch(url);
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || 'Failed to fetch restaurants');

        return data;
    } catch (error) {
        throw new Error(`fetchRestaurants: ${error.message}`);
    }
};

/**
 * Fetch a single restaurant by UUID.
 */
export const fetchRestaurantById = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/restaurants/${id}`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || 'Restaurant not found');

        return data;
    } catch (error) {
        throw new Error(`fetchRestaurantById: ${error.message}`);
    }
};

/**
 * Create a new restaurant (requires access token).
 */
export const createRestaurant = async (restaurant, accessToken) => {
    try {
        const response = await fetch(`${API_BASE_URL}/restaurants`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(restaurant),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to create restaurant');

        return data;
    } catch (error) {
        throw new Error(`createRestaurant: ${error.message}`);
    }
};

/**
 * Update an existing restaurant by ID (requires access token).
 */
export const updateRestaurant = async (id, updatedRestaurant, accessToken) => {
    try {
        const response = await fetch(`${API_BASE_URL}/restaurants/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(updatedRestaurant),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to update restaurant');

        return data;
    } catch (error) {
        throw new Error(`updateRestaurant: ${error.message}`);
    }
};

/**
 * Delete a restaurant by UUID (requires access token).
 */
export const deleteRestaurant = async (id, accessToken) => {
    try {
        const response = await fetch(`${API_BASE_URL}/restaurants/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Failed to delete restaurant');
        }

        return true;
    } catch (error) {
        throw new Error(`deleteRestaurant: ${error.message}`);
    }
}; 