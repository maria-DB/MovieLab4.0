import { useEffect, useState } from 'react';
import { useSelector, useDispatch} from 'react-redux';
import { getAllActor, getActorNames, setHasMore, clearActors, deleteActor } from '../../redux/actorSlice';
import InfiniteScroll from "react-infinite-scroll-component";
import { CardMedia, Grid, Box, Paper, Button, Backdrop, CircularProgress  } from '@mui/material';
import { Link } from 'react-router-dom';
import SearchBar from '../common/SearchBar';
import RatingFilter from '../common/RatingFilter';
import DeleteIcon from '@mui/icons-material/Delete';
import Snack from '../common/Snack';
import CreateActor from './CreateActor';
import EditActor from './EditActor';
import EditIcon from '@mui/icons-material/Edit';


const style = {
    height: 30,
    border: "1px solid green",
    margin: 6,
    padding: 8
  };

const Actor = () => {
    
    const { members, membersCount, actorNames, hasMore, page, isLoading, message } = useSelector(state => state.actor);
    const { keywords } = useSelector(state => state.filter);
    const { user } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const [snack, setSnack] = useState({message:'', open:false});


    useEffect(() => {
      dispatch(getActorNames())
            fetchMoreData()
            return () => {
              dispatch(clearActors());
            }
        }, [])

    console.log(members);

    const fetchMoreData = () => {
        dispatch (getAllActor({page, ...keywords}));
      };

      const handleDelete = (e,member) => {
        e.preventDefault();
        dispatch(deleteActor(member));
        setTimeout(() => {
          setSnack({message : message !== '' ? message : 'Actor Successfully Deleted', open:true});
        },1000);
      }
    
    return ( 
        <>

    <div>
        <h1>demo: react-infinite-scroll-component</h1>
        <hr />
        { isLoading &&
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={true}
            onClick={() => {return false}}
          >
            <CircularProgress color="inherit" />
          </Backdrop>

        }
        { snack &&
          <Snack
          handleOnClose={() => { setSnack({...snack, open:false}) }}
          message={snack.message}
          snackState={snack.open}
          timeOpen={6000}
          />
        }
        
        <Box sx={{m:2}}>
          <SearchBar items={actorNames}  label="Search Actor"/>
        </Box>
        {
          user && user.role === 'Admin' && <CreateActor/>
        }
        <Box sx={{m:2}} style={{ float: 'right'}}>
          <RatingFilter/>
        </Box>


        <InfiniteScroll
          dataLength={members.length}
          next={fetchMoreData}
          hasMore={members.length >= membersCount ? false : true}
          loader={members.length >= membersCount ? <h4>Wala na...</h4> : <h4>Loading...</h4>}
          endMessage={
            <h4>End Result...</h4>
          }
        >
        <Grid container spacing={2} sx={{p:2}}>
            {members.map(member => (
                <Grid item lg={2} md={2} key={member._id} sm={2} xs={12}>
                  <Paper elevation={4} sx={{p:2}}>
                    <Link to={`/actors/${member._id}`}>
                        <CardMedia
                            component="img"
                            height="194"
                            image={member.avatar[0].url}
                            alt={member.avatar[0].public_url}
                            sx={{pb:2}}
                        />
                          {member.name}
                  </Link>
                  <Box>
                      {
                        (user && user.role === 'Admin') && 
                        <div>
                          <Button variant='contained'fullWidth color='error' onClick={ (e) => { handleDelete(e,member._id)} }><DeleteIcon></DeleteIcon></Button>
                          <EditActor id={member._id} member={member}><EditIcon></EditIcon></EditActor>
                          
                        </div>
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
 
export default Actor;

