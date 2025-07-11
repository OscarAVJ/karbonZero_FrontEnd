function initDashboard() {
  const chartsData = {
    general: {
      id: "general",
      name: "General",
      data: {
        Luz: 60,
        Agua: 20,
        Gasolina: 5,
        Diesel: 5,
        Papel: 8,
        Refrigerante: 2,
      },
    },
    specific: [
      {
        id: "agua",
        name: "Agua",
        data: {
          "2025-01-01T00:00:00.000Z": 32,
          "2025-02-02T00:00:00.000Z": 20,
          "2025-02-01T00:00:00.000Z": 20,
          "2025-03-01T00:00:00.000Z": 45,
          "2025-04-01T00:00:00.000Z": 78,
          "2025-05-01T00:00:00.000Z": 45,
          "2025-06-01T00:00:00.000Z": 20,
          "2025-07-01T00:00:00.000Z": 47,
          "2025-08-01T00:00:00.000Z": 45,
          "2025-09-01T00:00:00.000Z": 41,
          "2025-10-01T00:00:00.000Z": 20,
          "2025-11-01T00:00:00.000Z": 47,
          "2025-12-01T00:00:00.000Z": 74,
        },
      },
      {
        id: "luz",
        name: "Luz",
        data: {
          "2025-01-01T00:00:00.000Z": 12,
          "2025-02-01T00:00:00.000Z": 75,
          "2025-03-01T00:00:00.000Z": 2,
          "2025-04-01T00:00:00.000Z": 5,
          "2025-05-01T00:00:00.000Z": 4,
          "2025-06-01T00:00:00.000Z": 20,
          "2025-07-01T00:00:00.000Z": 47,
          "2025-08-01T00:00:00.000Z": 15,
          "2025-09-01T00:00:00.000Z": 41,
          "2025-10-01T00:00:00.000Z": 20,
          "2025-11-01T00:00:00.000Z": 47,
          "2025-12-01T00:00:00.000Z": 74,
        },
      },
      {
        id: "gasolina",
        name: "Gasolina",
        data: {
          "2025-01-01T00:00:00.000Z": 32,
          "2025-02-01T00:00:00.000Z": 20,
          "2025-03-01T00:00:00.000Z": 45,
          "2025-04-01T00:00:00.000Z": 12,
          "2025-05-01T00:00:00.000Z": 45,
          "2025-06-01T00:00:00.000Z": 45,
          "2025-07-01T00:00:00.000Z": 12,
          "2025-08-01T00:00:00.000Z": 32,
          "2025-09-01T00:00:00.000Z": 0,
          "2025-10-01T00:00:00.000Z": 124,
          "2025-11-01T00:00:00.000Z": 47,
          "2025-12-01T00:00:00.000Z": 74,
        },
      },
    ],
  };

  loadCharts(chartsData);
}

function loadMainChart(json) {
  var options = {
    series: Object.values(json),
    labels: Object.keys(json),
    chart: {
      type: "donut",
      height: "750px",
    },
    responsive: [
      {
        breakpoint: 700,
        options: {
          legend: {
            position: "bottom",
          },
          chart: {
            height: "auto",
          },
        },
      },
    ],
    fill: {
      colors: ["#1F4F24", "#388E3C", "#2E7D32", "#2C6B2F"],
    },
    legend: {
      fontSize: "20px",
    },
  };

  const chart = new ApexCharts(document.getElementById("main-chart"), options);
  chart.render();
}

function loadCharts(data) {
  loadMainChart(data.general.data);

  const consumptionList = document.getElementById("consumptions-selection");

  data.specific.forEach((tab, idx) => {
    const tabItem = document.createElement("div");
    tabItem.className = "d-inline";
    tabItem.innerHTML = `
          <input type="checkbox" class="btn-check" href="#${tab.id}" id="${tab.name}" name="${tab.name}" ${idx === 0 ? "checked" : ""}>
          <label class="btn btn-outline-success" for="${tab.name}">${tab.name}</label>
        `;
        
    consumptionList.appendChild(tabItem);

  });

  
    const options = {
      series: [
        {
          name: "Toneladas de CO2",
          data: Object.values(tab.data),
        },
      ],
      labels: Object.keys(tab.data),
      chart: {
        type: "area",
        height: "600px",
      },
      tooltip: {
        x: {
          format: "dd/MM/yy",
        },
      },
      stroke: {
        curve: "smooth",
      },
      fill: {
        colors: ["#1F4F24"],
      },
      markers: {
        size: 4,
      },
      xaxis: {
        type: "datetime",
        min: new Date("01 January 2025").getTime(),
        tickAmount: 6,
      },
      responsive: [{}],
    };
  

  document
    .querySelector("#one-month")
    .addEventListener("click", function (e) {
      chart.zoomX(
        new Date("01 Jan 2025").getTime(),
        new Date("01 Feb 2025").getTime()
      );
    });
  document
    .querySelector("#three-months")
    .addEventListener("click", function (e) {
      chart.zoomX(
        new Date("01 Jan 2025").getTime(),
        new Date("01 April 2025").getTime()
      );
    });
  document
    .querySelector("#six-months")
    .addEventListener("click", function (e) {
      chart.zoomX(
        new Date("01 Jan 2025").getTime(),
        new Date("01 July 2025").getTime()
      );
    });
  document
    .querySelector("#one-year")
    .addEventListener("click", function (e) {
      chart.zoomX(
        new Date("01 Jan 2025").getTime(),
        new Date("01 Jan 2026").getTime()
      );
    });
  document
    .querySelector("#all")
    .addEventListener("click", function (e) {
      chart.zoomX(
        new Date("01 Jan 2025").getTime(),
        new Date("01 Feb 2026").getTime()
      );
    });

  const chart = new ApexCharts(
    document.getElementById("consumption-chart"),
    options
  );
  chart.render();
});
}
