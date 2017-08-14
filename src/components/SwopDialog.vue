<template>
  <div class="container">
    <div class="columns is-mobile is-centered">
      <div class="column is-8 is-narrow">
        <img src="../assets/swop-logo.svg">
        <h1 class="is-title is-size-3">Swop-Dialog</h1>
    </div>
  </div>
</div>
  <!-- <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>Navigation</h2>
    <ul>
      <li><router-link :to="{ name: 'chats' }" >Chats</router-link></li>
      <li v-cloak v-if="isLoggedIn"><router-link :to="{ name: 'me' }">Account</router-link></li>
      <li v-cloak v-else><router-link :to="{ name: 'signup' }">Signup</router-link></li>
    </ul>
    <h4>Essential Links</h4>
    <ul>
      <li><a href="https://vuejs.org" target="_blank">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank">Forum</a></li>
      <li><a href="https://gitter.im/vuejs/vue" target="_blank">Gitter Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></li>
      <br>
      <li><a href="http://vuejs-templates.github.io/webpack/" target="_blank">Docs for This Template</a></li>
    </ul>
    <h4>Ecosystem</h4>
    <ul>
      <li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
      <li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
      <li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
    </ul>
  </div> -->
</template>

<script type="text/babel">
import db from 'baqend'

export default {
  name: 'swop-dialog',
  data () {
    return {
      msg: 'Welcome to Your Vue.js and Baqend App',
      isLoggedIn: null
    }
  },
  created () {
    console.log(db.User.me)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
