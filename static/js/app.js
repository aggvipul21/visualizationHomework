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

        //

        Object.entries(data.samples).forEach(([key,value])=>{
            
            if (value.id===dataset){

                var trace1={
                    type: 'bar',
                    x: value.sample_values.slice(0,9).reverse(),
                    y: value.otu_ids.slice(0,9).reverse(),
                    orientation: 'h',
                    hovertext:value.otu_labels.slice(0,9)
                }
                
                var data=[trace1];
                
                var layout = {
                    yaxis:
                    {
                        tickprefix: "OTU ",
                        type: 'category'
                    }
                };


                Plotly.newPlot('bar', data,layout);

                var bubble_trace = {
                    x: value.otu_ids,
                    y: value.sample_values,
                    text:value.otu_labels,
                    mode: 'markers',
                    marker: {
                      size: value.sample_values,
                      colorscale: [
                        ['0.0', 'rgb(255,255,0)'],
                        ['0.5','rgb(0,255,85)'],
                        ['1.0', 'rgb(255,25,179)']
                      ],
                      color: value.otu_ids
                    }
                  };
                  
                  var data = [bubble_trace];
                  
                Plotly.newPlot('bubble', data);

               }
            
        });
      
       




    }

});

