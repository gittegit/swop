<template type="text/html" >
  <!-- Button-Group Navigation -->
  <p class="has-text-right flex-center"><a class="is-white font-klein margin-right">
    <slot name="backItem"></slot>
  </a><a class="button is-primary">
    <slot name="forwardItem"></slot>
  </a></p>


</template>

<style>

</style>

<script type="text/babel">
import db from 'baqend'

export default {
  name: 'button-group',
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
