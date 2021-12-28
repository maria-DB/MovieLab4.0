import { Box, Button, List } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { deleteReview, getMovie } from "../../redux/movieSlice";
import Comment from "../common/Comment";
import MovieReview from "./MovieReview";
import { Link } from "react-router-dom";



const MovieDetails = () => {

    const id = useParams();
    const { movie,reviews, userReview } = useSelector(state => state.movie);
    const { user } = useSelector(state => state.user)
    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(getMovie({id,user}))
        return () => {
            console.log(`Cleaned Movie Details`);
        }
    }, [user])

    console.log('Movie Detail => ',movie);

    return ( 
        <>
        <div style={{padding: '10%'}}>
            <h1>{movie && movie.title}</h1>
            <p>{movie && movie.posters.map(poster => {
                return <img src={poster.url} alt={poster.public_url} />
            })}</p>
            <p><b>Type:</b> {movie && movie.movieType}</p>
            <p><b>Genre:</b> {movie && movie.genre}</p>
            <p><b>Plot:</b> {movie && movie.plot}</p>
            
            <h4>Actors/Actress</h4>
            { (movie && movie.members) &&
                movie.members.filter(member => member.role === 'Actor' || member.role === 'Actress')
                .map(item => {
                    return <>
                        <Link to={`/actors/${item.user}`} key={item.user}>{item.name}</Link><br/>
                    </>
                })
            }
            <h4>Producers</h4>
            { (movie && movie.members) &&
                movie.members.filter(member => member.role === 'Producer')
                .map(item => {
                    return <>
                        <Link to={`/producers/${item.user}`} key={item.user}>{item.name}</Link><br/>
                    </>
                })
            }

            <Box sx={{m:2}}>
                <h4>Reviews</h4>
                <List sx={{ width: '100%', bgcolor: 'Background.paper'}}>
                    { reviews &&
                    reviews.map (review => {
                        return <Comment comment={review} key={review._id}/>
                    })
                }
                {(userReview && userReview.length > 0) &&
                    <Box sx={{backgroundColor:'#fafafa'}}>
                    <Comment comment={userReview[0]} />
                    <Button size="small" onClick={() => { dispatch(deleteReview({id:userReview[0]._id, movieId:movie._id}))}}>Delete</Button>

                    </Box>


                }
                </List>

            </Box>

            
            <Box>
                <MovieReview/>
            </Box>
            </div>
        </>
     );
}
 
export default MovieDetails;