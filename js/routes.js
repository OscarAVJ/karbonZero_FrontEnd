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
        app.innerHTML = `<h1>404 Página no encontrada</h1>`;
    }
}

if (localStorage.getItem('isAuthenticated') !== 'true') {
    window.location.href = 'login.html';
}
