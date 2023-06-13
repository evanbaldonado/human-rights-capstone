function visualizeAffiliations(data) {

    // Define links.
    const links = {
        "CWA": "https://cwa-union.org/",
        "UAW": "https://uaw.org/",
        "SEIU": "https://www.seiu.org/",
        "Unite Here": "https://unitehere.org/",
        "UE": "https://www.ueunion.org/",
        "NEARI": "https://www.neari.org/",
        "Teamsters": "https://teamster.org/",
        "OPEIU": "https://www.opeiu.org/",
        "USW": "https://www.usw.org/",
        "NEA": "https://www.nea.org/",
        "AAUP": "https://www.aaup.org/",
        "UCW": "https://ucw-cwa.org/", // CWA affiliate
        "AFT": "https://www.aft.org/",
        "IFT/AFT": "https://www.ift-aft.org/" // AFT
    };

    // Create objects to keep track of the count of each affiliation.
    let affiliationCountsFull = {}; // untagged and not system
    let affiliationCountsAggregated = {}; // untagged and system

    // Loop through each union in the dataset.
    for (const union of data) {
        if (union["Affiliation"] === "" || union["Affiliation"] === "unknown" || union["Affiliation"] === "not technically a union") { continue; } // skip empty data

        // Untagged: add to both
        if (union["Is campus?"] === null || union["Is campus?"] === undefined || union["Is campus?"] === "") {
            if (!affiliationCountsFull.hasOwnProperty(union["Affiliation"])) {
                affiliationCountsFull[union["Affiliation"]] = 0;
            }
            affiliationCountsFull[union["Affiliation"]]++;

            if (!affiliationCountsAggregated.hasOwnProperty(union["Affiliation"])) {
                affiliationCountsAggregated[union["Affiliation"]] = 0;
            }
            affiliationCountsAggregated[union["Affiliation"]]++;
        }

        // System:
        if (union["Is campus?"] === "System" || union["Is campus?"] === "system") {
            if (!affiliationCountsAggregated.hasOwnProperty(union["Affiliation"])) {
                affiliationCountsAggregated[union["Affiliation"]] = 0;
            }
            affiliationCountsAggregated[union["Affiliation"]]++;
        } else {
            // Campus:
            if (union["Is campus?"] !== null && union["Is campus?"] !== undefined && union["Is campus?"] !== "") {
                if (!affiliationCountsFull.hasOwnProperty(union["Affiliation"])) {
                    affiliationCountsFull[union["Affiliation"]] = 0;
                }
                affiliationCountsFull[union["Affiliation"]]++;
            }
        }
    }

    // Create an array to store affiliation data.
    let affiliationCountsFullArray = [];
    let affiliationCountsAggregatedArray = [];

    // Populate the array by iterating through the object.
    for (const affiliation in affiliationCountsFull) {
        if (affiliationCountsFull.hasOwnProperty(affiliation)) {
            affiliationCountsFullArray.push(
                {
                    affiliation: affiliation,
                    count: affiliationCountsFull[affiliation]
                }
            );
        }
    }
    for (const affiliation in affiliationCountsAggregated) {
        if (affiliationCountsAggregated.hasOwnProperty(affiliation)) {
            affiliationCountsAggregatedArray.push(
                {
                    affiliation: affiliation,
                    count: affiliationCountsAggregated[affiliation]
                }
            );
        }
    }

    // Sort the array.
    affiliationCountsFullArray.sort(
        (a, b) => a.count < b.count ? 1 : -1
    );

    affiliationCountsAggregatedArray.sort(
        (a, b) => a.count < b.count ? 1 : -1
    );

    // Create arrays for chart.js.
    var xValuesFull = [];
    var yValuesFull = [];
    var xValuesAggregated = [];
    var yValuesAggregated = [];

    // Populate arrays.
    for (const affiliation of affiliationCountsFullArray) {
        xValuesFull.push(affiliation["affiliation"]);
        yValuesFull.push(affiliation["count"]);
    }

    for (const affiliation of affiliationCountsAggregatedArray) {
        xValuesAggregated.push(affiliation["affiliation"]);
        yValuesAggregated.push(affiliation["count"]);
    }


    // Handle toggling
    let affiliationChartMode = "aggregated";
    function toggleAffiliationChart() {
        const toggleButton = document.getElementById("affiliation-chart-toggle");
        const caption = document.getElementById("affiliation-caption");

        if (affiliationChartMode === "aggregated") {
            affiliationChartMode = "unaggregated";
            // affiliationChart.options.title.text = "Student unions by affiliation (not aggregated)";
            populateTable(xValuesFull, yValuesFull);
            caption.innerText = "A table of union affiliations (not aggregated). Click to toggle whether unionized schools within a system are counted as a single entity or aggregated (ex: whether each of the schools that make up the University of California (UC) System are counted separately).";
            toggleButton.innerText = "view aggregated";
        } else {
            affiliationChartMode = "aggregated";
            // affiliationChart.options.title.text = "Student unions by affiliation (aggregated by system)";
            populateTable(xValuesAggregated, yValuesAggregated);
            caption.innerText = "A table of union affiliations (aggregated by system). Click to toggle whether unionized schools within a system are counted as a single entity or aggregated (ex: whether each of the schools that make up the University of California (UC) System are counted separately).";
            toggleButton.innerText = "view unaggregated";
        }
    }

    document.getElementById("affiliation-chart-toggle").addEventListener("click", toggleAffiliationChart);

    function populateTable(xValues, yValues) {
        const table = document.getElementById("affiliation-table");
        table.style.borderCollapse = "collapse";

        const thead = table.getElementsByTagName("thead")[0];
        const maxWidth = "300"; //thead.getElementsByTagName("th")[2].offsetWidth;

        const tbody = table.getElementsByTagName("tbody")[0];
        tbody.innerHTML = "";

        for (var i = 0; i < xValuesFull.length; i++) {
            const tr = document.createElement("tr");
            tr.style.borderBottomStyle = "solid";
            tr.style.borderBottomWidth = "0.5px";

            const td1 = document.createElement("td"); // rank
            td1.appendChild(document.createTextNode("#" + (i + 1).toString()));
            const td2 = document.createElement("td"); // name + url
            if (links.hasOwnProperty(xValues[i])) {
                const link = document.createElement("a");
                link.appendChild(document.createTextNode(xValues[i]));
                link.href = links[xValues[i]];
                link.target = "_blank";
                td2.appendChild(link);
            } else {
                td2.appendChild(document.createTextNode(xValuesFull[i]));
            }
            const td3 = document.createElement("td"); // count
            const length = document.createElement("div");
            length.style.width = (maxWidth * (yValues[i] / Math.max(...yValues))) + "px";
            length.style.height = "20px";
            length.style.display = "inline-block";
            length.style.backgroundColor = "#67AFD2";
            td3.appendChild(length);
            td3.appendChild(document.createTextNode(" (" + yValues[i].toString() + ")"));
            td3.style.paddingTop = "0.5em";
            td3.style.paddingBottom = "0.5em";

            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tbody.appendChild(tr);
        }
    }

    populateTable(xValuesAggregated, yValuesAggregated);
}
