import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getProducerDetail } from "../../redux/producerSlice";


const ProducerDetails = () => {

    const id = useParams();
    const { producer } = useSelector(state => state.producer);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getProducerDetail(id))
        return () => {
            console.log(`Cleaned Producer Details`);
        }
    }, [])

    console.log('Producer Detail => ',producer);

    return ( 
        <>
        <div style={{padding: '10%'}}>
            <p>{producer && producer.member.name}</p>
            <p>{producer && producer.member.role}</p>
            <p>{producer && producer.member.avatar.map(avatar => {
                return <img src={avatar.url} alt={avatar.public_url} />
            })}</p>
            <p>{producer && producer.member.info}</p>
            { producer && producer.movies &&
                producer.movies.map(movie => {
                    return <>
                    <Link to={`/movies/${movie._id}`}>{movie.title}</Link>
                    </>
                })
            } 
            </div>
        </>
     );
}
 
export default ProducerDetails;