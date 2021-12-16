import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
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
            <p>{producer && producer.name}</p>
            <p>{producer && producer.role}</p>
            <p>{producer && producer.avatar.map(avatar => {
                return <img src={avatar.url} alt={avatar.public_url} />
            })}</p>
            <p>{producer && producer.info}</p>
            </div>
        </>
     );
}
 
export default ProducerDetails;