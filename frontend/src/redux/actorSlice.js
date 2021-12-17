import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getAllActor = createAsyncThunk(
    'actor/getAllActor',
    async(obj,{rejectWithValue}) => {
        try {
            let keywords = '';
                if(obj.toString().length > 0) {
                    keywords = Object.keys(obj).map((item,index) => {
                        return `${item}=${obj[item]}`
                    }).join('&')
                }


            const response = await axios.get(`/api/v1/members?role=Actor&role=Actress&${keywords}`)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data)
            
        }
    }
)

export const getActorDetail = createAsyncThunk(
    'actor/getActorDetail', 
    async(obj, {rejectWithValue}) => {
        try {
            const response = await axios.get(`/api/v1/members/${obj.id}`)
            return response.data

        } catch (error) {
            return rejectWithValue(error.response.data)
            
        }
    }
)
export const getActorNames = createAsyncThunk(
    'Actor/getActorNames',
    async(obj, {rejectWithValue}) => {
        try {
            const response = await axios.get(`/api/v1/members/all/names?role=Actors&role=Actress`)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
            
        }
    }
)
    

const initialState = {
    members:[],
    actorNames:[],
    actor:null,
    membersCount:0,
    resPerPage:20,
    isLoading:false,
    errors:null,
    hasMore:true,
    page:1,
};



const actorSlice = createSlice({
    name : 'member',
    initialState,
    reducers: {
        setHasMore : (state,action) => {
            state.hasMore = action.payload
        },
        setPage : (state,action) => {
            state.page = action.payload
        },
        clearActors : (state) =>{
            state.members = []
            state.page = 1
        }
    },
    extraReducers: {
        [getAllActor.pending] : (state) => {
            state.isLoading = true
        },
        [getAllActor.fulfilled] : (state,action) => {
            state.members = [...state.members, ...action.payload.members]
            state.membersCount = action.payload.membersCount
            state.resPerpage = action.payload.resPerPage
            state.page = state.page + 1
            state.isLoading = false
        },
        [getAllActor.rejected] : (state,action) => {
            state.errors = action.payload
            state.isLoading = false
    },
    [getActorDetail.pending] : (state) => {
        state.isLoading = true
},
    [getActorDetail.fulfilled] : (state,action) => {
        state.actor = action.payload.member
        state.isLoading = false
},
    [getActorDetail.rejected] : (state,action) => {
    state.errors = action.payload
    state.isLoading =false
},[getActorNames.pending] : (state) => {
    state.isLoading = true
},
[getActorNames.fulfilled] : (state,action) => {

    const names = []

    action.payload.names.reduce((obj,item) => {
        return names.push({"title" : item})
    })
    state.actorNames = names
    state.isLoading = false
},
[getActorNames.rejected] : (state,action) => {
    state.errors = action.payload
    state.isLoading = false
}
}
})
export const { setHasMore, setPage, clearActors } = actorSlice.actions
export default actorSlice.reducer
