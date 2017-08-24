<template>
  <div class="main-content">
    <div class="container main-content">
      <div class="columns is-centered">

          <div class="column is-8 is-narrow is-form">
            <div class="task-description-title">
              <h4 class="title">Spielregeln</h4>
            </div>
            <!-- Spielregeln -->
            <div class="content gaming-rules">
                  <p><img class="float-right animated jello" src="../assets/swoppy.svg">swop bietet Dir die Möglichkeit, einen Tauschpartner für Deinen Platz in einer Uni-Veranstaltung zu finden. swop ist <strong>komplett kostenlos</strong>.
                    Damit das so bleiben kann, müssen sich alle swop-Mitglieder an folgende Spielregeln halten:
                  </p>
                  <ol>
                    <li>
                      <strong>Geh sensibel mit den Daten Deiner Tauschpartner um.</strong><br>
                      Hinter jedem Match steckt eine echte Person. Bitte nutze die Mail-Adresse Deines Tauschpartners ausschließlich zur Kontaktaufnahme für den Tausch Eurer Veranstaltungsplätze.
                    </li>
                    <li>
                      <strong>Schaue regelmäßig bei swop vorbei.</strong><br>
                      Du hast insgesamt zwei Tage um einen Match mit Deinem Tauschpartner zu bestätigen – länger wollen wir Euch nicht zappeln lassen. Nach zwei Tagen ohne Deine Bestätigung verfällt Deine Tauschanfrage und Du musst eine neue anlegen.
                    </li>
                    <li>
                      <strong>Jeder Deiner Tauschkarten und Matches wird für maximal zwei Wochen gespeichert.</strong><br>
                      Damit stellen wir sicher, dass Du wir Dich nur mit aktuell interessierten Tauschpartnern matchen.
                    </li>
                    <li>
                      <strong>Gefällt Dir swop?</strong><br>
                      Wir würden uns freuen, wenn Du swop auch Deinen Kommilitonen zeigst. Je mehr Studenten swop benutzen, desto größer ist die Chance, einen Tauschpartner zu finden.
                    </li>
                  </ol>
              </div>
              <!-- Support -->
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
<style scoped lang="scss"></style>
