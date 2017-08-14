<template>
  <b-dropdown>
    <button class="button is-primary" slot="trigger">
        <span>Click me!</span>
        <b-icon icon="arrow_drop_down"></b-icon>
    </button>

    <b-dropdown-item>Action</b-dropdown-item>
    <b-dropdown-item>Another action</b-dropdown-item>
    <b-dropdown-item>Something else</b-dropdown-item>
</b-dropdown>

</template>

<script type="text/babel">
import db from 'baqend'

export default {
  name: 'modal-sample',
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

</style>
