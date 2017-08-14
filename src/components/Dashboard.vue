<template>
  <div class="container">

      <!-- Inhalt / Formulare -->
      <div class="columns is-centered">

          <div class="column is-9 is-narrow">

            <!-- Beginn einer Karte / mit Swop-->
            <button class="button block">Toggle</button>
            <b-message title="Default" :active.sync="isActive">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce id fermentum quam. Proin sagittis, nibh id hendrerit imperdiet, elit sapien laoreet elit
            </b-message>

            <div class="swop-card card swop-accepted">
              <!-- Kartenheader -->
              <header class="card-header">
                <div class="swop-status">
                  <div class="swop-status-icon"><i class="fa fa-user-times" aria-hidden="true"></i></div>
                  <div class="swop-status-courses">
                    <!-- Swop Kurse -->
                    <div class="swop-status-course-from">
                      <p class="help"><span class="swop-change">Swop</span> <span class="swop-course-id">64-012</span> — <span class="swop-course-group">Gruppe E</span> </p>
                      <p class="is-title is-size-5 course-title">Übungen zu Softwareentwicklung II</p>
                    </div>

                    <div class="swop-status-course-from">
                      <p class="help"><span class="swop-change">Gegen</span> <span class="swop-course-id">64-012</span> — <span class="swop-course-group">Gruppe F</span> </p>
                      <p class="is-title is-size-5 course-title">Übungen zu Softwareentwicklung II</p>
                    </div>
                  </div>
                </div>
                <!-- Icon -->
                <a class="card-header-icon">
                  <span class="icon">
                    <i class="fa fa-angle-down"></i>
                  </span>
                </a>
              </header>

              <!-- Karteninhalt - muss aufgetogglet werrden -->
              <div class="card-content">
                <div class="content">
                  <p>Du swopst deinen Platz mit <strong>Marco</strong></p>
                  <form class="swop-partner-mail">
                  <div class="field has-addons">
                      <div class="control has-icons-left is-expanded">
                          <input class="input is-medium" type="mail" value="marco@uni.rocks">
                          <span class="icon is-small is-left">
                          <i class="fa fa-envelope"></i>
                          </span>
                      </div>

                      <div class="control">
                          <a class="button is-white is-medium clipboard-button"><i class="fa fa-clipboard" aria-hidden="true"></i></a>
                      </div>

                  </div>
                        <p class="help">Bitte nimm zügig Kontakt auf, Marco wartet sicher schon!</p>
                </form>

                </div>
              </div>
              <footer class="card-footer">
                <p class="card-footer-item help">1. Januar 2016 — 20:34 Uhr</p>
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
                    <a class="button is-primary has-icon is-medium">
                      <span class="icon">
                      <i class="fa fa-plus" aria-hidden="true"></i>
                    </span>
                    <span>Neue Anfrage</span>
                    </a></p>
              </div>
          </div>
      </div>
  </footer>
</div>

</template>

<script type="text/babel">
import Vue from 'vue'
import db from 'baqend'
import Buefy from 'buefy'
Vue.component(Buefy.Message.name, Buefy.Message)

export default {
  name: 'dashboard',
  data () {
    return {
      msg: 'Welcome to Your Vue.js and Baqend App',
      isLoggedIn: null
    }
  },
  created () {
    console.log(db.User.me)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.swop-card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 0 1.5rem 1.5rem;
}
.swop-status {
  display: flex;
  justify-content: left;
  align-items: center;
}
.swop-status-icon {
  margin-right: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-basis: 50px;
  width: 50px !important;
  height: 50px !important;
  min-width: 50px;
  border-radius: 50%;
  background-color: #F39016;
  color: #ffffff;
}
.swop-status-switch-icons p i {
}
.swop-status-switch-icons p i {
  width: 30% !important;
}
.swop-course-group {
  font-size: 0.75rem !important;
}
.swop-status-course-from {
  margin-bottom: 0.75rem;
}
.swop-change {
  color: #F39016;
  font-weight: bold;
}
.swop-card {
  margin-bottom: 1.5rem;
}
</style>
