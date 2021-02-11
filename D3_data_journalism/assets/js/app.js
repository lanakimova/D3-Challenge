// @TODO: YOUR CODE HERE!

d3.csv("assets/data/data.csv").then(function(data) {

    // get data from csv file
    let states = [];
    let abbrs = [];
    let poverties = [];
    let ages = [];
    let incomes = [];
    let healthCare = [];
    let obesity = [];
    let smokes = [];

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

    // scale y 
    let yScale = d3.scaleLinear()
                    .domain([d3.min(healthCare), d3.max(healthCare)])
                    .range([chartHeight, 0]); 

    console.log(`Healthcare: ${healthCare}`);   
    console.log(`MIN: ${d3.min(healthCare)}, MAX: ${d3.max(healthCare)}`);

    console.log(`poverty ${poverties}`);
    console.log(`MIN: ${d3.min(poverties)}, MAX: ${d3.max(poverties)}`);

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

    let barsGroup = chartGroup.selectAll("rect")
                                .data(healthCare)
                                .enter()
                                .append('circle')
                                .attr("cx", function(d, i) {return xScale(poverties[i]);})
                                .attr("cy", function(d, i) {return yScale(healthCare[i]);})
                                .attr("r", 2.5)
                                .style('fill', 'blue');

    svg.append("text")
        // .attr("text-anchor", "end")
        .attr("x", width/2)
        .attr("y", height - 15)
        .text("In Poverty (%)");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(height/2 + 50))
        .attr("y", 20)
        .text("Lacks of Healthcare (%)");
                                
    barsGroup.on("mouseover", function() {
        d3.select(this)
            .transition()
            .duration(1500)
            .style('fill', 'red');
    }).on("mouseout", function() {
        d3.select(this).transition().duration(1500).style("fill", "blue");
    });

                                

});