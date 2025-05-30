import { StyleSheet } from 'react-native';
import { baseStyles } from './baseStyles';

export const restaurantStyles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        padding: 20,
        backgroundColor: '#fff',
    },
    centered: baseStyles.centered,

    // Restaurant detail view
    detailContainer: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
    },
    title: {
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

    // Restaurant list view
    card: {
        backgroundColor: '#f9f9f9',
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 10,
        elevation: 2,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    address: {
        fontSize: 14,
        color: '#555',
        marginTop: 4,
    },
    phone: {
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

    // Add/edit restaurant form
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

    searchContainer: {
        padding: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    searchInput: {
        height: 40,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
    },
}); 