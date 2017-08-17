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
      <div v-if="swopCard.status === filtered || filtered === 'ALL'" v-for="swopCard in mySwopCards" class="swop-card card" :class="{'swop-accepted':swopCard.match}">
        <!-- Kartenheader -->
        <header class="card-header" v-on:click="toggleOpen(swopCard.id); logMal(swopCard)">
          <div class="swop-status">
            <div class="swop-status-icon">
              <img v-if="swopCard.status === 'DECLINED'"src="../assets/swop-declined-invert.svg">
              <img v-if="swopCard.status === 'ACCEPTED'"src="../assets/swop-accepted.svg">
              <img v-if="swopCard.status === 'PENDING'"src="../assets/swop-pending.svg">
              <img v-if="swopCard.status === 'WAITING'"src="../assets/swop-waiting-invert.svg">
            </div>
            <div class="swop-status-courses">
              <!-- Swop Kurse -->
              <div class="swop-status-course-from">
                <p class="help"><span class="swop-change">Swop</span> <span class="swop-course-id">{{ swopCard.course.id.substring(11) }}</span> <span v-if="swopCard.myGroup != ''"><span v-if="swopCard.myGroup != null" class="swop-course-group my-group">{{swopCard.myGroup}}</span></span> </p>
                <p class="is-title is-size-5 course-title">{{swopCard.course.name}}</p>
              </div>

              <div class="swop-status-course-to">
                <p class="help"><span class="swop-change">Gegen</span> <span class="swop-course-id"><span class="searched-group-entry" v-for="courseId in Array.from(swopCard.searchedCourses)">{{ courseId.id.substring(11) }}</span></span> <span class="swop-course-group"><span class="searched-group-entry groups" v-for="group in Array.from(swopCard.searchedGroups)">{{ group }}</span></span> </p>
                <p class="is-title is-size-5 course-title"><span class="searched-group-entry" v-for="course in Array.from(swopCard.searchedCourses)">{{ course.name }}</span></p>
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
          <div class="card-content" v-if="open === swopCard.id">
            <div class="content">
              <div class="swop-match-info" v-if="swopCard.match">
                <p>Du swopst deinen Platz mit <strong><span v-if="swopCard.match.user1.restrictedUserInfo.email != null">{{swopCard.match.user1.restrictedUserInfo.name}}</span></strong></p>
                <form class="swop-partner-mail">
                  <div class="field has-addons">
                    <div class="control has-icons-left is-expanded">
                      <input class="input is-medium" type="mail" v-model="swopCard.match.user1.restrictedUserInfo.email">
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
          <p class="card-footer-item help">{{getStringDay(swopCard.createdAt) }}. {{getStringMonth(swopCard.createdAt)}} — {{getStringTime(swopCard.createdAt)}} Uhr</p>
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
      filtered: 'ALL',
      open: null,
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
          createdAt: '2. Januar 2016',
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
          createdAt: '4. Januar 2016',
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
          createdAt: '4. Januar 2016',
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
          createdAt: '4. Januar 2016',
          time: '18:34',
          match: true,
          open: false,
          status: 'pending'
        }
      ]
    }
  },
  created () {
    // console.log(db.User.me.username)
    M.getMySwopCards().then((swopCards) => {
      this.mySwopCards = Array.from(swopCards)
      console.log(db.User.me.username)
    })
    // Einzelne SwopCard hat folgende Einträge:
    // acl,
    // course,
    // createdAt,
    // createdBy,
    // id,
    // match,
    // myGroup,
    // searchedCourses,
    // searchedGroups,
    // status,
    // updatedAt,
    // version
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
        this.filtered = 'WAITING'
        console.log(this.filtered)
      } else if (this.filtered === 'Match') {
        this.filtered = 'PENDING' || 'ACCEPTED'
        console.log(this.filtered)
      } else {
        this.filtered = 'ALL'
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
    },
    toCommaSeparatedString: function (array) {
      for (var element in array) {
        element = element + ' '
      }
      return array.join()
    },
    setToArray: function (set) {
      console.log(Array.from(set))
      return Array.from(set)
    },
    getStringDay: function (date) {
      return date.getDay()
    },
    getStringMonth: function (date) {
      // string = string.substring(6, 7)
      date = date.getMonth()

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
    getStringTime: function (date) {
      return date.getHours() + ':' + date.getMinutes()
    },
    toggleOpen: function (swopCard) {
      if (this.open === null) {
        this.open = swopCard
      } else if (this.open !== swopCard) {
        this.open = swopCard
      } else {
        this.open = null
      }
    },
    logMal: function (event) {
      console.log(event)
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
@media only screen and (max-width: 375px) {
  .course-title {
    font-size: 1rem !important;
  }
}
.swop-status-icon img {
  max-height: 1.7rem;
}
</style>
