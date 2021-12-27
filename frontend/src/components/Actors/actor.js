import { useEffect, useState } from 'react';
import { useSelector, useDispatch} from 'react-redux';
import { getAllActor, getActorNames, setHasMore, clearActors, deleteActor } from '../../redux/actorSlice';
import InfiniteScroll from "react-infinite-scroll-component";
import { CardMedia, Grid, Box, Paper, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import SearchBar from '../common/SearchBar';
import RatingFilter from '../common/RatingFilter';
import DeleteIcon from '@mui/icons-material/Delete';
import Snack from '../common/Snack';

const style = {
    height: 30,
    border: "1px solid green",
    margin: 6,
    padding: 8
  };

const Actor = () => {
    
    const { members, membersCount, actorNames, hasMore, page, message } = useSelector(state => state.actor);
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
                <Grid item lg={3} md={3} key={member._id} sm={3} xs={12}>
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
                        (user && user.role === 'Admin') && <Button variant='contained' color='error' onClick={ (e) => { handleDelete(e,member._id)} }><DeleteIcon></DeleteIcon></Button>
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

