// set size for svg container
let height = 600;
let width = 800;

// set margins for svg container
let margin = {
    top: 90,
    right: 90,
    bottom: 90,
    left: 90
};

// set size of chart area minus margins
let chartHeight = height - margin.top - margin.bottom;
let chartWidth = width - margin.left - margin.right;

// create svg container
let svg = d3.select("#scatter").append("svg").attr("height", height).attr("width", width);

// shift all over by the margin
let chartGroup = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

// add label for xaxis
let poverty = svg.append("text").attr("x", width/2).attr("y", height - 10).attr("id", "poverty")
                    .attr("stroke", "grey").text("In Poverty (%)");

let age = svg.append("text").attr("x", width/2).attr("y", height - 30).attr("id", "age")
                .attr("stroke", "grey").text("Age");

let income = svg.append("text").attr("x", width/2).attr("y", height - 50).attr("id", "income")
                .attr("stroke", "black").text("Income");

//  add label for yaxis
let healthcare = svg.append("text").attr("transform", "rotate(-90)").attr("x", -(height/2 + 50)).attr("y", 20)
                    .attr("id", "healthcare").attr("stroke", "grey").text("Lacks of Healthcare (%)");

let obesity = svg.append("text").attr("transform", "rotate(-90)").attr("x", -(height/2 + 50)).attr("y", 40)
                    .attr("id", "obesity").attr("stroke", "grey").text("Obesity (%)");

let smokes = svg.append("text").attr("transform", "rotate(-90)").attr("x", -(height/2 + 50)).attr("y", 60)
                    .attr("id", "smoke").attr("stroke", "black").text("Smokes (%)");


d3.csv("assets/data/data.csv").then(function(data) {
    let states = [],
        abbrs = [],
        poverties = [],
        ages = [],
        incomes = [],
        healthCare = [],
        obesity = [],
        smoke = [];

    data.forEach((d) => {
        states.push(d.state);
        abbrs.push(d.abbr);
        poverties.push(+d.poverty);
        ages.push(+d.age);
        incomes.push(+d.income);
        healthCare.push(+d.healthcare);
        obesity.push(+d.obesity);
        smoke.push(+d.smokes);
    });

    // create event listener
    let ySmoke = d3.select("#smoke");
    let yObesity = d3.select("#obesity");
    let yHealthcare = d3.select("#healthcare")
    let xIncome = d3.select("#income");
    let xAge = d3.select("#age");
    let xPoverty = d3.select("#poverty");

    // scale x and y for default values (Smoke vs Income)
    let x = income;
    let y = smoke;

    let xScale = d3.scaleLinear().domain([d3.min(x), d3.max(x)]).range([0, chartWidth]);
    let yScale = d3.scaleLinear().domain([d3.min(y), d3.max(y)]).range([chartHeight, 0]); 

    // create the rectangle for default values
    let circleGroup = chartGroup.selectAll("rect")
                                .data(y)
                                .enter()
                                .append('circle')
                                .attr("cx", function(d, i) {return xScale(x[i]);})
                                .attr("cy", function(d, i) {return yScale(y[i]);})
                                .attr("opacity", 0.5)
                                .attr("r", 10)
                                .attr("stroke", "black")
                                .style('fill', '#bde0fe');

    //add abbr of states to each circle   
    // let abbrGroup = chartGroup.selectAll("rect")
    //             .data(abbrs).enter()
    //             .append("text")
    //             .attr("id", "circle-text")
    //             .attr("x", function(d, i) {return xScale(x[i]) -5;})
    //             .attr("y", function(d, i) {return yScale(y[i]) +2;})
    //             .attr("font-size", "8px")
    //             .attr("font-weight", "bold")
    //             .text(function(d, i) {return d[i]});

    let yAxis = d3.axisLeft(yScale);
    let xAxis = d3.axisBottom(xScale);
                            
    // set y and x to the axises
    chartGroup.append("g").attr('class', 'yaxis').call(yAxis);
                                
    chartGroup.append("g").attr("transform", `translate(0, ${chartHeight})`).attr('class', 'xaxis').call(xAxis);
    // change attr for link after click
    ySmoke.on("click", function (d) {
        y = smoke;
        // change visual attributes
        d3.select(this).transition().duration(1000).attr("stroke", "black");
        d3.select("#obesity").transition().duration(1000).attr("stroke", "grey");
        d3.select("#healthcare").transition().duration(1000).attr("stroke", "grey");  
        // rescale y axis
        yScale.domain([d3.min(y), d3.max(y)]).range([chartHeight, 0]);
        chartGroup.select(".yaxis").transition().duration(1500).call(yAxis);
        // update circles coordinates
        chartGroup.selectAll('circle').transition().duration(1500).attr("cx", function(d, i) {return xScale(x[i]);})
                                                                    .attr("cy", function(d, i) {return yScale(y[i]);});

        circleGroup.selectAll("#circle-text").transition().duration(1500).attr("x", function(d, i) {return xScale(x[i])-5;})
                                                                        .attr("y", function(d, i) {return yScale(y[i]) +2;});
    });

    yObesity.on("click", function (d) {
        y = obesity;
        // change visual attributes
        d3.select(this).transition().duration(1000).attr("stroke", "black");
        d3.select("#smoke").transition().duration(1000).attr("stroke", "grey");
        d3.select("#healthcare").transition().duration(1000).attr("stroke", "grey");
        // rescale y axis
        yScale.domain([d3.min(y), d3.max(y)]).range([chartHeight, 0]);
        chartGroup.select(".yaxis").transition().duration(1500).call(yAxis);
        // update circles coordinates
        chartGroup.selectAll('circle').transition().duration(1500).attr("cx", function(d, i) {return xScale(x[i]);})
                                                                    .attr("cy", function(d, i) {return yScale(y[i]);});
        
        circleGroup.selectAll("#circle-text").transition().duration(1500).attr("x", function(d, i) {return xScale(x[i])-5;})
                                                                    .attr("y", function(d, i) {return yScale(y[i]) +2;});                                
    });

    yHealthcare.on("click", function (d) {
        y = healthCare;
        // change visual attributes
        d3.select(this).transition().duration(1000).attr("stroke", "black").attr("active", "yes");
        d3.select("#obesity").transition().duration(1000).attr("stroke", "grey").attr("active", "no");
        d3.select("#smoke").transition().duration(1000).attr("stroke", "grey").attr("active", "no");
        // rescale y axis
        yScale.domain([d3.min(y), d3.max(y)]).range([chartHeight, 0]);
        chartGroup.select(".yaxis").transition().duration(1500).call(yAxis);
        // update circle coordinates
        chartGroup.selectAll('circle').transition().duration(1500).attr("cx", function(d, i) {return xScale(x[i]);})
                                                                    .attr("cy", function(d, i) {return yScale(y[i]);});

        circleGroup.selectAll("#circle-text").transition().duration(1500).attr("x", function(d, i) {return xScale(x[i])-5;})
                                                                    .attr("y", function(d, i) {return yScale(y[i]) +2;});
    });

    xIncome.on("click", function (d) {
        x = incomes;
        // change visual attributes
        d3.select(this).transition().duration(1000).attr("stroke", "black").attr("active", "yes");
        d3.select("#age").transition().duration(1000).attr("stroke", "grey").attr("active", "no");
        d3.select("#poverty").transition().duration(1000).attr("stroke", "grey").attr("active", "no");
        // rescale x axis
        xScale.domain([d3.min(x), d3.max(x)]).range([0, chartWidth]);
        chartGroup.select(".xaxis").transition().duration(1500).call(xAxis);
        // update circle coordinates
        chartGroup.selectAll('circle').transition().duration(1500).attr("cx", function(d, i) {return xScale(x[i]);})
                                                                    .attr("cy", function(d, i) {return yScale(y[i]);});
                                                                    
        circleGroup.selectAll("#circle-text").transition().duration(1500).attr("x", function(d, i) {return xScale(x[i])-5;})
                                                                    .attr("y", function(d, i) {return yScale(y[i]) +2;});

    });

    xAge.on("click", function (d) {
        x = ages;
        // change visual attributes
        d3.select(this).transition().duration(1000).attr("stroke", "black").attr("active", "yes");
        d3.select("#income").transition().duration(1000).attr("stroke", "grey").attr("active", "no");
        d3.select("#poverty").transition().duration(1000).attr("stroke", "grey").attr("active", "no");
        // rescale x axis
        xScale.domain([d3.min(x), d3.max(x)]).range([0, chartWidth]);
        chartGroup.select(".xaxis").transition().duration(1500).call(xAxis);
        // update circle coordinates
        chartGroup.selectAll('circle').transition().duration(1500).attr("cx", function(d, i) {return xScale(x[i]);})
                                                                    .attr("cy", function(d, i) {return yScale(y[i]);});

        circleGroup.selectAll("#circle-text").transition().duration(1500).attr("x", function(d, i) {return xScale(x[i])-5;})
                                                                        .attr("y", function(d, i) {return yScale(y[i]) +2;});

    });

    xPoverty.on("click", function (d) {
        x = poverties;
        // change visual attributes
        d3.select(this).transition().duration(1000).attr("stroke", "black").attr("active", "yes");
        d3.select("#age").transition().duration(1000).attr("stroke", "grey").attr("active", "no");
        d3.select("#income").transition().duration(1000).attr("stroke", "grey").attr("active", "no");
        // rescale x axis
        xScale.domain([d3.min(x), d3.max(x)]).range([0, chartWidth]);
        chartGroup.select(".xaxis").transition().duration(1500).call(xAxis);
        // update circle coordinates
        chartGroup.selectAll('circle').transition().duration(1500).attr("cx", function(d, i) {return xScale(x[i]);})
                                                                    .attr("cy", function(d, i) {return yScale(y[i]);});

        circleGroup.selectAll("#circle-text").transition().duration(1500).attr("x", function(d, i) {return xScale(x[i])-5;})
                                                                        .attr("y", function(d, i) {return yScale(y[i]) +2;});
    });

                              
    circleGroup.on("mouseover", function() {
        d3.select(this)
            .transition()
            .duration(1500)
            .style('fill', '#ffc8dd');
    }).on("mouseout", function() {
        d3.select(this).transition().duration(1500).style("fill", "#bde0fe");
    });

});

function rescale(x, y) {
        yScale.domain([d3.min(y), d3.max(y)]).range([chartHeight, 0]);
        chartGroup.select(".yaxis").transition().duration(1500).call(yAxis);
        chartGroup.selectAll('circle').transition().duration(1500).attr("cx", function(d, i) {return xScale(x[i]);}).attr("cy", function(d, i) {return yScale(y[i]);});
};