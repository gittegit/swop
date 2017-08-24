<template>
<!-- Wird Später statt Hello.vue als Startpunkt verwendet -->
<div class="main-content">
  <div class="container">
    <div class="columns is-centered">
      <div class="column is-8 is-narrow">
        <h1 class="has-text-centered"><img class="login-logo" src="../assets/swop-logo-invert.svg"></h1>
        <h2 class="subtitle has-text-centered has-text-white">Swop ist das Tauschtool für Deine Uni-Veranstaltungen.</h2>
        <div class="spacer"></div>
      </div>
    </div>

    <!-- Inhalt / Formulare -->
    <div class="columns is-centered">
      <!-- Logo + Text -->
      <div class="column is-8 is-narrow is-form">

        <div class=" task-description-title">
          <h4 class="title has-text-centered">Login</h4>
        </div>

        <div class="task-description">
          <p class="description has-text-centered">Logge Dich mit Deiner Uni-Mail ein.</p>
        </div>

        <div class="spacer"></div>

        <!-- Formulare -->
        <form class="signUp">
          <div class="field">
            <p class="control has-icons-left ">
              <input v-model.trim="username" class="input" :class="{'is-danger': LoginError}" v-on:keyup.enter="nextInput" type="mail" placeholder="Deine Uni-Mail" name="username" required>
              <span class="icon is-small is-left">
                      <i class="fa fa-envelope"></i>
                    </span>
            </p>
          </div>

          <div class="field has-addons is-expanded">
            <p class="control has-icons-left is-expanded">
              <input v-model="password" id="password" class="input" :class="{'is-danger': LoginError}" v-on:keyup.enter="logIn" type="password" placeholder="Dein Passwort" name="password" required>
              <span class="icon is-small is-left">
                        <i class="fa fa-lock"></i>
              </span>
            </p>
            <p class="control">
              <router-link :to="{name: 'passwort-vergessen'}"class="button is-outlined has-text-primary">
                Vergessen?
              </router-link>
            </p>
          </div>
          <p class="help is-danger">{{LoginError}}</p>
        </form>
        <!-- Registierungsbutton -->
        <p class="has-text-right flex-center"><router-link :to="{name: 'signup'}" class="is-white font-klein margin-right">Noch kein Mitglied? </router-link><a class="button is-primary" @click="logIn">Einloggen</a></p>
      </div>

    </div>

  </div>
</div>
</template>

<script type="text/babel">
import db from 'baqend'
import router from '../router'

export default {
  name: 'login',
  data () {
    return {
      username: null,
      password: null,
      LoginError: null
    }
  },
  created () {
    this.$parent.isLoggedIn = false
    console.log(this.$parent.isLoggedIn)
    console.log(db.user)
  },
  computed: {
    isValid () {
      return this.username && this.password
    }
  },
  methods: {
    logIn () {
      var lowerCaseUser = this.username.toLowerCase()
      db.User.login(lowerCaseUser, this.password).then(_ => {
        this.$parent.isLoggedIn = true
        router.push('dashboard')
      }).catch((error) => {
        console.log(error)
        this.LoginError = error.cause.message
      })
    },
    nextInput () {
      document.getElementById('password').focus()
    }
  },
  beforeRouteEnter (to, from, next) {
    if (db.User.me) {
      next('dashboard')
    } else {
      next()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.main-content {
  padding: 0 1rem;
  display: flex;
  align-items: center;
  height: 100vh;
  background-color: #F39016;
}
.main-content .container {
  // margin-top: -10vh;
}
.login-logo {
  width: 70%;
}
.is-form {
  border-color: #ffffff;
  box-shadow: 0px 40px 20px -20px rgba(#000000, 0.05);
}
@media only screen and (min-width: 450px) {
  .login-logo {
    width: 50%;
  }
  .main-content {
    padding: 6rem 1rem !important;
    display: block !important;
    height: 100vh;
    overflow-y: scroll !important;
    background-color: #F39016;
  }
  .is-form {
    margin-bottom: 3rem !important;
  }
}
</style>
