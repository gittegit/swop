<template>
<div class="main-content">
  <div class="container main-content">
    <div class="columns is-centered">
      <!-- Inhalt / Formulare -->
        <div class="column is-8 is-narrow is-form">
          <div class="task-description-title">
            <h4 class="title">Deine Einstellungen</h4>
          </div>

          <!-- Hier kann man seinen Displaynamen ändern -->
          <form class="change-name">
            <h4 class="title is-6">Name ändern</h4>
            <p class="help hasPadding">Dieser Name wird Deinem Tauschpartner angezeigt.</p>
            <b-field>
              <div class="control has-icons-left is-expanded" v-on:keyup="showNameButton">
                <input class="input" type="text" v-model="name" v-on:keyup.enter="changeName" placeholder="Dein Name"></b-input>
                  <span class="icon is-small is-left">
                    <i class="fa fa-user"></i>
                  </span>
              </div>
                <div class="control" v-if="showDisabledNameButton">
                    <a class="button is-primary" disabled><i class="fa fa-check"></i></a>
                </div>
                <div class="control" v-if="showNameCheckButton">
                    <a class="button is-primary" v-on:click="changeName"><i class="fa fa-check"></i></a>
                </div>
            </b-field>
            <!-- Success-Meldung -->
            <p class="help is-success">{{nameSuccess}}</p>
          </form>

          <!-- Hier kann man eine neue Mail-Adresse angeben und ändern -->
            <form class="add-email">
                <h4 class="title is-6">Zusätzliche Mail-Adresse</h4>
                <p class="help hasPadding">Wenn Du eine zusätzliche Mail-Adresse hinterlegst, werden Benachrichtigungen aus swop nur noch an diese Adresse gesendet. Einloggen kannst Du Dich aber weiterhin <strong>nur</strong> mit Deiner verifizierten Uni-Mail (<strong>{{ loginEmail }}</strong>).</p>
                <b-field>
                  <div class="control has-icons-left is-expanded" v-on:keyup="showMailButton">
                      <input class="input" v-model="email" v-on:keyup.enter="mailValidator" placeholder="Deine Mail-Adresse"></b-input>
                      <span class="icon is-small is-left">
                        <i class="fa fa-envelope"></i>
                      </span>
                  </div>
                    <div class="control" v-if="showDisabledMailCheckButton">
                        <a class="button is-primary" disabled><i class="fa fa-check"></i></a>
                    </div>
                    <div class="control" v-if="showMailCheckButton">
                        <a class="button is-primary" v-on:click="mailValidator"><i class="fa fa-check"></i></a>
                    </div>
                    <div class="control" v-if="showMailClearButton">
                        <a class="button is-primary" v-on:click="mailClear"><i class="fa fa-trash"></i></a>
                    </div>
                </b-field>
                <!-- Fehlermeldungen / Success-Meldung -->
                <p class="help is-success">{{mailSuccess}}</p>
                <p v-if="mailError" class="help is-danger">Bitte gib eine korrekte Mail-Adresse an.</p>
            </form>

            <!-- Hier kann man sein Passwort ändern -->
            <form class="change-password ">
                <h4 class="title is-6">Passwort ändern</h4>

                <b-field>
                    <p class="control has-icons-left ">
                      <input class="input" type="password" v-model="aPassword" :class="{'is-danger': passwordError}" v-on:keyup.enter="nextInput(aPassword)" placeholder="Dein altes Passwort"></input>
                        <span class="icon is-small is-left">
                          <i class="fa fa-lock"></i>
                        </span>
                    </p>
                </b-field>
                <div class="spacer"></div>

                <b-field>
                    <p class="control has-icons-left">
                        <input class="input" id="nPassword" type="password" v-model="nPassword" :class="{'is-danger': passwordErrorDifferent }" v-on:keyup.enter="nextInput(nPassword)" placeholder="Dein neues Passwort"></input>
                        <span class="icon is-small is-left">
                          <i class="fa fa-lock"></i>
                        </span>
                    </p>
                </b-field>

                <b-field>
                  <div v-on:keyup="confirmPasswordValidator">
                    <p class="control has-icons-left">
                        <input class="input" id="bPassword" type="password" v-bind:class="{ dangerInput : isDanger }" v-model="bPassword" placeholder="Bestätige Dein neues Passwort"></input>
                        <span class="icon is-small is-left">
                          <i class="fa fa-lock"></i>
                        </span>
                    </p>
                  </div>
                </b-field>
                <!-- Fehlermeldungen / Success-Meldung / Button -->
                <p v-if="passwordSuccess" class="help is-success">Dein Passwort wurde erfolgreich geändert!</p>
                <p v-if="passwordErrorDifferent" class="help is-danger">Dein Passwort konnte nicht geändert werden. Überprüfe, ob sich Dein neues und Dein altes Passwort unterscheiden.</p>
                <!-- <p v-if="passwordEmpty" class="help is-danger">Du musst ein neues Passwort eingeben.</p> -->
                <p class="help is-danger">{{passwordError}}</p>
                <p v-if="passwordButton" class="has-text-right"><a class="button is-primary" v-on:click="PasswordValidator">Passwort bestätigen</a></p>
            </form>

            <!-- Button (Account löschen & Logout) -->
            <p class="flex-center flex-center-left">
              <a class="has-text-secondary is-white font-klein margin-right" v-on:click="toggleModal">Account löschen</a>
              <a class="button is-primary has-icon-right" v-on:click="swopLogout">Ausloggen<i class="fa fa-sign-out icon-margin"></i></a>
            </p>
        </div>
<!-- Form zu Ende -->
    </div>
  </div>

<div class="modal" :class="{'is-active': modalOpen}">
  <div class="modal-background"></div>
  <div class="modal-content">
    <article class="message is-medium">
    <div class="message-header">
      <p>Account löschen</p>
    </div>
      <div class="message-body content">
        <p>Bist Du Dir sicher, dass Du Deinen Account <strong>löschen</strong> willst? Diese Aktion kann nicht rückgängig gemacht werden.</p>
        <p class="has-text-right flex-center">
          <a class="is-white font-klein margin-right" v-on:click="toggleModal">Abbrechen</a>
          <a class="button is-secondary" v-on:click="deleteAccount">Löschen</a>
        </p>
      </div>
    </article>
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
      // Display Name
      name: null,
      showDisabledNameButton: true,
      showNameCheckButton: false,
      nameSuccess: null,
      // Mail
      email: null,
      loginEmail: null,
      showDisabledMailCheckButton: true,
      showMailCheckButton: false,
      showMailClearButton: false,
      mailSuccess: null,
      mailError: false,
      // Passwort
      aPassword: null,
      nPassword: null,
      bPassword: null,
      passwordError: '',
      passwordSuccess: false,
      passwordErrorDifferent: false,
      // passwordEmpty: false,
      passwordButton: false,
      isDanger: false,
      // alles andere
      modalOpen: false,
      isLoggedIn: null
    }
  },

  created () {
    if (!db.User.me) {
      this.$router.push('/')
    }
    m.initUserData().then(() => {
      // Display-Namen holen
      this.name = m.getDisplayName()
      // Mail-Adresse holen
      var mail = m.getEmail()
      this.loginEmail = m.getLoginEmail()
      if (this.loginEmail !== mail) {
        this.email = m.getEmail()
        this.showMailClearButton = true
        this.showDisabledMailCheckButton = false
      }
    })
  },

  methods: {
    /*
    * Alles was man für die Änderung des Namens brauch.
    * macht den Button nicht mehr disabled oder wieder disabled (showNameButton)
    * Namen in der Datenbank ändern (changeName)
    */
    showNameButton () {
      if (this.name === '') {
        this.showNameCheckButton = false
        this.showDisabledNameButton = true
      } else {
        this.showNameCheckButton = true
        this.showDisabledNameButton = false
      }
    },
    changeName () {
      m.updateUsername(this.name)
      .then((result) => {
        this.nameSuccess = result.success.message
        this.showNameCheckButton = false
        this.showDisabledNameButton = true
      }).catch((error) => {
        var errorMessage = error.cause.message
        this.$toast.open({
          duration: 5000,
          message: errorMessage,
          type: 'is-danger'})
      })
    },

    /*
    * Alles was man für das Hinzufügen und die Änderung der Extra-Mail brauch.
    * macht den Button nicht mehr disabled oder wieder disabled (showMailButton)
    * kontrollieren ob es sich um eine echt Mail-Adresse handelt (validateEmail)
    * und entsprechende Meldungen anzeigen (mailValidator)
    * Mail in die Datenbank (mailValidator)
    * Mailanzeige leeren (mailClear)
    */
    showMailButton () {
      this.mailSuccess = null
      this.mailError = false
      this.showDisabledMailCheckButton = false
      this.showMailCheckButton = true
      this.showMailClearButton = false
    },
    validateEmail (mail) {
      var re = /\S+@\S+\.\S+/
      return re.test(mail)
    },
    mailValidator () {
      if (this.validateEmail(this.email)) {
        this.showMailCheckButton = false
        this.showMailClearButton = true
        m.updateEmail(this.email)
        .then((result) => {
          this.mailSuccess = result.success.message
          this.mailError = false
        }).catch((error) => {
          var errorMessage = error.cause.message
          this.$toast.open({
            duration: 5000,
            message: errorMessage,
            type: 'is-danger'})
        })
      } else {
        this.mailSuccess = null
        this.mailError = true
        this.showDisabledMailCheckButton = true
        this.showMailCheckButton = false
        this.showMailClearButton = false
      }
    },
    mailClear () {
      if (this.email !== null) {
        m.updateEmail(this.loginEmail)
        .then((result) => {
          this.showMailClearButton = false
          this.showDisabledMailCheckButton = true
          this.email = null
          this.mailSuccess = null
        }).catch((error) => {
          var errorMessage = error.cause.message
          this.$toast.open({
            duration: 5000,
            message: errorMessage,
            type: 'is-danger'})
        })
      }
    },

    /*
    * Hier wird alles vom Passwort alles was man beim Passwort so falsch machen kann abgefangen.
    * Testen ob altes Passwort und neues Passwort unterschiedlich sind (differentPasswordValidator)
    * Testen, dass neues Passwort geschrieben wurde (emptyPasswordValidator)
    * neues Passwort bestätigen (confirmPasswordValidator)
    * altes Passwort mit der Datenbank abgleichen und neues Passwort setzen (PasswordValidator)
    * in das nächste Input springen (nextInput)
    */
    differentPasswordValidator () {
      if (this.aPassword === this.nPassword) {
        this.passwordErrorDifferent = true
      } else {
        this.passwordErrorDifferent = false
        return true
      }
    },
    confirmPasswordValidator () {
      if (this.nPassword !== this.bPassword) {
        this.isDanger = true
        this.passwordButton = false
        return false
      } else {
        this.isDanger = false
        this.passwordButton = true
        return true
      }
    },
    PasswordValidator () {
      if (this.differentPasswordValidator() && this.confirmPasswordValidator()) {
        m.changePassword(this.aPassword, this.nPassword)
        .then((result) => {
          this.passwordSuccess = true
          this.aPassword = null
          this.nPassword = null
          this.bPassword = null
          this.passwordButton = false
        }).catch((error) => {
          this.passwordError = error.cause.message
        })
      } else {
        this.passwordSuccess = false
      }
    },
    nextInput (myInput) {
      if (myInput === this.aPassword) {
        document.getElementById('nPassword').focus()
      } else if (myInput === this.nPassword) {
        document.getElementById('bPassword').focus()
      }
    },

    /*
    * Modal aktiv setzen (toggleModal)
    * Hier wird der Account gelöscht (deleteAccount)
    */
    toggleModal () {
      this.modalOpen = !this.modalOpen
    },
    deleteAccount () {
      m.deleteUser().then((result) => {
        this.swopLogout()
      }).catch((error) => {
        this.toggleModal()
        var errorMessage = error.cause
        this.$toast.open({
          duration: 5000,
          message: errorMessage,
          type: 'is-danger'})
      })
    },

    /*
    * hier wird der User ausgeloggt
    * und auf die LogIn-Seite geleitet
    */
    swopLogout () {
      m.logout().then(() => {
        router.push('/')
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
  margin-left: 0.5rem;
}

.hasPadding {
  padding-bottom: 0.5rem;
}

</style>
