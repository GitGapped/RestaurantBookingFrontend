import React, { useCallback, useState, useContext } from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    Alert,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import { fetchRestaurantById, deleteRestaurant } from '../api/restaurantsApi';
import { AuthContext } from '../context/AuthContext';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { restaurantStyles as styles } from '../styles/restaurantStyles';

const RestaurantDetailScreen = () => {
    const { params } = useRoute();
    const navigation = useNavigation();
    const { userToken } = useContext(AuthContext);

    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadRestaurant = async () => {
        if (!params?.id) return;
        try {
            const data = await fetchRestaurantById(params.id);
            setRestaurant(data);
        } catch (error) {
            Alert.alert('Error', error.message || 'Could not load restaurant details.');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadRestaurant();
        }, [params?.id])
    );

    const handleDelete = async () => {
        Alert.alert('Confirm Delete', 'Are you sure you want to delete this restaurant?', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await deleteRestaurant(params.id, userToken);
                        Alert.alert('Deleted', 'Restaurant deleted successfully.');
                        navigation.goBack();
                    } catch (error) {
                        Alert.alert('Error', error.message || 'Delete failed.');
                    }
                },
            },
        ]);
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!restaurant) {
        return (
            <View style={styles.centered}>
                <Text>Restaurant not found.</Text>
            </View>
        );
    }

    if (!params?.id) {
        return (
            <View style={styles.centered}>
                <Text>Invalid restaurant ID.</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.detailContainer}>
            <Text style={styles.title}>{restaurant.name}</Text>
            
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.value}>{restaurant.address}</Text>

            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{restaurant.phone}</Text>

            <Text style={styles.label}>Created At:</Text>
            <Text style={styles.value}>{new Date(restaurant.created_at).toLocaleDateString()}</Text>

            {/* <TouchableOpacity
                style={[styles.deleteButton, { backgroundColor: '#007AFF', marginBottom: 10 }]}
                onPress={() => navigation.navigate('EditRestaurant', { id: restaurant.restaurant_uuid })}
            >
                <Text style={styles.deleteButtonText}>Edit Restaurant</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
            >
                <Text style={styles.deleteButtonText}>Delete Restaurant</Text>
            </TouchableOpacity> */}

            <TouchableOpacity
                style={[styles.deleteButton, { backgroundColor: '#4CAF50' }]}
                onPress={() => {
                    console.log('Navigating to reservations with restaurant ID:', restaurant.restaurant_uuid);
                    navigation.navigate('ReservationList', { restaurantId: restaurant.restaurant_uuid });
                }}
            >
                <Text style={styles.deleteButtonText}>View My Bookings</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.deleteButton, { backgroundColor: '#2196F3' }]}
                onPress={() => {
                    navigation.navigate('AddReservation', { 
                        restaurantId: restaurant.restaurant_id,
                        restaurantUuid: restaurant.restaurant_uuid
                    });
                }}
            >
                <Text style={styles.deleteButtonText}>New Reservation</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default RestaurantDetailScreen; 