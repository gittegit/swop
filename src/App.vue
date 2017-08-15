<template>
  <div id="app">
    <navigation></navigation>
    <router-view></router-view>
  </div>
</template>

<script>
import Navigation from 'components/Navigation.vue'
export default {
  name: 'app',
  components: {
    Navigation
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
a.has-text-primary:hover {
  color: rgba($primary, 0.8);
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
}
.button.is-secondary {
  background-color: $secondary;
  color: $white;
}
.button.is-secondary:hover {
  background-color: rgba($secondary, 0.8);
  color: $white;
}
input:focus {
  border-color: $primary !important;
}

/* Tabs */
.tabs.is-toggle li.is-active a {
  background-color: $secondary;
  border-color: $secondary;
}

/* -----------------------------------------
04.     INDIVIDUELLE GLOBALE KLASSEN
------------------------------------------*/

/* ---- Main Content ---- */
.main-content {
  padding-top: 8rem;
  padding-bottom: 5rem;
}
/* ---- Navigation Sektion ---- */
.swoppy-img {
  height: 4rem;
  margin-right: 0.5rem;
}

.navigation {
  border-bottom: 1px;
  border-bottom: 1px solid $lightgrey;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 8999;
  background-color: $white;
}
.navigation .container {
  padding: 0.5rem 0 !important;
}
.navbar-end {
  display: flex;
}
.navbar-item, .navbar-link {
  padding: 1.5rem 1rem;
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
  bottom: -0.75rem;
  left: 0;
  right: 0;
  margin: 0 auto;
  font-size: 30px;
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
.floating-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 8999;
  margin-bottom: 0 !important;
  padding-bottom: 3rem;
  /* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#ffffff+0,ffffff+100&0+0,1+50,1+100 */
background: -moz-linear-gradient(top, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 50%, rgba(255,255,255,1) 100%); /* FF3.6-15 */
background: -webkit-linear-gradient(top, rgba(255,255,255,0) 0%,rgba(255,255,255,1) 50%,rgba(255,255,255,1) 100%); /* Chrome10-25,Safari5.1-6 */
background: linear-gradient(to bottom, rgba(255,255,255,0) 0%,rgba(255,255,255,1) 50%,rgba(255,255,255,1) 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#00ffffff', endColorstr='#ffffff',GradientType=0 ); /* IE6-9 */
}
</style>
