function visualizeCostDonuts() {
    const averageSalary = 41041; // https://www.glassdoor.com/Salaries/uc-berkeley-teaching-assistant-salary-SRCH_IL.0,11_IC1164021_KO12,30.htm
    const unionIncrease = 1.075;
    const newAverageSalary = averageSalary * unionIncrease ;

    // Note: the data from https://livingwage.mit.edu/counties/06001 does not sum evenly (it is $132 off)
    // Some colors from: https://observablehq.com/@d3/color-schemes
    ["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf"]
    const costBreakdown = {
        "Average TA salary": [0, "#67AFD2"], // When using multiple rings, you can only use one labelset
        "Average TA salary (union)": [0, "#67AFD2"], // When using multiple rings, you can only use one labelset
        "Short amount": [0, "#67AFD2"], // When using multiple rings, you can only use one labelset
        "Food": [4686, "#1f77b4"],
        "Child Care": [0, "#ff7f0e"],
        "Medical": [3136, "#2ca02c"],
        "Housing": [18947, "#d62728"],
        "Transportation": [5316, "#9467bd"],
        "Civic": [2920, "#8c564b"],
        "Other": [4596, "#e377c2"],
        "Taxes": [6755, "#7f7f7f"]
    };

    // Calculate the total cost.
    let totalCost = 0;
    for (const item in costBreakdown) {
        totalCost += costBreakdown[item][0];
    }

    // Populate arrays for chart.js.
    let sliceColorsFull = [];
    let sliceNames = [];
    let sliceNumbers = [];

    for (const item in costBreakdown) {
        sliceNames.push(item);
        sliceNumbers.push(costBreakdown[item][0]);
        sliceColorsFull.push(costBreakdown[item][1]);
    }

    // Define datasets
    const datasets = [
        {
          label: 'Percent made (union)',
          data: [0, newAverageSalary, totalCost - newAverageSalary],
          backgroundColor: ["#FFFFFF", "#59a14f", "#FFFFFF"],
          hoverOffset: 4
        },
        {
          label: 'Percent made',
          data: [averageSalary, 0, totalCost - averageSalary],
          backgroundColor: ["#e15759", "#FFFFFF", "#FFFFFF"],
          hoverOffset: 4
        },
        {
          label: 'Cost breakdown (grey)',
          data: sliceNumbers,
          hoverOffset: 4
        },
        {
          label: 'Cost breakdown',
          data: sliceNumbers,
          backgroundColor: ["#ffffff", "#ffffff", "#ffffff", "#4e79a7","#f28e2c","#76b7b2","#edc949","#af7aa1","#ff9da7","#9c755f","#bab0ab"],
          hoverOffset: 4
        }
    ];

    function createDonutChart(id, title, datasets) {
        // Documentation: https://www.chartjs.org/docs/latest/charts/doughnut.html
        new Chart(id, {
            type: "doughnut",
            data: {
                labels: sliceNames,
                datasets: datasets
            },
            options: {
                legend: {
                    display: false
                },
                title: {
                  display: true,
                  text: title
                },
                // Modified from http://www.java2s.com/example/javascript/chart.js/chartjs-doughnut-tooltip-percentages-usage.html
                tooltips: {
                    callbacks: {
                        label: function(tooltipItem, data) {
                            const dataset = data.datasets[tooltipItem.datasetIndex];
                            const item = data.labels[tooltipItem.index];
                            const cost = dataset.data[tooltipItem.index];
                            const percent = Math.round(cost / totalCost * 100 * 100) / 100;
                            return item + ": $" + cost.toLocaleString("en-US") + " (" + percent + "%)";
                        }
                    }
                }
            }
        });
    }

    createDonutChart("cost-donut-chart-1", "Living salary cost breakdown (1 adult, 0 children in Alameda County, California)", datasets.slice(3, 4));
    createDonutChart("cost-donut-chart-2", "Living salary cost breakdown vs TA salary", datasets.slice(1, 3));
    createDonutChart("cost-donut-chart-3", "Living salary cost breakdown vs TA salary (union)", datasets.slice(0, 3));
}
