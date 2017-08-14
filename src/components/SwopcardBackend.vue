<template>
<div class="swopcardBackend">
  <div class="row">
    <div class="panel-heading">
      Kurse
      <input type="text" v-model="search">
    </div>
    <div v-for="course in filteredItems" class="panel-body">
      {{ courses }} <br />
      {{ course.id }}<br />
      {{ course.name }}
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
      db.Course.find()
          .ascending('name')
          .resultList().then((result) => {
            this.courses = result
            console.log(this.courses)
          })
    },
    computed: {
      filteredItems () {
        return this.courses.filter(course => {
          return course.id.indexOf(this.search.toLowerCase()) > -1
        })
      }
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
