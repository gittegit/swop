<template>
  <div class="swopcardBackend">
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
        id: null,
        name: null,
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
        var queryBuilder = db.Course.find()
        var conditionId = queryBuilder.equal('id', this.id)
        var conditionName = queryBuilder.equal('name', this.name)
        queryBuilder.or(conditionId, conditionName)
          .singleResult().then((course) => {
            console.log(course)
            if (!course) {
              console.log('false')
            } else {
              console.log('true')
            }
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
