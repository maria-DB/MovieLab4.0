import { TextField } from "@mui/material";
import  Autocomplete  from '@mui/material/Autocomplete';
import { useEffect, useState } from 'react';
import { useDispatch,useSelector } from "react-redux";
import { clearActors, getAllActor } from "../../redux/actorSlice";

import { clearFilters, setKeywords } from "../../redux/filterSlice";
import { clearMovie, getAllMovies } from "../../redux/movieSlice";
import { clearProducer, getAllProducer } from "../../redux/producerSlice";
const SearchBar = ({items,label}) => {

    // const [items,setItems] = useState([]);
    const { keywords } = useSelector(state => state.filter);
    const dispatch = useDispatch();

    const path = window.location.pathname
    console.log(path);

    useEffect(() => {
        return () => {
            dispatch(clearFilters())
        }
    }, [])

    const handleSearch = (e) => {
        // e.preventDefault();
        if(e.key === 'Enter'){
            console.log(e, 'enter');
            if (path === '/actors') {dispatch(clearActors()); dispatch(getAllActor({...keywords})); return;}
            if (path === '/producers') {dispatch(clearProducer()); dispatch(getAllProducer({...keywords})); return;}
            if (path === '/') {dispatch(clearMovie()); dispatch(getAllMovies({...keywords})); return;}
        
        }
    }

    const handleOnChange = (e) => {
        e.preventDefault();
        if (path === '/') return dispatch(setKeywords({...keywords, title: e.target.value}));
        if (path === '/actors') return dispatch(setKeywords({...keywords, name: e.target.value}));
        if (path === '/producers') return dispatch(setKeywords({...keywords, name: e.target.value}));
        console.log(e.target.value);
    }

    const handleAutoComplete = (event,value,reason) => {
        event.preventDefault();
        if (path === '/') return dispatch(setKeywords({...keywords, title: value}));
        if (path === '/actors') return dispatch(setKeywords({...keywords, name: value}));
        if (path === '/producers') return dispatch(setKeywords({...keywords, name: value}));
        console.log(event.target.value);
    }
    return ( 
        <>
        <Autocomplete
            id="free-solo-2-demo"
            freeSolo
            options={items && items.map((option) => option.title)}
            renderInput={(params) => <TextField {...params} label={label} 
            onChange={handleOnChange}
            onKeyPress={handleSearch}
            />}
            onChange={handleAutoComplete}
      />
        </>
     );
}
 
export default SearchBar;