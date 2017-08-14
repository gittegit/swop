<template>

</template>

<script type="text/babel">
  import db from 'baqend'

  export default {
    data () {
      return {
        username: null
      }
    },
    methods: {
      created () {
        this.username = db.User.me.username
        this.course
      },
      beforeRouteEnter (to, from, next) {
        if (!db.User.me) {
          next('signup')
        } else {
          next()
        }
      }
    }
  }
</script>
