import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { fetchBooks } from '../api/booksApi';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { bookStyles as styles } from '../styles/bookStyles';

const BookListScreen = () => {
    const navigation = useNavigation();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadBooks = async () => {
        try {
            const data = await fetchBooks();
            setBooks(data);
        } catch (error) {
            console.error('Failed to fetch books:', error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            setLoading(true); // Show loading when coming back to this screen
            loadBooks();
        }, []) // No dependencies so this runs every time you navigate to this screen
    );

    const onRefresh = () => {
        setRefreshing(true);
        loadBooks();
    };

    const renderBook = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('BookDetail', { id: item.uuid })}
        >
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.author}>{item.author}</Text>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={books}
                keyExtractor={(item) => item.uuid}
                renderItem={renderBook}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={<Text style={styles.empty}>No books found.</Text>}
            />
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('AddBook')}
            >
                <Text style={styles.fabText}>＋</Text>
            </TouchableOpacity>
        </View>
    );
};

export default BookListScreen;