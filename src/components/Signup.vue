<template>
  <div class="main-content">
    <!-- <div class="container">
      <div class="row">
        <div class="col-sm-offset-3 col-sm-6 col-1">
          <div class="panel panel-default">
            <div class="panel-heading">User registration example</div>
            <div class="panel-body">
              <form>
                <div class="row">
                  <div class="form-group col-lg-12">
                    <label>Username</label>
                    <input type="text" v-model.trim="username" class="form-control" name="username" required>
                  </div>
                  <div class="form-group col-lg-12">
                    <label>Password</label>
                    <input type="password" v-model="password" class="form-control" name="password" required>
                  </div>
                </div>
                <div class="pull-right">
                  <button class="btn btn-info" type="button" @click="register" :disabled.prop="!isValid">Register</button>
                  <button class="btn btn-info" type="button" @click="logIn" :disabled.prop="!isValid">Log In</button>
                </div>
              </form>
            </div>
          </div>
          <div class="alert alert-danger" role="alert" v-if="error">{{ error }}</div>
        </div>
      </div>
    </div> -->
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-8 is-narrow">
          <h1 class="has-text-centered"><img class="login-logo" src="../assets/swop-logo-invert.svg"></h1>
          <h2 class="subtitle has-text-centered has-text-white">Swop ist Dein Tool zum Finden eines Tauschpartners für Deine Uni-Veranstaltungen.</h2>
          <div class="spacer"></div>
        </div>
      </div>

      <!-- Inhalt / Formulare -->
      <div class="columns is-centered">
        <!-- Logo + Text -->
        <div class="column is-8 is-narrow is-form">

          <div class=" task-description-title">
            <h4 class="title has-text-centered">Registrieren</h4>
          </div>

          <div class="task-description">
            <p class="description has-text-centered">Melde Dich mit Deiner Uni-Mail an und erstelle Deinen kostenlosen swop-Account.</p>
          </div>

          <div class="spacer"></div>

          <!-- Formulare -->
          <form class="signUp">
            <b-field>
              <p class="control has-icons-left ">
                <input v-model.trim="name" class="input" type="text" placeholder="Deine Name" name="name" required>
                <span class="icon is-small is-left">
                  <i class="fa fa-user"></i>
                </span>
              </p>
            </b-field>
            <div class="spacer"></div>

            <b-field>
              <p class="control has-icons-left ">
                <input v-model.trim="username" class="input" :class="{'is-danger': mailError}" type="mail" placeholder="Deine Uni-Mail" name="username" required>
                <span class="icon is-small is-left">
                  <i class="fa fa-envelope"></i>
                </span>
              </p>
            </b-field>
            <div class="spacer"></div>

            <b-field>
              <p class="control has-icons-left">
                <input v-model="password" class="input" type="password" placeholder="Dein swop-Passwort" name="password" required>
                <span class="icon is-small is-left">
                  <i class="fa fa-lock"></i>
                </span>
              </p>
            </b-field>

            <b-field>
            <div v-on:keyup="confirmPasswordValidator">
              <p class="control has-icons-left">
                <input v-model="bPassword" class="input" v-bind:class="{ dangerInput : isDanger }" type="password" placeholder="Bestätige Dein swop-Passwort" name="bPassword" required>
                <span class="icon is-small is-left">
                  <i class="fa fa-lock"></i>
                </span>
              </p>
            </div>
            </b-field>
          <p v-if="mailError" class="help is-danger">Du kannst dich nur mit einer Uni-Mail registrieren.</p>
          <p v-if="passwordError" class="help is-danger">Deine Passwörter müssen übereinstimmen damit Du Dich registrieren kann.</p>
          <p v-if="error" class="help is-danger">Fehler beim registrieren.</p>
          </form>
          <!-- Registierungsbutton -->
          <p class="has-text-right flex-center"><router-link :to="{name: 'login-sample'}" class="is-white font-klein margin-right">Bereits Mitglied? </router-link><a class="button is-primary" @click="registerPossible">Registrieren</a></p>
        </div>
      </div>
  </div>
</div>
</template>

<script type="text/babel">
import db from 'baqend'
import router from '../router'

export default {
  name: 'signup',
  data () {
    return {
      name: null,
      username: null,
      password: '',
      bPassword: '',
      isDanger: false,
      mailError: false,
      passwordError: false,
      error: false
    }
  },

  methods: {
    register () {
      db.User.register(this.username, this.password).then(_ => {
        router.push('me')
      }).catch(e => {
        this.error = true
      })
    },
    registerPossible () {
      if (this.isDanger) {
        this.passwordError = true
      } else {
        this.register()
      }
    },

    confirmPasswordValidator () {
      if (this.password !== this.bPassword) {
        this.isDanger = true
        return false
      } else {
        this.isDanger = false
        return true
      }
    }
  },

  computed: {
    isValid () {
      return this.username && this.password
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

<style lang="scss" scoped>
.main-content {
  padding: 0 1rem !important;
  display: flex;
  align-items: center;
  height: 100vh;
  background-color: #F39016;
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

.dangerInput {
  border-color: #ff0000 !important;
}
</style>
