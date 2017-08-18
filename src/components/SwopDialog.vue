<template>
<div class="main-content">
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

        <!-- courseFrom Step 1  -->
        <!-- ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––- -->
        <!-- STEP 1: AKTUELLE VERANSTALTUNG -->
        <div v-if="firstStepActive && !newCourse">
          <h4 class="description is-5 has-text-centered">Aus welcher Veranstaltung möchtest Du <strong>heraus</strong> wechseln?</h4>

          <!-- courseFrom Autocomplete  -->
          <b-field>
            <b-autocomplete @click.native="createNewCourse" @keyup.native="createNewCourse" v-model="coursesObjectAutocomplete.name" :data="filteredDataArray" placeholder="Deine aktuelle Veranstaltung" @select="option => coursesObjectAutocomplete.selected = option">
            </b-autocomplete>
          </b-field>

          <!-- Untergruppe hinzufügen-Label (nur wenn noch keine hinzugefügt)-->
          <p v-if="!hasCourseGroupFrom" :class="{ 'help': true, 'add-group': true}" @click="addGroup">
            + Untergruppe hinzufügen
          </p>

          <!-- courseGroupFrom Untergruppe hinzufügen-Input courseGroupFrom (nur bei Klick auf Label)-->
          <div v-if="hasCourseGroupFrom">
            <b-field grouped>
              <b-input v-model="courseGroupFrom" placeholder="Deine aktuelle Untergruppe" expanded></b-input>
              <p class="control">
                <a class="button" @click="removeGroup">
                <span class="icon is-small">
                  <i class="fa fa-trash-o"></i>
                </span>
            </a>
              </p>
            </b-field>
          </div>
        </div>
        <!-- / Step 1 -->

        <!-- Step 1.2 Course erstellen -->
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
        <!-- / Step 1.2 Course erstellen -->


        <!-- Step 2 -->
        <div v-if="secondStepActive">
          <h4 class="description is-5 has-text-centered">In welche Veranstaltung möchtest Du <strong>hinein</strong> wechseln?</h4>

          <div v-if="!canHaveCourseGroupTo">

          <div v-for="(courseTitleToItem, index) in courseTitleToArray"  ref="crs" :key="courseTitleToItem.courseIndex">
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
              <a class="button"  @click="addCourseTo()">
              <span class="icon is-small">
                <i class="fa fa-plus"></i>
              </span>
          </a>
            </p>
          </b-field>
        </div>

          <!-- courseGroupFrom Untergruppe hinzufügen-Input courseGroupFrom (nur bei Klick auf Label)-->
          <div v-if="canHaveCourseGroupTo">


            <b-field>
              <b-input v-model="coursesObjectAutocomplete.name" :disabled="true">
              </b-input>
            </b-field>

            <div v-for="(courseGroupToItem, index) in courseGroupToArray"  ref="crs" :key="courseGroupToItem.groupIndex">
              <a v-if="index > 0" class="button is-danger is-outlined" @click="removeGroup(index)">
                  <span>{{groupItemLabel(index)}}</span>
                  <span class="icon is-small">
                    <i class="fa fa-times"></i>
                  </span>
                </a>
            </div>

            <b-field grouped>
              <b-input v-model="groupAdding" placeholder="Deine Wunsch-Untergruppe" expanded></b-input>
              <p class="control">
                <a class="button"  @click="addGroup">
                <span class="icon is-small">
                  <i class="fa fa-plus"></i>
                </span>
            </a>
              </p>
            </b-field>


            <!-- <b-field grouped>

                <b-autocomplete v-model="coursesObjectAutocomplete.name" :data="filteredDataArray" placeholder="Deine Wunschveranstaltung" @select="option => coursesObjectAutocomplete.selected = option" expanded>
                </b-autocomplete>


              <p class="control">
                <a class="button"  @click="addCourseTo()">
                <span class="icon is-small">
                  <i class="fa fa-plus"></i>
                </span>
            </a>
              </p>
            </b-field>
-->


          <!-- courseGroupToArray Untergruppe hinzufügen-Input-->
          <!--<div>
            <b-field grouped>
              <b-input v-model="courseGroupToArray[index].groupName" placeholder="Deine Wunsch-Untergruppe" expanded></b-input>
              <p class="control">
                <a class="button"  @click="removeGroup(index)">
                <span class="icon is-small">
                  <i class="fa fa-trash-o"></i>
                </span>
            </a>
              </p>
            </b-field>
          </div>-->

          </div>
          <!-- Untergruppe hinzufügen-Label (nur wenn noch keine hinzugefügt)-->
            <!--<p :class="{ 'help': true, 'add-group': true}" @click="addGroup">
            + Untergruppe hinzufügen
          </p>
          -->
        </div>


        <!-- / Step 2 -->

        <!-- Step 3 -->
        <!-- TO DO -->
        <!-- / Step 3 -->


        <!-- Button-Group Navigation -->
        <button-group>
          <div slot="backItem">
            <router-link v-if="firstStepActive" @click="back" :to="backLink">{{backItem}}</router-link>
            <div v-if="!firstStepActive" @click="back">{{backItem}}</div>
          </div>
          <div slot="forwardItem" @click="forward">{{forwardItem}}</div>
        </button-group>
        <!-- / Button-Group Navigation -->
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
      firstStepDone: true, // Stepweise-Anzeiger erste Seite
      secondStepDone: false, // Stepweise-Anzeiger erste Seite
      thirdStepDone: false, // Stepweise-Anzeiger erste Seite
      firstStepActive: true, // Inhalt Step 1
      secondStepActive: false, // Inhalt Step 2
      thirdStepActive: false, // Inhalt Step 3
      newCourse: false, // Suche in vorhandenen Kursen oder neue Kurserstellung?
      courseTitleFrom: '', // Titel der aktuellen Veranstaltung
      courseIdFrom: '', // ID der aktuellen Veranstaltung
      courseTitleTo: '', // Titel der gewünschten Veranstaltung
      courseIdTo: '', // ID der gewünschten Veranstaltung
      courseGroupFrom: '', // Untergruppe der aktuellen Veranstaltung
      courseGroupTo: '', // Untergruppe der gewünschten Veranstaltung (gesamte Liste in courseGroupToArray)
      hasCourseGroupFrom: false, // itital
      hasCourseGroupTo: false, // initial
      canHaveCourseGroupTo: false, // initial
      msg: 'Welcome to Your Vue.js and Baqend App',
      isLoggedIn: null,
      forwardItem: 'Weiter',
      backItem: 'Abbrechen', // Beschriftung für zurück-Button in Button-Group (inital: Abbrechen)
      backLink: {
        name: 'dashboard' // Link von zurück-Button in Button-Group (initial: Dashboard)
      },
      subgroupItem: '',
      // --- Daten für Autocomplete (nur courseItems) ---
      coursesObjectAutocomplete: {
        data: [
          ''
        ],
        name: '',
        selected: null
      },
      courses: [], // wird bei created () mit gesamter Kurslise aus DB befüllt
      courseid: '', // Kurs-Id
      search: '',
      selected: null,
      coursesArray: [], // Array aller Kurse, beinhaltet nur courseItem (für Autocomplete) und courseid (zum Matchen)
      courseGroupToArray: [], // Array aller courseGroupTo-Strings
      courseTitleToArray: [], // Array aller courseTitleTo-Strings
      groupCounter: 0,
      courseCounter: 0,
      groupAdding: '',
      searchedGroups: [],
      searchedCourses: []
    }
  },

  methods: {
    // --- Autocomplete ---
    courseItemName (index) {
      return this.courseTitleToArray[index].courseName
    },
    groupItemLabel (index) {
      return this.courseGroupToArray[index].groupItemLabel
    },
    createNewCourse () {
      if (this.coursesObjectAutocomplete.name === 'Deine Veranstaltung ist nicht dabei?') {
        this.coursesObjectAutocomplete.selected = this.coursesObjectAutocomplete.name
        this.addCourse()
      }
    },
    // Hilfsfunktion: reine ID aus ID-Directory aus DB
    getCourseId (courseid) {
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
    // / --- Autocomplete ---
    // Hilfsfunktion zur Anzeige des Kurserstellungs-Dialogs
    addCourse () {
      this.newCourse = true
      this.forwardItem = 'Veranstaltung erstellen'
      this.backItem = 'Zurück'
    },
    // Untergruppe zur Veranstaltung hinzufügen
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
        // this.courseGroupToArray.unshift(this.groupCounter++)
        this.canHaveCourseGroupTo = true
        this.hasCourseGroupTo = true
        // console.log(this.courseGroupToArray)
      }
    },
    addCourseTo () {
      // console.log('addCourseTo')
      var lastCourseName = this.coursesObjectAutocomplete.name
      this.coursesObjectAutocomplete.name = ''
      this.courseTitleToArray.push({
        courseName: lastCourseName,
        courseIndex: this.courseCounter++
      })
      // console.log(this.courseTitleToArray)
      // this.courseGroupToArray.unshift(this.groupCounter++)
      // console.log(this.courseTitleToArray)
      // this.courseTitleToArray.push(this.coursesObjectAutocomplete.name)
    },
    courseToIsAdded (courseCounter) {
      return true
    },
    // Untergruppe zur Veranstaltung entfernen
    removeGroup (index) {
      if (this.firstStepActive) {
        this.hasCourseGroupFrom = false
        this.canHaveCourseGroupTo = false
      } else if (this.secondStepActive) {
        this.courseGroupToArray.splice(index, 1)
      }
    },
    // Veranstaltung von Wunsch-LIste entfernen
    removeCourse (index) {
      this.courseTitleToArray.splice(index, 1)
      this.courseCounter = (-1) + this.courseCounter
      console.log(index)
      console.log(this.courseCounter)
    },
    createSearchedGroups () {
      for (var i = 1; i < this.courseGroupToArray.length; i++) {
        this.searchedGroups.push(this.courseGroupToArray[i].groupName)
      }
    },
    createSearchedCourses () {
      for (var i = 0; i < this.courseTitleToArray.length; i++) {
        this.searchedCourses.push(this.courseTitleToArray[i].courseName.substring(0, this.courseTitleToArray[i].courseName.indexOf(' –')))
        // console.log(this.courseTitleToArray[i].courseName.substring(0, this.courseTitleToArray[i].courseName.indexOf(' –')))
      }
      // console.log(this.searchedCourses)
    },
    createSearchedCoursesSingle () {
      this.searchedCourses = new Array(this.courseTitleFrom.substring(0, this.courseTitleFrom.indexOf(' –')))
    },
    // Aktionen bei Klick auf Weiter-Button
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
        // console.log(this.courseTitleFrom)
        // console.log(this.courseTitleFrom.substring(0, this.courseTitleFrom.indexOf(' –'))) // ----------------courseId
        // console.log(this.courseGroupFrom) // -----------------------------------------------------------------group
        this.createCoursesObjectAutocomplete = ''
        if (!this.newCourse) {
          this.courseTitleFrom = this.coursesObjectAutocomplete.name
        }
        if (!this.canHaveCourseGroupTo) {
          this.coursesObjectAutocomplete.name = this.courseTitleTo
        }
        this.courseGroupToArray.push({
          groupName: this.courseGroupTo,
          groupIndex: this.groupCounter++
        })
      } else if (this.firstStepDone && this.secondStepDone) {
        // Nav-Dots setzen
        this.secondStepActive = false
        this.thirdStepActive = true
        // Formular setzen
        this.thirdStepDone = true
        this.courseTitleTo = this.coursesObjectAutocomplete.name
        this.coursesObjectAutocomplete.name = this.courseTitleTo
        if (this.hasCourseGroupFrom) {
          this.createSearchedGroups()
          this.createSearchedCoursesSingle()
          M.createSwopCard(this.searchedCourses, this.searchedGroups, this.courseTitleFrom.substring(0, this.courseTitleFrom.indexOf(' –')), this.courseGroupFrom)
        } else if (!this.hasCourseGroupFrom) {
          console.log(this.courseTitleFrom.substring(0, this.courseTitleFrom.indexOf(' –')))
          console.log(this.searchedGroups)
          this.createSearchedCourses()
          console.log(this.searchedCourses)
          console.log(this.courseGroupFrom)
          M.createSwopCard(this.searchedCourses, this.searchedGroups, this.courseTitleFrom.substring(0, this.courseTitleFrom.indexOf(' –')), this.courseGroupFrom)
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
    // Aktionen bei Klick auf zurück-Button
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
    // Initiales Laden aller Kurse für Autocomplete
    M.getAllCourses()
      .then((courses) => {
        this.courses = courses
        this.createCoursesArray()
      })
      //  .catch((err) => {
      // Fehler behanlung
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
</style>
