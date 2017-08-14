<template>
<div class="swopcardBackend">
  <div class="row">
    <div class="panel-heading">
      Kurse
    </div>
    <div class="panel-body">
      {{ course }}
    </div>
  </div>
</div>
</template>

<script type="text/babel">
  import db from 'baqend'

  export default {
    name: 'swopcardBackend',
    data () {
      return {
        username: null,
        course: []
      }
    },
    created () {
      this.username = db.User.me.username
      db.Course.find().resultList().then((result) => {
        var courseNames = []
        result.forEach((course) => {
          var singleCourse = [
            course.id,
            course.name
          ]
          courseNames.push(singleCourse)
        })
        this.course = courseNames
      })
      console.log(this.course)
    },
    methods: {
//      created () {
//        db.Course.find().resultList((result) => {
//          if (!result) {
//            db.log.debug('gitte:', {result: result})
//            console.log('leer')
//          } else {
//            db.log.debug('gitte:', {result: result})
//            console.log(result)
//            result.forEach((course) => {
//              this.course.push(course)
//              console.log(this.course)
//            })
//          }
//        })
//      },
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
