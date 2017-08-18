<template>
<!-- Wird Später statt Hello.vue als Startpunkt verwendet -->
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
          <h4 class="title has-text-centered">Passwort vergessen?</h4>
        </div>

        <div class="task-description">
          <p class="description has-text-centered">Gib einfach Deine Uni-Mail an und klicke auf <strong>Link senden</strong>. Du bekommst dann eine E-Mail mit einem Link zum Setzen Deines neuen Passworts.</p>
        </div>

        <div class="spacer"></div>

        <!-- Formulare -->
        <form class="signUp">
          <div class="field">
            <p class="control has-icons-left ">
              <input v-model.trim="username" class="input" :class="{'is-danger': error}" type="mail" placeholder="Deine Uni-Mail" name="username" required>
              <span class="icon is-small is-left">
                      <i class="fa fa-envelope"></i>
                    </span>
            </p>
          </div>
        </form>
        <!-- Registierungsbutton -->
        <p class="has-text-right flex-center"><router-link :to="{name: 'login'}" class="is-white font-klein margin-right">Zurück zum Login </router-link><a class="button is-primary" @click="sendLink()">Link senden</a></p>
      </div>

    </div>

  </div>
</div>
</template>

<script type="text/babel">
import db from 'baqend'
import router from '../router'

export default {
  name: 'passwort-vergessen',
  data () {
    return {
      username: null,
      password: null,
      error: null
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
      db.User.login(this.username, this.password).then(_ => {
        this.$parent.isLoggedIn = true
        router.push('dashboard')
        this.error = false
      }).catch(e => {
        this.error = true
        console.log('geht nicht')
      })
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
@media only screen and (min-width: 400px) {
  .login-logo {
    width: 50%;
  }
}
</style>
