<template>
  <div class="container">
    <div class="columns is-centered">

        <div class="column is-half is-narrow is-form">
          <div class="task-description-title">
            <h4 class="title">Deine Einstellungen</h4>
          </div>
            <form class="add-email">
                <h4 class="title is-6">Zusätzliche Mail-Adresse</h4>
                <p class="subtitle">Benachrichtigungen aus dieser App werden zusätzlich an diese Mail geschickt. Du kannst Dich <strong>nicht</strong> mit dieser Mail einloggen.</p>
                <b-field>
                  <div class="control has-icons-left is-expanded">
                      <b-input v-model="email" placeholder="Deine Mail-Adresse"></b-input>
                      <span class="icon is-small is-left">
                        <i class="fa fa-envelope"></i>
                      </span>
                  </div>
                    <div class="control">
                        <a class="button is-primary" v-on:click="mailValidator"><i class="fa fa-paper-plane" aria-hidden="true"></i></a>
                    </div>

                </b-field>
                <div id="mail-success-message" hidden><p class="help is-success">Deine E-Mail wurde erfolgreich hinzugefügt!</p></div>
                <div id="mail-fail-message" hidden><p class="help is-danger">Gib bitte eine korrekte Mail-Adresse an.</p></div>
            </form>

            <form class="change-password ">
                <h4 class="title is-6">Passwort ändern</h4>

                <b-field>
                    <p class="control has-icons-left ">
                      <b-input type="password" v-model="nPassword" placeholder="Dein altes Passwort"></b-input>
                        <span class="icon is-small is-left">
                          <i class="fa fa-lock"></i>
                        </span>
                    </p>
                </b-field>
                <div id="password-wrong-message" hidden><p class="help is-danger">Dein Passwort konnte nicht geändert werden. Überprüfe ob Dein altes Passwort korrekt ist.</p></div>
                <div class="spacer"></div>

                <b-field>
                    <p class="control has-icons-left">
                        <b-input type="password" v-model="nPassword" placeholder="Dein neues Passwort"></b-input>
                        <span class="icon is-small is-left">
                          <i class="fa fa-lock"></i>
                        </span>
                    </p>
                </b-field>

                <b-field>
                    <p class="control has-icons-left">
                        <b-input type="password" v-model="bPassword" placeholder="Bestätige Dein neues Passwort"></b-input>
                        <span class="icon is-small is-left">
                          <i class="fa fa-lock"></i>
                        </span>
                    </p>
                </b-field>
                <div id="password-success-message" hidden><p class="help is-success">Deine Passwort wurde erfolgreich geändert!</p></div>
                <div id="password-not-different-message" hidden><p class="help is-danger">Dein Passwort konnte nicht geändert werden. Überprüfe ob sich Dein neues und Dein alter Passwort unterscheiden.</p></div>
            </form>

            <p><a class="button is-light">Account löschen</a></p>

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
    validateEmail () {
      var re = /\S+@\S+\.\S+/
      return re.test(this.email)
    },

    mailValidator () {
      var mail = this.email
      var successElem = document.getElementById('mail-success-message')
      var failElem = document.getElementById('mail-fail-message')
      if (this.validateEmail(mail)) {
        failElem.style.display = 'none'
        successElem.style.display = 'block'
        mail = ''
      } else {
        failElem.style.display = 'block'
      }
    },

    oldPasswordValidator () {
      var aPass = this.aPassword
      var wrongElem = document.getElementById('password-wrong-message')
      if (aPass !== 'Passwort') {
        wrongElem.style.display = 'block'
      }
    },

    newPasswordValidator () {
      var aPass = this.aPassword
      var nPass = this.nPassword
      var bPass = this.bPassword
      var successElem = document.getElementById('password-success-message')
      var difElem = document.getElementById('password-not-different-message')
      if (nPass !== bPass) {
        successElem.style.display = 'block'
      } else if (aPass === nPass) {
        successElem.style.display = 'none'
        difElem.style.display = 'block'
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
