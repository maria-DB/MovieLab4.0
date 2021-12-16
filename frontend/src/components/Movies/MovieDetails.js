import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getMovie } from "../../redux/movieSlice";

const MovieDetails = () => {

    const id = useParams();
    const { movie } = useSelector(state => state.movie);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getMovie(id))
        return () => {
            console.log(`Cleaned Movie Details`);
        }
    }, [])

    console.log('Movie Detail => ',movie);

    return ( 
        <>
        <div style={{padding: '10%'}}>
            <p>{movie && movie.title}</p>
            <p>{movie && movie.posters.map(poster => {
                return <img src={poster.url} alt={poster.public_url} />
            })}</p>
            <p>{movie && movie.movieType}</p>
            <p>{movie && movie.genre}</p>
            <p>{movie && movie.plot}</p>
            </div>
        </>
     );
}
 
export default MovieDetails;