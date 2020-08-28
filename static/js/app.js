const url = "./data/samples.json";

// Fetch the JSON data and console log it
d3.json(url).then(function(data) {
    console.log(data);
    // console.log(data.samples.map(sample=>sample));  
    // console.log(data.samples.map(sample=>sample.id));  
    // console.log(data.samples.map(sample=>sample.otu_ids)); 
    // console.log(data.names.map(name=>name));  

    //Function to filter out the data based on selection of value in drop-down
    function filterdata(dataset,data) {
        
        return data.id==dataset;
      }
    
    //START -- Building values in the dropdown on page load
    var dropDown=d3.select("#selDataset")

    var options=dropDown.selectAll("option")
    .data(data.names)
    .enter()
    .append("option");

    // console.log("1")
    
    options.text(function(d) {
        //console.log(d.names.key);
        return d;
    })
    .attr("value", function(d) {
        return d;
    });

    //END -- Building values in the dropdown on page load

    //Called function to build plots on the page based on default value of dropdown
    updatePlotbar(data);

    //Added event listener on change of value in dropdown and called function to build plots based on chnaged value in dropdown
    d3.selectAll("#selDataset").on("change", function(){updatePlotbar(data)});

    //Function to add data in demographic table and plot bubble and bar plot based on value selected in drop-down
    function updatePlotbar(data){

        // Use D3 to select the dropdown menu
        var dropdownMenu = d3.select("#selDataset");
        // Assign the value of the dropdown menu option to a variable
        var dataset = dropdownMenu.property("value");

        //Check the value in the variable is same as one selected in the dropdown
        console.log(dataset);

        //Find metadata record for id selected in dropdown
        var filteredmetadata=data.metadata.filter(filterdata.bind(this, dataset));
        console.log(filteredmetadata);

        //Build demographic table based on filtered metadata
        Object.entries(filteredmetadata).forEach(([key,value])=>{
            var demographicPanel=d3.select("#sample-metadata");
            //Clear html before loading data in the demographic table
            demographicPanel.html("");
            // console.log(`id:${value.id}`);
            demographicPanel.append("div").text(`id: ${value.id}`);
            demographicPanel.append("div").text(`ethnicity: ${value.ethnicity}`);
            demographicPanel.append("div").text(`gender: ${value.gender}`);
            demographicPanel.append("div").text(`age: ${value.age}`);
            demographicPanel.append("div").text(`location: ${value.location}`);
            demographicPanel.append("div").text(`bbtype: ${value.bbtype}`);
            demographicPanel.append("div").text(`wfreq: ${value.wfreq}`);

            //Build gauge chart showing weekly frequency for selected value

            var data = [
                {
                    domain: { x: [0, 1], y: [0, 1] },
                    value: value.wfreq,
                    title: { text: "Belly Button Washing frequency" },
                    type: "indicator",
                    text: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
                    direction: 'clockwise',
                    textinfo: 'text',
                    textposition: 'inside',
                    mode: "gauge+number",
                    gauge: {
                        axis: { range: [null, 9] },
                        steps: [
                          { range: [0, 1], color: 'rgb(242,230,255)' },
                          { range: [1, 2], color: "rgb(230,230,255)" },
                          { range: [2, 3], color: "rgb(230,242,255)" },
                          { range: [3, 4], color: "rgb(204,255,247)" },
                          { range: [4, 5], color: "rgb(51,255,187)" },
                          { range: [5, 6], color: "rgb(153,255,170)" },
                          { range: [6, 7], color: "rgb(0,230,77)" },
                          { range: [7, 8], color: "rgb(0,179,89)" },
                          { range: [8, 9], color: "rgb(0,179,60)" }
                          //
                        ],
                    }
                }
            ];
            
            var layout = { width: 600, height: 500, margin: { t: 0, b: 0 } };
            Plotly.newPlot('gauge', data, layout);
        });
        //Find sample record for id selected in dropdown
        var filteredsample=data.samples.filter(filterdata.bind(this, dataset));
        //console.log(filteredsample);

        //Plot bars using filtered sample data
        Object.entries(filteredsample).forEach(([key,value])=>{
            
            //Bar plot for sample data filtered based on selection of drop-down value
            //Setting up trace for plot
            var trace1={
                type: 'bar',
                //Only first 10 sample values in reverse order needed
                x: value.sample_values.slice(0,9).reverse(),
                //Only first 10 Otu_ids in reverse order needed
                y: value.otu_ids.slice(0,9).reverse(),
                //Orientation set to 'h' as it is horizontal bar
                orientation: 'h',
                //Hovertext set to otu_labels
                hovertext:value.otu_labels.slice(0,9)
            }            
            //Setting data for plot
            var data=[trace1];
            
            //Setting layout for plot
            var layout = {
                yaxis:
                {
                    //Adding 'OTU ' as prefix for ticker for y-axis
                    tickprefix: "OTU ",
                    //Setting y-axis value's type as categories to plot in order of data and not as values on y-axis
                    type: 'category'
                }
            };

            //Plot bar using data and layout set above
            Plotly.newPlot('bar', data,layout);

            //Bubble plot for sample data filtered based on selection of drop-down value
            //Setting up trace for plot
            var bubble_trace = {
                //Otu_Ids on x-axis
                x: value.otu_ids,
                //Sample Values on y-axis
                y: value.sample_values,
                //otu_labels as text shown on hover
                text:value.otu_labels,
                //mode as markers
                mode: 'markers',
                marker: {
                    //Sample_values as size of bubbles
                    size: value.sample_values,
                    //Setting color scale from yellow to pink with green in the middle
                    colorscale: [
                    ['0.0', 'rgb(255,255,0)'],
                    ['0.5','rgb(0,255,85)'],
                    ['1.0', 'rgb(255,25,179)']
                    ],
                    //Otu_ids as color of bubbles
                    color: value.otu_ids
                }
            };
            
            //Setting data for plot
            var data = [bubble_trace];
            
            //Plot bubble chart using data and layout set above
            Plotly.newPlot('bubble', data);
        });
    }
});

