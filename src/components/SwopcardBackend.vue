<template>

</template>

<script type="text/babel">
  import db from 'baqend'
  import vue from 'vue'

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
        console.log(this.username)
        db.Course.find().resultList((result) => {
          result.forEach((course) => {
            vue.log(course)
            this.course.push(course)
            console.log(this.course)
          })
        })
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
