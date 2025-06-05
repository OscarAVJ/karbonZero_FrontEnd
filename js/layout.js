const sidebar = document.querySelector(".sidebar");
const sidebarToggler = document.querySelector(".sidebar-toggler");
const mainContent = document.querySelector(".main-content");

sidebarToggler.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    if (mainContent) {
        mainContent.classList.toggle("collapsed");
    }
});

///DOMContentLoaded nos ayuda a asegurarnos de que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', function () {
    /// Acarelacionamos cada enlace del sideBar con su respectivo HTML
    const routes = {
        'dashboard': 'dashboard.html',
        'consumos': 'consumptions.html',
        'reportes': 'reports.html',
        'mapa': 'map.html',
        'recursos': 'resources.html',
        'usuarios': 'users.html'
    };

    // Función para cargar el contenido en el main
    function loadContent(page) {
        const mainContent = document.getElementById('main-content');
        ///Aplicacion de animacion
        mainContent.classList.add('fade-out');
        setTimeout(() => {
            fetch(page)
                .then(res => res.text())
                .then(html => {
                    const temp = document.createElement('div');
                    temp.innerHTML = html;
                    const body = temp.querySelector('body');
                    mainContent.innerHTML = body ? body.innerHTML : html;

                    // Cargar CSS específico si existe
                    const cssName = '../css/' + page.replace('.html', '.css');
                    const oldCss = document.querySelector(`link[data-dynamic-css="${cssName}"]`);
                    if (oldCss) oldCss.remove();
                    fetch(cssName)
                        .then(res => {
                            if (res.ok) {
                                const link = document.createElement('link');
                                link.rel = 'stylesheet';
                                link.href = cssName;
                                link.setAttribute('data-dynamic-css', cssName);
                                document.head.appendChild(link);
                            }
                        });

                    ///Cargar javascript asociado a la página
                    const scriptName = '../js/' + page.replace('.html', '.js');
                    const oldScript = document.querySelector(`script[src="${scriptName}"]`);
                    if (oldScript) oldScript.remove();

                    ///Limpia la función global antes de cargar el nuevo script
                    //TODO: Aca iran las demas paginas a ingresar

                    if (page === 'consumptions.html') {
                        window.initConsumptions = undefined;
                    }
                    if (page === 'users.html') {
                        window.initUsers = undefined;
                    }
                    fetch(scriptName)
                        .then(res => {
                            if (res.ok) {
                                const script = document.createElement('script');
                                script.src = scriptName;
                                script.type = "text/javascript";
                                //TODO: Aca iran los metodos de inicializacion de las paginas
                                script.onload = () => {
                                    if (page === 'consumptions.html' && typeof initConsumptions === 'function') {
                                        initConsumptions();
                                    }
                                    if (page === 'users.html' && typeof initUsers === 'function') {
                                        initUsers();
                                    }
                                };
                                document.body.appendChild(script);
                            }
                        });
                    // Aplica fade-in después de un pequeño delay
                    setTimeout(() => {
                        mainContent.classList.remove('fade-out');
                        mainContent.classList.add('fade-in');
                        // Quita la clase fade-in después de la animación para que funcione la próxima vez
                        setTimeout(() => mainContent.classList.remove('fade-in'), 300);
                    }, 10);
                });
        }, 300); // Debe coincidir con el tiempo de transición en CSS
    }

    // Asigna evento a cada enlace del sidebar
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function (e) {
            const label = this.querySelector('.nav-label')?.textContent.trim().toLowerCase();
            if (routes[label]) {
                e.preventDefault();
                loadContent(routes[label]);
            }
        });
    });

    // Carga el dashboard por defecto
    loadContent('dashboard.html');
});