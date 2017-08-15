<template>
  <div class="container">
      <!-- Inhalt / Formulare -->
      <div class="columns is-centered">

          <div class="column is-8 is-narrow">

            <!-- Beginn einer Karte / mit Swop-->
            <div v-for="swopCard in swopCards"  class="swop-card card" :class="{'swop-accepted':swopCard.match}">
              <!-- Kartenheader -->
              <header class="card-header" v-on:click="swopCard.open = !swopCard.open">
                <div class="swop-status">
                  <div class="swop-status-icon"><i class="fa fa-user-times" aria-hidden="true"></i></div>
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
              <transition name="expand">
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
                          <a class="button is-medium clipboard-button" :class="{'is-primary':!swopCard.match, 'is-white':swopCard.match,}"><i class="fa fa-clipboard" aria-hidden="true"></i></a>
                      </div>

                  </div>
                      <p class="help">Bitte nimm zügig Kontakt auf, {{swopCard.userName}} wartet sicher schon!</p>
                </form>
                </div>
                <div class="swop-no-match-info" v-else>
                  <p>Leider haben wir noch keinen Partner für dich gefunden. Bleib' aber ständig auf Empfang, denn das kann sich jederzeit ändern!</p>
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
                        </router-link></p>
                    </div>
                </div>
            </div>
        </footer>
</div>
</template>

<script type="text/babel">
import db from 'baqend'

export default {
  name: 'dashboard',
  data () {
    return {
      msg: 'Welcome to Your Vue.js and Baqend App',
      isLoggedIn: null,
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
          open: false
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
          open: false
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
          open: false
        }
      ]
    }
  },
  created () {
    console.log(db.User.me)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
