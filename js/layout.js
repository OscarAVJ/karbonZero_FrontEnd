const sidebar = document.querySelector(".sidebar");
const sidebarToggler = document.querySelector(".sidebar-toggler");
const mainWrapper = document.querySelector(".main-content");
const sideBarLabels = document.querySelectorAll(".nav-label-info");

//!Aca definimos las rutasl ../css y js para no escribirlas nuevamente, que hueva
const CSS_PATH = "../css/";
const JS_PATH = "../js/";


///Evento para cuando se colapsa el banner
sidebarToggler.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
    sideBarLabels.forEach(label => label.classList.toggle("collapsed")); 
    if (mainWrapper) {
        mainWrapper.classList.toggle("collapsed"); ///Ajustamos el contenido principal
    }
});

///asegurarnos de que el DOM esté completamente cargado antes de ejecutar el código
document.addEventListener('DOMContentLoaded', function () {

    /// Aqui hermanos carboneros relacionamos los nombre que estan en el menu con su archivo html respectivo
    const routes = {
        'dashboard': 'dashboard.html',
        'consumos': 'consumptions.html',
        'reportes': 'reports.html',
        'mapa': 'map.html',
        'recursos': 'resources.html',
        'usuarios': 'users.html'
    };

    ///las páginas con sus funciones de inicialización
    const initializers = {
        'consumptions.html': 'initConsumptions',
        'users.html': 'initUsers',
        'resources.html': 'initResources'
    };

    function loadContent(page) {
        /// aca es donde se insertará el contenido principal
        const container = document.getElementById('main-content');
        if (!container) return;

        /// AQUI METEMOS LA ANIMACION DEL FADE por que si no se ve muy simple jsjsjsj
        container.classList.add('fade-out');

        /// esperamos un momento para aplicar animación antes de cambiar el contenido
        setTimeout(() => {
            /// buscamos el contenido de la página HTML correspondiente
            fetch(page)
                .then(res => res.text()) /// Lo convertimos a texto para poder manipularlo
                .then(html => {
                    /// Creamos un contenedor temporal para insertar el HTML recibido
                    const temp = document.createElement('div');
                    temp.innerHTML = html;
                    const body = temp.querySelector('body');

                    /// En caso de que no exista un body, se usa el HTML completo
                    container.innerHTML = body ? body.innerHTML : html;

                    //! Cargar CSS específico si existe
                    const cssName = CSS_PATH + page.replace('.html', '.css');
                    const oldCss = document.querySelector(`link[data-dynamic-css="${cssName}"]`);
                    if (oldCss) oldCss.remove(); /// Eliminamos el CSS anterior

                    fetch(cssName)
                        .then(res => {
                            if (res.ok) {
                                const link = document.createElement('link');
                                link.rel = 'stylesheet';
                                link.href = cssName;
                                link.setAttribute('data-dynamic-css', cssName);
                                document.head.appendChild(link); /// Agregamos el nuevo CSS
                            }
                        });

                    //!~ Cargar JavaScript asociado a la página
                    const scriptName = JS_PATH + page.replace('.html', '.js');
                    const oldScript = document.querySelector(`script[src="${scriptName}"]`);
                    if (oldScript) oldScript.remove(); /// Eliminamos el script anterior si ya estaba

                    /// Limpiamos la función global antes de cargar el nuevo script
                    const initFn = initializers[page];
                    if (initFn) window[initFn] = undefined;

                    fetch(scriptName)
                        .then(res => {
                            if (res.ok) {
                                const script = document.createElement('script');
                                script.src = scriptName;
                                script.type = "text/javascript";
                                /// Al cargar el script, ejecutamos su función de inicialización si existe
                                script.onload = () => {
                                    if (initFn && typeof window[initFn] === 'function') {
                                        window[initFn]();
                                    }
                                };

                                document.body.appendChild(script); /// Insertamos el nuevo script
                            }
                        });

                    /// Aplicación de fade-in después de un pequeño delay
                    setTimeout(() => {
                        container.classList.remove('fade-out');
                        container.classList.add('fade-in');

                        /// Quitamos la clase fade-in después de la animación para permitir futuras animaciones
                        setTimeout(() => container.classList.remove('fade-in'), 300);
                    }, 10);
                })
                /// En caso de error, mostramos mensaje en consola y contenido de error en pantalla
                .catch(err => {
                    console.error(`Error cargando ${page}:`, err);
                    container.innerHTML = `
                        <div class="alert alert-danger">
                            <strong>Error:</strong> No se pudo cargar la página "${page}".
                        </div>
                    `;
                });
        }, 300); 
    }

    /// Asignamos evento a cada enlace del sidebar
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function (e) {
            /// Obtenemos el nombre del ítem de menú
            const label = this.querySelector('.nav-label')?.textContent.trim().toLowerCase();
            /// Si existe una ruta correspondiente, evitamos comportamiento por defecto y cargamos el contenido
            if (routes[label]) {
                e.preventDefault();
                loadContent(routes[label]);
            }
        });
    });

    /// Cargamos el dashboard por defecto al iniciar
    loadContent('dashboard.html');
});
