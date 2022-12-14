import React from 'react';
import RadialChart from "./chart/RadialChart";
import LineChart from "./chart/LineChart";
import Charts from "./chart/LineChart2";
// import RadialChart2 from "./chart/RaidalChart2";

const App = () => {
  const [temps, setTemps] = React.useState({})
  const [city, setCity] = React.useState("sf")
  React.useEffect(() => {
    Promise.all([
      fetch(`${process.env.PUBLIC_URL}/sf.json`),
      fetch(`${process.env.PUBLIC_URL}/ny.json`),
      fetch(`${process.env.PUBLIC_URL}/am.json`),
    ]).then(responses => Promise.all(responses.map(resp => resp.json())))
      .then(([sf, ny, am]) => {
        sf.forEach(day => day.date = new Date(day.date));
        ny.forEach(day => day.date = new Date(day.date));
        am.forEach(day => day.date = new Date(day.date));
        setTemps({sf, ny, am});
      });
  }, []);
  const updateCity = (e) => {
    setCity(e.target.value);
  }
  const data = temps[city];
  return (
    <div className="App">
      <div style={{display: 'flex', flexDirection: 'column', gap: 3, justifyContent: "space-between"}}>
        <div>
          <h1>Line Chart</h1>
          <Charts/>
        </div>

        <div>
          <h1>Radial Chart</h1>
          <div className="select">
            <select name='city' onChange={updateCity}>
              {
                [
                  {label: 'San Francisco', value: 'sf'},
                  {label: 'New York', value: 'ny'},
                  {label: 'Amsterdam', value: 'am'},
                ].map(option => {
                  return (<option key={option.value} value={option.value}>{option.label}</option>);
                })
              }
            </select>

          </div>
          <RadialChart data={data}/>
        </div>

        {/*<LineChart/>*/}
        {/*<RadialChart2/>*/}
      </div>
    </div>
  );
};

export default App;

