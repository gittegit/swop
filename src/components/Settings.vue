<template>
<div class="main-content">
  <div class="container main-content">
    <div class="columns is-centered">

        <div class="column is-8 is-narrow is-form">
          <div class="task-description-title">
            <h4 class="title">Deine Einstellungen</h4>
          </div>

          <form class="change-name">
            <h4 class="title is-6">Namen ändern</h4>
            <p class="subtitle">Dieser Name wird Deinem swop-Partner angezeigt.</p>
            <b-field>
              <div class="control has-icons-left is-expanded" v-on:keyup="showNameButton">
                <b-input type="text" v-model="name" placeholder="Dein Name"></b-input>
                  <span class="icon is-small is-left">
                    <i class="fa fa-user"></i>
                  </span>
              </div>
                <div class="control" id="disabled-change-name-button" visible>
                    <a class="button is-primary" disabled><i class="fa fa-check"></i></a>
                </div>
                <div class="control" id="change-name-button" hidden>
                    <a class="button is-primary" v-on:click="changeName"><i class="fa fa-check"></i></a>
                </div>
            </b-field>
          </form>

            <form class="add-email">
                <h4 class="title is-6">Zusätzliche Mail-Adresse</h4>
                <p class="subtitle">Benachrichtigungen aus dieser App werden zusätzlich an diese Mail geschickt. Du kannst Dich <strong>nicht</strong> mit dieser Mail einloggen.</p>
                <b-field>
                  <div class="control has-icons-left is-expanded" v-on:keyup.enter="mailValidator" v-on:keyup="showMailButton">
                      <b-input v-model="email" placeholder="Deine Mail-Adresse"></b-input>
                      <span class="icon is-small is-left">
                        <i class="fa fa-envelope"></i>
                      </span>
                  </div>
                    <div class="control" id="disabledMailCheckButton" visible>
                        <a class="button is-primary" disabled><i class="fa fa-check"></i></a>
                    </div>
                    <div class="control" id="mailCheckButton" hidden>
                        <a class="button is-primary" v-on:click="mailValidator"><i class="fa fa-check"></i></a>
                    </div>
                    <div class="control" id="mailClearButton" hidden>
                        <a class="button is-primary" v-on:click="mailClear"><i class="fa fa-trash"></i></a>
                    </div>
                </b-field>
                <p v-if="mailSuccess" class="help is-success">Diese Mail-Adresse wurde erfolgreich hinzugefügt!</p>
                <p v-if="mailError" class="help is-danger">Gib bitte eine korrekte Mail-Adresse an.</p>
            </form>

            <form class="change-password ">
                <h4 class="title is-6">Passwort ändern</h4>

                <b-field>
                    <p class="control has-icons-left ">
                      <input class="input" type="password" v-model="aPassword" :class="{'is-danger': passwordError}" placeholder="Dein altes Passwort"></input>
                        <span class="icon is-small is-left">
                          <i class="fa fa-lock"></i>
                        </span>
                    </p>
                </b-field>
                <p v-if="passwordError" class="help is-danger">Dein Passwort ist nicht korrekt.</p>
                <div class="spacer"></div>

                <b-field>
                    <p class="control has-icons-left">
                        <input class="input" type="password" v-model="nPassword" :class="{'is-danger': passwordErrorDifferent }" placeholder="Dein neues Passwort"></input>
                        <span class="icon is-small is-left">
                          <i class="fa fa-lock"></i>
                        </span>
                    </p>
                </b-field>

                <b-field>
                  <div v-on:keyup="confirmPasswordValidator">
                    <p class="control has-icons-left">
                        <input class="input" type="password" v-bind:class="{ dangerInput : isDanger }" v-model="bPassword" placeholder="Bestätige Dein neues Passwort"></input>
                        <span class="icon is-small is-left">
                          <i class="fa fa-lock"></i>
                        </span>
                    </p>
                  </div>
                </b-field>
                <p v-if="passwordSuccess" class="help is-success">Deine Passwort wurde erfolgreich geändert!</p>
                <p v-if="passwordErrorDifferent" class="help is-danger">Dein Passwort konnte nicht geändert werden. Überprüfe ob sich Dein neues und Dein alter Passwort unterscheiden.</p>
                <p v-if="passwordEmpty" class="help is-danger">Du musst ein neues Passwort eingeben.</p>
                <div id="password-validator-button" hidden><p class="has-text-right"><a class="button is-primary" v-on:click="PasswordValidator">Passwort bestätigen</a></p></div>
            </form>
            <p class="flex-center flex-center-left">
              <a class="has-text-secondary is-white font-klein margin-right" v-on:click="deleteAccount">Account löschen</a>
              <a class="button is-primary has-icon-right" v-on:click="swopLogout">LogOut<i class="fa fa-sign-out icon-margin"></i></a>
            </p>
        </div>
<!-- Form zu Ende -->
    </div>
  </div>
</div>
</template>

<script type="text/babel">
import db from 'baqend'
import router from '../router'
import m from '../Model/model.js'

export default {
  name: 'settings',
  data () {
    return {
      name: 'Juli',  // hier sollte der Name von der Datenbank geholen werden
      email: '',
      mailSuccess: false,
      mailError: false,
      aPassword: '',
      nPassword: '',
      bPassword: '',
      passwordError: false,
      passwordSuccess: false,
      passwordErrorDifferent: false,
      passwordEmpty: false,
      Pass: '123',  // hier sollte das Passwort von der Datenbank geholen werden
      isDanger: false,
      msg: 'Welcome to Your Vue.js and Baqend App',
      isLoggedIn: null
    }
  },

  created () {
    console.log(db.User.me)
  },

  methods: {
    showNameButton () {
      var buttonElem = document.getElementById('change-name-button')
      var disabledElem = document.getElementById('disabled-change-name-button')
      if (this.name === '') {
        buttonElem.style.display = 'none'
        disabledElem.style.display = 'block'
      } else {
        buttonElem.style.display = 'block'
        disabledElem.style.display = 'none'
      }
    },
    changeName () {
      var buttonElem = document.getElementById('change-name-button')
      var disabledElem = document.getElementById('disabled-change-name-button')
      this.$toast.open('Jetzt müsste der Name "' + this.name + '" in die Datenbank gepackt werden.')
      buttonElem.style.display = 'none'
      disabledElem.style.display = 'block'
    },

    showMailButton () {
      var disabledButton = document.getElementById('disabledMailCheckButton')
      var checkButton = document.getElementById('mailCheckButton')
      var clearButton = document.getElementById('mailClearButton')
      if (this.email === '') {
        this.mailSuccess = false
        this.mailError = false
        disabledButton.style.display = 'block'
        checkButton.style.display = 'none'
        clearButton.style.display = 'none'
      } else {
        this.mailSuccess = false
        this.mailError = false
        disabledButton.style.display = 'none'
        checkButton.style.display = 'block'
        clearButton.style.display = 'none'
      }
    },
    validateEmail (mail) {
      var re = /\S+@\S+\.\S+/
      return re.test(mail)
    },
    mailValidator () {
      var checkButton = document.getElementById('mailCheckButton')
      var clearButton = document.getElementById('mailClearButton')
      if (this.validateEmail(this.email)) {
        this.mailSuccess = true
        this.mailError = false
        checkButton.style.display = 'none'
        clearButton.style.display = 'block'
        // hier sollte die Mail in die Datenbank hinzugefügt werden
      } else {
        this.mailSuccess = false
        this.mailError = true
      }
    },
    mailClear () {
      var disabledButton = document.getElementById('disabledMailCheckButton')
      var clearButton = document.getElementById('mailClearButton')
      if (this.email !== '') {
        this.mailSuccess = false
        clearButton.style.display = 'none'
        disabledButton.style.display = 'block'
        // hier die Mail in der Datenbank löschen
        this.email = ''
      }
    },

    oldPasswordValidator (password) {
      if (password !== this.Pass) {
        this.passwordError = true
      } else {
        this.passwordError = false
        return true
      }
    },

    newPasswordValidator () {
      if (this.aPassword === this.nPassword) {
        this.passwordErrorDifferent = true
      } else {
        this.passwordErrorDifferent = false
        return true
      }
    },

    emptyPasswordValidator () {
      if (this.nPassword === '') {
        this.passwordEmpty = true
      } else {
        this.passwordEmpty = false
        return true
      }
    },

    confirmPasswordValidator () {
      var buttonElem = document.getElementById('password-validator-button')
      if (this.nPassword !== this.bPassword) {
        this.isDanger = true
        buttonElem.style.display = 'none'
        return false
      } else {
        this.isDanger = false
        buttonElem.style.display = 'block'
        return true
      }
    },

    PasswordValidator () {
      if (this.oldPasswordValidator(this.aPassword) && this.newPasswordValidator() && this.emptyPasswordValidator() && this.confirmPasswordValidator()) {
        this.passwordSuccess = true
        this.aPassword = this.nPassword
        // hier sollte er noch das alte Passwort in der Datenbank durch das neue ersetzten.
        this.aPassword = ''
        this.nPassword = ''
        this.bPassword = ''
      } else {
        this.passwordSuccess = false
      }
      m.changePassword(this.aPassword, this.nPassword)
      .then((result) => {
        console.log(result)
      }).catch((error) => {
        console.log(error)
      })
    },

    deleteAccoutPasswordValidator (password) {
      if (password !== this.Pass) {
        return false
      } else {
        return true
      }
    },
    deleteAccount () {
      this.$dialog.prompt({
        title: 'Account löschen',
        message: 'Bist Du Dir sicher, dass Du Deinen Account <strong>löschen</strong> willst? Diese Aktion kann nicht rückgängig gemacht werden.<br>Wenn Du Dir sicher bist gib hier Dein Passwort an:',
        confirmText: 'Löschen',
        cancelText: 'Doch nicht löschen',
        inputMaxlength: 20,
        inputPlaceholder: 'Dein Passwort',
        type: 'is-danger',
        onConfirm: (value) => { this.deleteAccoutPasswordValidator(value) },
        onCancel: () => { this.$toast.open('Zum Glück bleibst du bei uns!') }
      })
    },

    swopLogout () {
      db.User.logout().then(() => {
        router.push('login-sample')
        this.$parent.isLoggedIn = false
      })
    }
// Methoden zu Ende
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

.dangerInput {
  border-color: #ff0000 !important;
}

.icon-margin {
  margin-left: 0.5rem
}

</style>
