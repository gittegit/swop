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
                      <b-input type="email" placeholder="Deine Mail-Adresse"></b-input>
                      <span class="icon is-small is-left">
                        <i class="fa fa-envelope"></i>
                      </span>
                  </div>
                    <div class="control">
                        <a class="button is-primary" v-on:click="mailSuccess"><i class="fa fa-paper-plane" aria-hidden="true"></i></a>
                    </div>

                </b-field>
            </form>

            <form class="change-password ">
                <h4 class="title is-6">Passwort ändern</h4>

                <div class="field">
                    <p class="control has-icons-left ">
                      <b-input type="password" placeholder="Dein altes Passwort"></b-input>
                        <span class="icon is-small is-left">
                          <i class="fa fa-lock"></i>
                        </span>
                    </p>
                </div>
                <div class="spacer"></div>

                <div class="field">
                    <p class="control has-icons-left">
                        <b-input type="password" placeholder="Dein neues Passwort"></b-input>
                        <span class="icon is-small is-left">
                          <i class="fa fa-lock"></i>
                        </span>
                    </p>
                </div>

                <div class="field">
                    <p class="control has-icons-left">
                        <b-input type="password" placeholder="Bestätige Dein neues Passwort"></b-input>
                        <span class="icon is-small is-left">
                          <i class="fa fa-lock"></i>
                        </span>
                        <p class="help is-success">Dein Passwort wurde erfolgreich geändert!</p>
                    </p>
                </div>
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
    mailSuccess () {
      this.$toast.open({message: 'Deine E-Mail wurde erfolgreich hinzugefügt!', type: 'is-success'})
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
