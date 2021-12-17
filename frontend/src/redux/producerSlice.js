import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getAllProducer = createAsyncThunk(
    'producer/getAllProducer',
    async(obj,{rejectWithValue}) => {
        try {
            let keywords = '';
                if(obj.toString().length > 0) {
                    keywords = Object.keys(obj).map((item,index) => {
                        return `${item}=${obj[item]}`
                    }).join('&')
                }


            const response = await axios.get(`/api/v1/members?role=Producer&${keywords}`)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data)
            
        }
    }
)

export const getProducerDetail = createAsyncThunk(
    'producer/getProducerDetail', 
    async(obj, {rejectWithValue}) => {
        try {
            const response = await axios.get(`/api/v1/members/${obj.id}`)
            return response.data

        } catch (error) {
            return rejectWithValue(error.response.data)
            
        }
    }
    
)

export const getProducerNames = createAsyncThunk(
    'producer/getProducerNames',
    async(obj, {rejectWithValue}) => {
        try {
            const response = await axios.get(`/api/v1/members/all/names?role=Producer`)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
            
        }
    }
)

const initialState = {
    members:[],
    producer:null,
    producerNames:[],
    membersCount:0,
    resPerPage:20,
    isLoading:false,
    errors:null,
    hasMore:true,
    page:1,
};



const producerSlice = createSlice({
    name : 'member',
    initialState,
    reducers: {
        setHasMore : (state,action) => {
            state.hasMore = action.payload
        },
        setPage : (state,action) => {
            state.page = action.payload
        },
        clearProducer :(state) => {
            state.members = []
            state.page = 1

        }
    },
    extraReducers: {
        [getAllProducer.pending] : (state) => {
            state.isLoading = true
        },
        [getAllProducer.fulfilled] : (state,action) => {
            state.members = [...state.members, ...action.payload.members]
            state.membersCount = action.payload.membersCount
            state.resPerpage = action.payload.resPerPage
            state.page = state.page + 1
            state.isLoading = false
        },
        [getAllProducer.rejected] : (state,action) => {
            state.errors = action.payload
            state.isLoading = false
    },
        [getProducerDetail.pending] : (state) => {
            state.isLoading = true
    },
        [getProducerDetail.fulfilled] : (state,action) => {
            state.producer = action.payload.member
            state.isLoading = false
    },
        [getProducerDetail.rejected] : (state,action) => {
        state.errors = action.payload
        state.isLoading =false
    },
    [getProducerNames.pending] : (state) => {
        state.isLoading = true
    },
    [getProducerNames.fulfilled] : (state,action) => {

        const names = []

        action.payload.names.reduce((obj,item) => {
            return names.push({"title" : item})
        })
        state.producerNames = names
        state.isLoading = false
    },
    [getProducerNames.rejected] : (state,action) => {
        state.errors = action.payload
        state.isLoading = false
    }

}
})
export const { setHasMore, setPage, clearProducer } = producerSlice.actions
export default producerSlice.reducer
