import React, { useState, useContext } from 'react';
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
import { createReservation } from '../api/reservationsApi';
import { AuthContext } from '../context/AuthContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddReservationScreen = () => {
    const { params } = useRoute();
    const navigation = useNavigation();
    const { userToken } = useContext(AuthContext);

    console.log('Route params:', params);

    const [reservationData, setReservationData] = useState({
        reservation_datetime: '',
        guests: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

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

    const handleAddReservation = async () => {
        if (!reservationData.reservation_datetime || !reservationData.guests) {
            Alert.alert('Validation Error', 'Date and number of guests are required.');
            return;
        }

        if (!params.restaurantId) {
            Alert.alert('Error', 'Restaurant information is missing.');
            return;
        }

        setSubmitting(true);
        try {
            const formattedDateTime = selectedDate.toISOString().slice(0, 19).replace('T', ' ');
            const currentDate = new Date();
            const formattedCreatedAt = currentDate.toISOString().slice(0, 19).replace('T', ' ');

            const reservationPayload = {
                user_id: 6, // Hardcoded for now, should come from AuthContext user_id
                restaurant_id: params.restaurantId,
                reservation_datetime: formattedDateTime,
                guests: parseInt(reservationData.guests),
                status: 'pending',
                created_at: formattedCreatedAt,
            };

            console.log('Creating reservation with payload:', reservationPayload);

            const response = await createReservation(reservationPayload, userToken);
            console.log('Reservation created successfully:', response);

            Alert.alert('Success', 'Reservation created successfully.', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } catch (error) {
            console.error('Add reservation error:', error);
            Alert.alert('Add Failed', error.message || 'Failed to create reservation');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
        >
            <Text style={styles.title}>New Reservation</Text>

            <Text style={styles.label}>Date and Time</Text>
            <View style={styles.dateTimeContainer}>
                <TouchableOpacity
                    style={[styles.datePickerButton, { flex: 1, marginRight: 8 }]}
                    onPress={() => setShowDatePicker(true)}
                >
                    <Text style={styles.datePickerButtonText}>
                        {selectedDate.toLocaleDateString()}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.datePickerButton, { flex: 1 }]}
                    onPress={() => setShowTimePicker(true)}
                >
                    <Text style={styles.datePickerButtonText}>
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

            <TouchableOpacity
                style={[styles.button, submitting && styles.buttonDisabled]}
                onPress={handleAddReservation}
                disabled={submitting}
            >
                {submitting ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Create Reservation</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333',
    },
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
    input: {
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#ddd',
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

export default AddReservationScreen; 