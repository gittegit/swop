<template>
  <div id="app">
    <navigation v-show="isLoggedIn"></navigation>
    <transition
  name="custom-classes-transition"
  enter-active-class="animated fadeIn delay fast"
  leave-active-class="animated fadeOut fast">
    <router-view></router-view>
  </transition>
  </div>
</template>

<script>
import Navigation from 'components/Navigation.vue'
import db from 'baqend'
// import M from './Model/model.js'
// import LoginSample from 'components/LoginSample.vue'

export default {
  name: 'app',
  components: {
    Navigation
  },
  data () {
    return {
      isLoggedIn: db.User.me !== null
    }
  },
  created () {
  //   M.initUserData().then((result) => {
  //     console.log(result)
  //   })
  }
}
</script>

<style lang="scss">
/*
:'######::'##:::::'##::'#######::'########::
'##... ##: ##:'##: ##:'##.... ##: ##.... ##:
 ##:::..:: ##: ##: ##: ##:::: ##: ##:::: ##:
. ######:: ##: ##: ##: ##:::: ##: ########::
:..... ##: ##: ##: ##: ##:::: ##: ##.....:::
'##::: ##: ##: ##: ##: ##:::: ##: ##::::::::
. ######::. ###. ###::. #######:: ##::::::::
:......::::...::...::::.......:::..:::::::::

------------ TABLE OF CONTENTS -------------
01...................................Imports
02................................ Variablen
03................Bulma/Buefy Modifikationen
04..............Individuelle globale Klassen
05..............Component-spezifische Styles
05-01                              Dashboard
05-02                             ...


*/


/* -----------------------------------------
01.               IMPORTS
------------------------------------------*/
// Import von Bulma und Buefy-Styles
@import "~bulma";
@import "~buefy/src/scss/buefy";
@import "~bulma/sass/utilities/_all";

/* -----------------------------------------
02.               VARIABLEN
------------------------------------------*/


// Setup $colors to use as bulma classes (e.g. 'is-twitter')
$colors: (
    "white": ($white, $black),
    "black": ($black, $white),
    "light": ($light, $light-invert),
    "dark": ($dark, $dark-invert),
    "primary": ($primary, $primary-invert),
    "info": ($info, $info-invert),
    "success": ($success, $success-invert),
    "warning": ($warning, $warning-invert),
    "danger": ($danger, $danger-invert)
);
// Hauptfarben und deren Umkehrungen
$primary: #F39016;
$primary-invert: findColorInvert($primary);
$secondary: #0F75BC;
$secondary-invert: findColorInvert($secondary);
$lightgrey: #dbdbdb;

// Links
$link: $primary;
$link-invert: $primary-invert;
$link-focus-border: $primary;

/* -----------------------------------------
03.       BULMA/BUEFY MODIFIKATIONEN
------------------------------------------*/

body {
  font-family: 'Roboto', sans-serif;
}
a {
  color: $primary;
  transition: all 0.3s ease;
}
a:hover {
  color: rgba($primary, 0.8);
}
a.has-text-primary {
  color: $primary;
}
.has-text-primary {
  color: $primary !important;
}
a.has-text-primary:hover, a.has-text-primary:focus {
  color: rgba($primary, 0.8) !important;
}
a.has-text-secondary {
  color: $secondary;
}
a.has-text-secondary:hover {
  color: rgba($secondary, 0.8);
}
a.has-text-lightgrey {
  color: $lightgrey;
}
a.has-text-lightgrey:hover {
  color: rgba($lightgrey, 0.8);
}
.button {
  transition: all 0.3s ease;
}
.button.is-primary {
  background-color: $primary;
}
.button.is-primary:hover {
  background-color: rgba($primary, 0.8);
  border-color: rgba($primary,0.8);
}
.button.is-primary[disabled] {
  background-color: $primary;
}
.button.is-primary:focus, .button.is-primary.is-focused {
  box-shadow: 0 0 0.5em rgba($primary, 0.25);
}
.button.is-primary.is-outlined {
  border-color: $primary;
  color: $primary;
}
.button.is-primary.is-outlined:hover {
  background-color: $primary;
  border-color: $primary;
}
.button.is-secondary {
  background-color: $secondary;
  color: $white;
  border-color: $secondary;
}
.button.is-secondary:hover {
  background-color: rgba($secondary, 0.8);
  color: $white;
  border-color: rgba($secondary,0.8);
}
.button.is-outlined:active {
  border-color: $lightgrey;
}
.button.is-outlined:hover {
  color: $primary;
}
input:focus {
  border-color: $primary !important;
}
.main-content {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin-right: auto;
  margin-left: auto;
  overflow-y: scroll;
}
.main-content .container {
  padding-left: 1rem;
  padding-right: 1rem;
}
@media only screen and(min-width: 768px) {
  .main-content .container {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
}
.modal  {
  z-index: 9999;
}
.field:not(:last-child) {
  margin-bottom: 0.75rem;
}
form:not(:last-child) {
  margin-bottom: 2.25rem;
}
.has-addons, .is-grouped {
  margin-bottom: 0 !important;
}
.has-addons .button {
  margin-left: 1px !important;
  // border-top-right-radius: 0 !important;
  // border-bottom-right-radius: 0 !important;
}

/* Tabs */
.tabs.is-toggle li.is-active a {
  background-color: $secondary;
  border-color: $secondary;
}

/* -----------------------------------------
04.     INDIVIDUELLE GLOBALE KLASSEN
------------------------------------------*/

/* ---- Kasten ---- */
@media only screen and (min-width: 768px) {
.is-form {
  padding: 2.25rem;
  border: 1px solid $lightgrey;
  background-color: $white;
}
}
.is-form {
  padding: 2.25rem;
  background-color: $white;
}
/* Animations */
.delay {
  animation-delay: 0.2s !important;
}
.fast {
  animation-duration: 0.1s !important;
}
/* Struktur */
.spacer {
  height: 0.75rem;
}
.flex-center {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.flex-center-left {
  justify-content: space-between;
}
.margin-right {
  margin-right: 0.75rem;
}
.modal-background {
  background-color: rgba($primary, 0.8);
}
.message-header {
  background-color: $secondary;
}
/* ---- Main Content ---- */
.main-content {
  padding-top: 8rem;
  padding-bottom: 5rem;
}
.notices.is-top {
  top: 5rem !important;
}
/* ---- Navigation Sektion ---- */
.swoppy-img {
  height: 3rem;
  margin: 0.25rem 0;
}
@media only screen and (min-width: 768px) {
  .swoppy-img {
    height: 4rem;
    margin: 0.5rem 0;
  }
  .navbar-item, .navbar-link {
    padding: 0.75rem 1.5rem;
  }
  a.navbar-item.router-link-active:after {
    bottom: -1.25rem !important;
  }
}
.navigation {
  border-bottom: 1px;
  border-bottom: 1px solid $lightgrey;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  background-color: $white;
}
.navigation .container {
  padding: 0.2rem 0 !important;
}
.navbar, .logo a {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
}
.navbar-end {
  display: flex;
}
.navbar-item, .navbar-link {
  padding: 0.75rem;
}
a.navbar-item.is-active {
  background-color: transparent;
  color: $lightgrey;
}
a.navbar-item:hover {
  background-color: transparent;
  color: $secondary;
}
a.navbar-item.router-link-active:after {
  transition: all 0.3s ease;
  content: "•";
  display: block;
  text-align: center;
  border-radius: 50%;
  color: $secondary;
  position: absolute;
  bottom: -1rem;
  left: 0;
  right: 0;
  margin: 0 auto;
  font-size: 30px;
}
a.navbar-item .fa-cog {
  transform: scale(1.16);
}
.checkbox input[type=checkbox]:checked + .check{
  background: $primary url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3Cpath d='M.04.627L.146.52.43.804.323.91zm.177.177L.854.167.96.273.323.91z' fill='%23fff'/%3E%3C/svg%3E") no-repeat 50%;
  border-color: $primary;
  box-shadow: none !important;
}
.checkbox:hover input[type=checkbox] + .check {
  border-color: $primary !important;
}

/* -------- TYPOGRAFIE EDITS -------------*/
.main-content .title {
  margin-bottom: 1.25rem;
}
.main-content .title.is-6 {
  margin-bottom: 0.25rem;
}
.main-content .subtitle {
  font-size: 1rem;
  margin-bottom: 1.25rem;
}
.title:not(.is-spaced) + .subtitle {
  margin-top: 0;
}
.font-klein {
  font-size: 0.75rem;
}
.checkbox input[type=checkbox] + .check {
  min-width: 1.25em;
}

/* -----------------------------------------
05.      COMPONENT-SPEZIFISCHE STYLES
------------------------------------------*/

/* 05-01 - DASHBOARD ---------------------*/

.swop-card {
  transition: all 0.3s ease;
}
.swop-card:hover {
  transform: scale(1.03);
  box-shadow: 0px 10px 20px -10px rgba(0,0,0,0.3);
}
.swop-card .card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 0 1.5rem 1.5rem;
  cursor: pointer;
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
  background-color: $primary;
  color: $white;
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
  color: $primary;
  font-weight: bold;
}
.swop-card {
  margin-bottom: 1.5rem;
}
.swop-card:last-child {
  margin-bottom: 6.5rem;
}
.swop-accepted.swop-card {
  background-color: rgba($primary,0.8) !important;
}
.swop-accepted .card-header {
    background-color: $primary;
}
.swop-accepted.swop-card p, .swop-accepted.swop-card p strong, .swop-accepted.swop-card a {
  color: $white !important;
}
.swop-accepted .swop-status-icon {
  background-color: $white;
  color: $primary;
}
.swop-accepted .swop-change {
  color: rgba(0,0,0,0.3);
}
.swop-accepted .field .control input {
  background-color: rgba($primary, 0.8);
  border-color: $white;
  box-shadow: none !important;
  color: $white;
}
.swop-accepted .field .control .is-left i {
  color: $white !important;
}
.swop-accepted .field .control .icon {
  color: $white;
}
.swop-accepted .clipboard-button i {
  color: $primary !important;
}
.swop-accepted .card-footer {
  border-color: $white;
}
.swop-accepted .card-footer .card-footer-item {
  border-color: $white !important;
}
.card-footer .help {
  margin-top: 0 !important;
}
.floating-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 8999;
  margin-bottom: 0 !important;
  padding-bottom: 2rem;
  /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#ffffff+0,ffffff+100&0+0,1+50,1+100 */
background: -moz-linear-gradient(top, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,1) 100%); /* FF3.6-15 */
background: -webkit-linear-gradient(top, rgba(255,255,255,0) 0%,rgba(255,255,255,1) 50%,rgba(255,255,255,1) 100%); /* Chrome10-25,Safari5.1-6 */
background: linear-gradient(to bottom, rgba(255,255,255,0) 0%,rgba(255,255,255,1) 50%,rgba(255,255,255,1) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00ffffff', endColorstr='#ffffff',GradientType=0 ); /* IE6-9 */
}
@media only screen and (min-width: 768px) {
  .floating-footer {
    padding-bottom: 3rem;
  }
}
.refresh {
  margin-top: 3rem;
  margin-bottom: 3rem;
}
.tabs.is-toggle li:last-child a, .tabs.is-toggle li:first-child a {
  border-radius: 0 !important;
}
/* 05-02 - SWOP-DIALOG ------------------*/
.autocomplete input {
  border-bottom-right-radius: 0px !important;
  border-top-right-radius: 0px !important;
}
/* 05-03 - SPIELREGELN -------------------*/
img.float-right {
  height: 8rem;
  float: right;
  margin: -3rem 0rem 1rem 2rem;
  display: inline-block;
}

/* -----------------------------------------
06.          RESPONSIVE STYLING
------------------------------------------*/
@media only screen and(max-width: 450px) {
  /* -- General -- */
  .main-content {
    display: block !important;
    padding: 6rem 0;
  }
  .hide-mobile {
    display: none !important;
  }
  .is-form {
    padding: 1rem;
  }
  .task-description-title .title {
    text-align: center;
    margin-bottom: 2rem;
  }
  .title.is-3 {
    font-size: 1.5rem !important;
  }
  /* -- Login Screen --*/
  .button.forget-password {
    font-size: 0.75rem !important;
    padding: 1.05rem 0.5rem !important;
    margin-left: -1px !important;
  }
  /* -- Navigation -- */
  // .navbar-item i {
  //   font-size: 1.25rem !important;
  // }
  /* -- Dashboard --*/
  .neue-anfrage {
    font-size: 1rem !important;
  }
  .neue-anfrage i {
    font-size: 1rem !important;
  }
  .swop-card .card-header {
    padding: 0.75rem 0 0.75rem 0.75rem !important;
  }
  a.card-footer-item {
    font-size: 0.75rem !important;
  }
  a.card-footer-item i {
    font-size: 1rem !important;
  }
  .card-content p {
    font-size: 0.75rem !important;
  }
  .card-content {
    padding: 1rem !important;
  }
  .swop-status-icon {
    margin-right: 15px !important;
    width: 40px !important;
    height: 40px !important;
    min-width: 40px !important;
    flex-basis: 40px !important;
  }
  .swop-status-icon img {
    max-width: 60% !important;
  }
  /* --- Swop Dialog -- */
  .dropdown-item {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem !important;
  }
  .nav-dot {
    margin: 0 5% !important;
  }
  .description.is-5 {
      margin: 1.5rem 0 !important;
  }
  .nav-dots-container {
    margin: 1rem 0 !important;
    padding-bottom: 0 !important;
  }
  .flex-center {
    margin-top: 3rem;
  }
  .swop-uebersicht {
    margin: 2rem 0;
  }
  .swop-uebersicht strong {
    display: block;
    margin: 0.5rem 0;
  }
  /* -- Spielregeln -- */
  img.float-right {
    height: 4rem !important;
    margin: -1rem 1rem 1rem 0 !important;
  }

}
@media only screen and (min-width: 451px) {
  .hide-desktop {
    display: none !important;
  }
}
</style>
