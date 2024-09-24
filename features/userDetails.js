import { createSlice } from '@reduxjs/toolkit';

const userDetailsSlice = createSlice({
    name:'userDetails',
    initialState: {
        userDetails:null,
        error: null,
    },
    reducers:{
        storeUserDetails: (state,action) =>{
            state.userDetails = action.payload;
        }
    }
})
export const { storeUserDetails } = userDetailsSlice.actions;

export default userDetailsSlice.reducer;