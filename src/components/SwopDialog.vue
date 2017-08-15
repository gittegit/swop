<template>
<div class="container">

  <!-- Inhalt / Formulare -->
  <div class="columns is-centered">

    <div class="column is-9 is-narrow is-form">

      <h1 class="title is-3 has-text-centered">Dein swop</h1>

      <!-- Stepwise-Naviagtion / Fortschrittsanzeige -->
      <ul class="nav-dots-container">
        <li class="nav-dot" :class="{ 'done': firstStepDone}"></li>
        <li class="nav-dot" :class="{ 'done': secondStepDone}"></li>
        <li class="nav-dot" :class="{ 'done': thirdStepDone}"></li>
      </ul>
      <!-- / Stepwise-Naviagtion / Fortschrittsanzeige -->

      <!-- Step 1 -->
      <div v-if="firstStepActive">
         <h4 class="description is-5 has-text-centered">Aus welcher Veranstaltung möchtest du <strong>heraus</strong> wechseln?</h4>

        <b-field>
          <b-autocomplete v-model="arrayExample.name" :data="filteredDataArray" placeholder="Deine aktuelle Veranstaltung" @select="option => arrayExample.selected = option">
          </b-autocomplete>
        </b-field>

        <!-- Untergruppe hinzufügen-Label (nur wenn noch keine hinzugefügt)-->
        <p v-if="!hasSubgroup" :class="{ 'help': true, 'add-group': true}" @click="addGroup">+ Untergruppe hinzufügen</p>

        <!-- Untergruppe hinzufügen-Input (nur bei Klick auf Label)-->
        <div v-if="hasSubgroup">
          <b-field>
            <b-input placeholder="Deine aktuelle Untergruppe"></b-input>
          </b-field>
          <p :class="{ 'help': true, 'add-group': true}" @click="removeGroup">- Untergruppe entferen</p>
        </div>
      </div>
      <!-- / Step 1 -->


        <!-- Button-Group Navigation -->
        <button-group>
          <div slot="backItem"><router-link :to="backLink">{{backItem}}</router-link></router-link></div>
          <div slot="forwardItem" @click="forward">Weiter</div>
        </button-group>

      </div>
    </div>
  </div>
</template>

<script type="text/babel">
import db from 'baqend'
import ButtonGroup from './molecules/ButtonGroup.vue'

export default {
  name: 'swop-dialog',
  data () {
    return {
      firstStepDone: true, // Stepweise-Anzeiger erste Seite
      secondStepDone: false, // Stepweise-Anzeiger erste Seite
      thirdStepDone: false, // Stepweise-Anzeiger erste Seite
      hasSubgroup: false, // Untergruppe in aktueller Veranstaltung?
      firstStepActive: true, // Inhalt Step 1
      msg: 'Welcome to Your Vue.js and Baqend App',
      isLoggedIn: null,
      backItem: 'Abbrechen', // Beschriftung für zurück-Button in Button-Group (inital: Abbrechen)
      backLink: {
        name: 'dashboard' // Link von zurück-Button in Button-Group (initial: Dashboard)
      },
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
    },
    removeGroup () {
      this.hasSubgroup = false
    },
    forward () {
      console.log('hi')
      if (!this.secondStepDone) {
        this.secondStepDone = true
      } else if (!this.thirdStepDone && this.secondStepDone) {
        this.thirdStepDone = true
      }
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
    ButtonGroup
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
