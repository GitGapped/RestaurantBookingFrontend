import React, { useState, useCallback, useContext } from 'react';
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    RefreshControl,
    TextInput,
} from 'react-native';
import { fetchRestaurants } from '../api/restaurantsApi';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { restaurantStyles as styles } from '../styles/restaurantStyles';
import { AuthContext } from '../context/AuthContext';

const RestaurantListScreen = () => {
    const navigation = useNavigation();
    const { userToken, logout } = useContext(AuthContext);
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const loadRestaurants = async () => {
        try {
            const data = await fetchRestaurants();
            setRestaurants(data);
        } catch (error) {
            console.error('Failed to fetch restaurants:', error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            loadRestaurants();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        loadRestaurants();
    };

    const filteredRestaurants = restaurants.filter(restaurant =>
        restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        restaurant.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderRestaurant = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('RestaurantDetail', { id: item.restaurant_uuid })}
        >
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.address}>{item.address}</Text>
            <Text style={styles.phone}>{item.phone}</Text>
        </TouchableOpacity>
    );

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('ReservationList', { showAllUserReservations: true })}
                        style={{ marginRight: 15 }}
                    >
                        <Text style={{ color: '#007AFF' }}>All my Reservations</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={logout} style={{ marginRight: 15 }}>
                        <Text style={{ color: '#007AFF' }}>Logout</Text>
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation, logout]);

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search restaurants..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>
            <FlatList
                data={filteredRestaurants}
                keyExtractor={(item) => item.restaurant_uuid}
                renderItem={renderRestaurant}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={<Text style={styles.empty}>No restaurants found.</Text>}
            />

        </View>
    );
};

export default RestaurantListScreen; 