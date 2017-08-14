import db from 'baqend'
import Hello from './components/Hello'
import VueRouter from 'vue-router'

function dbReady (to, from, next) {
  db.ready(() => next())
}

/**
 * Asynchronously load components (Webpack Lazy loading compatible)
 * @param  {string}   name     the filename (basename) of the component to load.
 */
function view (name) {
  return function (resolve) {
    require(['./components/' + name + '.vue'], resolve)
  }
}

const routes = [
  { path: '/', component: Hello },
  { path: '/dashboard', name: 'dashboard', component: view('Dashboard'), beforeEnter: dbReady },
  { path: '/settings', name: 'settings', component: view('Settings'), beforeEnter: dbReady },
  { path: '/swop-dialog', name: 'swop-dialog', component: view('SwopDialog'), beforeEnter: dbReady },
  { path: '/spielregeln', name: 'spielregeln', component: view('Spielregeln'), beforeEnter: dbReady },
  { path: '/navigation', name: 'navigation', component: view('Navigation'), beforeEnter: dbReady },
  { path: '/modal-sample', name: 'modal-sample', component: view('ModalSample'), beforeEnter: dbReady },
  // { path: '/chats', name: 'chats', component: view('Chats'), beforeEnter: dbReady },
  // { path: '/chat/:id', name: 'chat', component: view('Chat'), beforeEnter: dbReady },
  { path: '/signup', name: 'signup', component: view('Signup'), beforeEnter: dbReady },
  { path: '/me', name: 'me', component: view('Me'), beforeEnter: dbReady },
  // custom from Gitte
  { path: '/swopcardBackend', name: 'swopcardBackend', component: view('SwopcardBackend'), beforeEnter: dbReady }
]

const router = new VueRouter({
  routes
})

export default router
