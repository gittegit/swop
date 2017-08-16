<template>

</template>

<script type="text/babel">
import db from 'baqend'

export default {
  name: 'login-sample',
  data () {
    return {
      isLoggedIn: false
    }
  },
  created () {
    this.isLoggedIn = false
    console.log(db.user.me)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
