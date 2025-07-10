function initDashboard () {

    const data = {
        "Luz": 60,
        "Agua": 20,
        "Gasolina": 5,
        "Diesel": 5,
        "Papel": 8, 
        "Refrigerante": 2
    }

    loadMainChart(data);
}

function loadMainChart (json) {

    var options = {
        series: Object.values(json),
        labels: Object.keys(json),
        chart: {
          type: 'donut',
          height: "300px"
        },
        responsive: [{
          breakpoint: 700,
          options : {
            legend : {
                position: 'bottom',
            },
            chart: {
                height: "auto"
            }
          }
        }],
        fill: { 
            colors: ['#1F4F24', '#388E3C', '#2E7D32', '#2C6B2F']
        },
        legend : {
            fontSize: '20px',
        }
        };

    var chart = new ApexCharts(document.querySelector("#main-chart"), options);
    chart.render();
}