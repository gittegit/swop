<template>
  <div class="main-content">
      <div class="container">
          <!-- Inhalt / Formulare -->
          <div class="columns is-centered">

              <div class="column is-8 is-narrow" :class="{'is-form': noSwopCards}">

                  <!-- Tab Navigation -->
                  <div class="card-tabs tabs is-toggle is-fullwidth is-small">
                      <ul>
                          <li v-for="swopCardTab in swopCardTabs" :class="{'is-active':swopCardTab.active}" v-on:click="manageCards(swopCardTab);">
                              <a>
                                  <span>{{ swopCardTab.statusMessage }}</span>
                              </a>
                          </li>
                      </ul>
                  </div>
                  <!-- / Tab Navigation -->

                  <!-- Beginn einer einzelnen Karte -->
                  <!-- im v-if wird die Filtrierung der Karten vorgenommen und dann darüber iteriert -->
                  <!-- Ist eine Karte ein match, so wird eine Klasse hinzugefügt, die die Karte optisch abhebt -->
                  <div v-if="hasMatch(swopCard) === activeTab || activeTab === 'ALL'" v-for="swopCard in mySwopCards" class="swop-card card" :class="{'swop-accepted':swopCard.match}">

                      <!-- Kartenheader -->
                      <header class="card-header" v-on:click="toggleOpen(swopCard.id)">
                          <div class="swop-status">
                              <div class="swop-status-icon">
                                <!-- Je nach Status wird passendes Icon geliefert -->
                                  <img v-if="swopCard.status === 'DECLINED'" src="../assets/swop-declined-invert.svg">
                                  <img v-if="swopCard.status === 'ACCEPTED'" src="../assets/swop-accepted.svg">
                                  <img v-if="swopCard.status === 'PENDING' && getSwopCardMatchStatus(swopCard.match.id)[0] === 'WAITING'" src="../assets/swop-notification.svg">
                                  <img v-if="swopCard.status === 'PENDING' && getSwopCardMatchStatus(swopCard.match.id)[0] === 'ACCEPTED'" src="../assets/swop-pending.svg">
                                  <img v-if="swopCard.status === 'WAITING'" src="../assets/swop-waiting-invert.svg">
                              </div>

                              <!-- Liste der Kurse -->
                              <div class="swop-status-courses">
                                  <div class="swop-status-course-from">
                                      <p class="help"><span class="swop-change">Tausche</span> <span class="swop-course-id">{{ swopCard.course.id.substring(11) }}</span> <span v-if="swopCard.myGroup != ''"><span v-if="swopCard.myGroup != null" class="swop-course-group my-group">Gr<span class="hide-mobile">uppe</span><span class="hide-desktop">.</span> {{swopCard.myGroup}}</span></span>
                                      </p>
                                      <p class="is-title is-size-5 course-title">{{swopCard.course.name}}</p>
                                  </div>

                                  <div class="swop-status-course-to">
                                      <p class="help"><span class="swop-change">Gegen</span> <span class="swop-course-id"><span class="searched-group-entry" v-for="courseId in Array.from(swopCard.searchedCourses)">{{ courseId.id.substring(11) }}</span></span>
                                          <span class="swop-course-group"><span class="searched-group-entry groups" v-for="group in Array.from(swopCard.searchedGroups)">Gr<span class="hide-mobile">uppe</span><span class="hide-desktop">.</span> {{ group }}</span></span>
                                      </p>
                                      <p class="is-title is-size-5 course-title"><span class="searched-group-entry" v-for="course in Array.from(swopCard.searchedCourses)">{{ course.name }}</span></p>
                                  </div>
                              </div>
                              <!-- / Liste der Kurse -->
                          </div>

                          <!-- Icon -->
                          <a class="card-header-icon"><span class="icon">
                            <i v-if="!(open === swopCard.id)" class="fa fa-angle-down"></i>
                            <i v-else class="fa fa-angle-up"></i>
                          </span></a>

                      </header>
                      <!-- / Kartenheader -->

                      <!-- Karteninhalt - wird durch Klick auf Header getoggled -->
                      <div class="card-content" v-if="open === swopCard.id">
                          <div class="content">

                              <!-- FALL 1: Die Karte ist ACCEPTED - beide Partner haben bestätigt -->
                              <div class="swop-match-info" v-if="swopCard.status === 'ACCEPTED'">
                                  <p>Du tauschst Deinen Platz mit <strong>{{ getMatchPartner(swopCard.match.id).displayName }}</strong></p>
                                  <form class="swop-partner-mail">
                                      <div class="field has-addons">
                                          <div class="control has-icons-left is-expanded">
                                              <input class="input is-medium" type="mail" v-model="getMatchPartner(swopCard.match.id).email">
                                              <span class="icon is-small is-left">
                                                <i class="fa fa-envelope"></i>
                                              </span>
                                          </div>

                                          <div class="control">
                                              <a v-clipboard:copy="getMatchPartner(swopCard.match.id).email" v-clipboard:success="onSuccess" v-clipboard:error="onError" class="button is-medium clipboard-button is-white"><i class="fa fa-clipboard" aria-hidden="true"></i></a>
                                          </div>

                                      </div>
                                      <p class="help">Bitte nimm zügig Kontakt auf, <strong>{{ getMatchPartner(swopCard.match.id).displayName}} wartet sicher schon!</strong></p>
                                  </form>
                              </div>

                              <!-- Fall 2: Die Karte ist PENDING - mind. einer der beiden Partner hat den Match noch nicht bestätigt -->
                              <div class="swop-match-info" v-if="swopCard.status === 'PENDING'">

                                  <!-- Du selbst hast Accepted, der andere muss noch bestätigen -->
                                  <div v-if="getSwopCardMatchStatus(swopCard.match.id)[0] === 'ACCEPTED'">
                                      <p>Du hast Diesen Match bestätigt. Sobald Dein Tauschpartner ebenfalls bestätigt, wird Dir hier seine Mailadresse angezeigt.</p>
                                  </div>
                                  <!-- Der andere hat bestätigt, du selbst musst noch accepten -->
                                  <div v-else>
                                      <p>Super! Wir haben einen Tauschpartner für Dich! Bitte akzeptiere den Match oder, wenn Du es Dir anders überlegt hast, brich ihn ab.</p>
                                      <p class="has-text-centered display-flex"><a class="button is-outlined is-primary margin-right" @click="declineMatch(swopCard.match.id)"><span class="margin-right"><i class="fa fa-times-circle" aria-hidden="true"></i></span>Abbrechen</a><a class="button is-primary"
                                              @click="acceptMatch(swopCard.match.id)"><span class="margin-right"><i class="fa fa-check-circle" aria-hidden="true"></i></span>Bestätigen</a></p>
                                  </div>
                              </div>

                              <!-- Fall 3: Der Match wurde vom User selbst abgebrochen -->
                              <div class="swop-match-info" v-if="swopCard.status === 'DECLINED'">
                                Du hast diesen Match <strong>abgebrochen</strong>. Wenn Du erneut für diese Veranstaltung suchen möchtest, musst Du diesen swop löschen und einen neuen erstellen.
                              </div>

                              <!-- Fall 4: Deine Karte hat noch keinen Partner -->
                              <div class="swop-no-match-info" v-if="swopCard.status === 'WAITING'">
                                  <p>Leider haben wir noch keinen Tauschpartner für Dich gefunden. Bleib' aber ständig auf Empfang, denn das kann sich jederzeit ändern!</p>
                              </div>

                          </div>
                      </div>
                      <!-- / Karteninhalt -->

                      <!-- Kartenfooter mit Löschfunktion und Datum -->
                      <footer class="card-footer">
                          <p class="card-footer-item help">{{getStringDay(swopCard.createdAt) }}. {{getStringMonth(swopCard.createdAt)}} — {{getStringTime(swopCard.createdAt)}}<span class="hide-mobile">&nbsp;Uhr</span></p>
                          <a class="card-footer-item" v-on:click="deleteSwopCard(swopCard.id)"><span class="icon"><i class="fa fa-trash" aria-hidden="true"></i></span> Löschen</a>
                      </footer>
                      <!-- / Kartenfooter -->
                  </div>

                  <!-- Sonderfälle -->
                  <div>
                      <!-- Keine Swopcards -->
                      <div v-if="noSwopCards">
                          <h2 class="title is-size-3">{{Begruessung}}!</h2>
                          <p>Du hast noch keinen laufenden Tauschkarten. Starte, indem Du unter "Neue Tauschanfrage" einen neue Tauschkarte erstellst.<strong>Viel Spaß beim Swoppen!</strong></p>
                      </div>

                      <!-- Swopcards vorhanden, aber in gewählter Kategorie nicht -->
                      <div v-else>
                          <!-- Keine Ausstehenden Karten / activeTab checkt ob es Matches gibt -->
                          <div class="is-form" v-if="checkWaitingEmpty(mySwopCards) && this.activeTab === false">
                              <h3 class="title is-size-4">Keine ausstehenden Tauschanfragen!</h3>
                              <p>Wow, Du hast nur Matches! Diese findest Du unter "Match" oder "Alle".</p>
                          </div>

                          <!-- Keine Matches / activeTab gibt an, ob es Matches gibt-->
                          <div class="is-form" v-if="checkMatchEmpty(mySwopCards) && this.activeTab === true">
                              <h3 class="title is-size-4">Leider noch keine Matches.</h3>
                              <p>Wir haben noch keine Deiner Tauschkarten matchen können. Gedulde Dich und bleib' auf Empfang!</p>
                          </div>
                      </div>
                  </div>
                  <div class="refresh margin-top animated fadeIn"><p class="has-text-centered"><a @click="refreshHard()" class="button is-outlined has-text-lightgrey"><i class="fa fa-refresh font-klein margin-right"></i> Aktualisieren</a></p></div>
              </div>
          </div>
          <!-- / Inhalt -->

          <!-- Floating Footer mit Button -->
          <footer class="floating-footer">
              <div class="container">
                  <div class="columns is-centered">
                      <div class="column is-half is-narrow">
                          <p class="has-text-centered">
                              <router-link :to="{name: 'swop-dialog'}" class="button is-secondary has-icon is-medium neue-anfrage">
                                  <span class="icon">
                            <i class="fa fa-plus" aria-hidden="true"></i>
                          </span>
                                  <span>Neue Tauschanfrage</span>
                              </router-link>
                          </p>
                      </div>
                  </div>
              </div>
          </footer>
      </div>
  </div>
</template>

<script type="text/babel">
import db from 'baqend'
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'
import M from '../Model/model.js'

Vue.use(VueClipboard)
export default {
  name: 'dashboard',
  data () {
    return {
      isLoggedIn: null, // Nutzer eingelogged?
      activeTab: 'ALL', // Aktueller Tab
      copyData: '', // Zwischenablage
      noSwopCards: null, // Variable für nicht vorhandene Swopcards
      open: null, // Variable für geöffnete Karte
      swopCardTabs: [ // Tabs Zustände
        {
          statusMessage: 'Ausstehend',
          active: false
        },
        {
          statusMessage: 'Alle',
          active: true
        },
        {
          statusMessage: 'Match',
          active: false
        }
      ],
      mySwopCards: [], // Array, das mit Daten vom Baqend befüttert wird
      begruessungen: ['Tagchen', 'Guten Tag', 'Servus', 'Moin', 'Hallo', 'Hi', 'Hey', 'Na'], // Begrüßungen für den Fall, dass man keine Karten hat
      displayName: 'swop-Mitglied', // Variable Display Name
      Begruessung: 'Hey swop-Mitglied' // Fallback Begrüßung, Falls es keinen Display Namen gibt
    }
  },
  created () {
    if (!db.User.me) { // wenn nicht eingelogged, leite auf Login Screen weiter
      this.$router.push('/')
    }
    // Z E N T R U M:
    // Initiierung des Dashboards
    M.initUserData().then(() => {
      this.initiateDashboard()
    })
  },
  methods: {
    /*
      Manage Cards übernimmt die Logik des Filterns der Karten
    */
    manageCards: function (event) {
      // Toggle die Active Klassen der Tabs erstmal auf false
      for (var swopCardTab in this.swopCardTabs) {
        this.swopCardTabs[swopCardTab].active = false
      }
      // Stelle das gewählte Tab auf is-active
      event.active = true
      // Manage die Kartensicht
      this.activeTab = event.statusMessage
      if (this.activeTab === 'Ausstehend') {
        this.activeTab = false
      } else if (this.activeTab === 'Match') {
        this.activeTab = true
      } else {
        this.activeTab = 'ALL'
      }
    },
    /*
      Hilfsfunktion, die wiedergibt, ob Karte ein Match ist
    */
    hasMatch: function (swopCard) {
      var result
      if (swopCard.match !== null) {
        result = true
      } else {
        result = false
      }
      return result
    },
    // SUCCESS Message für Copy-to-Clipboard Funktion
    onSuccess: function () {
      this.$toast.open({
        message: 'Mail wurde in die Zwischenablage kopiert!',
        type: 'is-success',
        position: 'is-top'
      })
    },
    // ERROR Message für Copy-to-Clipboard Funktion
    onError: function () {
      this.$toast.open({
        duration: 5000,
        message: `Oops, irgendetwas ist schiefgelaufen. Versuch's noch mal.`,
        position: 'is-bottom',
        type: 'is-danger'
      })
    },
    // Frontend-Funktion, die Karte öffnet oder schließt
    toggleOpen: function (swopCard) {
      // Öffne eine angeklickte Swopcard. Schließe alle geöffneten dabei
      if (this.open === null) {
        this.open = swopCard
      } else if (this.open !== swopCard) {
        this.open = swopCard
      } else {
        this.open = null
      }
    },
    // Swopkarte löschen
    deleteSwopCard: function (swopCard) {
      // Löscht eine swopCard anhand ihrere id
      M.deleteSwopCard(swopCard).then(() => {
        this.$toast.open({
          message: 'Die Tauschkarte wurde gelöscht.',
          type: 'is-success',
          position: 'is-top'
        })
        this.initiateDashboard()
      }).catch((error) => {
        var errorMessage = error.cause.message
        this.$toast.open({
          duration: 5000,
          message: errorMessage,
          type: 'is-danger'})
      })
    },
    // Hilfsfunktion zum erfragen des Matchstatuses einer Karte
    getSwopCardMatchStatus: function (swopCard) {
      return M.getMatchStatus(swopCard)
    },
    // Match akzeptieren
    acceptMatch: function (swopCard) {
      M.acceptMatch(swopCard).then(() => {
        this.$toast.open({
          message: 'Der Match wurde bestätigt.',
          type: 'is-success',
          position: 'is-top'
        })
        this.initiateDashboard()
      }).catch((error) => {
        var errorMessage = error.cause.message
        this.$toast.open({
          duration: 5000,
          message: errorMessage,
          type: 'is-danger'})
      })
    },
    // Match abbrechen
    declineMatch: function (swopCard) {
      M.declineMatch(swopCard).then(() => {
        this.$toast.open({
          message: 'Der Match wurde abgebrochen.',
          type: 'is-success',
          position: 'is-top'
        })
        this.initiateDashboard()
      })
    },
    // Userdaten des Partners laden
    getMatchPartner: function (swopCard) {
      return M.getMatchUserDetail(swopCard)
    },
    /*
      Initiiere Dashboard
      Lade Swopkarten über das Model aus baqend
    */
    initiateDashboard: function () {
      M.getMySwopCards()
        .then((swopCards) => {
          this.mySwopCards = swopCards // Zuweisen der geladenen SwopCards auf lokales Array
          if (this.mySwopCards.length === 0) { // Check auf Inhalt
            this.noSwopCards = true
          } else {
            this.noSwopCards = false
          }
          var random = this.getRandom(0, this.begruessungen.length) // Würfel eine Begruessung zurecht
          this.Begruessung = this.begruessungen[random] + ' ' + M.getDisplayName() // Setze Begrüßung zusammen
        }).catch((error) => {
          var errorMessage = error.cause.message
          this.$toast.open({
            duration: 5000,
            message: errorMessage,
            type: 'is-danger'})
        })
    },
    // Hard Refresh Hilfsfunktion
    refreshHard: function () {
      document.location.reload()
    },
    // Hilfsfunktion zum abfragen, ob es keine ausstehenden Karten gibt
    checkWaitingEmpty: function (swopCards) {
      var result = true
      for (var swopCard in swopCards) {
        swopCard = swopCards[swopCard]
        if (swopCard.match === null) {
          result = false
        }
      }
      return result
    },
    // Hilfsfunktion zum checken, ob es keine Matches gibt
    checkMatchEmpty: function (swopCards) {
      var result = true
      for (var swopCard in swopCards) {
        swopCard = swopCards[swopCard]
        if (swopCard.match !== null) {
          result = false
        }
      }
      return result
    },
    // Hilfsfunktion, die ein Set in ein Array umwandelt
    setToArray: function (set) {
      return Array.from(set)
    },
    // Datums Hilfsfunktion
    getStringDay: function (date) {
      return date.getDate()
    },
    // Monat Hilfsfunktion, gibt für entsprechende Monatszahl den Monat als Wort wieder
    getStringMonth: function (date) {
      // Monat in Klartext
      date = date.getMonth() + 1 // Januar = 0, selbst hier fängt der brave Informatiker bei 0 an
      switch (date) {
        case (1): return 'Januar'
        case (2): return 'Februar'
        case (3): return 'März'
        case (4): return 'April'
        case (5): return 'Mai'
        case (6): return 'Juni'
        case (7): return 'Juli'
        case (8): return 'August'
        case (9): return 'September'
        case (10): return 'Oktober'
        case (11): return 'November'
        case (12): return 'Dezember'
        default: return ''
      }
    },
    // Hilfsfunktion, die eine 0 vor einstellige Minuten setzt
    getStringTime: function (date) {
      var plusZero = function (element) {
        element = element.toString()
        if (element.length === 1) {
          return '0' + element
        } else {
          return element
        }
      }
      return plusZero(date.getHours()) + ':' + plusZero(date.getMinutes())
    },
    // Random Hilfsfunktion
    getRandom: function (min, max) {
      min = Math.ceil(min)
      max = Math.floor(max)
      return Math.floor(Math.random() * (max - min)) + min
    },
    // Testfunktion, die man an alle Events im Template dranhängen kann, um sie zu loggen
    logMal: function (event) {
      console.log(event)
    },
    // Funktion, die vor dem Betreten des Dashboard ausgeführt werden sollte
    beforeRouteEnter: function (to, from, next) {
      if (db.User.me !== null) {
        next()
        this.initiateDashboard()
      } else {
        next('/')
      }
    }
  }
}
</script>

<style scoped lang="scss">
.card-tabs {
  position: fixed;
  top: 3.1rem;
  left: 0;
  right: 0;
  z-index: 99;
  padding: 0.75rem 0 0rem 0;
  background-color: rgba(255,255,255,0.8);
  ul {
    background-color: #ffffff;
  }
}
.searched-group-entry:not(:last-child):after {
  content: ", "
}
.searched-group-entry.groups:first-child:before, .my-group:before {
  content: "—  "
}
@media only screen and (min-width:768px) {
  .card-tabs {
  top: 4.6rem;
  font-size: 1rem;
  }
  .main-content {
    padding-top: 10rem;
  }
}
@media only screen and (max-width: 450px) {
  .course-title {
    font-size: 1rem !important;
  }
  .main-content {
    padding: 8rem 0 !important;
  }
}
.swop-status-icon img {
  max-height: 1.7rem;
}
</style>
