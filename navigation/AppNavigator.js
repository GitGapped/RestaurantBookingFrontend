import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity, Text } from 'react-native';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import BookListScreen from '../screens/BookListScreen';
import BookDetailScreen from '../screens/BookDetailScreen';
import AddBookScreen from '../screens/AddBookScreen';
import EditBookScreen from '../screens/EditBookScreen';
import RestaurantListScreen from '../screens/RestaurantListScreen';
import RestaurantDetailScreen from '../screens/RestaurantDetailScreen';
import AddRestaurantScreen from '../screens/AddRestaurantScreen';
import EditRestaurantScreen from '../screens/EditRestaurantScreen';
import ReservationListScreen from '../screens/ReservationListScreen';
import EditReservationScreen from '../screens/EditReservationScreen';
import AddReservationScreen from '../screens/AddReservationScreen';

import { AuthContext } from '../context/AuthContext';

const Stack = createStackNavigator();

const AppNavigator = () => {
    const { isLoading, userToken, logout } = useContext(AuthContext);

    if (isLoading) {
        return <SplashScreen />;
    }

    return (
        <Stack.Navigator screenOptions={{ headerShown: true }}>
            {userToken == null ? (
                <>
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="Register" component={RegisterScreen} />
                </>
            ) : (
                <>
                    <Stack.Screen
                        name="RestaurantList"
                        component={RestaurantListScreen}
                        options={{
                            headerRight: () => (
                                <TouchableOpacity onPress={logout} style={{ marginRight: 15 }}>
                                    <Text style={{ color: '#007AFF' }}>Logout</Text>
                                </TouchableOpacity>
                            ),
                        }}
                    />
                    <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
                    <Stack.Screen name="AddRestaurant" component={AddRestaurantScreen} />
                    <Stack.Screen name="EditRestaurant" component={EditRestaurantScreen} />
                    <Stack.Screen name="ReservationList" component={ReservationListScreen} />
                    <Stack.Screen name="EditReservation" component={EditReservationScreen} />
                    <Stack.Screen name="AddReservation" component={AddReservationScreen} />
                    <Stack.Screen name="BookList" component={BookListScreen} />
                    <Stack.Screen name="BookDetail" component={BookDetailScreen} />
                    <Stack.Screen name="AddBook" component={AddBookScreen} />
                    <Stack.Screen name="EditBook" component={EditBookScreen} />
                </>
            )}
        </Stack.Navigator>
    );
};

export default AppNavigator;
