<template>
<<<<<<< HEAD
  <div class="main-content container">
    <div class="row">
      <div class="col-sm-offset-3 col-sm-6 col-1">
        <div class="panel panel-default">
          <div class="panel-heading">You are logged in as {{ username }}</div>
          <div class="panel-body">
            <li><router-link :to="{name: 'swopcardBackend'}">SwopCard Backend Erstellung</router-link></li>
            <li><router-link :to="{name: 'addCourse'}">Neuen Kurs anlegen</router-link></li>
            <button class="btn btn-info pull-right" type="button" @click="logout">Logout</button>
=======
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
>>>>>>> development
          </div>

        </div>

      </div>
  </div>

  <!-- Neues Template -->

</template>
<script type="text/babel">
import db from 'baqend'
import router from '../router'

export default {
  data () {
    return {
      username: null
    }
  },
  methods: {
    logout () {
      db.User.logout().then(() => {
        router.push('signup')
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
