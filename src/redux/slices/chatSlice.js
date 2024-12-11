import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import serverURL from "../serverURL";

// to fetch the user details from the server
export const fetchUserData = createAsyncThunk('user,fetchUserData',async () => {
    const result = await axios.get(`${serverURL}/userDetails`)
    // console.log('chatSlice api',result.data);
    return result.data;
})

// to add a new user to the user details
export const addNewUser = createAsyncThunk('user,addNewUser',async (newUser) => {
    const result = await axios.post(`${serverURL}/userDetails`,newUser)
    // console.log('addNewUser',result.data);
    return result.data;
})

// to update the password of user
export const resPass = createAsyncThunk('user/resPass', async ({ id, updatedPassword }, thunkAPI) => {
    try {
        const result = await axios.patch(`${serverURL}/userDetails/${id}`, {
            password: updatedPassword // Only update the password
        });
        return { id, password: updatedPassword }; // Return the updated fields
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
    }
});

// to update user details
export const updateUserDetails = createAsyncThunk('user/updateUserDetails', async ({ id, updatedDetails }, thunkAPI) => {
      try {
        const result = await axios.patch(`${serverURL}/userDetails/${id}`, updatedDetails);
        return result.data; // Return the updated user data
      } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
    }
);

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        allUsers: [],
        error: null,
        status: 'idle'
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
          .addCase(fetchUserData.fulfilled, (state, action) => {
            state.allUsers = action.payload;
          })
          .addCase(addNewUser.fulfilled, (state, action) => {
            state.allUsers.push(action.payload);
          })
          .addCase(resPass.fulfilled, (state, action) => {
            const index = state.allUsers.findIndex(user => user.id === action.payload.id);
            if (index !== -1) {
              state.allUsers[index] = {
                ...state.allUsers[index],
                password: action.payload.password // Update only the password
              };
            }
          })
          .addCase(resPass.rejected, (state, action) => {
            state.error = action.payload;
          })
          .addCase(updateUserDetails.fulfilled, (state, action) => {
            const index = state.allUsers.findIndex(user => user.id === action.payload.id);
            if (index !== -1) {
              state.allUsers[index] = action.payload; // Update the user with the new details
            }
          })
          .addCase(updateUserDetails.rejected, (state, action) => {
            state.error = action.payload; // Handle any errors
          });
      }
    });

export default chatSlice.reducer;