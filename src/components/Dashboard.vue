<template>
  <div class="main-content">
<div class="container">
  <!-- Inhalt / Formulare -->
  <div class="columns is-centered">

    <div class="column is-8 is-narrow">

      <!-- Tab Navigation -->
      <div class="card-tabs tabs is-toggle is-fullwidth is-small">
        <ul>
          <li v-for="swopCardTab in swopCardTabs" :class="{'is-active':swopCardTab.active}" v-on:click="manageCards(swopCardTab)">
            <a>
              <span>{{ swopCardTab.statusMessage }}</span>
            </a>
          </li>
        </ul>
      </div>

      <!-- Beginn einer Karte / mit Swop-->
      <div v-for="swopCard in swopCards" v-if="swopCard.status === filtered || filtered === 'all'" class="swop-card card" :class="{'swop-accepted':swopCard.match}">
        <!-- Kartenheader -->
        <header class="card-header" v-on:click="swopCard.open = !swopCard.open">
          <div class="swop-status">
            <div class="swop-status-icon">
              <img v-if="swopCard.status=== 'declined'"src="../assets/swop-declined-invert.svg">
              <img v-if="swopCard.status=== 'accepted'"src="../assets/swop-accepted.svg">
              <img v-if="swopCard.status=== 'pending'"src="../assets/swop-pending.svg">
              <img v-if="swopCard.status=== 'waiting'"src="../assets/swop-waiting-invert.svg">
            </div>
            <div class="swop-status-courses">
              <!-- Swop Kurse -->
              <div class="swop-status-course-from">
                <p class="help"><span class="swop-change">Swop</span> <span class="swop-course-id">64-012</span> — <span class="swop-course-group">{{swopCard.courseGroupFrom}}</span> </p>
                <p class="is-title is-size-5 course-title">{{swopCard.courseTitleFrom}}</p>
              </div>

              <div class="swop-status-course-from">
                <p class="help"><span class="swop-change">Gegen</span> <span class="swop-course-id">64-012</span> — <span class="swop-course-group">{{swopCard.courseGroupTo}}</span> </p>
                <p class="is-title is-size-5 course-title">{{swopCard.courseTitleTo}}</p>
              </div>
            </div>
          </div>
          <!-- Icon -->
          <a class="card-header-icon">
            <span class="icon">
                    <i v-if="!swopCard.open" class="fa fa-angle-down"></i>
                    <i v-else class="fa fa-angle-up"></i>
                  </span>
          </a>
        </header>

        <!-- Karteninhalt - muss aufgetogglet werrden -->
        <transition
    name="expand-card"
  >
          <div class="card-content" v-show="swopCard.open">
            <div class="content">
              <div class="swop-match-info" v-if="swopCard.match">
                <p>Du swopst deinen Platz mit <strong>{{swopCard.userName}}</strong></p>
                <form class="swop-partner-mail">
                  <div class="field has-addons">
                    <div class="control has-icons-left is-expanded">
                      <input class="input is-medium" type="mail" v-model="swopCard.userMail">
                      <span class="icon is-small is-left">
                          <i class="fa fa-envelope"></i>
                          </span>
                    </div>

                    <div class="control">
                      <a v-clipboard:copy="swopCard.userMail" v-clipboard:success="onSuccess" v-clipboard:error="onError" class="button is-medium clipboard-button" :class="{'is-primary':!swopCard.match, 'is-white':swopCard.match,}"><i class="fa fa-clipboard" aria-hidden="true"></i></a>
                    </div>

                  </div>
                  <p class="help">Bitte nimm zügig Kontakt auf, {{swopCard.userName}} wartet sicher schon!</p>
                </form>
              </div>
              <div class="swop-no-match-info" v-else>
                <p>Leider haben wir noch keinen Partner für Dich gefunden. Bleib' aber ständig auf Empfang, denn das kann sich jederzeit ändern!</p>
              </div>
            </div>
          </div>
        </transition>
        <footer class="card-footer">
          <p class="card-footer-item help">{{swopCard.date}} — {{swopCard.time}} Uhr</p>
          <a class="card-footer-item"><span class="icon"><i class="fa fa-trash" aria-hidden="true"></i></span> Löschen</a>
        </footer>
      </div>
      <!-- Ende einer Karte -->
    </div>
  </div>
  <!-- / Inhalt / Formulare -->
  <footer class="floating-footer">
    <div class="container">
      <div class="columns is-centered">
        <div class="column is-half is-narrow">
          <p class="has-text-centered">
            <router-link :to="{name: 'swop-dialog'}" class="button is-secondary has-icon is-medium">
              <span class="icon">
                            <i class="fa fa-plus" aria-hidden="true"></i>
                          </span>
              <span>Neue Anfrage</span>
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
      copyData: 'test',
      msg: 'Welcome to Your Vue.js and Baqend App',
      isLoggedIn: null,
      filtered: 'all',
      swopCardTabs: [
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
      mySwopCards: [],
      swopCards: [
        {
          courseTitleFrom: 'Übungen zu Softwareentwicklung II',
          courseGroupFrom: 'Gruppe F',
          courseTitleTo: 'Übungen zu Softwareentwicklung II',
          courseGroupTo: 'Gruppe E',
          userName: 'Marco',
          userMail: 'marco@uni.rocks',
          date: '2. Januar 2016',
          time: '19:34',
          match: false,
          open: false,
          status: 'declined'
        },
        {
          courseTitleFrom: 'Denken lernen leicht gemacht',
          courseGroupFrom: 'Seminar F',
          courseTitleTo: 'Denken lernen leicht gemacht',
          courseGroupTo: 'Seminar E',
          userName: 'Stefan',
          userMail: 'stefan@uni.rocks',
          date: '4. Januar 2016',
          time: '18:34',
          match: true,
          open: false,
          status: 'accepted'
        },
        {
          courseTitleFrom: 'Wurst selber machen',
          courseGroupFrom: 'Seminar F',
          courseTitleTo: 'Mittelalter Vogelkunde',
          courseGroupTo: 'Seminar E',
          userName: 'Dieter',
          userMail: 'dieter@uni.rocks',
          date: '4. Januar 2016',
          time: '18:34',
          match: false,
          open: false,
          status: 'waiting'
        },
        {
          courseTitleFrom: 'Käse essen',
          courseGroupFrom: 'Seminar F',
          courseTitleTo: 'Bier trinken',
          courseGroupTo: 'Seminar E',
          userName: 'Harry',
          userMail: 'harry@uni.rocks',
          date: '4. Januar 2016',
          time: '18:34',
          match: true,
          open: false,
          status: 'pending'
        }
      ]
    }
  },
  created () {
    console.log(db.User.me)
  },
  methods: {
    manageCards: function (event) {
      // Toggle die Active Klassen der Tabs
      for (var swopCardTab in this.swopCardTabs) {
        this.swopCardTabs[swopCardTab].active = false
      }
      event.active = true
      // Toggle
      this.filtered = event.statusMessage
      if (this.filtered === 'Ausstehend') {
        this.filtered = 'waiting'
        console.log(this.filtered)
      } else if (this.filtered === 'Match') {
        this.filtered = 'match'
        console.log(this.filtered)
      } else {
        this.filtered = 'all'
        console.log(this.filtered)
      }
    },
    onSuccess: function () {
      this.$toast.open({
        message: 'Mail wurde in die Zwischenablage kopiert!',
        type: 'is-success',
        position: 'is-top'
      })
    },
    onError: function () {
      this.$toast.open({
        duration: 5000,
        message: `Something's not good, also I'm on bottom`,
        position: 'is-bottom',
        type: 'is-danger'
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
@media only screen and (min-width:768px) {
  .card-tabs {
  top: 4.6rem;
  font-size: 1rem;
  }
  .main-content {
    padding-top: 10rem;
  }
}
.swop-status-icon img {
  max-height: 1.7rem;
}
</style>
