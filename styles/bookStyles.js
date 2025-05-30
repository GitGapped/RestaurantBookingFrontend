import { StyleSheet } from 'react-native';
import { baseStyles } from './baseStyles';

export const bookStyles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        padding: 20,
        backgroundColor: '#fff',
    },
    centered: baseStyles.centered,

    // Book detail view
    detailTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 12,
        color: '#333',
    },
    value: {
        fontSize: 16,
        marginBottom: 8,
    },
    deleteButton: {
        marginTop: 30,
        backgroundColor: '#ff3b30',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },

    // Book list view
    card: {
        backgroundColor: '#f9f9f9',
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 10,
        elevation: 2,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    author: {
        fontSize: 14,
        color: '#555',
        marginTop: 4,
    },
    empty: {
        textAlign: 'center',
        marginTop: 40,
        color: '#888',
        fontSize: 16,
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#007AFF',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
    },
    fabText: {
        color: 'white',
        fontSize: 32,
        marginBottom: 2,
    },

    // Add/edit book form
    formContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
        backgroundColor: '#fff',
    },
    formTitle: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 24,
        alignSelf: 'center',
    },
    input: baseStyles.input,
    submitButton: baseStyles.button,
    submitButtonText: baseStyles.buttonText,
});
