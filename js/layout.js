const sidebar = document.querySelector(".sidebar");
const sidebarToggler = document.querySelector(".sidebar-toggler");
const mainWrapper = document.querySelector(".main-content");
const sideBarLabels = document.querySelectorAll(".nav-label-info");

/// Rutas base relativas al layout asi como los archivos CSS y JS
const HTML_PATH = "views/";
const CSS_PATH = "css/";
const JS_PATH = "js/";

/// Aca esta el comportamiento al hacer click y hacer pequenio el sidebar
sidebarToggler.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    sideBarLabels.forEach(label => label.classList.toggle("collapsed"));
    if (mainWrapper) {
        mainWrapper.classList.toggle("collapsed");
    }
});

///Con DomContentLoaded pues nos ayuda a que esperemos hasat que el DOM este listo y asi evitar errores de que no se cargaron los elementos
document.addEventListener('DOMContentLoaded', function () {
    ///Dfinimos las rutas y las hacemos un MAP donde su key seria el texto y ya despues su valor que es el nombre del archivo HTML
    //! Cuidado por que los nombres si tienen que ser iguales ehh
    const routes = {
        'dashboard': 'dashboard.html',
        'consumos': 'consumptions.html',
        'reportes': 'reports.html',
        'mapa': 'map.html',
        'recursos': 'resources.html',
        'usuarios': 'users.html',
        'cuenta': 'userProfile.html'
    };
    //!Lo mismo con los inicializadores, si no tiene pues no lo pongas
    const initializers = {
        'consumptions.html': 'initConsumptions',
        'users.html': 'initUsers',
        'resources.html': 'initResources',
        'userProfile.html': 'initUserProfile',
    };

    function loadCSSIfExists(path) {
        ///Aca creamos el link de css y lo agregamos al head del documento
        fetch(path).then(res => {
            if (res.ok) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = path;
                link.setAttribute('data-dynamic-css', path);
                document.head.appendChild(link);
            }
        });
    }
    ///Lo mismo con el JS PEROOOO en este caso si existe una funcion de inicializacion la llamamos
    function loadJSIfExists(path, initFn) {
        fetch(path).then(res => {
            if (res.ok) {
                const script = document.createElement('script');
                script.src = path;
                script.type = "text/javascript";
                script.onload = () => {
                    if (initFn && typeof window[initFn] === 'function') {
                        window[initFn]();
                    }
                };
                document.body.appendChild(script);
            }
        });
    }
    ///Aca cargamos el contenido de la pagina que se le pase por parametro
    function loadContent(pagePath) {
        ///Aca buscamos el contenedor principal
        const container = document.getElementById('main-content');
        if (!container) return;
        ///ACAAAAA Metemos una animacion que esta en el css de fade-out para que se vea mas bonito 
        container.classList.add('fade-out');
        ///Y pues aca un tiempo para que se vea la animacion entre paginas mas limpio
        setTimeout(() => {
            fetch(pagePath)
            ///Aca pasamos el nombre a texto para poder manipularlo
                .then(res => res.text())
                .then(html => {
                    const temp = document.createElement('div');
                    temp.innerHTML = html;
                    const body = temp.querySelector('body');
                    container.innerHTML = body ? body.innerHTML : html;
                    ///Aca extraemos solo el nombre del archivo para usarlo en css y js TODOS TIENEN QUE SER IGUALES EN LA ESTRUCTURA DE CARPETAS
                    const fileName = pagePath.split('/').pop().replace('.html', '');

                    //! Carga CSS
                    const cssPath = CSS_PATH + fileName + '.css';
                    document.querySelector(`link[data-dynamic-css="${cssPath}"]`)?.remove();
                    loadCSSIfExists(cssPath);

                    //!CARGA JS 
                    ///Busca si hay una funcion de inicialización asociada al archivo HTML
                    ///Si no hay funcion de inicialización, simplemente carga el JS que tenga 
                    const initFn = initializers[fileName + '.html'];
                    if (initFn) {
                        const jsPath = JS_PATH + fileName + '.js';
                        document.querySelector(`script[src="${jsPath}"]`)?.remove();
                        window[initFn] = undefined;
                        loadJSIfExists(jsPath, initFn);
                    }
                    ///Aca la animacion de entrada 
                    setTimeout(() => {
                        container.classList.remove('fade-out');
                        container.classList.add('fade-in');
                        setTimeout(() => container.classList.remove('fade-in'), 300);
                    }, 10);
                })
                ///Manejar error si por caso de la vida no podemos cargar la pagina
                .catch(err => {
                    console.error(`Error cargando ${pagePath}:`, err);
                    container.innerHTML = `
                        <div class="alert alert-danger">
                            <strong>Error:</strong> No se pudo cargar la página "${pagePath}".
                        </div>
                    `;
                });
        }, 300);
    }

    /// Acaa agregamos los eventos a los enlaces del sidebar
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function (e) {
            const label = this.querySelector('.nav-label')?.textContent.trim().toLowerCase();
            if (routes[label]) {
                e.preventDefault();
                loadContent(HTML_PATH + routes[label]);
            }
        });
    });

    /// Carga al entrar a la pagina por defecto
    loadContent(HTML_PATH + 'dashboard.html');
});
