import { Box, Button, List } from "@mui/material";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { deleteReview, getActorDetail } from "../../redux/actorSlice";
import Comment from "../common/Comment";
import ActorReview from "./ActorReview";

const ActorDetails = () => {

    const id = useParams();
    const { actor, reviews, userReview } = useSelector(state => state.actor);
    const { user } = useSelector(state => state.user)
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getActorDetail({id,user}))

        return () => {
            console.log(`Cleaned Actor Details`);
        }
    }, [user])

    console.log('Actor Detail => ',actor);

    return ( 
        <>
        <div style={{padding: '10%'}}>
            <p>{actor && actor.name}</p>
            <p>{actor && actor.role}</p>
            <p>{actor && actor.avatar.map(avatar => {
                return <img src={avatar.url} alt={avatar.public_url} />
            })}</p>
            <p>{actor && actor.info}</p>
            

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
                    <Button size="small" onClick={() => { dispatch(deleteReview({id:userReview[0]._id, memberId:actor._id}))}}>Delete</Button>

                    </Box>


                }
                </List>

            </Box>
            <Box>
                <ActorReview/>
            </Box>
            </div>
        </>
     );
}
 
export default ActorDetails;