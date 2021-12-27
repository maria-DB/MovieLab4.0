import { useEffect, useState } from "react";
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import { TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setKeywords } from "../../redux/filterSlice";
import { clearMovie, getAllMovies } from "../../redux/movieSlice";
import { clearActors, getAllActor } from "../../redux/actorSlice";
import { clearProducer, getAllProducer } from "../../redux/producerSlice";

const YearFilter = () => {

const [value,setValue] = useState(new Date());
const { keywords } = useSelector(state => state.filter);

const dispatch = useDispatch();
const path = window.location.pathname
console.log(value);


useEffect(() => {
    if(keywords !== null && keywords.hasOwnProperty('year')) {
    switch (path) {
        case '/':
            dispatch(clearMovie());
            dispatch(getAllMovies({...keywords}));
            break;
        default:
            break;
            }
    }
    
}, [value]) 

    return ( 
        <>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
                views={['year']}
                label="Year only"
                value={value}
                onChange={(newValue) => {
                    setValue(newValue);
                    dispatch(setKeywords({...keywords, year:newValue.getFullYear()}));
                }}
                renderInput={(params) => <TextField {...params} helperText={null} />}
                />
        </LocalizationProvider>
        </>
     );
     
}
 
export default YearFilter;