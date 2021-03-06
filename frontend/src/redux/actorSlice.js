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
            console.log(obj);
            const response = await axios.get(`/api/v1/members/${obj.id.id}`)
            response.data.user = obj.user._id
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
export const createActorReview = createAsyncThunk(
    'actor/createActorReview',
    async(obj, {rejectWithValue}) => {
        try {
            const response = await axios.put(`/api/v1/members/new/reviews`, {...obj});
            response.data.review = obj;
            return response.data
            
        } catch (error) {
            return rejectWithValue(error.response.data)
            
        }
    }
)
export const deleteReview =  createAsyncThunk(
    'actor/deleteReview',
    async(obj, {rejectWithValue}) => {
        try {
            const response = await axios.delete(`/api/v1/members/delete/reviews?id=${obj.id}&memberId=${obj.memberId}`)
            return response.data
            
        } catch (error) {
            return rejectWithValue(error.response.data)
            
        }
    }
)

export const deleteActor = createAsyncThunk(
    'actor/deleteActor',
    async(obj, { rejectWithValue}) => {
        try {
            console.log(obj)
            const response = await axios.delete(`/api/v1/members/${obj}`)
            response.data.actorId = obj
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
            
        }
    }
)

export const createActor = createAsyncThunk(
    'actor/createActor',
    async(obj, {rejectWithValue}) => {
        try {
            const response = await axios.post(`/api/v1/members/new`,obj, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }

            })
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
            
        }
    }
)

export const editActor = createAsyncThunk(
    'actor/editActor',
    async(obj, {rejectWithValue}) => {
        try {
            const response = await axios.put(`/api/v1/members/${obj.get('_id')}`,obj, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }

            })
            
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
            
        }
    }
)

    

const initialState = {
    members:[],
    actorNames:[],
    actorNamesWithId: [],
    actor:null,
    reviews:[],
    userReview:null,
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
        },
        clearActorsNames : (state) => {
            state.actorNames = []
            state.clearActorsNames = []
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
            state.reviews = [...action.payload.member.member.reviews.filter(review => review.user !== action.payload.user)]
            state.userReview = action.payload.member.member.reviews.filter(review => review.user === action.payload.user)
            state.isLoading = false
        },
        [getActorDetail.rejected] : (state,action) => {
            state.errors = action.payload
            state.isLoading =false
        },
        [getActorNames.pending] : (state) => {
            state.isLoading = true
        },
        [getActorNames.fulfilled] : (state,action) => {

            const names = []

            action.payload.names.reduce((obj,item) => {
            return names.push({"title" : item})
            })
            state.actorNames = names
            state.actorNamesWithId = action.payload.name_id
            state.isLoading = false
        },
        [getActorNames.rejected] : (state,action) => {
            state.errors = action.payload
            state.isLoading = false
        },
        [createActorReview.pending] : (state) => {
            state.isLoading = true
        },
        [createActorReview.fulfilled] : (state,action) => {
            state.reviews = [...action.payload.reviews.filter(review => review.user !== action.payload.review.user._id)]
            state.userReview = action.payload.reviews.filter(review => review.user === action.payload.review.user._id)
            state.isLoading = false
        },
        [createActorReview.rejected] : (state,action) => {
            state.errors = action.payload
            state.isLoading = false
        },
        [deleteReview.pending] : (state) => {
            state.isLoading = true
        },
        [deleteReview.fulfilled] : (state,action) => {
            state.message = action.payload.message
            state.userReview = null
            state.isLoading  = false
        },
        [deleteReview.rejected] : (state,action) => {
            state.errors = action.payload
            state.isLoading = false
        },
        [deleteActor.pending] : (state) =>{
            state.isLoading = true
        },
        [deleteActor.fulfilled] : (state,action) => {
    
            state.message = action.payload.message
            state.members = [...state.members.filter(member => member._id !== action.payload.actorId)]
            state.isLoading = false
        },
        [deleteActor.rejected] : (state,action) => {
            state.errors = action.payload
            state.isLoading = false
        },
        [createActor.pending] : (state) => {
            state.isLoading = true
        },
        [createActor.fulfilled] : (state,action) => {
            state.message = action.payload.message
            state.members = [action.payload.member,...state.members]
            state.isLoading = false
        },
        [createActor.rejected] : (state, action) => {
            state.errors = action.payload
            state.isLoading = false
    
        },
        [editActor.pending] : (state) => {
            state.isLoading = true
        },
        [editActor.fulfilled] : (state,action) => {
            state.message = action.payload.message
            const memberIndex = state.members.findIndex(member => member._id === action.payload.member._id);
            state.members[memberIndex] = {...action.payload.member}
            state.isLoading = false
        },
        [editActor.rejected] : (state, action) => {
            state.errors = action.payload
            state.isLoading = false
    
        }
    }
})
export const { setHasMore, setPage, clearActors, clearActorsNames } = actorSlice.actions
export default actorSlice.reducer
