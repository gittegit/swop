<template>
  <div class="main-content">
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
          <p v-if="mailError" class="help is-danger">Es gibt ein Problem mit Deiner Mail-Adresse. <br> Kontrolliere, ob es sich um eine Uni-Mail handeln oder Du bereits einen Account hast.</p>
          <p v-if="passwordError" class="help is-danger">Deine Passwörter müssen übereinstimmen damit Du Dich registrieren kann.</p>
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
      password: null,
      bPassword: null,
      isDanger: false,
      mailError: false,
      passwordError: false
    }
  },

  methods: {
    register () {
      db.User.register(this.username, this.password).then(_ => {
        router.push('me')
      }).catch((err) => {
        console.log(err)
        this.mailError = true
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
