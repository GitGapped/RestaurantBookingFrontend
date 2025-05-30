import React, { useCallback, useState, useContext } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Alert,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import { fetchBookById, deleteBook } from '../api/booksApi';
import { AuthContext } from '../context/AuthContext';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { bookStyles as styles } from '../styles/bookStyles';

const BookDetailScreen = () => {
    const { params } = useRoute();
    const navigation = useNavigation();
    const { userToken } = useContext(AuthContext);

    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadBook = async () => {
        if (!params?.id) return;
        try {
            const data = await fetchBookById(params.id);
            setBook(data);
        } catch (error) {
            Alert.alert('Error', error.message || 'Could not load book details.');
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadBook();
        }, [params?.id])
    );

    const handleDelete = async () => {
        Alert.alert('Confirm Delete', 'Are you sure you want to delete this book?', [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await deleteBook(params.id, userToken);
                        Alert.alert('Deleted', 'Book deleted successfully.');
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

    if (!book) {
        return (
            <View style={styles.centered}>
                <Text>Book not found.</Text>
            </View>
        );
    }

    if (!params?.id) {
        return (
            <View style={styles.centered}>
                <Text>Invalid book ID.</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.detailContainer}>
        <Text style={styles.title}>{book.title}</Text>
            <Text style={styles.label}>Author:</Text>
            <Text style={styles.value}>{book.author}</Text>

            <Text style={styles.label}>Published Year:</Text>
            <Text style={styles.value}>{book.published_year}</Text>

            <Text style={styles.label}>Genre:</Text>
            <Text style={styles.value}>{book.genre}</Text>

            <TouchableOpacity
                style={[styles.deleteButton, { backgroundColor: '#007AFF', marginBottom: 10 }]}
                onPress={() => navigation.navigate('EditBook', { id: book.uuid })}
            >
                <Text style={styles.deleteButtonText}>Edit Book</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.deleteButton}
                onPress={handleDelete}
            >
                <Text style={styles.deleteButtonText}>Delete Book</Text>
            </TouchableOpacity>

        </ScrollView>
    );
};

export default BookDetailScreen;
