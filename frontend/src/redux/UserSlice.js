import { createSlice } from "@reduxjs/toolkit";
import {createSlice} from require("@reduxjs/toolkit")
const userSlice = createSlice({
    name: 'User',
    initialState: {
        user:null
    },
    reducers: {
        setUser: (state, action) => {
            state.user=action.payload
        }
    }
})
export const { setUser } = userSlice.actions
export default userSlice.reducer