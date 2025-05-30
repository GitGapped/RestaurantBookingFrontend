import React, { createContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, logoutUser, refreshToken } from '../api/authApi';
import {getTokens, removeTokens, saveTokens} from "../utils/storage";
import * as data from "../api/authApi";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [userToken, setUserToken] = useState(null);
    const [refreshTokenValue, setRefreshTokenValue] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load tokens from storage on app start
    useEffect(() => {
        const loadTokens = async () => {
            try {
                const { accessToken, refreshToken } = await getTokens();
                setUserToken(accessToken);
                setRefreshTokenValue(refreshToken);
            } catch (e) {
                console.error('Error loading tokens:', e);
            } finally {
                console.log('[AuthContext] Finished loading');
                setIsLoading(false);
            }
        };
        loadTokens();

        // Fallback timeout (temporary)
        setTimeout(() => setIsLoading(false), 5000); // force it off after 5 sec
    }, []);

    /**
     * Log in using email and password, save access and refresh tokens.
     */
    const login = async (email, password) => {
        setIsLoading(true);
        try {
            const { accessToken, refreshToken: newRefreshToken } = await loginUser(email, password);
            await saveTokens(accessToken, newRefreshToken);
            setUserToken(accessToken);
            setRefreshTokenValue(newRefreshToken);
        } catch (e) {
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Log out and clear stored tokens.
     */
    const logout = async () => {
        setIsLoading(true);
        try {
            if (userToken) await logoutUser(userToken);
        } catch (e) {
           // console.warn('Logout error (probably already expired):', e.message);
        }
        await removeTokens();
        setUserToken(null);
        setRefreshTokenValue(null);
        setIsLoading(false);
    };

    /**
     * Refresh the access token using the stored refresh token.
     */
    const refreshAuthToken = async () => {
        if (!refreshTokenValue) return;
        try {
            const newAccessToken = await refreshToken(refreshTokenValue);
            await AsyncStorage.setItem('userToken', newAccessToken);
            setUserToken(newAccessToken);
        } catch (e) {
            console.error('Refresh token failed:', e.message);
            await logout(); // logout on failure
        }
    };

    return (
        <AuthContext.Provider
            value={{
                userToken,
                isLoading,
                login,
                logout,
                refreshAuthToken,
                isAuthenticated: !!userToken,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
