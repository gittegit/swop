<template>
  <div class="container">

      <!-- Inhalt / Formulare -->
      <div class="columns is-centered">
        <!-- Logo + Text -->
          <div class="column is-half is-narrow is-form">
              <h1 class="logo has-text-centered"><img class="swoppy-img-big" src="../assets/swop-logo.svg" alt="swop-logo"></h1>

                <div class=" task-description-title">
                  <h4 class="title has-text-centered">Registrierung</h4>
                </div>

                <div class="task-description">
                  <p class="description has-text-centered">Melde Dich mit Deiner Uni-Mail an und erstelle Dir einen kostenlosen swop-Account.</p>
                </div>

                  <!-- Formulare -->
                  <form class="signUp">
                  <div class="field">
                      <p class="control has-icons-left ">
                        <input class="input" type="text" placeholder="Dein Name">
                        <span class="icon is-small is-left">
                  <i class="fa fa-user"></i>
                  </span>
                      </p>
                  </div>

                  <div class="spacer"></div>

                                          <div class="field">
                                              <p class="control has-icons-left ">
                                                <input class="input" type="mail" placeholder="Deine Uni-Mail">
                                                <span class="icon is-small is-left">
                      <i class="fa fa-envelope"></i>
                    </span>
                                              </p>
                                          </div>

                    <div class="spacer"></div>

                                          <div class="field">
                                              <p class="control has-icons-left has-icons-right">
                                                  <input class="input" type="password" placeholder="Dein swop-Passwort">
                                                  <span class="icon is-small is-left">
                        <i class="fa fa-lock"></i>
                      </span>
                      <span class="icon is-small is-right">
<i class="fa fa-check"></i>
</span>
                                              </p>
                                          </div>

                                          <div class="field">
                                              <p class="control has-icons-left has-icons-right">
                                                  <input class="input" type="password" placeholder="Dein swop-Passwort bestätigen">
                                                  <span class="icon is-small is-left">
                        <i class="fa fa-lock"></i>
                      </span>
                      <span class="icon is-small is-right">
<i class="fa fa-check"></i>
</span>
                                              </p>
                                          </div>
                  <p class="help is-success">Deine Passwörter stimmen überein!</p>
</form>
<!-- Registierungsbutton -->
<p class="has-text-right flex-center"><a class="is-white font-klein margin-right">Ich hab bereits ein Account.</a><a class="button is-primary">Registrieren</a></p>
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
body {
  background-color: #F39016;
}
</style>
