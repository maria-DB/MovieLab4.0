import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPopularMovies } from "../../redux/dashboardSlice";
// import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);



const PopularMovies = () => {
    
    const { popularMovies, movieLabels, movieValues } = useSelector(state => state.dashboard);
    const dispatch = useDispatch();
    

    useEffect(() => {
        dispatch(getPopularMovies());
    },[dispatch])
    
    const labels = movieLabels.map(k=>k.substr(0,12));

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                  title: (tooltipItem, data) => {
                    return `${movieLabels[tooltipItem[0].dataIndex]}`
                  }
                }
            },
            title: {
                display: true,
                text: 'Popular Movies',
            },
        },
    };

    const data = {
        labels,
        datasets : [{
            label: 'Count',
            data: movieValues,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(122, 159, 64, 0.2)',
                'rgba(40, 159, 64, 0.2)',
                'rgba(0, 159, 64, 0.2)',
                'rgba(15, 159, 64, 0.2)',
            ],
            borderWidth: 1,
        }]
    }
    return (
        <> 
            { popularMovies && <Pie options={options} data={data} />}   
        </>
    );
}
 
export default PopularMovies;