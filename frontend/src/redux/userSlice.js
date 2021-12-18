import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const loginUser = createAsyncThunk(
    'user/login',
    async(obj, {rejectWithValue}) => {
        try {
            const response = await axios.post('/api/v1/login', {...obj})
            return response.data
            
        } catch (error) {
            return rejectWithValue(error.response.data);
            
        }

    }
)

export const logout = createAsyncThunk(
    'user/logout',
    async(obj, {rejectWithValue}) => {
    try {
        const response = await axios.get('/api/v1/logout')
        return response.data
        
    } catch (error) {
        return rejectWithValue(error.response.data);
        
    }

}

)

export const registerUser = createAsyncThunk(
    'user/register',
    async(obj, {rejectWithValue}) => {
        try {
            const response = await axios.post('/api/v1/users',obj,{
                headers: {
                    "Content-Type" : "multipart/data"
                }
            })

            return response.data
            
        } catch (error) {
            return rejectWithValue(error.response.data);
            
        }

    }
)

export const getUserInfo = createAsyncThunk(
    'user/getUserInfo',
    async(obj, {rejectWithValue}) => {
        try {
            const response = await axios.get(`/api/v1/users/${obj.id}`)
            return response.data
            
        } catch (error) {
            return rejectWithValue(error.response.data);
            
        }

    }
)

export const googleRegister = createAsyncThunk(
    'user/googleRegister',
    async(obj, {rejectWithValue}) => {
        try {
            const response =await axios.post('/api/v1/google/register', obj);
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
)


const initialState = {
    user:null,
    email:'',
    name:'',
    avatar:'',
    token:null,
    isLogin:false,
    isLoading:false,
    errors:null,
    onRegister:false,
    onRegisterAvatar:'',
    isAdmin: false,
    onGoogle:false,
};


const userSlice = createSlice({
    name : 'user',
    initialState,
    reducers: {
        setRegister : (state,action) => {
            state.onRegister = action.payload
        },
        setonRegisterAvatar : (state,action) => {
            state.onRegisterAvatar = action.payload
        },
        setEmail : (state,action) => {
            state.email = action.payload
        },
        setonGoogle : (state,action) => {
            state.email = action.payload
        },
        clearError : (state) => {
            state.errors = null
        }

    },
    extraReducers: {
        [loginUser.pending] : (state) => {
            state.isLoading = true
        },
        [loginUser.fulfilled] : (state,action) => {
            state.user = action.payload.user
            state.token = action.payload.token
            state.isLogin = true
            state.name = action.payload.name
            // state.isAdmin = action.payload.user.role === 'Admin' ? trrue : false
            state.isLoading = false
            if(action.payload.success === true) localStorage.setItem('id',action.payload.user._id)
        },
        [loginUser.rejected] : (state,action) => {
            state.errors = action.payload
            state.isLoading = false
        },
        [logout.pending] : (state) => {
            state.isLoading = true
        },
        [logout.fulfilled] : (state,action) => {
            state.user = null
            state.token = null
            state.email = ''
            state.name = ''
            state.isLogin = false
            state.isLoading = false
            state.isAdmin = false
            localStorage.clear()
        },
        [logout.rejected] : (state,action) => {
            state.errors = action.payload
            state.isLoading = false
        },
        [registerUser.pending] : (state) => {
            state.isLoading = true
        },
        [registerUser.fulfilled] : (state,action) => {
            state.user = action.payload.user
            state.token = action.payload.token
            state.isLogin = true
            state.name = action.payload.name
            // state.isAdmin = action.payload.user.role === 'Admin' ? trrue : false
            state.isLoading = false
            if(action.payload.success === true) localStorage.setItem('id',action.payload.user._id)

        },
        [registerUser.rejected] : (state,action) => {
            state.errors = action.payload
            state.isLoading = false
        },
        [getUserInfo.pending] : (state) => {
            state.isLoading = true
        },
        [getUserInfo.fulfilled] : (state,action) => {
            state.user = action.payload.user
            // state.token = action.payload.token
            state.isLogin = true
            state.name = action.payload.name
            // state.isAdmin = action.payload.user.role === 'Admin' ? trrue : false
            state.isLoading = false
            // if(action.payload.success === true) localStorage.setItem('id',action.payload.user._id)

        },
        [getUserInfo.rejected] : (state,action) => {
            state.errors = action.payload
            state.isLoading = false
        },
        [googleRegister.pending] : (state) => {
            state.isLoading = true
        },
        [googleRegister.fulfilled] : (state,action) => {
            state.user = action.payload.user
            state.email = action.payload.user.email
            state.token = action.payload.token
            state.isLogin = true
            state.isLoading = false
            // state.isAdmin = action.payload.user.role === 'Admin' ? true : false
            if(action.payload.success === true) localStorage.setItem('id',action.payload.user._id)
            // if(action.payload.success === true) localStorage.setItem('googleId',action.payload.user._id)
            
        },
        [googleRegister.rejected] : (state,action) => {
            state.errors = action.payload
            state.isLoading = false 
        }
    }
});
export const { setRegister, setonRegisterAvatar, setEmail, setonGoogle, clearError} = userSlice.actions
export default userSlice.reducer
