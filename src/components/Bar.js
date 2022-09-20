import React from 'react';
import * as d3 from "d3";
import {useDeepEffect} from "../hooks/useDeepEffect";

const Bar = (props) => {
  const barRef = React.useRef();
  React.useEffect(() => {
    renderBar();
  }, []);
  useDeepEffect(() => {
    const {scales, margins, svgDimensions, data} = props;
    const {xScale, yScale} = scales;
    const {height} = svgDimensions;
    let node = barRef.current;
    let bar = d3.select(node).append("g");

    d3.select(".rect-group").remove();
    bar.attr("class", "rect-group")
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(d.month))
      .attr("y", (d) => height - margins.bottom)
      .transition().duration(2500).ease(d3.easeElastic)
      .attr("x", (d) => xScale(d.month))
      .attr("y", (d) => yScale(d.income))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => height - yScale(d.income) - margins.bottom)
      .style("fill", (d) => colorScale(d.income));

    d3.select(".text-group").remove();
    bar.append("g")
      .attr("class", "text-group")
      .selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("x", (d) => xScale(d.month))
      .attr("y", (d) => height - margins.bottom)
      .transition().duration(2500).ease(d3.easeElastic)
      .text((d) => d.income)
      .attr("x", (d) => xScale(d.month) + xScale.bandwidth() / 4)
      .attr("y", (d) => yScale(d.income) - 5)
      .style("fill", "#333333")
      .style("font-size", "12px")
  }, [props])
  const colorScale = React.useMemo(() => {
    return d3.scaleLinear()
      .domain([0, props.yMaxValue])
      .range(['#999999', '#333333']);
  }, []);
  const renderBar = (nextProps) => {
    let node = barRef.current;
    const {scales, margins, svgDimensions, data} = nextProps || props;
    const {xScale, yScale} = scales;
    const {height} = svgDimensions;

    let bar = d3.select(node).append("g");
    bar.attr("class", "rect-group")
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", (d) => xScale(d.month))
      .attr("y", height - margins.bottom)
      .transition().duration(1500).ease(d3.easeElastic)
      .attr("x", (d) => xScale(d.month))
      .attr("y", (d) => yScale(d.income))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => height - yScale(d.income) - margins.bottom)
      .style("fill", (d) => colorScale(d.income))


    bar.attr("class", "text-group")
      .selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("x", (d) => xScale(d.month))
      .attr("y", () => height - margins.bottom)
      .transition().duration(1500).ease(d3.easeElastic)
      .text((d) => d.income)
      .attr("x", (d) => xScale(d.month) + xScale.bandwidth() / 4)
      .attr("y", (d) => yScale(d.income) - 5)
      .style("fill", "#333333")
      .style("font-size", "12px")
  }
  return (
    <g ref={barRef}/>
  )
};

export default Bar;
