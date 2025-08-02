import { createContext } from 'react';

// Context for API Base URL and User
export const AppContext = createContext(null);

// Base URL for your backend API
export const API_BASE_URL = 'http://localhost:3001/api'; // This will be dynamic in Docker 