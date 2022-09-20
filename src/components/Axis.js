import React, {useEffect, useRef} from "react";
import * as d3 from "d3";

const Axis = ({orient, scale, tickSize, padding, ticks, format, className, translate}) => {
  const element = useRef()
  useEffect(() => {
    renderAxis();
  });
  const renderAxis = () => {
    let axisType = `axis${orient}`;
    const axis = d3[axisType]()
      .scale(scale)
      .tickSize(-tickSize)
      .tickPadding(padding)
      .ticks(ticks)
      .tickFormat(format)

    d3.select(element.current)
      .call(axis)
  }
  return (
    <g className={className} ref={element} transform={translate}>
    </g>
  )
};
export default Axis;
