function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Deliverable 1: 1. Create the buildChart function.
function buildCharts(sample) {
  // Deliverable 1: 2. Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Deliverable 1: 3. Create a variable that holds the samples array. 
    var sampleArray = data.samples; 
    // Deliverable 1: 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleResult = sampleArray.filter(sampleObj => sampleObj.id == sample);
    // Deliverable 3: 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadataArray = data.metadata; 
    // Deliverable 1: 5. Create a variable that holds the first sample in the array.
    var resultMetaArray = metadataArray.filter(sampleObj => sampleObj.id == sample);
    // Deliverable 3: 2. Create a variable that holds the first sample in the metadata array.
    var result = sampleResult[0]; 
    console.log({result}); 

    var firstMeta = resultMetaArray[0];
    console.log({firstMeta});
    // Deliverable 1: 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_idsData = result.otu_ids; 
    var otu_labelsData = result.otu_labels;
    var sample_valuesData = result.sample_values; 
    console.log({otu_idsData});
    console.log({otu_labelsData});
    console.log({sample_valuesData});

    // Deliverable 3: 3. Create a variable that holds the washing frequency.
    var wash_freq = parseFloat(firstMeta.wfreq);
    console.log({wash_freq});
    // Deliverable 1: 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last. 
    var yticks = otu_idsData.slice(0, 10).map(ids => "OTU " + ids).reverse(); 

    // Deliverable 1: 8. Create the trace for the bar chart. 
    var barData = [{
      x: sample_valuesData.slice(0, 10).reverse(),
      y: yticks, 
      text: otu_labelsData.slice(0, 10).reverse(), 
      type: "bar",
      orientation: 'h'
    }];

    // Deliverable 1: 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      width: 400, 
      height: 400 
    };

    // Deliverable 1: 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout); 
    // Deliverable 2: 1. Create the trace for the bubble chart.
    // Reference: https://plotly.com/javascript/bubble-charts/
    var trace1 = {
      x: otu_idsData, 
      y: sample_valuesData, 
      text: otu_labelsData,
      mode: 'markers',
      marker: {
        color: otu_idsData,
        size: sample_valuesData, 
        colorscale: 'Picnic'
      }
    };

    var bubbleData = [trace1];

    // Deliverable 2: 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: { title: "OTU ID" }, 
      hovermode:'closest'
    };
    // Deliverable 2: 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    // Deliverable 3: 4. Create the trace for the gauge chart.
    
    var gaugeData = [
      {
        type: "indicator",
		    mode: "gauge+number", 
        domain: { x: [0, 1], y: [0, 1] },
        value: wash_freq, 
        title: { text: "<b> Belly Button Washing Frequency </b> <br> Scrubs per Week" },
        delta: { reference: 100 }, 
        gauge: {
          axis: { range: [0, 10], tickwidth: 1, tickcolor: "black" }, 
          steps: [
            { range: [0, 2], color: "red" },
            { range: [2, 4], color: "orange" }, 
            { range: [4, 6], color: "yellow" }, 
            { range: [6, 8], color: "lightgreen" }, 
            { range: [8, 10], color: "green" }
            ], 
          bar: { color: "black" },
          borderwidth: 2,
          bordercolor: "gray" 
        }    
      }
    ];

    // Deliverable 3: 5. Create the layout for the gauge chart.
    var gaugeLayout = { width: 500, height: 400, margin: { t: 25, r: 25, l: 25, b: 25 } }; 

    // Deliverable 3: 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout); 
  });
}; 
