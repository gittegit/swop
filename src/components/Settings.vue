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
              <div>
                <p class="control has-icons-left">
                  <b-input type="text" v-model="name" placeholder="Dein Name"></b-input>
                    <span class="icon is-small is-left">
                      <i class="fa fa-user"></i>
                    </span>
                </p>
              </div>
            </b-field>
            <div><p class="has-text-right"><a class="button is-primary" v-on:click="changeName">Name bestätigen</a></p></div>
          </form>

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
                      <b-input type="password" v-model="aPassword" placeholder="Dein altes Passwort"></b-input>
                        <span class="icon is-small is-left">
                          <i class="fa fa-lock"></i>
                        </span>
                    </p>
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

                <b-field>
                  <div v-on:keyup="confirmPasswordValidator">
                    <p class="control has-icons-left">
                        <input class="input" type="password" v-bind:class="{ dangerInput: isDanger }" v-model="bPassword" placeholder="Bestätige Dein neues Passwort"></b-input>
                        <span class="icon is-small is-left">
                          <i class="fa fa-lock"></i>
                        </span>
                    </p>
                  </div>
                </b-field>
                <div id="password-success-message" hidden><p class="help is-success">Deine Passwort wurde erfolgreich geändert!</p></div>
                <div id="password-not-different-message" hidden><p class="help is-danger">Dein Passwort konnte nicht geändert werden. Überprüfe ob sich Dein neues und Dein alter Passwort unterscheiden.</p></div>
                <div id="password-empty-message" hidden><p class="help is-danger">Du musst ein neues Passwort eingeben.</p></div>
                <div><p class="has-text-right"><a class="button is-primary" v-on:click="PasswordValidator">Passwort bestätigen</a></p></div>
            </form>
            <p class="has-text-left">
              <a class="has-text-secondary is-white font-klein margin-right" v-on:click="deleteAccount">Account löschen</a>
            </p>
        </div>
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
      name: 'Juli',  // hier sollte der Name von der Datenbank geholen werden
      email: '',
      aPassword: '',
      nPassword: '',
      bPassword: '',
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
    changeName () {
      this.$toast.open('Jetzt müsste der Name "' + this.name + '" in die Datenbank gepackt werden.')
    },

    validateEmail (mail) {
      var re = /\S+@\S+\.\S+/
      return re.test(mail)
    },
    mailValidator () {
      var successElem = document.getElementById('mail-success-message')
      var failElem = document.getElementById('mail-fail-message')
      if (this.validateEmail(this.email)) {
        failElem.style.display = 'none'
        successElem.style.display = 'block'
        // hier sollte die Mail in die Datenbank hinzugefügt werden
        this.email = ''
      } else {
        failElem.style.display = 'block'
        successElem.style.display = 'none'
      }
    },

    oldPasswordValidator () {
      var wrongElem = document.getElementById('password-wrong-message')
      if (this.aPassword !== this.Pass) {
        wrongElem.style.display = 'block'
      } else {
        wrongElem.style.display = 'none'
        return true
      }
    },

    newPasswordValidator () {
      var difElem = document.getElementById('password-not-different-message')
      if (this.aPassword === this.nPassword) {
        difElem.style.display = 'block'
      } else {
        difElem.style.display = 'none'
        return true
      }
    },

    emptyPasswordValidator () {
      var emptyElem = document.getElementById('password-empty-message')
      if (this.nPassword === '') {
        emptyElem.style.display = 'block'
      } else {
        emptyElem.style.display = 'none'
        return true
      }
    },

    confirmPasswordValidator () {
      if (this.nPassword !== this.bPassword) {
        this.isDanger = true
        return false
      } else {
        this.isDanger = false
        return true
      }
    },

    PasswordValidator () {
      var successElem = document.getElementById('password-success-message')
      if (this.oldPasswordValidator() && this.newPasswordValidator() && this.emptyPasswordValidator() && this.confirmPasswordValidator()) {
        successElem.style.display = 'block'
        this.aPassword = this.nPassword
        // hier sollte er noch das alte Passwort in der Datenbank durch das neue ersetzten.
        this.aPassword = ''
        this.nPassword = ''
        this.bPassword = ''
      } else {
        successElem.style.display = 'none'
      }
    },

    deleteAccount () {
      this.$dialog.confirm({
        title: 'Account löschen',
        message: 'Bist Du Dir sicher, dass Du Deinen Account <strong>löschen</strong> willst? Diese Aktion kann nicht rückgängig gemacht werden.',
        cancelText: 'Account wirklich löschen',
        confirmText: 'Doch nicht löschen',
        type: 'is-danger',
        hasIcon: true,
        onCancel: () => { this.$toast.open('Account gelöscht!') } // hier müssten alle Daten aus der Datenbank gelöscht werden
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

</style>
