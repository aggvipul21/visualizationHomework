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

        //Find sample record for id selected in dropdown
        var filteredsample=data.samples.filter(filterdata.bind(this, dataset));
        console.log(filteredsample);

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

