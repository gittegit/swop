<template>
  <!-- Navigation Sektion -->
  <section class="navigation">
      <div class="container">
          <div class="columns is-mobile">
              <!-- Leere Kolumne -->
              <div class="column is-one-third"></div>
              <div class="column is-one-third">
                  <h1 class="logo has-text-centered"><router-link :to="{name: 'dashboard'}"><img class="swoppy-img" src="../assets/swop-logo.svg" alt="swop-logo"></router-link></h1></div>
              <div class="column is-one-third">
                  <nav class="navbar ">
                      <div class="navbar-end">
                          <router-link :to="{name: 'spielregeln'}" class="navbar-item has-text-lightgrey">
                              <i class="fa fa-life-ring" aria-hidden="true"></i>
                          </router-link>
                          <router-link :to="{name: 'settings'}" class="navbar-item has-text-lightgrey">
                              <i class="fa fa-cog" aria-hidden="true"></i>
                          </router-link>
                      </div>
                  </nav>
              </div>
          </div>
      </div>
  </section>
  <!-- / Navigation Sektion -->
</template>

<script type="text/babel">
import db from 'baqend'

export default {
  name: 'navigation',
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
