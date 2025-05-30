import React, { useEffect, useState, useContext } from 'react';
import {
    View,
    Text,
    TextInput,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { fetchRestaurantById, updateRestaurant } from '../api/restaurantsApi';
import { AuthContext } from '../context/AuthContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { restaurantStyles as styles } from '../styles/restaurantStyles';

const EditRestaurantScreen = () => {
    const { params } = useRoute();
    const navigation = useNavigation();
    const { userToken } = useContext(AuthContext);

    const [restaurantData, setRestaurantData] = useState({
        name: '',
        address: '',
        phone: '',
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const loadRestaurant = async () => {
            try {
                const data = await fetchRestaurantById(params.id);
                setRestaurantData({
                    name: data.name,
                    address: data.address,
                    phone: data.phone,
                });
            } catch (error) {
                Alert.alert('Error', error.message || 'Failed to load restaurant');
                navigation.goBack();
            } finally {
                setLoading(false);
            }
        };
        loadRestaurant();
    }, []);

    const handleUpdate = async () => {
        if (!restaurantData.name || !restaurantData.address || !restaurantData.phone) {
            Alert.alert('Validation Error', 'All fields are required.');
            return;
        }

        setSubmitting(true);
        try {
            await updateRestaurant(params.id, {
                ...restaurantData,
                created_at: new Date().toISOString(),
            }, userToken);

            Alert.alert('Success', 'Restaurant updated successfully.', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } catch (error) {
            Alert.alert('Update Failed', error.message || 'Failed to update restaurant');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
        >
            <Text style={styles.title}>Edit Restaurant</Text>

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
                onPress={handleUpdate}
                disabled={submitting}
            >
                {submitting ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Update Restaurant</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
};

export default EditRestaurantScreen; 