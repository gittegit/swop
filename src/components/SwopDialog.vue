<template>
<div class="main-content">
  <div class="container">

    <!-- Inhalt / Formulare -->
    <div class="columns is-centered">

      <div class="column is-9 is-narrow is-form">

        <h1 class="title is-3 has-text-centered">Dein swop</h1>

        <!-- –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->
        <!-- ––––––––––––––––––––– ANZEIGER STEPWISE-NAVIGATION ––––––––––––––––––––––––– -->
        <!-- –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->
        <ul class="nav-dots-container">
          <li class="nav-dot" :class="{ 'done': firstStepDone}"></li>
          <li class="nav-dot" :class="{ 'done': secondStepDone}"></li>
          <li class="nav-dot" :class="{ 'done': thirdStepDone}"></li>
        </ul>

        <!-- –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->
        <!-- –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->
        <!-- –––––––––––––––––––– STEP 1: AKTUELLE VERANSTALTUNG –––––––––––––––––––––––– -->
        <!-- –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->
        <!-- –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->

        <div v-if="firstStepActive && !newCourse">
          <h4 class="description is-5 has-text-centered">Aus welcher Veranstaltung möchtest Du <strong>heraus</strong> wechseln?</h4>
          </br></br>
          <!-- –––––––––––––––––––– AUTOCOMPLETE VERANSTALTUNG  ––––––––––––––––––––––––– -->

          <b-field class="has-addons" v-if="!hasCourseFromSet">
            <div class="control is-expanded is-grouped">
              <b-autocomplete  @click.native="createNewCourse" @keyup.native="createNewCourse" v-model="coursesObjectAutocomplete.name" :data="filteredDataArray" placeholder="Deine aktuelle Veranstaltung" @select="option => coursesObjectAutocomplete.selected = option"></b-autocomplete>
            </div>
              <div :class="{'control': true}">
                  <a :class="{'button': true, 'is-primary': true}" :disabled="!courseFromSelected" @click="setCourseTitleFrom"><i class="fa fa-check"></i></a>
              </div>
          </b-field>

          <div v-if="hasCourseFromSet">

            <div class="field has-addons">
              <p class="control is-expanded">
                <input :class="{'input': true, 'titleIsSet': true}" type="text" placeholder="Find a repository" v-model="courseTitleFrom" readonly>
              </p>
              <p class="control">
                <a class="button is-primary" @click="hasCourseFromSet=false">
                  <i class="fa fa-pencil-square-o"></i>
                </a>
              </p>
            </div>

          </div>

        </br>

          <!-- ––––––––––––––––––––––––– UNTERGRUPPE HINZ  –––––––––––––––––––––––––––––– -->
          <p v-if="!hasCourseGroupFrom" :class="{ 'help': true, 'add-group': true}" @click="addGroup">
            + Untergruppe hinzufügen
          </p>

          <div v-if="hasCourseGroupFrom && !hasGroupFromSet">
            <div class="field has-addons">
              <p class="control is-expanded">
                <input :class="{'input': true, 'group': true}" type="text" placeholder="Deine aktuelle Untergruppe" v-model="courseGroupFrom">
              </p>
              <p class="control">
                <a class="button is-secondary" @click="hasGroupFromSet=true">
                  <i class="fa fa-plus"></i>
                </a>
              </p>
            </div>
          </div>

            <div v-if="hasGroupFromSet">
              <div class="field has-addons">
                <p class="control is-expanded">
                  <input :class="{'input': true, 'groupIsSet': true}" type="text"  v-model="courseGroupFrom" readonly>
                </p>
                <p class="control">
                  <a class="button is-secondary" @click="hasGroupFromSet=false">
                    <i class="fa fa-pencil-square-o"></i>
                  </a>
                </p>
              </div>
            </div>
        </div>

        <!-- –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->
        <!-- –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->
        <!-- –––––––––––––––––––– STEP X: VERANSTALTUNG ERSTELLEN ––––––––––––––––––––––– -->
        <!-- –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->
        <!-- –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->
        <div v-if="firstStepActive && newCourse">
          <h4 class="description is-5 has-text-centered">Erstelle hier die Veranstaltung aus der Du <strong>heraus</strong> wechseln möchtest.</h4>

          <!-- courseFrom Input -->
          <b-field>
            <p class="control is-expanded">
              <b-input placeholder="Vollständiger Name Deiner aktuellen Veranstaltung" v-model="courseTitleFrom"></b-input>
            </p>
          </b-field>
          <b-field>
            <p class="control is-expanded">
              <b-input placeholder="ID Deiner aktuellen Veranstaltung" v-model="courseIdFrom"></b-input>
            </p>
          </b-field>
        </div>

        <!-- –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->
        <!-- –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->
        <!-- –––––––––––––––––––––– STEP 2: WUNSCHVERANSTALTUNG ––––––––––––––––––––––––– -->
        <!-- –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->
        <!-- –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->
        <div v-if="secondStepActive">
          <h4 class="description is-5 has-text-centered">In welche Veranstaltung möchtest Du <strong>hinein</strong> wechseln?</h4>
        </br></br>

          <!-- –––––––––––– FALL A: KEINE GRUPPE –> MEHRERE VERANSTALTUNGEN ––––––––––––– -->
          <div v-if="!canHaveCourseGroupTo">

            <div v-for="(courseTitleToItem, index) in courseTitleToArray" ref="crs" :key="courseTitleToItem.courseIndex">
              <a class="button is-danger is-outlined" @click="removeCourse(index)">
                <span>{{courseItemName(index)}}</span>
                <span class="icon is-small">
                  <i class="fa fa-times"></i>
                </span>
              </a>
            </div>

            <b-field grouped>

              <b-autocomplete v-model="coursesObjectAutocomplete.name" :data="filteredDataArray" placeholder="Deine Wunschveranstaltung" @select="option => coursesObjectAutocomplete.selected = option" expanded>
              </b-autocomplete>


              <p class="control">
                <a class="button" @click="addCourseTo()">
              <span class="icon is-small">
                <i class="fa fa-plus"></i>
              </span>
          </a>
              </p>
            </b-field>
          </div>

          <!-- –––––––– FALL B: GRUPPE –> KEINE VERANSTALTUNG & MEHRERE GRUPPEN ––––––––– -->
          <div v-if="canHaveCourseGroupTo">

              <p class="control is-expanded">
                <input :class="{'input': true, 'titleIsSet': true}" type="text" placeholder="Find a repository" v-model="courseTitleFrom" readonly>
              </p>

            </br>

            <div v-for="(courseGroupToItem, index) in courseGroupToArray" ref="crs" :key="courseGroupToItem.groupIndex">
              <a  class="button is-secondary" @click="removeGroup(index)">
                  <span>{{groupItemLabel(index)}}</span>
                  <span class="icon is-small">
                    <i class="fa fa-times"></i>
                  </span>
                </a>
            </div>

            <div class="field has-addons">
              <p class="control is-expanded">
                <input :class="{'input': true, 'group': true}" type="text" placeholder="Deine Wunsch-Untergruppe" v-model="groupAdding">
              </p>
              <p class="control">
                <a class="button is-secondary" @click="addGroup">
                  <i class="fa fa-plus"></i>
                </a>
              </p>
            </div>

          </div>
        </div>


        <!-- –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->
        <!-- –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->
        <!-- –––––––––––––––––––––––––– STEP 3: BESTÄTIGUNG ––––––––––––––––––––––––––––– -->
        <!-- –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->
        <!-- –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->
        <div v-if="thirdStepActive">
          <p class="has-text-centered"> Du möchtest von </br>
            </br>
            <strong>{{courseTitleFrom}}, Gruppe {{courseGroupFrom}}</strong></br>
            </br>
            nach </br>
            </br>
            <span v-for="courseTitleTo in courseTitleToArray">
              <strong>{{courseTitleTo.courseName}}</strong>
              <span v-if="courseTitleTo.courseIndex !== (-1 + courseTitleToArray.length)"> oder</span></br>
            </span>
            <span v-for="courseGroupTo in courseGroupToArray" v-if="courseGroupTo.groupIndex !== 0">
              <strong>
                Gruppe {{courseGroupTo.groupName}}
              </strong>
                <span v-if="courseGroupTo.groupIndex !== (-1 + courseGroupToArray.length)"> oder
              </span>
            </span>
            </br></br>
            wechseln?
          </p>
        </div>

      </br></br>
        <!-- ––––––––––––––––––––––– BUTTON GROUP (NAVIGATION) –––––––––––––––––––––––––– -->
        <button-group>
          <div slot="backItem">
            <router-link v-if="firstStepActive" @click="back" :to="backLink">{{backItem}}</router-link>
            <div v-if="!firstStepActive" @click="back">{{backItem}}</div>
          </div>
          <div slot="forwardItem" @click="forward">{{forwardItem}}</div>
        </button-group>

      </div>

    </div>
  </div>
</div>
</div>
</template>

<script type="text/babel">
import db from 'baqend'
import ButtonGroup from './molecules/ButtonGroup.vue'
import M from '../Model/model.js'

export default {
  name: 'swop-dialog',
  data () {
    return {
      // –––––––––––––––––––––––––––––– NAVIGATION NAVDOTS ––––––––––––––––––––––––––––––––
      firstStepDone: true,
      secondStepDone: false,
      thirdStepDone: false,
      // ––––––––––––––––––––––––––– NAVIGATION FORMULARINHALT ––––––––––––––––––––––––––––
      firstStepActive: true,
      secondStepActive: false,
      thirdStepActive: false,
      // –––––––––––––––––––––––––––– NAVIGATION BUTTONGROUP ––––––––––––––––––––––––––––––
      forwardItem: 'Weiter',
      backItem: 'Abbrechen',
      backLink: {
        name: 'dashboard'
      },
      // –––––––––––––––––––––––––––– KURSTERSTELLUNGS-MODAL ––––––––––––––––––––––––––––––
      newCourse: false,
      // ––––––––––––––––––––––––––––– SWOPCARD-ATTRIBUTE –––––––––––––––––––––––––––––––––
      courseTitleFrom: '', // Titel der aktuellen Veranstaltung
      courseIdFrom: '', // ID der aktuellen Veranstaltung
      courseTitleTo: '', // Titel der gewünschten Veranstaltung
      courseIdTo: '', // ID der gewünschten Veranstaltung
      courseGroupFrom: '', // Untergruppe der aktuellen Veranstaltung
      courseGroupTo: '', // Zwischenspeichern der Untergruppe der gewünschten Veranstaltung (gesamte Liste in courseGroupToArray)
      subgroupItem: '', // Zwischenspeichern der Subgruppe mit Präfix 'Gruppe:' für Anzeige in Button
      courseGroupToArray: [], // Array aller courseGroupTo-Strings
      courseTitleToArray: [], // Array aller courseTitleTo-Strings
      searchedGroups: [],
      searchedCourses: [],
      // –––––––––––––––– HILFSATTRIBUTE WECHSEL GRUPPE ODER VERANSTALTUNG –––––––––––––––––
      hasCourseGroupFrom: false, // itital
      hasCourseGroupTo: false, // initial
      canHaveCourseGroupTo: false, // initial
      groupCounter: 0,
      courseCounter: 0,
      groupAdding: '',
      // –––––––––––––––––––––––––––––– AUTOCOMPLETE-DATEN ––––––––––––––––––––––––––––––––––
      courses: [], // wird bei created () mit gesamter Kurslise aus DB befüllt
      courseid: '', // Zwischenspeicher Kurs-Id (nach Umwandlung aus Directory zu String)
      coursesArray: [], // Array aller Kurse, beschränkt auf courseItem (für Autocomplete) und courseid (zum Matchen)
      coursesObjectAutocomplete: {
        data: [
          ''
        ],
        name: '',
        selected: null
      },
      courseFromSelected: false,
      hasCourseFromSet: false,
      hasGroupFromSet: false,
      search: '',
      selected: null,
      msg: 'Welcome to Your Vue.js and Baqend App',
      isLoggedIn: null
    }
  },

  methods: {
    // –––––––––––––––––––––––––– NAVIGATION ÜBER BUTTONGROUP –––––––––––––––––––––––––––––
    forward () {
      if (this.firstStepDone && !this.secondStepDone && !this.newCourse) {
        // Nav-Dots setzen
        this.firstStepActive = false
        this.secondStepActive = true
        // Formular setzen
        this.secondStepDone = true
        // Zurück-Button setzen
        this.backItem = 'Zurück'
        // Eingaben speichern
        this.courseTitleFrom = this.coursesObjectAutocomplete.name
        this.createCoursesObjectAutocomplete = ''
        if (!this.newCourse) {
          this.courseTitleFrom = this.coursesObjectAutocomplete.name
        }
        if (!this.canHaveCourseGroupTo) {
          this.coursesObjectAutocomplete.name = this.courseTitleTo
        }
        // this.courseGroupToArray.push({
        //  groupName: this.courseGroupTo,
        //  groupIndex: this.groupCounter++
        // })
      } else if (this.firstStepDone && this.secondStepDone && !this.thirdStepDone) {
        // Nav-Dots setzen
        this.secondStepActive = false
        this.secondStepDone
        this.thirdStepActive = true
        // Formular setzen
        this.thirdStepDone = true
        this.courseTitleTo = this.coursesObjectAutocomplete.name
        this.coursesObjectAutocomplete.name = this.courseTitleTo
      } else if (this.firstStepDone && this.secondStepDone && this.thirdStepDone) {
        if (this.hasCourseGroupFrom) {
          this.createSearchedGroups()
          this.createSearchedCoursesSingle()
          console.log('Gruppen-SwopCard wird erstellt…')
          // M.createSwopCard(this.searchedCourses, this.searchedGroups, this.courseTitleFrom.substring(0, this.courseTitleFrom.indexOf(' –')), this.courseGroupFrom)
        } else if (!this.hasCourseGroupFrom) {
          console.log('Veranstaltungs-SwopCard wird erstellt…')
          this.createSearchedCourses()
          // M.createSwopCard(this.searchedCourses, this.searchedGroups, this.courseTitleFrom.substring(0, this.courseTitleFrom.indexOf(' –')), this.courseGroupFrom)
        }
      } else if (this.newCourse) { // 'Neuen Kurs erstellen' nach Kurserstellungs-Dialog
        M.createCourse(this.courseTitleFrom, this.courseIdFrom) // Erstellung des neuen Kurses
        M.getAllCourses() // Neuladen aller Kurse inklusive des neuen
        this.backItem = 'Abbrechen' // Anpassen der Buttongroup
        this.forwardItem = 'Weiter' // Anpassen der Buttongroup
        this.newCourse = false // schließen des Formulars/Dialogs
        this.coursesObjectAutocomplete.name = this.courseIdFrom.concat(' – ').concat(this.courseTitleFrom)
      }
    },
    back () {
      if (this.firstStepActive) {
        this.backLink.name = 'dashboard'
      } else if (this.secondStepActive) {
        // Input setzen
        this.courseTitleTo = this.coursesObjectAutocomplete.name
        this.coursesObjectAutocomplete.name = this.courseTitleFrom
        // Nav-Dots setzen
        this.firstStepActive = true
        this.secondStepActive = false
        // Formular setzen
        this.secondStepDone = false
        // Zurück-Button setzen
        this.backItem = 'Abbrechen'
      } else if (this.thirdStepActive) {
        // Nav-Dots setzen
        this.secondStepActive = true
        this.thirdStepActive = false
        // Formular setzen
        this.thirdStepDone = false
      }
    },
    // ––––––––––––––––––––––––––– AUTOCOMPLETE-DATEN UMWANDELN ––––––––––––––––––––––––––––––
    courseItemName (index) {
      return this.courseTitleToArray[index].courseName
    },
    groupItemLabel (index) {
      return this.courseGroupToArray[index].groupItemLabel
    },
    createNewCourse () {
      if (this.coursesObjectAutocomplete.selected !== null) {
        this.courseFromSelected = true
        if (this.coursesObjectAutocomplete.name === 'Deine Veranstaltung ist nicht dabei?') {
          this.coursesObjectAutocomplete.selected = this.coursesObjectAutocomplete.name
          this.addCourse()
        }
      }
    },
    getCourseId (courseid) { // Hilfsfunktion: reine ID aus ID-Directory aus DB
      courseid = courseid.substring(11)
      return courseid
    },
    // Befüllen des Daten-Objektes mit courseItem für Autocomplete
    createCoursesObjectAutocomplete () {
      for (var course in this.coursesArray) {
        this.coursesObjectAutocomplete.data.push(this.coursesArray[course].courseItem)
      }
      this.coursesObjectAutocomplete.data.push('Deine Veranstaltung ist nicht dabei?')
    },
    // Befüllen des Arrays mit courseItem und courseid
    createCoursesArray () {
      for (var course in this.courses) {
        this.courseid = this.getCourseId(this.courses[course].id)
        this.courseItem = this.courseid.concat(' – ').concat(this.courses[course].name)
        this.coursesArray.push({
          courseItem: this.courseItem,
          courseid: this.courseid
        })
      }
      this.createCoursesObjectAutocomplete()
    },
    setCourseTitleFrom () {
      this.courseTitleFrom = this.coursesObjectAutocomplete.name
      this.hasCourseFromSet = true
    },
    // –––––––––––––––––––––––––––– KURSTERSTELLUNGS-MODAL ––––––––––––––––––––––––––––––
    addCourse () {
      this.newCourse = true
      this.forwardItem = 'Veranstaltung erstellen'
      this.backItem = 'Zurück'
    },
    // –––––––––––––––––––––––––– UNTERGRUPPE(N) HINZUFÜGEN ––––––––––––––––––––––––––––––
    addGroup () {
      if (this.firstStepActive) {
        this.hasCourseGroupFrom = true
        this.canHaveCourseGroupTo = true
      } else if (this.secondStepActive) {
        this.courseGroupToArray.push({
          groupName: this.groupAdding,
          groupItemLabel: 'Gruppe: ' + this.groupAdding,
          groupIndex: this.groupCounter++
        })
        this.groupAdding = ''
        this.canHaveCourseGroupTo = true
        this.hasCourseGroupTo = true
      }
    },
    // –––––––––––––––––––––––– WUNSCHVERANSTALTUNG HINZUFÜGEN –––––––––––––––––––––––––––
    addCourseTo () {
      var lastCourseName = this.coursesObjectAutocomplete.name
      this.coursesObjectAutocomplete.name = ''
      this.courseTitleToArray.push({
        courseName: lastCourseName,
        courseIndex: this.courseCounter++
      })
    },
    courseToIsAdded (courseCounter) {
      return true
    },
    // ––––––––––––––––––––––––––– UNTERGRUPPE(N) ENTFERNEN –––––––––––––––––––––––––––––––
    removeGroup (index) {
      if (this.firstStepActive) {
        this.hasCourseGroupFrom = false
        this.canHaveCourseGroupTo = false
      } else if (this.secondStepActive) {
        this.courseGroupToArray.splice(index, 1)
      }
    },
    // –––––––––––––––––––––––– WUNSCHVERANSTALTUNG ENTFERNEN –––––––––––––––––––––––––––––
    removeCourse (index) {
      this.courseTitleToArray.splice(index, 1)
      this.courseCounter = (-1) + this.courseCounter
      console.log(index)
      console.log(this.courseCounter)
    },
    // –––––––––––––– ERSTELLUNG ÜBERGABEPARAMETER FÜR SWOPCARD-ERSTELLUNG ––––––––––––––––
    createSearchedGroups () {
      for (var i = 1; i < this.courseGroupToArray.length; i++) {
        this.searchedGroups.push(this.courseGroupToArray[i].groupName)
      }
    },
    createSearchedCourses () {
      for (var i = 0; i < this.courseTitleToArray.length; i++) {
        this.searchedCourses.push(this.courseTitleToArray[i].courseName.substring(0, this.courseTitleToArray[i].courseName.indexOf(' –')))
      }
    },
    createSearchedCoursesSingle () {
      this.searchedCourses = new Array(this.courseTitleFrom.substring(0, this.courseTitleFrom.indexOf(' –')))
    }
  },

  computed: {
    // --- forgiving formatting der Daten für das Autocomplete  ---
    filteredDataArray () {
      return this.coursesObjectAutocomplete.data.filter((option) => {
        if (option === 'Deine Veranstaltung ist nicht dabei?') { // Option für denn Fall, dass die gewüsnchte Veranstaltung noch nicht in der Liste ist
          option = this.coursesObjectAutocomplete.name // damit steht Deine Veranstaltung ist nicht dabei?' immer als Option zur Verfügung
        }
        return option
        .toString()
        .toLowerCase()
        .indexOf(this.coursesObjectAutocomplete.name.toLowerCase()) >= 0
      })
    }
  },
  components: {
    ButtonGroup
  },
  created () {
    db.Course.find()
    M.getAllCourses() // Initiales Laden aller Kurse aus der DB zur Suche
      .then((courses) => {
        this.courses = courses
        this.createCoursesArray()
      })
      //  .catch((err) => {
      // Fehlerbehandlung
      // })
    console.log(db.User.me.username)
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

.dropdown-content {
  background: #F7154C !important;
  color: #F7154C !important;
  font-weight: bolder !important;
}

.titleIsSet {
    background: #F39016;
    border: #F39016;
    color: #ffffff;
}

.groupIsSet {
    background: #0F75BC;
    border: #0F75BC;
    color: #ffffff;
}

.group:focus {
border-color: #0F75BC !important;
}
</style>
