import { useEffect } from 'react';
import { useSelector, useDispatch} from 'react-redux';
import { getAllMovies, getMovieTitles, setHasMore } from '../../redux/movieSlice';
import InfiniteScroll from "react-infinite-scroll-component";
import { CardMedia, Grid, Paper, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import SearchBar from '../common/SearchBar';
import { clearMovie } from '../../redux/movieSlice';
import RatingFilter from '../common/RatingFilter';
import YearFilter from '../common/YearFilter';



const style = {
    height: 30,
    border: "1px solid green",
    margin: 6,
    padding: 8
  };

const HomePage = () => {
    
    const { movies, titles, moviesCount, filteredMoviesCount, hasMore, page } = useSelector(state => state.movie);
    const { keywords } = useSelector(state => state.filter);
    const dispatch = useDispatch();


    useEffect(() => {
      dispatch(getMovieTitles())
      fetchMoreData()
      return() => {
        console.log('movies Cleaned');
        dispatch(clearMovie())
       }
        }, [])

    console.log(movies);

    const fetchMoreData = () => {
        dispatch (getAllMovies({page, ...keywords}));
      };
    
    return ( 
        <>

<div>
        <h1>demo: react-infinite-scroll-component</h1>
        <hr />
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
            {movies.map(movie => (
                <Grid item lg={2} md={2} key={movie._id} sm={2} xs={12}>
                    <Link to={`/movies/${movie._id}`}>
                    <Paper elevation={4} sx={{p:2}}>
                        <CardMedia
                            component="img"
                            height="200"
                            image={movie.posters[0].url}
                            alt={movie.posters[0].public_url}
                            sx={{pb:2}}
                            />
                          {movie.title}
                      </Paper>
                  </Link>
              </Grid>
            ))}
        </Grid>
        </InfiniteScroll>
      </div>
        </>
     );
}
 
export default HomePage;