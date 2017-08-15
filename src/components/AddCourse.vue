<template>
  <div class="CourseBackend">
    <div class="row">
      <div class="panel-heading">
        Neuen Kurs anlegen
      </div>
      <div class="panel-body">
        <label>Kurs-ID</label>
        <input type="text" v-model.trim="id" class="form-control" name="id" required>
        <label>Name</label>
        <input type="text" v-model.trim="name" class="form-control" name="name" required>
        <button class="btn btn-info" type="button" @click="addCourse" :disabled.prop="!isValid">Add Course</button>
      </div>
    </div>
  </div>
</template>

<script type="text/babel">
  import db from 'baqend'

  export default {
    name: 'addCourse',
    data () {
      return {
        id: '',
        name: '',
        error: null
      }
    },
    methods: {
      addCourse () {
        db.Course.create(this.id, this.name).then(() => {
          console.log('yay')
        }).catch(e => {
          this.error = e.message
        })
      }
    },
    computed: {
      isValid () {
        if (this.id.length > 1 && this.name.length > 1 && this.id) {
          var queryBuilder = db.Course.find()
          var conditionId = queryBuilder.equal('id', '/db/Course/' + this.id)
          var conditionName = queryBuilder.equal('name', this.name)
          queryBuilder.or(conditionId, conditionName)
            .resultList().then((course) => {
              console.log(course.length === 0)
              return (course.length === 0)
            })
        }
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
