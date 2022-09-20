import React, {useState} from "react";
import {useSpring, useSprings, animated} from 'react-spring'
import * as d3 from 'd3'
import {mean} from 'lodash'


const BASE_WIDTH = 650
const BASE_HEIGHT = 650
const NUM_BARS = 25
const BAR_ANGLE = (2 * Math.PI) / NUM_BARS
const INNER_RADIUS = 20
const MAX_RADIUS = BASE_WIDTH / 2
const DOMAIN = [0, 100]

// first build a "layout", which in a d3 context means:
// a function that takes in some data and gives us
// drawing instructions - here, in the form of an SVG path
// commands string
const layout = d3
  .arc()
  .startAngle(d => d.i * BAR_ANGLE)
  .endAngle(d => (d.i + 1) * BAR_ANGLE)
  .innerRadius(INNER_RADIUS)

// we'll use a scale to match values from the domain
// to a certain range (expressed in pixels)
const scale = d3
  .scaleLinear()
  .domain(DOMAIN)
  .range([INNER_RADIUS, MAX_RADIUS])

const Chart = ({dataset}) => {
  const meanScoreSpring = useSpring({score: mean(dataset)})
  const radialBarSprings = useSprings(dataset.length, dataset.map((item, i) => {
    // Compute the outer radius of each bar using the pre-generated scale
    // We must make sure our path always has the same number of points,
    // or else Spring's interpolator will fail - we do that by avoiding
    // having "zero" values render to a bar, ie this radius must always
    // be > to innerRadius.
    const outerRadius = Math.max(INNER_RADIUS + 0.1, scale(item))

    // Send the current index as the data, as well
    // as the calculated outerRadius, which is a method of d3.arc
    const path = layout({i, outerRadius})

    // Generate a color for each frame of the animation using a preset
    // color scale
    const color = d3.interpolateRdYlGn(item / 100)

    return {
      to: {
        path,
        color
      },
      from: {
        path,
        color
      },
      delay: i * 30
    }
  }))
  return (
    <div className="App">
      <svg style={{width: BASE_WIDTH, height: BASE_HEIGHT}}>
        <g style={{transform: `translate(${BASE_WIDTH / 2}px, ${BASE_HEIGHT / 2}px)`}}>
          <circle r={MAX_RADIUS} stroke="rgba(0, 0, 0, .2)" fill="none"/>
          {radialBarSprings.map((props, i) =>
            <animated.path key={i} d={props.path} fill={props.color}/>
          )}
          <animated.text transform="translate(-9, 5)">
            {meanScoreSpring.score.interpolate(Math.round)}
          </animated.text>
        </g>
      </svg>
    </div>
  );
}

const datasets = [
  [0, 94, 92, 95, 40, 78, 77, 99, 90, 50, 10, 88, 82, 15, 20, 40, 10, 41, 15, 28, 38, 87, 90, 98, 66],
  [100, 95, 90, 80, 70, 60, 60, 65, 98, 40, 30, 35, 80, 25, 55, 66, 92, 67, 10, 37, 59, 88, 80, 90, 76]
]

const RadialChart2 = () => {
  const [currentDataset, setDataset] = useState(0);
  return (
    <div
      onClick={() =>
        setDataset((currentDataset === 0) ? 1 : 0)
      }
    >
      <Chart dataset={datasets[currentDataset]}/>
    </div>
  );
};

export default RadialChart2;
