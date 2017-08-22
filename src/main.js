// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import db from 'baqend'
import App from './App'
import router from './router'
import Buefy from 'buefy'
// import M from './Model/model.js'

Vue.use(Buefy, {
  defaultIconPack: 'fa'
})

Vue.use(VueRouter)

db.connect('restless-bolt-1').then(() => {
  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
  })
})
