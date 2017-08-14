<template>
  <div id="app">
    <!--<navigation></navigation> -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="scss">
@import "~bulma/sass/utilities/_all";
/* --- V A R I A B L E N --- */
$primary: #F39016 !important;

  [v-cloak] {
    display: none;
  }

  #app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style>
