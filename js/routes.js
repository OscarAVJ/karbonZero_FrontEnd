import { isAuth } from './controllers/sessionController.js';

const routes = {
    'dashboard': () => import('../js/pages/dashboardPage.js'),
    'consumptions': () => import('../js/pages/consumptionsPage.js'),
    'reports': () => import('../js/pages/reportsPage.js'),
    'map': () => import('../js/pages/mapPage.js'),
    'resources': () => import('../js/pages/resourcesPage.js'),
    'users': () => import('../js/pages/usersPage.js'),
    'userProfile': () => import('../js/pages/userProfilePage.js'),
    'channel': () => import("../js/pages/channelPage.js")
}

export async function startRouter() {
  // Bloquea acceso si no hay sesión
  const guard = async () => {
    const ok = await isAuth();
    if (!ok) window.location.replace('/login.html'); // usa absoluto
    return ok;
  };

  // Renderiza la página según el hash
  const render = async () => {
    const routeName = location.hash.slice(1) || 'dashboard';
    const viewLoader = routes[routeName];
    const app = document.getElementById('app');

    if (!viewLoader) {
      app.innerHTML = `
        <section class="d-flex align-items-center min-vh-100 py-5">
          <div class="container py-5">
            <div class="row align-items-center">
              <div class="col-md-6 order-md-2">
                <img class="img-fluid" src="https://res.cloudinary.com/dtxerr5sz/image/upload/v1760503417/boredParrot_evl0kr.png" alt="">
              </div>
              <div class="col-md-6 text-center text-md-start">
                <h1 class="display-1 fw-bold text-success">Error 404</h1>
                <p class="rfs-11 fw-light">La página que buscas fue movida, eliminada o nunca existió.</p>
              </div>
            </div>
          </div>
        </section>`;
      return;
    }

    const module = await viewLoader();
    app.innerHTML = await module.render();
    if (module.afterRender) module.afterRender();
  };

  window.addEventListener('pageshow', guard);
  window.addEventListener('hashchange', async () => {
    if (await guard()) await render();
  });

  if (await guard()) await render();
}
