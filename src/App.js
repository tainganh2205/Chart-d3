import React from 'react';
import RadialChart from "./visualizations/RadialChart";
import RadialChart2 from "./visualizations/RaidalChart2";

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
      <h1>
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
      </h1>
      <div style={{display: 'flex', gap: 3, justifyContent: "space-between"}}>
        <RadialChart data={data}/>
        {/*<RadialChart2/>*/}
      </div>
    </div>
  );
};

export default App;

