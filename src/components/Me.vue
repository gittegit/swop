<template>
  <div class="main-content">
      <div class="container">
        <!-- Inhalt / Formulare -->
        <div class="columns is-centered">
          <!-- Logo + Text -->
          <div class="column is-8 is-narrow is-form">

            <div class=" task-description-title">
              <h4 class="title has-text-centered">Login erfolgreich</h4>
            </div>

            <p class="has-text-centered">Du bist nun als <strong>{{ username }}</strong> angemeldet.</p>

            <div class="spacer"></div>

            <!-- Registierungsbutton -->
            <p class="has-text-right flex-center"><a class="is-white font-klein margin-right" @click="logout">Logout </a><router-link :to="{name: 'dashboard'}"class="button is-primary">Zum Dashboard</router-link></p>
          </div>

        </div>

      </div>
  </div>

  <!-- Neues Template -->

</template>
<script type="text/babel">
import db from 'baqend'
import router from '../router'
import m from '../Model/model.js'

export default {
  data () {
    return {
      username: null
    }
  },
  methods: {
    logout () {
      db.User.logout().then(() => {
        router.push('login-sample')
        this.$parent.isLoggedIn = false
      })
    }
  },
  created () {
    this.username = db.User.me.username
    this.$parent.isLoggedIn = true
  },
  beforeRouteEnter (to, from, next) {
    if (!db.User.me) {
      next('signup')
    } else {
      next()
    }
  }
}
</script>

<style lang="scss" scoped>
.main-content {
  padding: 0 1rem !important;
  display: flex;
  align-items: center;
  height: 100vh;
  background-color: #F39016 !important;
}
.main-content .container {
  margin-top: -10vh;
}
.login-logo {
  width: 70%;
}
.is-form {
  border-color: #ffffff;
  box-shadow: 0px 40px 20px -20px rgba(#000000, 0.05);
}
</style>
