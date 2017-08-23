<template>
  <div class="main-content">
    <div class="container main-content">
      <div class="columns is-centered">

          <div class="column is-8 is-narrow is-form">
            <div class="task-description-title">
              <h4 class="title">Spielregeln</h4>
            </div>
            <div class="content gaming-rules">
                  <p><img class="float-right animated jello" src="../assets/swoppy.svg">Mit swop bieten wir Dir eine Möglichkeit, mit der Du ganz einfach einen Tauschpartner Plätze in Uni-Veranstaltungen finden kannst. Dies geschieht <strong>absolut kostenlos</strong>.
                    Im Gegenzug erwarten wir nur von Dir, Dich an folgende Spielregeln zu halten:
                  </p>
                  <ol>
                    <li>
                      <strong>Geh sensibel mit den Daten Deiner Partner um.</strong><br>
                      Hinter jedem Match steckt auch eine andere Person. Bitte stelle nichts anderes mit der E-Mail des anderen an als das Nutzen für die Kontaktaufnahme.
                    </li>
                    <li>
                      <strong>Schaue regelmäßig in Deine Mails.</strong><br>
                      Du hast insgesamt 2 Tage um einen Match zu bestätigen. Nach 2 Tagen ohne Bestätigung verfällt dieser und Du musst einen neuen anlegen.
                    </li>
                    <li>
                      <strong>Jeder Deiner Tauschkarten und Matches ist für maximal 2 Wochen im System</strong><br>
                      Dies geschiet aus Fairnessgründen und weil Ummeldephasen oft nicht länger dauern. Danach musst Du einen neue Tauschkarte erstellen.
                    </li>
                    <li>
                      <strong>Erzähl uns weiter!</strong><br>
                      Wir würden uns freuen, wenn Du swop auch Deinen Kommilitonen zeigen würdest. Denn je mehr Studenten swop benutzen, desto größer sind die Chancen einen Partner zu finden.
                    </li>
                  </ol>
              </div>

              <p class="has-text-centered">Noch Fragen?</p>
              <div class="spacer"></div>
              <p class="has-text-centered"><a target="_blank" href="https://rickrolled.fr/" class="button is-primary">Kontaktiere den Support</a></p>

          </div>
      </div>
    </div>
  </div>
</template>

<script type="text/babel">
import db from 'baqend'

export default {
  name: 'spielregeln',
  data () {
    return {
      msg: 'Welcome to Your Vue.js and Baqend App',
      isLoggedIn: null
    }
  },
  created () {
    if (!db.User.me) {
      this.$router.push('/')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  img.float-right {
    height: 8rem !important;
    float: right;
    margin: -3rem 0rem 1rem 2rem;
    display: inline-block;
  }

</style>
