import { useEffect, useState } from 'react';
import { useSelector, useDispatch} from 'react-redux';
import { deleteProducer, getAllProducer, getProducerNames, setHasMore } from '../../redux/producerSlice';
import InfiniteScroll from "react-infinite-scroll-component";
import { CardMedia, Grid, Paper, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import SearchBar from '../common/SearchBar';
import { clearActors } from '../../redux/actorSlice';
import RatingFilter from '../common/RatingFilter';
import YearFilter from '../common/YearFilter';
import DeleteIcon from '@mui/icons-material/Delete';
import Snack from '../common/Snack';

const style = {
    height: 30,
    border: "1px solid green",
    margin: 6,
    padding: 8
  };

const Producer = () => {
    
    const { members, membersCount, producerNames, hasMore, page, message } = useSelector(state => state.producer);
    const { keywords } = useSelector(state => state.filter);
    const { user } = useSelector(state => state.user);
    const dispatch = useDispatch();
    const [snack, setSnack] = useState({message:'', open:false});


    useEffect(() => {
      dispatch(getProducerNames())
            fetchMoreData()
          return() => {
           dispatch(clearActors())
          }
        }, [])

    console.log(members);

    const fetchMoreData = () => {
        dispatch (getAllProducer({...keywords, page}));

      };

      const handleDelete = (e,member) => {
        e.preventDefault();
        dispatch(deleteProducer(member));
        setTimeout(() => {
          setSnack({message : message !== '' ? message : 'Producer Successfully Deleted', open:true});
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
          <SearchBar items={producerNames}  label="Search Producer"/>
        </Box>
        <Box sx={{m:2}}>
          {/* <RatingFilter/> */}
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
                <Grid item lg={4} md={4} key={member._id} sm={4} xs={12}>
                  <Paper elevation={4} sx={{p:2}}>
                    <Link to={`/producers/${member._id}`}>
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

export default Producer;