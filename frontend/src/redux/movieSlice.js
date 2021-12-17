import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getAllMovies = createAsyncThunk(
    'movie/getAllMovies',
    async(obj,{rejectWithValue}) => {
        try {
            let keywords = '';
                if(obj.toString().length > 0) {
                    keywords = Object.keys(obj).map((item,index) => {
                        return `${item}=${obj[item]}`
                    }).join('&')
                }


            const response = await axios.get(`/api/v1/movies?${keywords}`)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data)
            
        }
    }
)


export const getMovie = createAsyncThunk(
    'movie/getMovie', 
    async(obj, {rejectWithValue}) => {
        try {
            const response = await axios.get(`/api/v1/movies/${obj.id}`)
            return response.data

        } catch (error) {
            return rejectWithValue(error.response.data)
            
        }
    }
    
)

export const getMovieTitles = createAsyncThunk(
    'movie/getMovieTitles',
    async(obj, {rejectWithValue}) => {
        try {
            const response = await axios.get(`/api/v1/movies/all/titles`)
            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data)
            
        }
    }
)

const initialState = {
    movies:[],
    titles:[],
    movie:null,
    moviesCount:0,
    resPerPage:20,
    filteredMoviesCount:0,
    isLoading:false,
    errors:null,
    hasMore:true,
    page:1,
};



const movieSlice = createSlice({
    name : 'movie',
    initialState,
    reducers: {
        setHasMore : (state,action) => {
            state.hasMore = action.payload
        },
        setPage : (state,action) => {
            state.page = action.payload
        },
        clearMovie :(state) => {
            state.movies = []
            state.page = 1

        }
    },
    extraReducers: {
        [getAllMovies.pending] : (state) => {
            state.isLoading = true
        },
        [getAllMovies.fulfilled] : (state,action) => {
            state.movies = [...state.movies, ...action.payload.movies]
            state.moviesCount = action.payload.moviesCount
            state.resPerpage = action.payload.resPerPage
            state.filteredMoviesCount = action.payload.filteredMoviesCount
            state.page = state.page + 1
            state.isLoading = false
        },
        [getAllMovies.rejected] : (state,action) => {
            state.errors = action.payload
            state.isLoading = false
    },
    [getMovie.pending] : (state) => {
        state.isLoading = true
    },
    [getMovie.fulfilled] : (state,action) => {
        state.movie = action.payload.movie
        state.isLoading = false
    },
    [getMovie.rejected] : (state,action) => {
        state.errors = action.payload
        state.isLoading = false
    },
    [getMovieTitles.pending] : (state) => {
        state.isLoading = true
    },
    [getMovieTitles.fulfilled] : (state,action) => {

        const titles = []

        action.payload.titles.reduce((obj,item) => {
            return titles.push({"title" : item})
        })
        state.titles = titles
        state.isLoading = false
    },
    [getMovieTitles.rejected] : (state,action) => {
        state.errors = action.payload
        state.isLoading = false
    }
}
})
export const { setHasMore, setPage, clearMovie } = movieSlice.actions
export default movieSlice.reducer
