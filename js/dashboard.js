function initDashboard () {
    const chartsData = [
        {
            id: 'general',
            name: 'General',
            data : {
                "Luz": 60,
                "Agua": 20,
                "Gasolina": 5,
                "Diesel": 5,
                "Papel": 8, 
                "Refrigerante": 2
            }
        },
        {
            id: 'agua',
            name: 'Agua',
            data : {
                "2025-01-01T00:00:00.000Z" : 32,
                "2025-02-02T00:00:00.000Z" : 20,
                "2025-02-01T00:00:00.000Z" : 20,
                "2025-03-01T00:00:00.000Z" : 45, 
                "2025-04-01T00:00:00.000Z" : 78, 
                "2025-05-01T00:00:00.000Z" : 45,
                "2025-06-01T00:00:00.000Z" : 20,
                "2025-07-01T00:00:00.000Z" : 47,
                "2025-08-01T00:00:00.000Z" : 45,
                "2025-09-01T00:00:00.000Z" : 41,
                "2025-10-01T00:00:00.000Z" : 20,
                "2025-11-01T00:00:00.000Z" : 47,
                "2025-12-01T00:00:00.000Z" : 74
            }
        },
        {
            id: 'luz',
            name: 'Luz',
            data : {
                "2025-01-01T00:00:00.000Z" : 12,
                "2025-02-01T00:00:00.000Z" : 75,
                "2025-03-01T00:00:00.000Z" : 2, 
                "2025-04-01T00:00:00.000Z" : 5, 
                "2025-05-01T00:00:00.000Z" : 4,
                "2025-06-01T00:00:00.000Z" : 20,
                "2025-07-01T00:00:00.000Z" : 47,
                "2025-08-01T00:00:00.000Z" : 15,
                "2025-09-01T00:00:00.000Z" : 41,
                "2025-10-01T00:00:00.000Z" : 20,
                "2025-11-01T00:00:00.000Z" : 47,
                "2025-12-01T00:00:00.000Z" : 74
            }
        },
        {
            id: 'gasolina',
            name: 'Gasolina',
            data : {
                "2025-01-01T00:00:00.000Z" : 32,
                "2025-02-01T00:00:00.000Z" : 20,
                "2025-03-01T00:00:00.000Z" : 45, 
                "2025-04-01T00:00:00.000Z" : 12, 
                "2025-05-01T00:00:00.000Z" : 45,
                "2025-06-01T00:00:00.000Z" : 45,
                "2025-07-01T00:00:00.000Z" : 12,
                "2025-08-01T00:00:00.000Z" : 32,
                "2025-09-01T00:00:00.000Z" : 0,
                "2025-10-01T00:00:00.000Z" : 124,
                "2025-11-01T00:00:00.000Z" : 47,
                "2025-12-01T00:00:00.000Z" : 74
            }
        }
    ]

    renderTabs(chartsData)
}

function loadMainChart (json) {
    var options = {
        series: Object.values(json),
        labels: Object.keys(json),
        chart: {
          type: 'donut',
          height: "750px"
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
            fontSize: '20px'
        }
        };

    const chart = new ApexCharts(document.getElementById("main-chart"), options);
    chart.render();
}

function renderTabs(tabsData) {
    const tabList = document.getElementById("tabList");
    const tabContent = document.getElementById("tabContent")
    tabList.innerHTML = '';
    tabContent.innerHTML = '';

    tabsData.forEach((tab, idx) => {
        const tabItem = document.createElement('li');
        tabItem.className = 'nav-item';
        tabItem.innerHTML = `
          <a class="nav-link ${idx === 0 ? 'active' : ''}" data-bs-toggle="tab" href="#${tab.id}">${tab.name}</a>
        `;
        tabList.appendChild(tabItem);

        const tabPane = document.createElement('div');
        tabPane.className = `tab-pane fade${idx === 0 ? ' show active' : ''}`;
        tabPane.id = tab.id;

        if (tab.id != "general") {
            tabPane.innerHTML += `
            <div id="time-buttons" class="d-none d-md-block">
                <button class="btn kz-button-create" id="one-month-${tab.id}">1M</button>
                <button class="btn kz-button-create" id="three-months-${tab.id}">3M</button>
                <button class="btn kz-button-create" id="six-months-${tab.id}">6M</button>
                <button class="btn kz-button-create" id="one-year-${tab.id}">1Y</button>
                <button class="btn kz-button-create" id="all-${tab.id}">ALL</button>
            </div>`
            tabPane.innerHTML += `
            <div id="consumption-chart-${tab.id}">
            </div>`;
            tabContent.appendChild(tabPane);
        } 
        else {
            tabPane.innerHTML += `
                <div id="main-chart" class="mx-auto" style="max-width: 1000px">
                </div>`
            tabContent.appendChild(tabPane);
            loadMainChart(tab.data)
            return;
        }

        var options = {
            series: [{
                name: "Toneladas de CO2",
                data: Object.values(tab.data)
            }],
            labels: Object.keys(tab.data),
            chart: {
              type: 'area',
              height: "600px",
            },
            tooltip: {
                x: {
                  format: 'dd/MM/yy'
                },
            },
            stroke: {
                curve: 'smooth'
            },
            fill: { 
                colors: ['#1F4F24']
            },
            markers: {
                size: 4,
              },
            xaxis: {
                type: 'datetime',
                min: new Date('01 January 2025').getTime(),
                tickAmount: 6,
            },
            responsive : [{

            }]
            
        };
    
        document.querySelector('#one-month-' + tab.id).addEventListener('click', function(e) {
            chart.zoomX(
                new Date('01 Jan 2025').getTime(),
                new Date('01 Feb 2025').getTime())
            })
        document.querySelector('#three-months-' + tab.id).addEventListener('click', function(e) {
            chart.zoomX(
                new Date('01 Jan 2025').getTime(),
                new Date('01 April 2025').getTime())
            })
        document.querySelector('#six-months-' + tab.id).addEventListener('click', function(e) {
            chart.zoomX(
                new Date('01 Jan 2025').getTime(),
                new Date('01 July 2025').getTime())
            })
        document.querySelector('#one-year-' + tab.id).addEventListener('click', function(e) {        
            chart.zoomX(
            new Date('01 Jan 2025').getTime(),
            new Date('01 Jan 2026').getTime())
        })
        document.querySelector('#all-' + tab.id).addEventListener('click', function(e) {        
            chart.zoomX(
            new Date('01 Jan 2025').getTime(),
            new Date('01 Feb 2026').getTime())
        })

        const chart = new ApexCharts(document.getElementById("consumption-chart-" + tab.id), options);
        chart.render();

    })
}