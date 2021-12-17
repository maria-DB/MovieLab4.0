import { useEffect } from 'react';
import { useSelector, useDispatch} from 'react-redux';
import { getAllProducer, getProducerNames, setHasMore } from '../../redux/producerSlice';
import InfiniteScroll from "react-infinite-scroll-component";
import { CardMedia, Grid, Paper, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import SearchBar from '../common/SearchBar';
import { clearActors } from '../../redux/actorSlice';


const style = {
    height: 30,
    border: "1px solid green",
    margin: 6,
    padding: 8
  };

const Producer = () => {
    
    const { members, membersCount, producerNames, hasMore, page } = useSelector(state => state.producer);
    const { keywords } = useSelector(state => state.filter);
    const dispatch = useDispatch();


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
    
    return ( 
        <>
        

<div>
        <h1>demo: react-infinite-scroll-component</h1>
        <hr />
        <Box sx={{m:2}}>
          <SearchBar items={producerNames}  label="Search Producer"/>
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
                  <Link to={`/producers/${member._id}`}>
                    <Paper elevation={4} sx={{p:2}}>
                        <CardMedia
                            component="img"
                            height="194"
                            image={member.avatar[0].url}
                            alt={member.avatar[0].public_url}
                            sx={{pb:2}}
                                        />
                                        {member.name}
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

export default Producer;