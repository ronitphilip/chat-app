import { configureStore } from "@reduxjs/toolkit";
import chatSlice from './slices/chatSlice'

export const chatStore = configureStore({
    reducer:{
        chatReducer : chatSlice
    }
})