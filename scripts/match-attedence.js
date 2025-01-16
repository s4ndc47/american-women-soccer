d3.csv("Data/NWSL_Attendance_2016_2024.csv").then(function(data) {

    data.forEach(function(d) {
        d.Attendance = parseInt(d.Attendance.replace(/,/g, ''), 10);
    });

    const svgAttendance = d3.select('#attendance-svg');
    const tooltipAttendance = d3.select("#tooltip-attendance");

    const rectWidth = 50;
    const rectHeight = 25;
    const rectPadding = 10;
    const rectsPerRow = 12;
    const rowPadding = 5;

    const totalWidth = rectsPerRow * (rectWidth + rectPadding);
    const totalHeight = Math.ceil(data.length / rectsPerRow) * (rectHeight + rowPadding);
    svgAttendance.attr("width", totalWidth)
       .attr("height", totalHeight); 

    const colorScale = d3.scaleThreshold()
             .domain([2500, 5000, 10000, 15000, 20000, 35038])
             .range(["#675468", "#89688f", "#ba85c9", "#e9a1ff", "#ffb5fa", "#f8dfff"]);

    svgAttendance.selectAll("rect")
       .data(data)
       .enter()
       .append("rect")
       .attr("x", (d, i) => (i % rectsPerRow) * (rectWidth + rectPadding))
       .attr("y", (d, i) => Math.floor(i / rectsPerRow) * (rectHeight + rowPadding))
       .attr("width", rectWidth)
       .attr("height", rectHeight)
       .attr("fill", d => {
        if (d.Attendance === null || isNaN(d.Attendance)) {
            return "none"; 
        }
        return colorScale(d.Attendance); 
    })
    .attr("stroke", d => {
        if (d.Attendance === null || isNaN(d.Attendance)) {
            return "white"; 
        }
        return "none"; 
    })
    .attr("stroke-width", d => {
        if (d.Attendance === null || isNaN(d.Attendance)) {
            return 2; 
        }
        return 0; 
    })
        .on("mouseover", (event, d) => {
            tooltipAttendance.style("display", "block")
                   .style("left", (event.pageX + 10) + "px")
                   .style("top", (event.pageY + 10) + "px")
                   .html(`${d.Date}<br>Attendance: ${isNaN(d.Attendance) ? 'Closed-door' : d.Attendance}<br><strong>${d.Home}</strong> v.s. <strong>${d.Away}</strong><br>${d.Venue}`);
        })        
       .on("mouseout", () => {
        tooltipAttendance.style("display", "none");
       });
}).catch(error => {
    console.error('Error loading the CSV:', error);
});

console.log("Attendance values and their colors:");
data.forEach(d => {
    console.log(d.Attendance, colorScale(d.Attendance));
});
