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
          <li class="nav-dot" :class="{ 'active': activeStep == 'st', 'done': stepsDone.length > 0}" ></li>
          <li class="nav-dot" :class="{ 'active': activeStep == 'nd', 'done': stepsDone.length > 1}" ></li>
          <li class="nav-dot" :class="{ 'active': activeStep == 'rd', 'done': stepsDone.length > 2}" ></li>
        </ul>

        <!-- –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->
        <!-- –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->
        <!-- –––––––––––––––––––– STEP 1: AKTUELLE VERANSTALTUNG –––––––––––––––––––––––– -->
        <!-- –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->
        <!-- –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->

        <div v-if="activeStep === 'st'">
          <h4 class="description is-5 has-text-centered">Aus welcher Veranstaltung möchtest Du <strong>heraus</strong> wechseln?</h4></br></br>
          <!-- –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->
          <!-- –––––––––––––––––––––– AUTOCOMPLETE VERANSTALTUNG –––––––––––––––––––––––––– -->
          <!-- –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->
          <b-field class="has-addons" v-if="!courseFromSet">
            <div class="control is-expanded is-grouped">
              <b-autocomplete v-model="coursesAC.name" :data="filteredDataArray" placeholder="Deine aktuelle Veranstaltung" @select="option => coursesAC.selected = option" @click.native="selectOrCreate" @keyup.native="selectOrCreate" @keyup.native.enter="setCourseFrom"></b-autocomplete>
            </div>
            <div :class="{'control': true}">
              <a :class="{'button': true, 'is-primary': true}" :disabled="!courseFromSelected" @click="setCourseFrom"><i class="fa fa-check"></i></a>
            </div>
          </b-field>

          <div v-if="courseFromSet">
            <div class="field has-addons">
              <p class="control is-expanded">
                <input :class="{'input': true, 'courseIsSet': true}" type="text" v-model="courseTitleFrom" readonly>
              </p>
              <p class="control">
                <a class="button is-primary" @click="courseFromSet=false">
                  <i class="fa fa-pencil-square-o"></i>
                </a>
              </p>
            </div>
          </div>

          <p v-if="!hasGroupFrom" :class="{ 'help': true, 'small-link': true}" @click="addGroup">
            + Untergruppe hinzufügen
          </p>
          </br>
          <!-- –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->
          <!-- ––––––––––––––––––––––––––––––– INPUT GRUPPE ––––––––––––––––––––––––––––––– -->
          <!-- –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->

          <div v-if="hasGroupFrom && !hasGroupFromSet">
            <div class="field has-addons">
              <p class="control is-expanded">
                <input :class="{'input': true, 'group': true}" type="text" placeholder="Deine aktuelle Untergruppe"  @keyup.enter="hasGroupFromSet=true" v-model="courseGroupFrom">
              </p>
              <p class="control">
                <a class="button is-secondary" @click="hasGroupFromSet=true" :disabled="courseGroupFrom === ''">
                  <i class="fa fa-check"></i>
                </a>
              </p>
            </div>
          </div>

          <div v-if="hasGroupFromSet">
            <a class="button is-secondary" @click="hasGroupFrom=false, hasGroupFromSet=false, canHaveCourseGroupTo=false, courseGroupFrom='', courseGroupToArray = new Array()">
                <span>Gruppe: {{courseGroupFrom}}</span>
                <span class="icon is-small">
                  <i class="fa fa-times"></i>
                </span>
              </a>
          </div>

        </div>

        <!-- –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->
        <!-- –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->
        <!-- –––––––––––––––––––––– STEP 2: WUNSCHVERANSTALTUNG ––––––––––––––––––––––––– -->
        <!-- –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->
        <!-- –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->
        <div v-if="activeStep === 'nd'">
          <h4 class="description is-5 has-text-centered">In welche Veranstaltung möchtest Du <strong>hinein</strong> wechseln?</h4>
          </br>
          </br>

          <!-- –––––––––––– FALL A: KEINE GRUPPE –> MEHRERE VERANSTALTUNGEN ––––––––––––– -->
          <div v-if="!hasGroupFrom">

            <div class="floatingItems">
              <div v-for="(courseTitleToItem, index) in courseTitleToArray" ref="crs" :key="courseTitleToItem.courseIndex">
                <a class="button is-primary is-floating" @click="removeCourse(index)">
                <span>{{courseItemName(index)}}</span>
                <span class="icon is-small">
                  <i class="fa fa-times"></i>
                </span>
              </a>
              </div>
            </div>

            <b-field class="has-addons">
              <div class="control is-expanded is-grouped">
                <b-autocomplete @keyup.native.enter="addCourseTo" v-model="coursesAC.name" :data="filteredDataArray" placeholder="Deine Wunschveranstaltung" @select="option => coursesAC.selected = option" @click.native="selectOrCreate" @keyup.native="selectOrCreate"></b-autocomplete>
              </div>
              <div :class="{'control': true}">
                <a :class="{'button': true, 'is-primary': true}" @click="addCourseTo()" :disabled="!courseToSelected"><i class="fa fa-plus"></i></a>
              </div>
            </b-field>

          </div>

          <!-- –––––––– FALL B: GRUPPE –> KEINE VERANSTALTUNG & MEHRERE GRUPPEN ––––––––– -->
          <div v-if="hasGroupFrom">

            <p class="control is-expanded">
              <input :class="{'input': true, 'courseIsSet': true}" type="text" v-model="courseTitleFrom" readonly>
            </p>

            </br>

            <div class="floatingItems">
              <div v-for="(courseGroupToItem, index) in courseGroupToArray" ref="crs" :key="courseGroupToItem.groupIndex">
                <a class="button is-secondary is-floating" @click="removeGroup(index)">
                  <span>Gruppe: {{groupName(index)}}</span>
                  <span class="icon is-small">
                    <i class="fa fa-times"></i>
                  </span>
                </a>
              </div>
            </div>

            <div class="field has-addons">
              <p class="control is-expanded">
                <input :class="{'input': true, 'group': true}" type="text" placeholder="Deine Wunsch-Untergruppe" @keyup.enter="addGroup" v-model="groupAdding">
              </p>
              <p class="control">
                <a class="button is-secondary" @click="addGroup" :disabled="groupAdding === ''">
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
        <div v-if="activeStep === 'rd'">
          <p class="has-text-centered"> Du möchtest von </br>
            </br>
            <strong>{{courseTitleFrom}}<span v-if="courseGroupFrom !== ''">, Gruppe {{courseGroupFrom}}</span></strong></br>
            </br>
            nach </br>
            </br>
            <span v-for="courseTitleTo in courseTitleToArray">
              <strong>{{courseTitleTo.courseName}}</strong>
              <span v-if="courseTitleTo.courseIndex !== (-1 + courseTitleToArray.length)"> oder</span></br>
            </span>
            <span v-if="hasGroupFrom">
              <strong>{{courseTitleTo}},</strong>
            </span>
            <span v-for="courseGroupTo in courseGroupToArray">
              <strong>
                Gruppe {{courseGroupTo.groupName}}
              </strong>
                <span v-if="courseGroupTo.groupIndex !== (-1 + courseGroupToArray.length)"> oder
              </span>
            </span>
            </br>
          </br>
            wechseln?
          </p>
        </div>

        </br>
        </br>
        <!-- ––––––––––––––––––––––– BUTTON GROUP (NAVIGATION) –––––––––––––––––––––––––– -->
        <button-group>
          <div slot="backItem">
            <router-link v-if="activeStep == 'st'" @click="back" :to="backLink">{{backItem}}</router-link>
            <div v-if="activeStep == 'nd' || activeStep == 'rd'" @click="back">{{backItem}}</div>
          </div>
          <div slot="forwardItem">
            <div @click="forward">{{forwardItem}}</div>
          </div>
        </button-group>

        <!-- –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->
        <!-- –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->
        <!-- ––––––––––––––––––––– MODAL: VERANSTALTUNG ERSTELLEN ––––––––––––––––––––––– -->
        <!-- –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->
        <!-- –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->
        <div v-if="newCourse">

          <div class="modal is-active">
            <div class="modal-background"></div>
            <div class="modal-content">

              <div class="container">

                <div class="box white-modal">

                  <h4 class="description is-5 has-text-centered">Erstelle hier eine neue Veranstaltung</h4>
                  </br>

                  <!-- Input Name-->
                  <b-field class="has-addons" v-if="!hasNewCourseTitleSet">
                    <div class="control is-expanded is-grouped">
                      <b-input placeholder="Vollständiger Name der Veranstaltung" v-model="newCourseTitle" @keyup.native="hasNewCourseTitle=true" @keyup.native.enter="setNewCourseTitle(), jump()"></b-input>
                    </div>
                    <div :class="{'control': true}">
                      <a :class="{'is-primary': true, 'button': true}" :disabled="!hasNewCourseTitle" @click="setNewCourseTitle"><i class="fa fa-check"></i></a>
                    </div>
                  </b-field>

                  <div class="field has-addons" v-if="hasNewCourseTitleSet">
                    <p class="control is-expanded">
                      <input :class="{'input': true, 'courseIsSet': true}" type="text" v-model="newCourseTitle" readonly>
                    </p>
                    <p class="control">
                      <a class="button is-primary" @click="hasNewCourseTitleSet=false">
                            <i class="fa fa-pencil-square-o"></i>
                          </a>
                    </p>
                  </div>
                  </br>

                  <!-- Input ID -->
                  <b-field class="has-addons" v-if="!hasNewCourseIdSet">
                    <div class="control is-expanded is-grouped">
                      <b-input id="next" placeholder="ID der Veranstaltung" v-model="newCourseId" @keyup.native="hasNewCourseId=true" @keyup.native.enter="setNewCourseId()"></b-input>
                    </div>
                    <div :class="{'control': true}">
                      <a :class="{'is-primary': true, 'button': true}" :disabled="!hasNewCourseId" @click="setNewCourseId"><i class="fa fa-check"></i></a>
                    </div>
                  </b-field>

                  <div class="field has-addons" v-if="hasNewCourseIdSet">
                    <p class="control is-expanded">
                      <input :class="{'input': true, 'courseIsSet': true}" type="text" v-model="newCourseId" readonly>
                    </p>
                    <p class="control">
                      <a class="button is-primary" @click="hasNewCourseIdSet=false">
                          <i class="fa fa-pencil-square-o"></i>
                        </a>
                    </p>
                  </div>

                  </br>

                  <!-- Button-Leiste -->
                  <button-group>
                    <div slot="backItem">
                      <div @click="back">{{backItem}}</div>
                    </div>
                    <div slot="forwardItem" @click="forward">{{forwardItem}}</div>
                  </button-group>
                </div>

              </div>
            </div>

          </div>


        </div>

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
      // –––––––––––––––––––––––––––––––––– NAVIGATION ––––––––––––––––––––––––––––––––––––
      activeStep: 'st', // st, nd, rd
      stepsDone: [], // absolvierte steps

      // –––––––––––––––––––––––––––––––––––– STEP 1 ––––––––––––––––––––––––––––––––––––––
      courseFromSet: false, // coursefrom erfolgreich gesetzt

      // ––––––––––––––––––––––––––––––– STEP-ÜBERGREIFEND –––––––––––––––––––––––––––––––––
      coursesAC: {
        data: [
          ''
        ],
        name: '',
        selected: null
      },
      // –––––––––––––––––––––––––––– NAVIGATION BUTTONGROUP ––––––––––––––––––––––––––––––
      forwardItem: 'Weiter',
      forwardLink: {
        name: 'dashboard'
      },
      backItem: 'Abbrechen',
      backLink: {
        name: 'dashboard'
      },
      // –––––––––––––––––––––––––––– KURSTERSTELLUNGS-MODAL ––––––––––––––––––––––––––––––
      newCourse: false,
      hasNewCourseTitle: false,
      hasNewCourseTitleSet: false,
      hasNewCourseId: false,
      hasNewCourseIdSet: false,
      newCourseTitle: '',
      newCourseId: '',
      // ––––––––––––––––––––––––––––– SWOPCARD-ATTRIBUTE –––––––––––––––––––––––––––––––––
      courseTitleFrom: '', // Titel der aktuellen Veranstaltung
      courseTitleTo: '', // Titel der gewünschten Veranstaltung
      courseGroupFrom: '', // Untergruppe der aktuellen Veranstaltung
      courseGroupTo: '', // Zwischenspeichern der Untergruppe der gewünschten Veranstaltung (gesamte Liste in courseGroupToArray)
      courseGroupToArray: [], // Array aller courseGroupTo-Strings
      courseTitleToArray: [], // Array aller courseTitleTo-Strings
      searchedGroups: [],
      searchedCourses: [],
      // –––––––––––––––– HILFSATTRIBUTE WECHSEL GRUPPE ODER VERANSTALTUNG –––––––––––––––––
      hasGroupFrom: false, // itital
      canHaveCourseGroupTo: false, // initial
      groupCounter: 0,
      courseCounter: 0,
      groupAdding: '',
      // –––––––––––––––––––––––––––––– AUTOCOMPLETE-DATEN ––––––––––––––––––––––––––––––––––
      courses: [], // wird bei created () mit gesamter Kurslise aus DB befüllt
      courseid: '', // Zwischenspeicher Kurs-Id (nach Umwandlung aus Directory zu String)
      coursesArray: [], // Array aller Kurse, beschränkt auf courseItem (für Autocomplete) und courseid (zum Matchen)
      courseFromSelected: false,
      courseToSelected: false,
      hasGroupFromSet: false,
      search: '',
      selected: null,
      isLoggedIn: null,
      created: false
    }
  },

  methods: {
    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    // –––––––––––––––––––––––––––– INHALTE SWOPCARD  –––––––––––––––––––––––––––––––––––
    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    addCourseTo () { // wunschveranstaltung(en) hinzufügen
      if (this.coursesAC.name === this.coursesAC.selected) {
        if (this.coursesAC.name === 'Deine Veranstaltung ist nicht dabei?') {
          this.createCourse()
        } else {
          var lastCourseName = this.coursesAC.name
          this.courseTitleToArray.push({
            courseName: lastCourseName,
            courseIndex: this.courseCounter++
          })
          this.coursesAC.name = ''
          this.courseTitleTo = ''
          this.coursesAC.selected = ''
          this.courseToSelected = false
        }
      }
    },
    courseToIsAdded (courseCounter) {
      return true
    },
    removeCourse (index) {
      this.courseTitleToArray.splice(index, 1)
      this.courseCounter = (-1) + this.courseCounter
    },
    addGroup () { // untergruppe(n) hinzufügen
      if (this.activeStep === 'st') { // in step 1
        this.hasGroupFrom = true
        this.courseTitleToArray = []
      } else if (this.activeStep === 'nd') { // in step 2
        this.courseGroupToArray.push({
          groupName: this.groupAdding,
          groupIndex: this.groupCounter++
        })
        this.groupAdding = ''
      }
    },
    removeGroup (index) { // untergruppe entfernen
      if (this.activeStep === 'st') {
        this.hasGroupFrom = false
        this.canHaveCourseGroupTo = false
      } else if (this.activeStep === 'nd') {
        this.courseGroupToArray.splice(index, 1)
      }
    },
    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    // –––––––––––––––––––––––––– MODAL KURSERSTELLUNG ––––––––––––––––––––––––––––––––––
    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    createCourse () { // navigation zu modal
      if (this.activeStep === 'st') {
        this.courseTitleFrom = null
        this.newCourse = true // öffnen des modal
      } else if (this.activeStep === 'nd') {
        this.courseTitleTo = null
        this.newCourse = true
      }
      this.forwardItem = 'Veranstaltung erstellen' // buttongroup forwarditem setzen
      this.backItem = 'Abbrechen' // buttongroup backitem setzen
    },
    setNewCourseTitle () {
      this.hasNewCourseTitleSet = true
    },
    setNewCourseId () {
      this.hasNewCourseIdSet = true
    },
    onSuccess () {
      this.$toast.open({
        message: 'Die Veranstaltung wurde erfolgreich erstellt!',
        type: 'is-success',
        position: 'is-top'
      })
    },
    onFailure (cp) { // Fehleranzeige (nach Frontend- und Backendvalidierung)
      var messageString
      if (cp === 'courseFromNotSet') {
        messageString = 'Bitte wähle Deine Veranstaltung aus.'
      } else if (cp === 'courseTitleToArrayEmpty') {
        messageString = 'Bitte gib mindestens eine Wunschveranstaltung an.'
      } else if (cp === 'courseGroupToArrayEmpty') {
        messageString = 'Bitte gib mindestens eine Wunschgruppe an.'
      } else if (cp === null) {
        messageString = 'Oops, irgendentwas scheint schief gelaufen zu sein.'
      } else {
        messageString = cp + '!'
      }
      this.$toast.open({
        message: messageString,
        type: 'is-danger',
        position: 'is-top'
      })
    },
    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    // –––––––––––––––––––––––––––––– AUTOCOMPLETE ––––––––––––––––––––––––––––––––––––––
    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    courseItemName (index) {
      return this.courseTitleToArray[index].courseName
    },
    groupName (index) {
      return this.courseGroupToArray[index].groupName
    },
    getCourseId (courseid) { // reine id aus id-directory aus db
      courseid = courseid.substring(11)
      return courseid
    },
    // Befüllen des Daten-Objektes mit courseItem für Autocomplete
    createcoursesAC () {
      for (var course in this.coursesArray) {
        this.coursesAC.data.push(this.coursesArray[course].courseItem)
      }
      if (!this.created) {
        this.coursesAC.data.push('Deine Veranstaltung ist nicht dabei?')
      }
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
      this.createcoursesAC()
    },
    createSearchedGroups () {
      for (var i = 0; i < this.courseGroupToArray.length; i++) {
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
    },
    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    // –––––––––––––––––––––––––––––– HILFSFUNKTIONEN –––––––––––––––––––––––––––––––––––
    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    selectOrCreate () { // unterscheidet ob ac item ausgewählt werden oder ob neue veranstaltung erstellt werden soll
      if (this.activeStep === 'st') {
        if (this.coursesAC.selected === null) {
          this.courseFromSelected = false
        } else if (this.coursesAC.selected !== null) {
          this.coursesAC.name = this.coursesAC.selected
          this.coursesAC.selected === null
          this.courseFromSelected = true
          if (this.coursesAC.name === 'Deine Veranstaltung ist nicht dabei?') {
            this.coursesAC.name = ''
            this.createCourse() // öffnen des kurserstellungs-modals
          }
        }
      } else if (this.activeStep === 'nd') {
        if (this.coursesAC.selected === null) {
          this.courseToSelected = false
        } else if (this.coursesAC.selected !== null) {
          this.courseToSelected = true
          this.coursesAC.name = this.coursesAC.selected
          this.coursesAC.selected === null
          if (this.coursesAC.name === 'Deine Veranstaltung ist nicht dabei?') {
            this.createCourse()
          }
        }
      }
    },
    setCourseFrom () { // setzen des coursetitlefrom
      if (this.coursesAC.name === this.coursesAC.selected) {
        this.courseTitleFrom = this.coursesAC.name
        this.courseFromSet = true
      }
    },
    jump () { // fokus auf nächstes feld in kurserstellungs-modal
      document.getElementById('next').focus()
    },
    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    // ––––––––––––––––––––––––––––––– NAVIGATION  ––––––––––––––––––––––––––––––––––––––
    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    forward () {
      if (this.activeStep === 'st' && !this.newCourse) { // step 1 zu step 2
        // ––––––––––––––––––––––––––––––– NAVIGATION –––––––––––––––––––––––––––––––––––––
        if (this.courseFromSet) {
          this.activeStep = 'nd' // navdot setzen
          this.backItem = 'Zurück' // buttongroup backitem setzen
          this.stepsDone.push('st') // step 1 zu absolvierten steps hinzufügen
          // –––––––––––––––––––––––––––––––– ACTIONS –––––––––––––––––––––––––––––––––––––
          this.courseTitleFrom = this.coursesAC.name
          if (this.hasGroupFrom) {
            this.coursesAC.name = this.courseTitleFrom
            this.courseTitleTo = this.courseTitleFrom
          } else if (!this.hasGroupFrom) {
            this.coursesAC.name = ''
            this.coursesAC.selected = ''
          }
        } else {
          this.onFailure('courseFromNotSet')
        }
      } else if (this.activeStep === 'nd' && !this.newCourse) { // step 2 zu step 3
        if (this.courseTitleToArray.length !== 0 || this.courseGroupToArray.length !== 0) {
          // ––––––––––––––––––––––––––––––– NAVIGATION –––––––––––––––––––––––––––––––––––––
          this.activeStep = 'rd' // navdot setzen
          this.forwardItem = 'Partner finden!' // buttongroup forwarditem setzen
          this.stepsDone.push('nd') // step 2 zu absolvierten steps hinzufügen
          // –––––––––––––––––––––––––––––––– ACTIONS ––––––––––––––––––––––––––––––––––––––
          this.courseTitleTo = this.coursesAC.name
        } else {
          if (this.hasGroupFrom) {
            this.onFailure('courseGroupToArrayEmpty')
          } else {
            this.onFailure('courseTitleToArrayEmpty')
          }
        }
      } else if (this.activeStep === 'rd') {
        // –––––––––––––––––––––––––––––––– ACTIONS ––––––––––––––––––––––––––––––––––––––
        if (this.hasGroupFrom) { // swopcard mit gruppen abschicken
          this.createSearchedGroups()
          this.createSearchedCoursesSingle()
          M.createSwopCard(this.searchedCourses, this.searchedGroups, this.courseTitleFrom.substring(0, this.courseTitleFrom.indexOf(' –')), this.courseGroupFrom)
          .then(() => {
            this.stepsDone = []
            this.activeStep = ''
            this.$router.push('dashboard') // umleitung auf dashboard
          }).catch((error) => {
            var errormes = error.cause.message.message
            this.onFailure(errormes)
          })
        } else if (!this.hasGroupFrom) { // swopcard ohne gruppen abschicken
          this.createSearchedCourses()
          M.createSwopCard(this.searchedCourses, this.searchedGroups, this.courseTitleFrom.substring(0, this.courseTitleFrom.indexOf(' –')), this.courseGroupFrom)
          .then(() => {
            this.stepsDone = []
            this.activeStep = ''
            this.$router.push('dashboard') // umleitung auf dashboard
          }).catch((error) => {
            var errormes = error.cause.message.message
            this.onFailure(errormes)
          })
        }
      } else if (this.newCourse) {
        this.courses = []
        if (this.activeStep === 'st') {
          M.createCourse(this.newCourseTitle, this.newCourseId)
            .then(() => {
              this.initiateAC()
              this.newCourse = false // schließen des Formulars/Dialogs
              this.onSuccess()
            }).catch((error) => {
              var errormes = error.cause.message
              this.onFailure(errormes)
            })
          this.coursesAC.name = this.newCourseId.concat(' – ').concat(this.newCourseTitle)
          this.coursesAC.selected = this.coursesAC.name
          this.backItem = 'Abbrechen' // Anpassen der Buttongroup
          this.setCourseFrom()
        }
        if (this.activeStep === 'nd') {
          M.createCourse(this.newCourseTitle, this.newCourseId)
            .then(() => {
              this.initiateAC()
              this.newCourse = false // schließen des Formulars/Dialogs
              this.onSuccess()
            }).catch((error) => {
              var errormes = error.cause.message
              this.onFailure(errormes)
            })
          this.coursesAC.name = this.newCourseId.concat(' – ').concat(this.newCourseTitle)
          this.coursesAC.selected = this.coursesAC.name
          this.backItem = 'Zurück'
          this.addCourseTo()
          this.courseTitleTo = ''
        }
        this.hasNewCourseTitle = false
        this.hasNewCourseTitleSet = false
        this.hasNewCourseId = false
        this.hasNewCourseIdSet = false
        this.newCourseTitle = ''
        this.newCourseId = ''
        this.forwardItem = 'Weiter' // Anpassen der Buttongroup
      }
    },
    back () {
      if (this.newCourse) {
        this.newCourse = false
      }
      if (this.activeStep === 'nd') { // step 2 zu step 1
        // ––––––––––––––––––––––––––––––– NAVIGATION –––––––––––––––––––––––––––––––––––––
        this.activeStep = 'st' // navdot setzen
        this.backItem = 'Abbrechen' // buttongroup backitem setzen
        this.stepsDone.splice(1, 1) // step 2 aus absolvierten steps entfernen
        // –––––––––––––––––––––––––––––––– ACTIONS ––––––––––––––––––––––––––––––––––––––
        this.courseTitleTo = this.coursesAC.name
        this.coursesAC.name = this.courseTitleFrom
      } else if (this.activeStep === 'rd') { // step 3 zu step 2
        // ––––––––––––––––––––––––––––––– NAVIGATION –––––––––––––––––––––––––––––––––––––
        this.activeStep = 'nd' // navdot setzen
        this.forwardItem = 'Weiter' // buttongroup forwarditem setzen
        this.stepsDone.splice(2, 1) // step 3 aus absolvierten steps entfernen
      }
    },
    initiateAC () {
      M.getAllCourses() // Initiales Laden aller Kurse aus der DB zur Suche
        .then((courses) => {
          this.courses = courses
          this.createCoursesArray()
          this.created = true
        })
    }
  },
  computed: {
    // Autocomplete Forgiving Formatting –––––––––––––––––––––––––––––––––––––––––––––
    filteredDataArray () {
      return this.coursesAC.data.filter((option) => {
        if (option === 'Deine Veranstaltung ist nicht dabei?') { // Auswahloption falls die gesuchte Veranstaltung noch in in der Liste steht
          option = this.coursesAC.name // damit steht die Option immer als Auswahloption im Autocomplete zur Verfügung
        }
        return option
        .toString()
        .toLowerCase()
        .indexOf(this.coursesAC.name.toLowerCase()) >= 0
      })
    }
  },
  components: {
    ButtonGroup
  },
  created () {
    if (!db.User.me) {
      this.$router.push('/')
    }
    this.initiateAC()
  }
}
</script>

<style scoped lang="scss">

/* Stepwise-Navigation */
.nav-dots-container {
    text-align: center;
    padding-bottom: 5%;
}
.nav-dots-container .nav-dot {
    display: inline-block;
    text-align: center;
    width: 8px;
    height: 8px;
    background: #FBDDB8;
    border-radius: 100%;
    margin-left: 5%;
    margin-right: 5%;
}
.nav-dots-container .nav-dot.active {
    background: #F39016;
    transform: scale(1.5);
}

.nav-dots-container .nav-dot.done {
    background: #F39016;
}

.small-link {
  cursor: pointer;
}

.courseIsSet {
    background: #F39016;
    border: #F39016;
    color: #ffffff;
}

.group:focus {
border-color: #0F75BC !important;
}

.floatingItems {
  display: flex;
  flex-flow: row wrap;
}

.is-floating {
  margin-right: 1rem;
  margin-bottom: 1rem;
}

/* ––––––––––––––––––––––––––––––––––– MODAL DIALOG ––––––––––––––––––––––––––––––––– */
.white-modal, .white-modal .title {
  background-color: #ffffff;
  color: #000000 !important;
}

.white-modal .is-white {
  color: #F39016;
}

.modal-background {
  background-color: rgba(0, 0, 0, 0.4);
}

</style>
