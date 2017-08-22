import db from 'baqend'
import Login from './components/Login'
import VueRouter from 'vue-router'
// import M from './Model/model.js'

function dbReady (to, from, next) {
  db.ready(() => next())
}

// function logMal (to, from, next) {
//   console.log(to)
//   console.log(from)
//   console.log()
//   next()
// }

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
  { path: '/', component: Login, name: 'login' },
  { path: '/dashboard', name: 'dashboard', component: view('Dashboard'), beforeEnter: dbReady },
  { path: '/settings', name: 'settings', component: view('Settings'), beforeEnter: dbReady },
  { path: '/swop-dialog', name: 'swop-dialog', component: view('SwopDialog'), beforeEnter: dbReady },
  { path: '/spielregeln', name: 'spielregeln', component: view('Spielregeln'), beforeEnter: dbReady },
  { path: '/hello', name: 'hello', component: view('Hello'), beforeEnter: dbReady },
  { path: '/modal-sample', name: 'modal-sample', component: view('ModalSample'), beforeEnter: dbReady },
  { path: '/signup', name: 'signup', component: view('Signup'), beforeEnter: dbReady },
  { path: '/me', name: 'me', component: view('Me'), beforeEnter: dbReady },
  { path: '/passwort-vergessen', name: 'passwort-vergessen', component: view('ForgotPassword'), beforeEnter: dbReady },
  { path: '/passwort-reset', name: 'passwort-reset', component: view('ResetPassword'), beforeEnter: dbReady }
]

const router = new VueRouter({
  routes
})

export default router
