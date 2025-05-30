import React, { useState, useCallback, useContext } from 'react';
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { getReservationsByRestaurantId, getReservationsByUserId } from '../api/reservationsApi';
import { AuthContext } from '../context/AuthContext';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';

const ReservationListScreen = () => {
    const { params } = useRoute();
    const navigation = useNavigation();
    const { userToken } = useContext(AuthContext);
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadReservations = async () => {
        try {
            let data;
            if (params?.showAllUserReservations) {
                // Get all reservations for the current user
                data = await getReservationsByUserId(6); // Using 6 as the user_id for now
            } else if (params?.restaurantId) {
                // Get reservations for specific restaurant
                data = await getReservationsByRestaurantId(params.restaurantId);
                // Filter reservations to only show those matching the current user's ID
                data = data.filter(reservation => reservation.user_id === 6);
            } else {
                Alert.alert('Error', 'Invalid parameters');
                navigation.goBack();
                return;
            }
            
            console.log('Received reservations:', data);
            setReservations(data);
        } catch (error) {
            console.error('Error loading reservations:', error);
            Alert.alert('Error', error.message || 'Failed to load reservations');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            loadReservations();
        }, [params?.restaurantId, params?.showAllUserReservations])
    );

    const renderReservation = ({ item }) => {
        const date = new Date(item.reservation_datetime);
        const formattedDate = date.toLocaleString();

        return (
            <TouchableOpacity
                style={styles.card}
                onPress={() => navigation.navigate('EditReservation', { 
                    id: item.reservation_uuid,
                    restaurantId: item.restaurant_uuid
                })}
            >
                <Text style={styles.date}>{formattedDate}</Text>
                <Text style={styles.guests}>Guests: {item.guests}</Text>
                <Text style={styles.status}>Status: {item.status}</Text>
                {params?.showAllUserReservations && (
                    <Text style={styles.restaurantName}>Restaurant ID: {item.restaurant_id}</Text>
                )}
            </TouchableOpacity>
        );
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (reservations.length === 0) {
        return (
            <View style={styles.centered}>
                <Text>No reservations found for your account.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={reservations}
                renderItem={renderReservation}
                keyExtractor={(item) => item.reservation_uuid}
                contentContainerStyle={styles.list}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        padding: 16,
    },
    card: {
        backgroundColor: 'white',
        padding: 16,
        marginBottom: 16,
        borderRadius: 8,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    date: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    guests: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    status: {
        fontSize: 14,
        color: '#666',
    },
    restaurantName: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
});

export default ReservationListScreen; 