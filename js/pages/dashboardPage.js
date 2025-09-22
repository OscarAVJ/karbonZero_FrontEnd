import { renderKarbonZeroData } from "../controllers/sessionController";
import { getLoggedUser } from "../services/authService";
import { getAllResourcesConsumptionsCO2 } from "../services/dashboardService";
import { getAllResourceConsumptionsCO2Total } from "../services/dashboardService";

export async function render() {
  loadCSS();
  return `
    <!-- Consumptions Section -->
    <div class="py-4">
        <h2 class="general-title">
            Dashboard
        </h2>

        <ul class="nav nav-tabs mb-3" id="tabList">
            <li class="nav-item">
                <a class="nav-link active" data-bs-toggle="tab" href="#general">General</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" data-bs-toggle="tab" href="#specific">CO2 Producido</a>
            </li>
        </ul>

        <div class="tab-content px-4" id="tabContent">
            <div class="tab-pane fade show active" id="general">
                <div id="main-chart" class="mx-auto" style="max-width: 1000px"></div>
            </div>
            <div class="tab-pane fade" id="specific">
                <div id="time-buttons" class="d-none d-md-block my-2">
                    <button class="btn kz-button-create" id="one-month">1M</button>
                    <button class="btn kz-button-create" id="three-months">3M</button>
                    <button class="btn kz-button-create" id="six-months">6M</button>
                    <button class="btn kz-button-create" id="one-year">1Y</button>
                    <button class="btn kz-button-create" id="all">ALL</button>
                </div>
                <div id="consumptions-selection"></div>
                <div id="consumption-chart"></div>
            </div>
        </div>
    </div>
  `;
}
export function afterRender() {
  renderKarbonZeroData()
  initDashboard();
}
function loadCSS() {
  const id = "dashboard-css";
  if (!document.getElementById(id)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "../../css/dashboard.css";
    link.id = id;
    document.head.appendChild(link);
  }
}

async function initDashboard() {
  const resp = await getLoggedUser();
  console.log(resp)
  const general_data = await getAllResourceConsumptionsCO2Total();
  for (let resource in general_data) {
    general_data[resource] = parseFloat(general_data[resource].toFixed(4));
  }

  const specific_data = await getAllResourcesConsumptionsCO2();
  specific_data.forEach((resource) => {
    resource.data = Object.entries(resource.data);
    resource.data.forEach((entry) => {
      entry[1] = parseFloat(entry[1]).toFixed(4);
    });
    resource.data.sort((a, b) => {
      return a[0].localeCompare(b[0]);
    });
  });

  const chartsData = {
    general: {
      id: "general",
      name: "General",
      data: general_data,
    },
    specific: specific_data,
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

  const options = getChartConfig();
  const chart = new ApexCharts(
    document.getElementById("consumption-chart"),
    options
  );
  chart.render();

  data.specific.forEach((tab, idx) => {
    const tabItem = document.createElement("div");
    tabItem.className = "d-inline m-1";
    tabItem.innerHTML = `
          <input type="checkbox" class="btn-check" href="#${
            tab.id
          }" id="check-${tab.id}" name="check-${tab.id}" ${
      idx === 0 ? "checked" : ""
    }>
          <label class="btn btn-outline-success" for="check-${tab.id}">${
      tab.name
    }</label>
        `;

    consumptionList.appendChild(tabItem);

    document
      .getElementById("check-" + tab.id)
      .addEventListener("change", (e) => {
        updateChart(data, chart);
      });
  });

  updateChart(data, chart);

  document.querySelector("#one-month").addEventListener("click", function (e) {
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
  document.querySelector("#six-months").addEventListener("click", function (e) {
    chart.zoomX(
      new Date("01 Jan 2025").getTime(),
      new Date("01 July 2025").getTime()
    );
  });
  document.querySelector("#one-year").addEventListener("click", function (e) {
    chart.zoomX(
      new Date("01 Jan 2025").getTime(),
      new Date("01 Jan 2026").getTime()
    );
  });
  document.querySelector("#all").addEventListener("click", function (e) {
    chart.zoomX(
      new Date("01 Jan 2025").getTime(),
      new Date("01 Feb 2026").getTime()
    );
  });
}

function updateChart(data, chart) {
  const series = [];

  const consumptions = document.querySelectorAll(
    "#consumptions-selection input[type='checkbox']"
  );
  for (var consumption of consumptions) {
    if (consumption.checked) {
      const dcon = data.specific.find(
        (obj) => obj.id == consumption.id.replace("check-", "")
      );
      series.push({
        name: dcon.name,
        data: dcon.data,
      });
    }
  }

  chart.updateSeries(series);
}

function getChartConfig() {
  return {
    series: [],
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
    markers: {
      size: 5,
    },
    xaxis: {
      type: "datetime",
      min: new Date("01 January 2025").getTime(),
      tickAmount: 6,
    },
    responsive: [{}],
    legend: {
      onItemClick: {
        toggleDataSeries: false,
      },
    },
  };
}
