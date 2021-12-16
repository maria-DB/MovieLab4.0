import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getActorDetail } from "../../redux/actorSlice";

const ActorDetails = () => {

    const id = useParams();
    const { actor } = useSelector(state => state.actor);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getActorDetail(id))
        return () => {
            console.log(`Cleaned Actor Details`);
        }
    }, [])

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
            </div>
        </>
     );
}
 
export default ActorDetails;