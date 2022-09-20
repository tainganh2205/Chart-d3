import React, {useState} from 'react';
import * as d3 from 'd3';
import chroma from 'chroma-js';

const width = 650;
const height = 650;
const red = '#eb6a5b';
const green = '#b6e86f';
const blue = '#52b6ca';
const colors = chroma.scale([blue, green, red]);

const RadialChart = ({data}) => {
  const [slices, setSlices] = useState([])
  const [tempAnnotations, setTempAnnotations] = useState([])
  let [prevRow, setPrevRow] = useState(null);
  const radiusScale = d3.scaleLinear().range([0, width / 2]),
    colorScale = d3.scaleLinear(),
    arcGenerator = d3.arc();
  if(!data) return null;
  if (data !== prevRow) {
    setPrevRow(data);
    // data has changed, so recalculate scale domains
    const tempMax = d3.max(data, d => d.high);
    const colorDomain = d3.extent(data, d => d.avg);
    radiusScale.domain([0, tempMax]);
    colorScale.domain(colorDomain);

    // one arc per day, innerRadius is low temp, outerRadius is high temp
    const perSliceAngle = (2 * Math.PI) / data.length;
    const slices = data.map((d, i) => {
      const path = arcGenerator({
        startAngle: i * perSliceAngle,
        endAngle: (i + 1) * perSliceAngle,
        innerRadius: radiusScale(d.low),
        outerRadius: radiusScale(d.high),
      });

      return {path, fill: colors(colorScale(d.avg))};
    });

    const tempAnnotations = [5, 20, 40, 60, 80].map(temp => {
      return {
        r: radiusScale(temp),
        temp,
      }
    });
    setSlices(slices);
    setTempAnnotations(tempAnnotations);
  }
  return (
    <svg width={width} height={height}>
      <g transform={`translate(${width / 2}, ${height / 2})`}>
        {slices.map((d, i) => (<path key={i} d={d.path} fill={d.fill}/>))}

        {tempAnnotations.map((d, i) => (
          <g key={i}>
            <circle r={d.r} fill='none' stroke='#999'/>
            <text y={-d.r - 2} textAnchor='middle'>{d.temp}℉</text>
          </g>
        ))}
      </g>
    </svg>
  );
};

export default RadialChart;

