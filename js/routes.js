const routes = {
    'dashboard': () => import('../js/pages/dashboardPage.js'),
    'consumptions': () => import('../js/pages/consumptionsPage.js'),
    'reports': () => import('../js/pages/reportsPage.js'),
    'map': () => import('../js/pages/mapPage.js'),
    'resources': () => import('../js/pages/resourcesPage.js'),
    'users': () => import('../js/pages/usersPage.js'),
    'userProfile': () => import('../js/pages/userProfilePage.js')
}

export async function startRouter() {
    const routeName = location.hash.slice(1) || 'dashboard';
    const app = document.getElementById('app');
    const viewLoader = routes[routeName];

    if (viewLoader) {
        const module = await viewLoader();
        app.innerHTML = await module.render();
        if (module.afterRender) module.afterRender();
    } else {
        app.innerHTML = `<section class="d-flex align-items-center min-vh-100 py-5">
        <div class="container py-5">
            <div class="row align-items-center">
                <div class="col-md-6 order-md-2">
                    <div class="lc-block">
                        <img class="img-fluid" src="../assets/imgs/BoredParrot.png"></img>
                    </div>
                </div>
                <div class="col-md-6 text-center text-md-start ">
                    <div class="lc-block mb-3">
                        <div editable="rich">
                            <!-- <h1 class="fw-bold text-success">PAGE NOT FOUND!<br></h1> -->
                        </div>
                    </div>
                    <div class="lc-block mb-3">
                        <div editable="rich">
                            <h1 class="display-1 fw-bold text-success">Error 404</h1>

                        </div>
                    </div>
                    <div class="lc-block mb-5">
                        <div editable="rich">
                            <p class="rfs-11 fw-light"> La pagina que estas buscando fue movida, eliminada o puede que nunca haya existido.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>`;
    }
}

if (localStorage.getItem('isAuthenticated') !== 'true') {
    window.location.href = 'login.html';
}
