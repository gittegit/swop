// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import Buefy from 'buefy'
import db from 'baqend'
import App from './app'
import router from './router'

db.connect('restless-bolt-1').then(() => {
  Vue.use(VueRouter, Buefy.default)

  /* eslint-disable no-new */
  new Vue({
    el: '#app',
    router,
    template: '<app/>',
    components: { App }
  })
})
