<template type="text/html" >
  <!-- Button-Group Navigation -->
  <p class="has-text-right flex-center"><a class="is-white font-klein margin-right">
    <slot></slot>
  </a><a class="button is-primary">
    <slot></slot>
  </a></p>


  <!--<div class="chat container">
    <div class="row">
      <div class="col-xs-10 col-xs-offset-1">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3 class="panel-title">{{ message.name }}</h3>
          </div>
          <div class="panel-body">
            <div class="row">
              <div class="col-xs-1">
                <img :src="imageUrl">
              </div>
              <div class="col-xs-11 text-left">
                {{ message.text }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>-->
</template>

<style>

</style>

<script type="text/babel">
import db from 'baqend'

export default {
  name: 'chat',
  data () {
    return {
      message: {}
    }
  },
  beforeRouteEnter (to, from, next) {
    db.Message.load(to.params.id).then((message) => {
      next(vm => {
        vm.message = message
      })
    })
  },
  computed: {
    imageUrl () {
      if (this.message.face) {
        return new db.File(this.message.face).url
      }
    }
  }
}
</script>

<style scoped>
img { width: 100% }
/* Button-Group */
.font-klein {
  font-size: 0.75rem !important;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.margin-right {
  margin-right: 0.75rem;
}
</style>
