(function() {
    function getTeamColor(teamName) {
        const teamColors = {
            "Boston Breakers": "#bababa", 
            "FC Kansas City": "#bababa",  
            "Utah Royals FC": "#bababa",
            "default": "#b996ec" // Main Color
        };
        return teamColors[teamName] || teamColors["default"];
    }

    document.addEventListener("DOMContentLoaded", function() {
        const margin = { top: 20, right: 20, bottom: 30, left: 100 };
        const width = 1200 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        const svgTimeline = d3.select("#timeline-svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const tooltipTimeline = d3.select("#tooltip-timeline");

        const data = [
            {"team": "Boston Breakers", "start": 2013, "end": 2018, "names": ["Boston Breakers"]},
            {"team": "FC Kansas City", "start": 2013, "end": 2018, "names": ["FC Kansas City"]},
            {"team": "Chicago Red Stars", "start": 2013, "end": "Present", "names": ["Chicago Red Stars"]},
            {"team": "Portland Thorns FC", "start": 2013, "end": "Present", "names": ["Portland Thorns FC"]},
            {
                "team": "Seattle Reign FC / RFC / OL Reign / Seattle Reign FC",
                "start": 2013,
                "end": "Present",
                "names": [
                    {"name": "Seattle Reign FC", "year": 2013},
                    {"name": "Reign FC", "year": 2019},
                    {"name": "OL Reign", "year": 2020},
                    {"name": "Seattle Reign FC", "year": 2023}
                ]
            },
            {"team": "Sky Blue FC / NJ/NY Gotham FC", "start": 2013, "end": "Present", "names": [
                {"name": "Sky Blue FC", "year": 2013},
                {"name": "NJ/NY Gotham FC", "year": 2021}
            ]},
            {"team": "Washington Spirit", "start": 2013, "end": "Present", "names": ["Washington Spirit"]},
            {"team": "Western New York Flash / North Carolina Courage", "start": 2013, "end": "Present", "names": [
                {"name": "Western New York Flash", "year": 2013},
                {"name": "North Carolina Courage", "year": 2017}
            ]},
            {"team": "Houston Dash", "start": 2014, "end": "Present", "names": ["Houston Dash"]},
            {"team": "Orlando Pride", "start": 2016, "end": "Present", "names": ["Orlando Pride"]},
            {"team": "Utah Royals FC", "start": 2018, "end": 2021, "names": ["Utah Royals FC"]},
            {"team": "Kansas City Current", "start": 2021, "end": "Present", "names": ["Kansas City Current"]},
            {"team": "Racing Louisville FC", "start": 2021, "end": "Present", "names": ["Racing Louisville FC"]},
            {"team": "Angel City FC", "start": 2022, "end": "Present", "names": ["Angel City FC"]},
            {"team": "San Diego Wave FC", "start": 2022, "end": "Present", "names": ["San Diego Wave FC"]}
        ];

        const xScale = d3.scaleLinear()
            .domain([2013, new Date().getFullYear()])
            .range([0, width]);

        const yScale = d3.scaleBand()
            .domain(data.map(d => d.team))
            .range([0, height])
            .padding(0.2);

        const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
        svgTimeline.append("g")
            .attr("class", "x axis")
            .attr("transform", `translate(0,${height})`)
            .call(xAxis);

        const bars = svgTimeline.selectAll(".bar")
            .data(data)
            .enter().append("g")
            .attr("class", "bar");

        bars.append("rect")
            .attr("x", d => xScale(d.start))
            .attr("y", d => yScale(d.team))
            .attr("width", d => xScale(d.end === "Present" ? new Date().getFullYear() : d.end) - xScale(d.start))
            .attr("height", yScale.bandwidth())
            .attr("fill", d => getTeamColor(d.team));

        data.forEach(team => {
            const barGroup = svgTimeline.append("g").attr("class", "bar");

            team.names.forEach((name, index) => {
                const startYear = name.year;
                const endYear = index < team.names.length - 1 ? team.names[index + 1].year : (team.end === "Present" ? new Date().getFullYear() : team.end);

                barGroup.append("rect")
                    .attr("x", xScale(startYear))
                    .attr("y", yScale(team.team))
                    .attr("width", xScale(endYear) - xScale(startYear))
                    .attr("height", yScale.bandwidth())
                    .attr("fill", () => [ "#d6c1f4", "#c7acf0", "#b996ec" ][index % 3]);

                barGroup.append("text")
                    .attr("x", xScale(startYear) + 3)
                    .attr("y", yScale(team.team) + yScale.bandwidth() / 2)
                    .attr("dy", ".35em")
                    .attr("fill", "black")
                    .text(name.name)
                    .attr("font-size", "10px")
                    .attr("text-anchor", "start");
            });
        });
    });
})();
