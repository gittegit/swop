<template>
<div class="main-content">
  <div class="container">
    <div class="columns is-centered">
      <div class="column is-8 is-narrow">
        <h1 class="has-text-centered"><img class="login-logo" src="../assets/swop-logo-invert.svg"></h1>
        <h2 class="subtitle has-text-centered has-text-white">Swop ist Dein Tool zum Finden eines Tauschpartners für Deine Uni-Veranstaltungen.</h2>
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
          <p class="description has-text-centered">Logge Dich mit deiner Uni-Mail ein.</p>
        </div>

        <!-- Formulare -->
        <form class="signUp">
          <div class="field">
            <p class="control has-icons-left ">
              <input class="input" type="mail" placeholder="Deine Uni-Mail">
              <span class="icon is-small is-left">
                      <i class="fa fa-envelope"></i>
                    </span>
            </p>
          </div>

          <div class="field">
            <p class="control has-icons-left">
              <input class="input" type="password" placeholder="Dein swop-Passwort">
              <span class="icon is-small is-left">
                        <i class="fa fa-lock"></i>
                      </span>
            </p>
          </div>
        </form>
        <!-- Registierungsbutton -->
        <p class="has-text-right flex-center"><a class="is-white font-klein margin-right">Noch kein swop-Mitglied? </a><a class="button is-primary">Einloggen</a></p>
      </div>

    </div>

  </div>
</div>
</template>

<script type="text/babel">
import db from 'baqend'

export default {
  name: 'login-sample',
  data () {
    return {
      isLoggedIn: false
    }
  },
  created () {
    this.$parent.isLoggedIn = false
    console.log(this.$parent.isLoggedIn)
    console.log(db.user)
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
</style>
