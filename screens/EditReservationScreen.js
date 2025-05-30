import React, { useEffect, useState, useContext } from 'react';
import {
    View,
    Text,
    TextInput,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
    ScrollView,
    Platform,
    StyleSheet,
} from 'react-native';
import { fetchReservationById, updateReservation } from '../api/reservationsApi';
import { fetchRestaurantById } from '../api/restaurantsApi';
import { AuthContext } from '../context/AuthContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { restaurantStyles as styles } from '../styles/restaurantStyles';
import DateTimePicker from '@react-native-community/datetimepicker';

const EditReservationScreen = () => {
    const { params } = useRoute();
    const navigation = useNavigation();
    const { userToken } = useContext(AuthContext);

    const [reservationData, setReservationData] = useState({
        user_id: '',
        restaurant_id: '',
        reservation_datetime: '',
        guests: '',
        status: '',
    });
    const [restaurantName, setRestaurantName] = useState('');
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        const loadReservation = async () => {
            try {
                const data = await fetchReservationById(params.id);
                console.log('Reservation data:', data);
                const date = new Date(data.reservation_datetime);
                setSelectedDate(date);

                setReservationData({
                    user_id: data.user_id.toString(),
                    restaurant_id: data.restaurant_id.toString(),
                    reservation_datetime: date.toISOString().slice(0, 16),
                    guests: data.guests.toString(),
                    status: data.status,
                });

                if (params?.restaurantId) {
                    try {
                        const restaurantData = await fetchRestaurantById(params.restaurantId);
                        setRestaurantName(restaurantData.name);
                    } catch (error) {
                        console.error('Error fetching restaurant:', error);
                        setRestaurantName('Restaurant #' + data.restaurant_id);
                    }
                } else {
                    setRestaurantName('Restaurant #' + data.restaurant_id);
                }

                setUserName(data.username || 'Unknown User');

            } catch (error) {
                console.error('Error loading reservation:', error);
                Alert.alert('Error', error.message || 'Failed to load reservation');
                navigation.goBack();
            } finally {
                setLoading(false);
            }
        };
        loadReservation();
    }, [params]);

    const onDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const newDate = new Date(selectedDate);
            newDate.setHours(selectedDate.getHours());
            newDate.setMinutes(selectedDate.getMinutes());
            setSelectedDate(newDate);
            setReservationData({
                ...reservationData,
                reservation_datetime: newDate.toISOString().slice(0, 16),
            });
        }
    };

    const onTimeChange = (event, selectedTime) => {
        setShowTimePicker(false);
        if (selectedTime) {
            const newDate = new Date(selectedDate);
            newDate.setHours(selectedTime.getHours());
            newDate.setMinutes(selectedTime.getMinutes());
            setSelectedDate(newDate);
            setReservationData({
                ...reservationData,
                reservation_datetime: newDate.toISOString().slice(0, 16),
            });
        }
    };

    const handleUpdate = async () => {
        if (!reservationData.reservation_datetime || !reservationData.guests) {
            Alert.alert('Validation Error', 'Date and number of guests are required.');
            return;
        }

        setSubmitting(true);
        try {
            // Format the datetime preserving local time
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDate.getDate()).padStart(2, '0');
            const hours = String(selectedDate.getHours()).padStart(2, '0');
            const minutes = String(selectedDate.getMinutes()).padStart(2, '0');
            const seconds = String(selectedDate.getSeconds()).padStart(2, '0');
            
            const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
            console.log('Updating reservation with datetime:', formattedDateTime);

            await updateReservation(params.id, {
                reservation_datetime: formattedDateTime,
                guests: parseInt(reservationData.guests)
            }, userToken);

            Alert.alert('Success', 'Reservation updated successfully.', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } catch (error) {
            console.error('Update error:', error);
            Alert.alert('Update Failed', error.message || 'Failed to update reservation');
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
            <Text style={styles.title}>Edit Reservation</Text>

            <View style={styles.readOnlyField}>
                <Text style={styles.label}>User</Text>
                <Text style={styles.value}>{userName}</Text>
            </View>

            <View style={styles.readOnlyField}>
                <Text style={styles.label}>Restaurant</Text>
                <Text style={styles.value}>{restaurantName}</Text>
            </View>

            <Text style={styles.label}>Date and Time</Text>
            <View style={localStyles.dateTimeContainer}>
                <TouchableOpacity
                    style={[localStyles.datePickerButton, { flex: 1, marginRight: 8 }]}
                    onPress={() => setShowDatePicker(true)}
                >
                    <Text style={localStyles.datePickerButtonText}>
                        {selectedDate.toLocaleDateString()}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[localStyles.datePickerButton, { flex: 1 }]}
                    onPress={() => setShowTimePicker(true)}
                >
                    <Text style={localStyles.datePickerButtonText}>
                        {selectedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </TouchableOpacity>
            </View>

            {showDatePicker && (
                <DateTimePicker
                    testID="datePicker"
                    value={selectedDate}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                />
            )}

            {showTimePicker && (
                <DateTimePicker
                    testID="timePicker"
                    value={selectedDate}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={onTimeChange}
                />
            )}

            <Text style={styles.label}>Number of Guests</Text>
            <TextInput
                style={styles.input}
                placeholder="Number of Guests"
                value={reservationData.guests}
                onChangeText={(text) => setReservationData({ ...reservationData, guests: text })}
                keyboardType="numeric"
            />

            <View style={styles.readOnlyField}>
                <Text style={styles.label}>Status</Text>
                <Text style={styles.value}>{reservationData.status}</Text>
            </View>

            <TouchableOpacity
                style={[localStyles.button, submitting && localStyles.buttonDisabled]}
                onPress={handleUpdate}
                disabled={submitting}
            >
                {submitting ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={localStyles.buttonText}>Update Reservation</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
};

const localStyles = StyleSheet.create({
    dateTimeContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    datePickerButton: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    datePickerButtonText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
    },
    button: {
        backgroundColor: '#2196F3',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    buttonDisabled: {
        backgroundColor: '#90CAF9',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default EditReservationScreen; 