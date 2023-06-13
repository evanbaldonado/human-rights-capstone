// Import the CSV data using d3.js.
d3.csv("data/union-data-6-12-23.csv", (unionData) => {
    displayMap(unionData);
    visualizeAffiliations(unionData);
    visualizeCostDonuts();
});
