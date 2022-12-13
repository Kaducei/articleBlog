import { configureStore, combineReducers } from '@reduxjs/toolkit';

import articlesAPI from '../components/services/articlesService';

import loginSlice from './slices/loginSlice';

export const rootReducer = combineReducers({
  [articlesAPI.reducerPath]: articlesAPI.reducer,
  loginSlice,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(articlesAPI.middleware),
});
