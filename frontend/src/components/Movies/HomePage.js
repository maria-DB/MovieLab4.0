import { useEffect, useState } from 'react';
import { useSelector, useDispatch} from 'react-redux';
import { deleteMovie, getAllMovies, getMovieTitles, setHasMore } from '../../redux/movieSlice';
import InfiniteScroll from "react-infinite-scroll-component";
import { CardMedia, Grid, Paper, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import SearchBar from '../common/SearchBar';
import { clearMovie } from '../../redux/movieSlice';
import RatingFilter from '../common/RatingFilter';
import YearFilter from '../common/YearFilter';
import DeleteIcon from '@mui/icons-material/Delete';
import Snack from '../common/Snack';
import Create from './Create';
import { clearActorsNames, getActorNames } from '../../redux/actorSlice';
import { clearProducerNames, getProducerNames } from '../../redux/producerSlice';


const style = {
    height: 30,
    border: "1px solid green",
    margin: 6,
    padding: 8
  };

const HomePage = () => {
    
    const { movies, titles, moviesCount, filteredMoviesCount, hasMore, page, message } = useSelector(state => state.movie);
    const { keywords } = useSelector(state => state.filter);
    const { user } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const [snack, setSnack] = useState({message:'', open:false});


    useEffect(() => {

      dispatch(getActorNames());
      dispatch(getProducerNames());


      dispatch(getMovieTitles())
      fetchMoreData()
      return() => {
        console.log('movies Cleaned');
        dispatch(clearMovie())
        dispatch(clearActorsNames)
        dispatch(clearProducerNames)
       }
        }, [])

    console.log(movies);

    const fetchMoreData = () => {
        dispatch (getAllMovies({page, ...keywords}));
      };

    const handleDelete = (e,movie) => {
      e.preventDefault();
      dispatch(deleteMovie(movie));
      setTimeout(() => {
        setSnack({message : message !== '' ? message : 'Movie Successfully Deleted', open:true});
      },1000);
    }
    
    return ( 
        <>

<div>
        <h1>demo: react-infinite-scroll-component</h1>
        <hr />
        { snack &&
          <Snack
          handleOnClose={() => { setSnack({...snack, open:false}) }}
          message={snack.message}
          snackState={snack.open}
          timeOpen={6000}
          />
        }
        <Box sx={{m:2}}>
          <SearchBar items={titles} label="Search Movie"/>
        </Box>

        <div style={{ float: 'right'}}>
        <Box sx={{m:2}}>
          <RatingFilter/>
          <YearFilter/>
                       {/* <Paper sx={{padding:'5%',borderRadius:'10px', display:'flex', justifyContent:'center', alignItems:'center'}} elevation={6}>
                            <getPopularMovies/>
                        </Paper> */}
        </Box></div>

        {
          user && user.role === 'Admin' && <Create/>
        }

        
        <InfiniteScroll
          dataLength={movies.length}
          next={fetchMoreData}
          hasMore={movies.length >= filteredMoviesCount ? false : true}
          loader={movies.length >= filteredMoviesCount ? <h4>Wala na...</h4> : <h4>Loading...</h4>}
          endMessage={
            <h4>End Result...</h4>
          }
        >
        <Grid container spacing={2} sx={{p:2}}>
            { movies && movies.map(movie => (
                <Grid item lg={2} md={2} key={movie._id} sm={2} xs={12}>
                    <Paper elevation={4} sx={{p:2}}>
                      <Link to={`/movies/${movie._id}`}>
                        <CardMedia
                            component="img"
                            height="200"
                            image={movie.posters[0].url}
                            alt={movie.posters[0].public_url}
                            sx={{pb:2}}
                            />
                          {movie.title}
                      </Link>
                      <Box>
                      {
                        (user && user.role === 'Admin') && <Button variant='contained' color='error' onClick={ (e) => { handleDelete(e,movie._id)} }><DeleteIcon></DeleteIcon></Button>
                      }
                      </Box>
                    </Paper>
                </Grid>
            ))}
        </Grid>
        </InfiniteScroll>
      </div>
        </>
     );
}
 
export default HomePage;

