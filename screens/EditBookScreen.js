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
import { fetchBookById, updateBook } from '../api/booksApi';
import { AuthContext } from '../context/AuthContext';
import { useNavigation, useRoute } from '@react-navigation/native';
import { bookStyles as styles } from '../styles/bookStyles';

const EditBookScreen = () => {
    const { params } = useRoute();
    const navigation = useNavigation();
    const { userToken } = useContext(AuthContext);

    const [bookData, setBookData] = useState({
        title: '',
        author: '',
        published_year: '',
        genre: '',
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const loadBook = async () => {
            try {
                const data = await fetchBookById(params.id);
                setBookData({
                    title: data.title,
                    author: data.author,
                    published_year: String(data.published_year),
                    genre: data.genre,
                });
            } catch (error) {
                Alert.alert('Error', error.message || 'Failed to load book');
                navigation.goBack();
            } finally {
                setLoading(false);
            }
        };
        loadBook();
    }, []);

    const handleUpdate = async () => {
        if (!bookData.title || !bookData.author || !bookData.published_year || !bookData.genre) {
            Alert.alert('Validation Error', 'All fields are required.');
            return;
        }

        setSubmitting(true);
        try {
            await updateBook(params.id, {
                ...bookData,
                published_year: parseInt(bookData.published_year, 10),
            }, userToken);

            Alert.alert('Success', 'Book updated successfully.', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } catch (error) {
            Alert.alert('Update Failed', error.message || 'Failed to update book');
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
            <Text style={styles.title}>Edit Book</Text>

            <TextInput
                style={styles.input}
                placeholder="Title"
                value={bookData.title}
                onChangeText={(text) => setBookData({ ...bookData, title: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Author"
                value={bookData.author}
                onChangeText={(text) => setBookData({ ...bookData, author: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Published Year"
                keyboardType="numeric"
                value={bookData.published_year}
                onChangeText={(text) => setBookData({ ...bookData, published_year: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Genre"
                value={bookData.genre}
                onChangeText={(text) => setBookData({ ...bookData, genre: text })}
            />

            <TouchableOpacity
                style={styles.button}
                onPress={handleUpdate}
                disabled={submitting}
            >
                {submitting ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Update Book</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
};

export default EditBookScreen;
