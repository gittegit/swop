<template>
<div class="container">

  <!-- Inhalt / Formulare -->
  <div class="columns is-centered">

    <div class="column is-9 is-narrow is-form">

      <h1 class="title is-3 has-text-centered">Dein swop</h1>

      <ul class="nav-dots-container">
        <li class="nav-dot" :class="{ 'done': firstStep}"></li>
        <li class="nav-dot" :class="{ 'done': secondStep}"></li>
        <li class="nav-dot" :class="{ 'done': thirdStep}"></li>
      </ul>

      <h4 class="description is-5 has-text-centered">Aus welcher Veranstaltung möchtest du <strong>heraus</strong> wechseln?</h4>

      <b-field>
        <b-autocomplete v-model="arrayExample.name" :data="filteredDataArray" placeholder="Deine aktuelle Veranstaltung" @select="option => arrayExample.selected = option">
        </b-autocomplete>
      </b-field>

      <!-- Untergruppe hinzufügen-Label (nur wenn noch keine hinzugefügt)-->
      <p v-if="!hasSubgroup" :class="{ 'help': true, 'add-group': true}" @click="addGroup">+ Untergruppe hinzufügen</p>

      <!-- Untergruppe hinzufügen-Input (nur bei Klick auf Label)-->
      <b-field>
        <b-input v-if="hasSubgroup" placeholder="Deine aktuelle Untergruppe"></b-input>
      </b-field>

      <!-- Button-Group Navigation -->
      <!--<p class="has-text-right flex-center"><a class="is-white font-klein margin-right">Abbrechen</a><a class="button is-primary">Weiter</a></p>
      -->
      <Chat>Abbrechen, Weiter</Chat>

    </div>
  </div>
</div>
</template>

<script type="text/babel">
import db from 'baqend'
import Chat from './Chat.vue'

export default {
  name: 'swop-dialog',
  data () {
    return {
      firstStep: true, // Stepweise Navigation erste Seite
      secondStep: false, // Stepweise Navigation erste Seite
      thirdStep: false, // Stepweise Navigation erste Seite
      hasSubgroup: false, // Untergruppe in aktueller Veranstaltung?
      msg: 'Welcome to Your Vue.js and Baqend App',
      isLoggedIn: null,
      // --- Daten für Autocomplete ---
      arrayExample: {
        data: [
          '64-144   Praktikum Datenbanken',
          '64-529   Vorlesung GDB',
          '64-017   Vorlesung Interaktionsdesign',
          '64-217   Vorlesung Interaktive Medien',
          'Backbone',
          'Ember',
          'jQuery',
          'Meteor',
          'Node.js',
          'Polymer',
          'React',
          'RxJS',
          'Vue.js'
        ],
        name: '',
        selected: null
      }
      // /--- Daten für Autocomplete ---
    }
  },

  methods: {
    addGroup () {
      this.hasSubgroup = true
    }
  },

  computed: {
    // --- Filterung der Autocomplete-Daten zur Verbessung der forgiveness des Autocomplete ---
    filteredDataArray () {
      return this.arrayExample.data.filter((option) => {
        return option
          .toString()
          .toLowerCase()
          .indexOf(this.arrayExample.name.toLowerCase()) >= 0
      })
    }
    // /--- Filterung der Autocomplete-Daten zur Verbessung der forgiveness des Autocomplete ---

  },
  components: {
    Chat
  },
  created () {
    console.log(db.User.me)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@media only screen and (min-width: 768px) {
    .is-form {
        border: 1px solid #efefef;
    }
}

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

.is-form {
    padding: 5%;
}

/* Stepwise navigation */
.nav-dots-container {
    text-align: center;
    padding-bottom: 5%;
}

.nav-dots-container .nav-dot {
    display: inline-block;
    text-align: center;
    width: 10px;
    height: 10px;
    background: #FBDDB8;
    border-radius: 100%;
    margin-left: 5%;
    margin-right: 5%;
    cursor: pointer;

}
.nav-dots-container .nav-dot.done {
    background: #F39016;
}
.nav-dots-container .nav-dot:hover {
    width: 12px;
    height: 12px;
    background: #F39016;
}

.add-group {
  cursor: pointer;
}
</style>
