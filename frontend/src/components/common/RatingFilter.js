import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Rating } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setKeywords } from "../../redux/filterSlice";
import { clearMovie, getAllMovies } from "../../redux/movieSlice";

const RatingFilter = () => {
    const [selected,setSelected] = useState(null);

    const { keywords } = useSelector(state => state.filter)
    const dispatch = useDispatch();
    console.log(selected);

    const path = window.location.pathname


    useEffect(() => {
        switch (path) {
            case '/':
                dispatch(clearMovie());
                dispatch(getAllMovies({...keywords}));
                break;
            default:
                break;
        }
        
    }, [keywords])





    return ( 
        <div>
            <FormControl component="fieldset">
            <FormLabel component="legend">Ratings</FormLabel>
            <RadioGroup
                aria-label="ratings"
                value={keywords && keywords.ratings}
                name="radio-buttons-group"
                onChange={(e) => { dispatch(setKeywords({...keywords, ratings: e.target.value})); }}
            >
                <FormControlLabel value={5} control={<Radio size="small"/>} label={<Rating name="rating5" defaultValue={5} size="small" readOnly/>} /> 
                <FormControlLabel value={4} control={<Radio size="small"/>} label={<Rating name="rating4" defaultValue={4} size="small" readOnly/>} />
                <FormControlLabel value={3} control={<Radio size="small"/>} label={<Rating name="rating3" defaultValue={3} size="small" readOnly/>} />
                <FormControlLabel value={2} control={<Radio size="small"/>} label={<Rating name="rating2" defaultValue={2} size="small" readOnly/>} />
                <FormControlLabel value={1} control={<Radio size="small"/>} label={<Rating name="rating1" defaultValue={1} size="small" readOnly/>} />
            </RadioGroup>
            </FormControl>
        </div>
     );
}
 
export default RatingFilter;