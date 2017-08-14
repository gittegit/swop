<template>
<div class="swopcardBackend">
  <div class="row">
    <div class="panel-heading">
      Kurse
      <input type="text" v-model="search">
    </div>
    <div v-for="course in courses" class="panel-body">
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
        search: '',
        courses: []
      }
    },
    created () {
      this.username = db.User.me.username
      db.Course.find().resultList().then((result) => {
        var courseNames = []
        result.forEach((course) => {
          var singleCourse = []
          singleCourse['id'] = course.id
          singleCourse['name'] = course.name
          console.log(singleCourse)
          courseNames = singleCourse
        })
        console.log(courseNames)
        this.courses = courseNames
      })
      console.log(this.courses)
    },
    beforeRouteEnter (to, from, next) {
      if (!db.User.me) {
        next('signup')
      } else {
        next()
      }
    }
  }
</script>
