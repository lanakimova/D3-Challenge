// @TODO: YOUR CODE HERE!

// set size for svg container
let height = 600;
let width = 1000;

// set margins for svg container
let margin = {
    top: 50,
    right: 50,
    bottom: 50,
    left: 50
};

// set size of chart area minus margins
let chartHeight = height - margin.top - margin.bottom;
let chartWidth = width - margin.left - margin.right;

// create svg container
let svg = d3.select("#scatter")
.append("svg")
.attr("height", height)
.attr("width", width);

// shift all over by the margin
let chartGroup = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

// add title for xaxis
svg.append("text")
    .attr("x", width/2)
    .attr("y", height - 15)
    .text("In Poverty (%)");

//  add title for yaxis
svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -(height/2 + 50))
    .attr("y", 20)
    .text("Lacks of Healthcare (%)");


d3.csv("assets/data/data.csv").then(function(data) {
    let states = [],
        abbrs = [],
        poverties = [],
        ages = [],
        incomes = [],
        healthCare = [],
        obesity = [],
        smokes = [];

    data.forEach((d) => {
        states.push(d.state);
        abbrs.push(d.abbr);
        poverties.push(+d.poverty);
        ages.push(+d.age);
        incomes.push(+d.income);
        healthCare.push(+d.healthcare);
        obesity.push(+d.obesity);
        smokes.push(+d.smokes);
    });

    // scale y 
    let yScale = d3.scaleLinear()
                    .domain([d3.min(healthCare), d3.max(healthCare)])
                    .range([chartHeight, 0]); 

    // scale x
    let xScale = d3.scaleLinear()
                    .domain([d3.min(poverties), d3.max(poverties)])
                    .range([0, chartWidth]);

    // create axes
    let yAxis = d3.axisLeft(yScale);
    let xAxis = d3.axisBottom(xScale);

    // set y to the y axis
    chartGroup.append("g").call(yAxis);
    
    chartGroup.append("g")
    .attr("transform", `translate(0, ${chartHeight})`)
    .call(xAxis);

    // create the rectangle
    let circleGroup = chartGroup.selectAll("rect")
                                .data(healthCare)
                                .enter()
                                .append('circle')
                                .attr("cx", function(d, i) {return xScale(poverties[i]);})
                                .attr("cy", function(d, i) {return yScale(healthCare[i]);})
                                .attr("opacity", 0.5)
                                .attr("r", 10)
                                .attr("stroke", "black")
                                .style('fill', '#bde0fe');
                                
                                
    //add abbr of states to each circle   
    chartGroup.selectAll("rect")
                .data(abbrs).enter()
                .append("text")
                .attr("x", function(d, i) {return xScale(poverties[i])-5;})
                .attr("y", function(d, i) {return yScale(healthCare[i]) +2;})
                .attr("font-size", "8px")
                .attr("font-weight", "bold")
                .text(function(d, i) {return abbrs[i]});
                            
    circleGroup.on("mouseover", function() {
        d3.select(this)
            .transition()
            .duration(1500)
            .style('fill', '#606c38');
    }).on("mouseout", function() {
        d3.select(this).transition().duration(1500).style("fill", "#ffc8dd");
    });

});