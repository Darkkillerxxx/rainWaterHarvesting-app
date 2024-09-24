// store.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';
//import thunk from 'redux-thunk'; // Thunk is included in Redux Toolkit by default
import picklistValueReducer from '../features/getPicklistValuesSlice'; // A slice for handling data
import userDetailsReducer from '../features/userDetails';

// Persist config
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

// Combine reducers
const rootReducer = combineReducers({
  data: picklistValueReducer,
  userDetails:userDetailsReducer
});

// Persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Example: disabling serializable check
    })// Thunk is included by default, but you can customize the middleware array
});

const persistor = persistStore(store);

export { store, persistor };