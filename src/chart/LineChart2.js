import React, {useEffect, useRef} from 'react';
import * as d3 from "d3";
import Axis from "../components/Axis";
import Bar from "../components/Bar";
import Tooltip from "../components/Tooltip";

const XYAxisLineChart = ({scales, margins, svgDimensions}) => {
  const xAxisProps = {
    orient: 'Bottom',
    translate: `translate(0,${svgDimensions.height - margins.bottom})`,
    scale: scales.xScale,
    tickSize: svgDimensions.height - margins.top - margins.bottom,
    ticks: 4,
    className: 'axisBottom',
    padding: 10,
    format: d3.format("")
  }
  const yAxisProps = {
    orient: 'Left',
    translate: `translate(${margins.left},0)`,
    scale: scales.yScale,
    tickSize: svgDimensions.width - margins.left - margins.right,
    ticks: 5,
    className: 'axisLeft',
    padding: 15,
    format: null
  }

  return <g>
    <Axis {...xAxisProps} />
    <Axis {...yAxisProps} />
  </g>
}
const XYAxisBarChart = ({scales, margins, svgDimensions}) => {
  const xAxisProps = {
    orient: 'Bottom',
    translate: `translate(0,${svgDimensions.height - margins.bottom})`,
    scale: scales.xScaleMonth,
    tickSize: svgDimensions.height - margins.top - margins.bottom,
    ticks: 4,
    className: 'axisBottom',
    padding: 10,
    format: null
  }
  const yAxisProps = {
    orient: 'Left',
    translate: `translate(${margins.left},0)`,
    scale: scales.yScale,
    tickSize: svgDimensions.width - margins.left - margins.right,
    ticks: 5,
    className: 'axisLeft',
    padding: 15,
    format: null
  }

  return <g>
    <Axis {...xAxisProps} />
    <Axis {...yAxisProps} />
  </g>
}

/***************** Axis End ****************/

const BarChartComponent = ({data, margins, svgDimensions}) => {
  const yMaxValue = Math.max(...data.map(d => d.income));
  const months = [
    {month: "Jan"}, {month: "Feb"}, {month: "Mar"}, {month: "Apr"}, {month: "May"}, {month: "Jun"},
    {month: "Jul"}, {month: "Aug"}, {month: "Sep"}, {month: "Oct"}, {month: "Nov"}, {month: "Dec"}
  ];

  const xScale = d3.scaleBand()
    .domain(data.map(d => d.month))
    .range([margins.left, svgDimensions.width - margins.right])
    .padding(0.2);

  const xScaleMonth = d3.scaleBand()
    .domain(months.map((d) => d.month))
    .range([margins.left, svgDimensions.width - margins.right])

  const yScale = d3.scaleLinear()
    .domain([0, yMaxValue])
    .range([svgDimensions.height - margins.bottom, margins.top])
  const text = (
    <text transform="translate(60,150)rotate(-90)" fontSize="13">Monthly Income ($)</text>
  )
  const rectOverlay = <rect transform={`translate(${margins.left / 2},${margins.top / 2})`} className="rectOverlayBarChart" width={svgDimensions.width - margins.right}
                            height={svgDimensions.height - margins.top} rx="5" ry="5"/>
  return <svg width={svgDimensions.width} height={svgDimensions.height}>
    {rectOverlay}{text}
    <XYAxisBarChart scales={{xScaleMonth, yScale}} margins={margins} svgDimensions={svgDimensions}/>
    <Bar scales={{xScale, yScale}} margins={margins} svgDimensions={svgDimensions} data={data} yMaxValue={yMaxValue}/>
  </svg>
}

/***************** BarChart End ****************/

// Line Component
const Line = ({scales, data}) => {
  const {xScale, yScale} = scales;
  const line = d3.line()
    .x((d) => xScale(d.year))
    .y((d) => yScale(d.income))
    .curve(d3.curveMonotoneX);

  const path =
    <path
      d={line(data)}
      stroke="rgb(149 218 137 / 90%)"
      strokeWidth="3px"
      fill="none"
    />
  return (
    <g>{path}</g>
  )
}
// Area Component
const Area = ({scales, data, svgDimensions, margins}) => {
  const {xScale, yScale} = scales;
  const area = d3.area()
    .x((d) => xScale(d.year))
    .y0(svgDimensions.height - margins.bottom)
    .y1((d) => yScale(d.income))
    .curve(d3.curveMonotoneX);

  const areaGradient =
    <linearGradient
      id="area-gradient"
      gradientUnits="userSpaceOnUse"
      x1="0"
      y1={yScale(0)}
      x2="0"
      y2={yScale(1000)}
    >
      <stop
        offset="0%"
        stopColor="#333333"
        stopOpacity="0"
      >
      </stop>
      <stop
        offset="100%"
        stopColor="rgb(149 218 137 / 90%)"
        stopOpacity="0.5"
      >
      </stop>
    </linearGradient>

  const path =
    <path
      d={area(data)}
      className="area"
    />
  return (
    <g>{areaGradient}{path}</g>
  )
}
// LineChart Component
const LineChartComponent = ({data, onChangeYear, svgDimensions, margins}) => {

  const xScaleMinValue = Math.min(...data.map(d => d.year));
  const xScaleMaxValue = Math.max(...data.map(d => d.year));
  const yScaleMaxValue = Math.max(...data.map(d => d.income));

  const xScale = d3.scaleLinear()
    .domain([xScaleMinValue, xScaleMaxValue])
    .range([margins.left, svgDimensions.width - margins.right])
    .clamp(true);
  const yScale = d3.scaleLinear()
    .domain([0, yScaleMaxValue])
    .range([svgDimensions.height - margins.top, margins.bottom])
    .clamp(true);
  const text = (
    <text transform="translate(60,140)rotate(-90)" fontSize="13">Annual Income ($)</text>
  )
  const rectOverlay = <rect transform={`translate(${margins.left / 2},${margins.top / 2})`} className="rectOverlayLineChart" width={svgDimensions.width - margins.right}
                            height={svgDimensions.height - margins.top} rx="5" ry="5"/>
  return <svg className="lineChartSvg" width={svgDimensions.width} height={svgDimensions.height}>
    {rectOverlay}{text}
    <XYAxisLineChart scales={{xScale, yScale}} margins={margins} svgDimensions={svgDimensions}/>
    <Line scales={{xScale, yScale}} data={data}/>
    <Area scales={{xScale, yScale}} data={data} svgDimensions={svgDimensions} margins={margins}/>
    <Tooltip svgDimensions={svgDimensions} margins={margins} scales={{xScale, yScale}} data={data} onChangeYear={onChangeYear}/>
  </svg>
}

/***************** LineChart End ****************/

// Charts Component
const Charts = () => {
  const [lineChartData, setLineChartData] = React.useState(
    [
      {'year': 2012, 'income': 40}, {'year': 2013, 'income': 80}, {'year': 2014, 'income': 50}, {'year': 2015, 'income': 100},
      {'year': 2016, 'income': 20}, {'year': 2017, 'income': 120}
    ]
  );
  const [barChartData, setBarChartData] = React.useState([
    {'month': 1, 'income': 20}, {'month': 2, 'income': 30}, {'month': 3, 'income': 100}, {'month': 4, 'income': 50}, {'month': 5, 'income': 60},
    {'month': 6, 'income': 80}, {'month': 7, 'income': 30}, {'month': 8, 'income': 90}, {'month': 9, 'income': 5}, {'month': 10, 'income': 23},
    {'month': 11, 'income': 76}, {'month': 12, 'income': 49}
  ]);
  const handleChangeYear = (year) => {
    let getData;
    if (year === "2012") {
      getData = [
        {'month': 1, 'income': 30}, {'month': 2, 'income': 40}, {'month': 3, 'income': 10}, {'month': 4, 'income': 60}, {'month': 5, 'income': 70},
        {'month': 6, 'income': 90}, {'month': 7, 'income': 40}, {'month': 8, 'income': 100}, {'month': 9, 'income': 15}, {'month': 10, 'income': 33},
        {'month': 11, 'income': 86}, {'month': 12, 'income': 59}
      ];
    } else if (year === "2013") {
      getData = [
        {'month': 1, 'income': 20}, {'month': 2, 'income': 30}, {'month': 3, 'income': 100}, {'month': 4, 'income': 50}, {'month': 5, 'income': 60},
        {'month': 6, 'income': 80}, {'month': 7, 'income': 30}, {'month': 8, 'income': 90}, {'month': 9, 'income': 5}, {'month': 10, 'income': 23},
        {'month': 11, 'income': 76}, {'month': 12, 'income': 49}
      ];
    } else if (year === "2014") {
      getData = [
        {'month': 1, 'income': 10}, {'month': 2, 'income': 20}, {'month': 3, 'income': 30}, {'month': 4, 'income': 40}, {'month': 5, 'income': 50},
        {'month': 6, 'income': 70}, {'month': 7, 'income': 20}, {'month': 8, 'income': 80}, {'month': 9, 'income': 25}, {'month': 10, 'income': 13},
        {'month': 11, 'income': 66}, {'month': 12, 'income': 39}
      ];
    } else if (year === "2015") {
      getData = [
        {'month': 1, 'income': 35}, {'month': 2, 'income': 16}, {'month': 3, 'income': 67}, {'month': 4, 'income': 13}, {'month': 5, 'income': 44},
        {'month': 6, 'income': 20}, {'month': 7, 'income': 39}, {'month': 8, 'income': 120}, {'month': 9, 'income': 55}, {'month': 10, 'income': 93},
        {'month': 11, 'income': 16}, {'month': 12, 'income': 59}
      ];
    } else if (year === "2016") {
      getData = [
        {'month': 1, 'income': 20}, {'month': 2, 'income': 30}, {'month': 3, 'income': 100}, {'month': 4, 'income': 50}, {'month': 5, 'income': 60},
        {'month': 6, 'income': 80}, {'month': 7, 'income': 30}, {'month': 8, 'income': 90}, {'month': 9, 'income': 5}, {'month': 10, 'income': 23},
        {'month': 11, 'income': 76}, {'month': 12, 'income': 49}
      ];
    } else if (year === "2017") {
      getData = [
        {'month': 1, 'income': 120}, {'month': 2, 'income': 60}, {'month': 3, 'income': 110}, {'month': 4, 'income': 55}, {'month': 5, 'income': 20},
        {'month': 6, 'income': 60}, {'month': 7, 'income': 60}, {'month': 8, 'income': 50}, {'month': 9, 'income': 52}, {'month': 10, 'income': 63},
        {'month': 11, 'income': 36}, {'month': 12, 'income': 19}
      ];
    }
    setBarChartData(getData)
  }
  const margins = {top: 50, right: 100, bottom: 50, left: 100},
    svgDimensions = {height: screen.height / 2, width: screen.width / 2};
  return (
    <div className="chart">
      <div className="lineChart">
        <LineChartComponent margins={margins} svgDimensions={svgDimensions} data={lineChartData} onChangeYear={handleChangeYear}/>
      </div>
      <div className="barChart">
        <BarChartComponent margins={margins} svgDimensions={svgDimensions} data={barChartData}/>
      </div>
    </div>
  )
};

export default Charts;

