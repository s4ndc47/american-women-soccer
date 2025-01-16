document.addEventListener("DOMContentLoaded", function () {

    const files = {
        table1: "Data/Points_Comparsion_NWSL_2024_Original.csv",
        table2: "Data/Points_Comparsion_NWSL_2024_Allyson_Schlegel.csv",
        table3: "Data/Points_Comparsion_NWSL_2024_Ashley_Sanchez.csv",
        table4: "Data/Points_Comparsion_NWSL_2024_Asisat_Oshoala.csv",
        table5: "Data/Points_Comparsion_NWSL_2024_Barbra_Banda.csv",
        table6: "Data/Points_Comparsion_NWSL_2024_Croix_Bethune.csv",
        table7: "Data/Points_Comparsion_NWSL_2024_Débora_Cristiane_de_Oliveira.csv",
        table8: "Data/Points_Comparsion_NWSL_2024_Ella_Stevens.csv",
        table9: "Data/Points_Comparsion_NWSL_2024_Esther_González.csv",
        table10: "Data/Points_Comparsion_NWSL_2024_Mallory_Swanson.csv",
        table11: "Data/Points_Comparsion_NWSL_2024_Marta.csv",
        table12: "Data/Points_Comparsion_NWSL_2024_Olivia_Moultrie.csv",
        table13: "Data/Points_Comparsion_NWSL_2024_Racheal_Kundananj.csv",
        table14: "Data/Points_Comparsion_NWSL_2024_Sophia_Smith.csv",
        table15: "Data/Points_Comparsion_NWSL_2024_Temwa_Chawinga.csv",
        table16: "Data/Points_Comparsion_NWSL_2024_Trinity_Rodman.csv",
        table17: "Data/Points_Comparsion_NWSL_2024_Tyler_Lussi.csv",
        table18: "Data/Points_Comparsion_NWSL_2024_Vanessa_DiBernardo.csv",
        table19: "Data/Points_Comparsion_NWSL_2024_Yazmeen_Ryan.csv",
    };

    const sentences = {
        table1: "This is the original table.",
        table2: "Without the goal contributions from Allyson Schlegel, </br>Chicago Red Stars would drop from 8th to 10th,</br> miss playoffs. Racing Louisville would clinch playoffs instead.",
        table3: "Without the goal contributions from Ashley Sanchez,</br> North Carolina Courage would drop from 5th to 8th,</br> they could have just clinched for playoffs.",
        table4: "Without the goal contributions from Asisat Oshoala,</br> Bay FC would drop from 7th to 10th, miss playoffs.</br>Racing Louisville would clinch playoffs instead.",
        table5: "Without the goal contributions from Barbra Banda,</br> Orlando Pride would drop from 1st to 4th. </br>The NWSL shield (regular season champion) </br>would go to Washington Spirit instead.",
        table6: "Without the goal contributions from Croix Bethune,</br> Washington Spirit would drop from 2nd to 4th.",
        table7: "Without the goal contributions from Débora,</br> Kansas City Current would remain 4th position.",
        table8: "Without the goal contributions from Ella Stevens,</br> NJ/NY Gotham FC would slightly drop 1 position, </br>from 3rd to 4th.",
        table9: "Without the goal contributions from Esther Gonzalez,</br> NJ/NY Gotham FC would slightly drop 1 position,</br>from 3rd to 4th.",
        table10: "Without the goal contributions from Mallory Swanson,</br> Chicago Red Stars would drastically drop</br> from 8th to the bottom of the table, 14th. </br>Racing Louisville would clinch playoffs instead.",
        table11: "Without the goal contributions from Marta,</br> Orlando Pride would fail to win the NWSL shield,</br> handing it to NJ/NY Gotham FC, </br>and drop to 4th position.",
        table12: "Without the goal contributions from Olivia Moultrie,</br> Portland Thorns FC would slightly drop 1 position, from 6th to 7th. ",
        table13: "Without the goal contributions from Racheal Kundananj,</br> Bay FC would slightly drop 1 position, from 7th to 8th. ",
        table14: "Without the goal contributions from Sophia Smith,</br> Portland Thorns FC would drop heavily for 6 position, </br>from 6th to 12th and miss playoffs. </br>Racing Louisville would clinch playoffs instead.",
        table15: "Without the goal contributions from Temwa Chawinga,</br> Kansas City Current would drop from 4th to 5th. </br>NJ/NY Gotham FC would take over from Orlando Pride </br>as the alternate NSWL shield winner.",
        table16: "Without the goal contributions from Trinity Rodman,</br> Washington Spirit would drop from runner-up </br>in the regular season to 4th position.",
        table17: "Without the goal contributions from Tyler Lussi,</br> North Carolina Courage would remain at 5th position.",
        table18: "Without the goal contributions from Vanessa DiBernardo,</br> Kansas City Current would remain 4th position.  ",
        table19: "Without the goal contributions from Yazmeen Ryan,</br> NJ/NY Gotham FC would slightly drop from 3rd to 4th."
    };

    d3.select("#table-selector").on("change", function () {
        const selectedKey = d3.select(this).property("value");
        const sentence = sentences[selectedKey];
        const tableContainer = d3.select("#ranking-table");

        if (sentence) {
            tableContainer.html(`<p style="text-align: center">${sentence}</p>`);
        } else {
            console.error("Sentence not found for selected option:", selectedKey);
        }

        const selectedFile = files[selectedKey];
        if (selectedFile) {
            loadCSV(selectedFile, (data) => {
                updateTable(data, false); // Pass `false` for subsequent updates
            });
        } else {
            console.error("Selected file key not found:", selectedKey);
        }
    });

    const initialSentence = sentences["table1"];
    d3.select("#ranking-table").html(`<p style="text-align: center">${initialSentence}</p>`);

    let previousData = [];

    function loadCSV(filePath, callback) {
        d3.csv(filePath)
            .then((data) => {
                prepareData(data);
                callback(data);
            })
            .catch((error) => {
                console.error(`Error loading CSV from ${filePath}:`, error);
            });
    }

    loadCSV(files.table1, (data) => {
        updateTable(data, true); // Pass `true` for the initial load
    });

    function prepareData(data) {
        data.forEach((d) => {
            d.Rank = parseInt(String(d.Rank).trim(), 10); // Parse and clean rank
            d.P = +d.P;
            d.W = +d.W;
            d.D = +d.D;
            d.L = +d.L;
            d.PTS = +d.PTS;
        });
    }

    function updateTable(data, initialLoad) {
        // Sort by Rank as a number
        data.sort((a, b) => a.Rank - b.Rank);

        const table = d3.select("#ranking-table");

        if (table.select("thead").empty()) {
            table.append("thead")
                .append("tr")
                .selectAll("th")
                .data(["Rank", "", "Team", "P", "W", "D", "L", "PTS"])
                .enter()
                .append("th")
                .text((d) => d);

            table.append("tbody");
        }

        const tbody = table.select("tbody");
        tbody.selectAll("tr").remove();
        const rows = tbody.selectAll("tr").data(data, (d, i) => i);
        const newRows = rows.enter()
            .append("tr");

        newRows.selectAll("td")
            .data((row) => [
                row.Rank,
                row.Image
                    ? `<img src="${row.Image}" alt="${row.Team} Logo" style="height: 20px; width: 20px;">`
                    : "",
                row.Team,
                row.P,
                row.W,
                row.D,
                row.L,
                row.PTS,
            ])
            .enter()
            .append("td")
            .html((value) => value);


        const mergedRows = rows.merge(newRows);
        mergedRows.selectAll("td")
            .data((row) => [
                row.Rank,
                row.Image
                    ? `<img src="${row.Image}" alt="${row.Team} Logo" style="height: 20px; width: 20px;">`
                    : "",
                row.Team,
                row.P,
                row.W,
                row.D,
                row.L,
                row.PTS,
            ])
            .join(
                (enter) => enter.append("td").html((d) => d),
                (update) => update.html((d) => d)
            );

        mergedRows.each(function (row) {
            const currentRow = d3.select(this);

            const prev = previousData.find((d) => d.Team === row.Team);
            if (!initialLoad && (!prev || JSON.stringify(prev) !== JSON.stringify(row))) {
                currentRow.selectAll("td")
                    .style("color", "#e9a1ff")
                    .transition()
                    .duration(2000)
                    .style("color", "white");
            }
        });

        previousData = [...data];
    }
});
