<template>
  <div class="container main-content">
    <div class="columns is-centered">

        <div class="column is-8 is-narrow is-form">
          <div class="task-description-title">
            <h4 class="title">Deine Einstellungen</h4>
          </div>
            <form class="add-email">
                <h4 class="title is-6">Zusätzliche Mail-Adresse</h4>
                <p class="subtitle">Benachrichtigungen aus dieser App werden zusätzlich an diese Mail geschickt. Du kannst Dich <strong>nicht</strong> mit dieser Mail einloggen.</p>
                <b-field>
                  <div class="control has-icons-left is-expanded" v-on:keyup.enter="mailValidator">
                      <b-input v-model="email" placeholder="Deine Mail-Adresse"></b-input>
                      <span class="icon is-small is-left">
                        <i class="fa fa-envelope"></i>
                      </span>
                  </div>
                    <div class="control">
                        <button class="button is-primary" v-on:click="mailValidator"><i class="fa fa-paper-plane" aria-hidden="true"></i></button>
                    </div>

                </b-field>
                <div id="mail-success-message" hidden><p class="help is-success">Deine E-Mail wurde erfolgreich hinzugefügt!</p></div>
                <div id="mail-fail-message" hidden><p class="help is-danger">Gib bitte eine korrekte Mail-Adresse an.</p></div>
            </form>

            <form class="change-password ">
                <h4 class="title is-6">Passwort ändern</h4>

                <b-field>
                  <div v-on:keyup.tap.prevent="oldPasswordValidator">
                    <p class="control has-icons-left ">
                      <b-input type="password" v-model="aPassword" placeholder="Dein altes Passwort"></b-input>
                        <span class="icon is-small is-left">
                          <i class="fa fa-lock"></i>
                        </span>
                    </p>
                  </div>
                </b-field>
                <div id="password-wrong-message" hidden><p class="help is-danger">Dein Passwort ist nicht korrekt.</p></div>
                <div class="spacer"></div>

                <b-field>
                    <p class="control has-icons-left">
                        <b-input type="password" v-model="nPassword" placeholder="Dein neues Passwort"></b-input>
                        <span class="icon is-small is-left">
                          <i class="fa fa-lock"></i>
                        </span>
                    </p>
                </b-field>

                <b-field id="nPassField" type="is-danger">
                  <div v-on:keyup="confirmPasswordValidator">
                    <p class="control has-icons-left">
                        <b-input type="password" v-model="bPassword" placeholder="Bestätige Dein neues Passwort"></b-input>
                        <span class="icon is-small is-left">
                          <i class="fa fa-lock"></i>
                        </span>
                    </p>
                  </div>
                </b-field>
                <div id="password-success-message" hidden><p class="help is-success">Deine Passwort wurde erfolgreich geändert!</p></div>
                <div id="password-not-different-message" hidden><p class="help is-danger">Dein Passwort konnte nicht geändert werden. Überprüfe ob sich Dein neues und Dein alter Passwort unterscheiden.</p></div>
            </form>

            <p><button class="button is-primary" v-on:click="PasswordValidator">Passwort bestätigen</button></p>

        </div>
    </div>
  </div>

</template>

<script type="text/babel">
import db from 'baqend'

export default {
  name: 'settings',
  data () {
    return {
      msg: 'Welcome to Your Vue.js and Baqend App',
      isLoggedIn: null
    }
  },
  created () {
    console.log(db.User.me)
  },

  methods: {
    validateEmail (a) {
      var re = /\S+@\S+\.\S+/
      return re.test(a)
    },
    mailValidator () {
      var mail = this.email
      var successElem = document.getElementById('mail-success-message')
      var failElem = document.getElementById('mail-fail-message')
      if (this.validateEmail(mail)) {
        failElem.style.display = 'none'
        successElem.style.display = 'block'
        mail = ''
        // hier sollte die Mail in die Datenbank hinzugefügt werden
      } else {
        failElem.style.display = 'block'
      }
    },

    oldPasswordValidator () {
      var aPass = this.aPassword
      var Pass = '123' // hier sollte das Passwort von der Datenbank geholen werden
      var wrongElem = document.getElementById('password-wrong-message')
      if (aPass !== Pass) {
        wrongElem.style.display = 'block'
      } else {
        return true
      }
    },

    newPasswordValidator () {
      var aPass = this.aPassword
      var nPass = this.nPassword
      var difElem = document.getElementById('password-not-different-message')
      if (aPass === nPass) {
        difElem.style.display = 'block'
      } else {
        return true
      }
    },

    confirmPasswordValidator () {
      var nPass = this.nPassword
      var bPass = this.bPassword
      // var field = document.getElementById('nPassField')
      if (nPass !== bPass) {
        console.log('false')
        return false
      } else {
        console.log('true')
        return true
      }
    },

    PasswordValidator () {
      var successElem = document.getElementById('password-success-message')
      if (this.oldPasswordValidator() && this.newPasswordValidator() && this.confirmPasswordValidator()) {
        successElem.style.display = 'block'
        // hier sollte er noch das alte Passwort in der Datenbank durch das neue ersetzten.
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

@media only screen and (min-width: 768px) {
.is-form {
  padding: 2.25rem;
  border: 1px solid #efefef;
}
}


</style>
