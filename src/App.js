import { useEffect, useState } from 'react';
import './App.css';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Chart,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {Dimmer,Loader} from 'semantic-ui-react';


function App () {
const [price, setPrice] = useState([]);
const [loading, setLoading] = useState(false);


  useEffect(() => { 
    setLoading(true);  
    let mounted = true;
    fetch('https://www.fxempire.com/api/v1/en/stocks/chart/candles?Identifier=AAPL.XNAS&IdentifierType=Symbol&AdjustmentMethod=All&IncludeExtended=False&period=5&Precision=Minutes&StartTime=8/28/2020%2016:0&EndTime=9/4/2020%2023:59&_fields=ChartBars.StartDate,ChartBars.High,ChartBars.Low,ChartBars.StartTime,ChartBars.Open,ChartBars.Close,ChartBars.Volume')
      .then(data => data.json())
      .then(res => {
        if(mounted) {
          setPrice(res);
        };
      })
      .then(() => setLoading(false));
    return () => mounted = false;
  }, []);
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false
      },
    },
  };

 
let x = Array.from(price.map(res => res.Date));
let y = Array.from(price.map(res => res.High));

const [changeData, setChangeData] = useState();
const [changeLabel, setChangeLabel] = useState();

 function data5min() {
    x = Array.from(price.map(res => res.Date));
    y = Array.from(price.map(res => res.High));
    setChangeData(y);
    setChangeLabel(x);
 }

function data1hour() {
  let x1=[];
  let y1=[];
  let y=Array.from(price.map(res => res.High));;
  let x=Array.from(price.map(res => res.Date));
  let k=0;
   for(let i=1; i<x.length; i++){
     if(x[i].substring(14, 16) === '30'){
       x1[k]=x[i];
       y1[k]=y[i];
       k=k+1;
     }
  }
   setChangeData(y1) ;
   setChangeLabel(x1);
}

function data1day() {
  let x1=[];
  let y1=[];
  let x = Array.from(price.map(res => res.StartDate));
  let y = Array.from(price.map(res => res.High));
  let k=0;
   for(let i=1; i<x.length; i++){
     if(x[i] !== x[i+1]){
       x1[k]=x[i];
       y1[k]=y[i];
       k=k+1;
     }
  }
  setChangeData(y1);
  setChangeLabel(x1); 
}

function getChartData(){
    return{
        labels: changeLabel,
        datasets: [
          {
            label: 'Apple',
            data: changeData,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
        ],
    }

}

   return (
    <div className = "App">
      <h1> Apple Diagram</h1> 
      {loading ? (
            <div>
              <Dimmer active inverted>
                <Loader>Loading...</Loader>
              </Dimmer>
            </div>
        ) : (
          <>
      
      <button onClick={data5min}>5 min</button>
      <button onClick={data1hour}>1 hour</button>
      <button onClick={data1day}>1 day</button>
      <Line options={options} data={getChartData()} />
      </>
      )}
         
    </div>

        

      
    );
}

   
export default App;