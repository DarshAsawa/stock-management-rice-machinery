import { createContext } from 'react';

// Context for API Base URL and User
export const AppContext = createContext(null);

// Base URL for your backend API - picks from environment variable or falls back to localhost
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';