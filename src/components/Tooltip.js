import React from 'react';
import * as d3 from "d3";
import {useDeepEffect} from "../hooks/useDeepEffect";

const Tooltip = (props) => {
  const [year, setYear] = React.useState("");
  const {svgDimensions, scales, margins, data} = props;
  const {xScale, yScale} = scales;
  let bisectMouseValue = d3.bisector((d) => d.year).left;
  let mouseValue, d0, d1, i, d;
  const translateX = xScale(data[1].year), translateY = yScale(data[1].income);
  useDeepEffect(() => {
    props.onChangeYear((year).toString());
  }, [year])
  const tooltip = React.useMemo(() => (
    <g
      className="lineChartTooltip"
      transform={`translate(${translateX},${translateY})`}
    >
      <line
        className="tooltipHoverLine"
        y1="0"
        y2={svgDimensions.height - translateY - margins.bottom}
        stroke="rgb(149 218 137 / 90%)"
        strokeWidth="1px"
        strokeDasharray="5"
      />
      <circle r="6px" stroke="rgb(149 218 137 / 90%)" strokeWidth="3px" fill="#333333"/>
      <text x="-10" y="-10" fontSize="12px">{data[1].income}</text>
    </g>
  ), [])
  const overlay = React.useMemo(() => (
    <rect
      transform={`translate(${margins.left},${margins.top})`}
      className="lineChartOverlay"
      width={svgDimensions.width - margins.left - margins.right}
      height={svgDimensions.height - margins.top - margins.bottom}
      opacity="0"
      onMouseMove={(event) => {
        mouseValue = xScale.invert(event.nativeEvent.offsetX);
        i = bisectMouseValue(data, mouseValue, 1, 5);
        d0 = data[i - 1];
        d1 = data[i];
        d = (mouseValue - d0.year) < (d1.year - mouseValue) ? d0 : d1;
        d3.select(".lineChartTooltip").attr("transform", "translate(" + xScale(d.year) + "," + yScale(d.income) + ")");
        d3.select(".lineChartTooltip line").attr("y2", svgDimensions.height - yScale(d.income) - margins.bottom);
        d3.select(".lineChartTooltip text").text(d.income)
        setYear(d.year)
      }}
      onMouseOut={() => {
        d3.select(".lineChartTooltip").attr("transform", "translate(" + translateX + "," + translateY + ")");
        d3.select(".lineChartTooltip line").attr("y2", svgDimensions.height - translateY - margins.bottom)
        d3.select(".lineChartTooltip text").text(data[2].income)
        setYear(xScale.invert(translateX))
      }}
    />
  ), [year])
  return <g>{overlay}{tooltip}</g>;
};

export default Tooltip;
