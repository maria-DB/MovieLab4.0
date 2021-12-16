import { useEffect } from 'react';
import { useSelector, useDispatch} from 'react-redux';
import { getAllActor, setHasMore } from '../../redux/actorSlice';
import InfiniteScroll from "react-infinite-scroll-component";
import { CardMedia, Grid, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

const style = {
    height: 30,
    border: "1px solid green",
    margin: 6,
    padding: 8
  };

const Actor = () => {
    
    const { members, membersCount, hasMore, page } = useSelector(state => state.actor);
    const dispatch = useDispatch();


    useEffect(() => {
            fetchMoreData()
        }, [])

    console.log(members);

    const fetchMoreData = () => {
        dispatch (getAllActor({page}));
        if(members.length < 0 && members.length >= membersCount) return dispatch(setHasMore(false));
      };
    
    return ( 
        <>

<div>
        <h1>demo: react-infinite-scroll-component</h1>
        <hr />
        <InfiniteScroll
          dataLength={members.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={members.length >= membersCount ? <h4>Wala na...</h4> : <h4>Loading...</h4>}
        >
        <Grid container spacing={2} sx={{p:2}}>
            {members.map(member => (
                <Grid item lg={4} md={4} key={member._id} sm={4} xs={12}>
                  <Link to={`/actors/${member._id}`}>
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
 
export default Actor;

