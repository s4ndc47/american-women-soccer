document.addEventListener("DOMContentLoaded", () => {
  const margin = { top: 20, right: 30, bottom: 50, left: 60 };
  const width = 550 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Select SVG container
  const svgElement = d3.select("#lineChart");
  if (svgElement.empty()) {
    console.error("SVG element #lineChart not found in the DOM.");
    return;
  }

  const svglineChart = svgElement
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const parseDate = d3.timeParse("%Y-%m");
  const xScale = d3.scaleTime().range([0, width]);
  const yScale = d3.scaleLinear().range([height, 0]);

  const line = d3.line()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.attendance));

  d3.csv("Data/NWSL_Seasonal_Attendance_Trends_with_Year-Month_line_chart.csv")
    .then((data) => {
      // Parse and validate data
      data.forEach((d) => {
        d.date = parseDate(d["Year-Month"]);
        d.attendance = parseInt(d["Attendance"], 10);
      });

      data = data.filter((d) => d.date && !isNaN(d.attendance));

      if (data.length === 0) {
        console.error("No valid data to display.");
        return;
      }

      xScale.domain(d3.extent(data, (d) => d.date));
      yScale.domain([0, d3.max(data, (d) => d.attendance)]);

      svglineChart.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(
          d3.axisBottom(xScale)
            .ticks(d3.timeMonth.every(1))
            .tickFormat((d) => {
              const month = d.getMonth();
              if ([3, 9].includes(month)) {
                return d3.timeFormat("%b %Y")(d);
              }
              return null;
            })
            .tickSize(0)
        )
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end");

      svglineChart.append("g")
        .call(d3.axisLeft(yScale).tickSize(0));

      const linePath = svglineChart.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#00ffa2")
        .attr("stroke-width", 2)
        .attr("d", line);

      svglineChart.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", (d) => xScale(d.date))
        .attr("cy", (d) => yScale(d.attendance))
        .attr("r", 3)
        .attr("fill", "#00ffa2");

      const lineCharttooltip = d3.select("body")
        .append("div")
        .attr("id", "lineCharttooltip")
          .style("color", "black")
        .style("font-size", "12px")
        .style("position", "absolute")
        .style("background-color", "white")
        .style("padding", "5px")
        .style("border", "1px solid #ccc")
        .style("border-radius", "5px")
        .style("opacity", 0)
        .style("pointer-events", "none");

      svglineChart.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "transparent")
      .attr("stroke-width", 10)
      .attr("d", line)
      .on("mousemove", (event) => {
        const [mouseX] = d3.pointer(event);
        const hoveredDate = xScale.invert(mouseX);
    
        const closestPoint = data.reduce((prev, curr) => {
          return Math.abs(curr.date - hoveredDate) < Math.abs(prev.date - hoveredDate)
            ? curr
            : prev;
        });
    
        console.log('Closest Point:', closestPoint); // Debugging log
    
        if (closestPoint && closestPoint.date && closestPoint.attendance) {
          lineCharttooltip
            .html(
              `<strong>Date:</strong> ${d3.timeFormat("%b %Y")(closestPoint.date)}<br>
               <strong>Attendance:</strong> ${closestPoint.attendance.toLocaleString()}`
            )
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY + 10}px`)
            .style("opacity", 1);
        }
      })
      .on("mouseout", () => {
        lineCharttooltip.style("opacity", 0);
      });
    
    })
    .catch((error) => {
      console.error("Error loading or parsing data:", error);
    });
});
