import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    TextInput,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { createRestaurant } from '../api/restaurantsApi';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { restaurantStyles as styles } from '../styles/restaurantStyles';

const AddRestaurantScreen = () => {
    const navigation = useNavigation();
    const { userToken } = useContext(AuthContext);

    const [restaurantData, setRestaurantData] = useState({
        name: '',
        address: '',
        phone: '',
    });
    const [submitting, setSubmitting] = useState(false);

    const handleAddRestaurant = async () => {
        if (!restaurantData.name || !restaurantData.address || !restaurantData.phone) {
            Alert.alert('Validation Error', 'All fields are required.');
            return;
        }

        setSubmitting(true);
        try {
            await createRestaurant({
                ...restaurantData,
                created_at: new Date().toISOString(),
            }, userToken);

            Alert.alert('Success', 'Restaurant added successfully.', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } catch (error) {
            Alert.alert('Add Failed', error.message || 'Failed to add restaurant');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
        >
            <Text style={styles.title}>Add New Restaurant</Text>

            <TextInput
                style={styles.input}
                placeholder="Name"
                value={restaurantData.name}
                onChangeText={(text) => setRestaurantData({ ...restaurantData, name: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Address"
                value={restaurantData.address}
                onChangeText={(text) => setRestaurantData({ ...restaurantData, address: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Phone"
                value={restaurantData.phone}
                onChangeText={(text) => setRestaurantData({ ...restaurantData, phone: text })}
                keyboardType="phone-pad"
            />

            <TouchableOpacity
                style={styles.button}
                onPress={handleAddRestaurant}
                disabled={submitting}
            >
                {submitting ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Add Restaurant</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
};

export default AddRestaurantScreen;