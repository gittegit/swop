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
          <li class="nav-dot" :class="{ 'active': activeStep == 'st', 'done': stepsDone.length > 0}" @click="activeStep = 'st'"></li>
          <li class="nav-dot" :class="{ 'active': activeStep == 'nd', 'done': stepsDone.length > 1}" @click="activeStep = 'nd'"></li>
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
            <a class="button is-secondary" @click="hasGroupFrom=false, hasGroupFromSet=false, canHaveCourseGroupTo=false">
                <span>{{courseGroupFrom}}</span>
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
                  <span>{{groupItemLabel(index)}}</span>
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
            <!-- <router-link v-if="activeStep == 'rd'"  :to="forwardLink"></router-link> -->
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
                      <b-input placeholder="Vollständiger Name der Veranstaltung" v-model="courseTitleFrom" @keyup.native="hasNewCourseTitle=true" @keyup.native.enter="setNewCourseTitle(), jump()"></b-input>
                    </div>
                    <div :class="{'control': true}">
                      <a :class="{'is-primary': true, 'button': true}" :disabled="!hasNewCourseTitle" @click="setNewCourseTitle"><i class="fa fa-check"></i></a>
                    </div>
                  </b-field>

                  <div class="field has-addons" v-if="hasNewCourseTitleSet">
                    <p class="control is-expanded">
                      <input :class="{'input': true, 'courseIsSet': true}" type="text" v-model="courseTitleFrom" readonly>
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
                      <b-input id="next" placeholder="ID der Veranstaltung" v-model="courseIdFrom" @keyup.native="hasNewCourseId=true" @keyup.native.enter="setNewCourseId()"></b-input>
                    </div>
                    <div :class="{'control': true}">
                      <a :class="{'is-primary': true, 'button': true}" :disabled="!hasNewCourseId" @click="setNewCourseId"><i class="fa fa-check"></i></a>
                    </div>
                  </b-field>

                  <div class="field has-addons" v-if="hasNewCourseIdSet">
                    <p class="control is-expanded">
                      <input :class="{'input': true, 'courseIsSet': true}" type="text" v-model="courseIdFrom" readonly>
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
      hasGroupFrom: false, // itital
      hasCourseGroupTo: false, // initial
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
      msg: 'Welcome to Your Vue.js and Baqend App',
      isLoggedIn: null,
      confirmationmodal: false,
      created: false
    }
  },

  methods: {
    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    // –––––––––––––––––––––––––––– INHALTE SWOPCARD  –––––––––––––––––––––––––––––––––––
    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    addCourseTo () { // wunschveranstaltung(en) hinzufügen
      if (this.coursesAC.name === this.coursesAC.selected) {
        var lastCourseName = this.coursesAC.name
        this.coursesAC.name = ''
        this.courseTitleToArray.push({
          courseName: lastCourseName,
          courseIndex: this.courseCounter++
        })
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
      } else if (this.activeStep === 'nd') { // in step 2
        this.courseGroupToArray.push({
          groupName: this.groupAdding,
          groupItemLabel: 'Gruppe: ' + this.groupAdding,
          groupIndex: this.groupCounter++
        })
        this.groupAdding = ''
        this.hasCourseGroupTo = true
      }
    },
    removeGroup (index) { // untergruppe entfernen
      if (this.firstStepActive) {
        this.hasGroupFrom = false
        this.canHaveCourseGroupTo = false
      } else if (this.secondStepActive) {
        this.courseGroupToArray.splice(index, 1)
      }
    },
    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    // –––––––––––––––––––––––––– MODAL KURSERSTELLUNG ––––––––––––––––––––––––––––––––––
    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    createCourse () { // navigation zu modal
      this.courseTitleFrom = null
      this.newCourse = true // öffnen des modals
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
    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    // –––––––––––––––––––––––––––––– AUTOCOMPLETE ––––––––––––––––––––––––––––––––––––––
    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    courseItemName (index) {
      return this.courseTitleToArray[index].courseName
    },
    groupItemLabel (index) {
      return this.courseGroupToArray[index].groupItemLabel
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
      if (!this.courseFromSelected) {
        this.setCourseFrom()
      }
      if (this.coursesAC.selected === null) {
        this.courseFromSelected = false
      } else if (this.coursesAC.selected !== null) {
        this.courseFromSelected = true
        if (this.coursesAC.name === 'Deine Veranstaltung ist nicht dabei?') {
          this.coursesAC.name = ''
          this.createCourse() // öffnen des kurserstellungs-modals
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
        this.activeStep = 'nd' // navdot setzen
        this.backItem = 'Zurück' // buttongroup backitem setzen
        this.stepsDone.push('st') // step 1 zu absolvierten steps hinzufügen
        // –––––––––––––––––––––––––––––––– ACTIONS –––––––––––––––––––––––––––––––––––––
        if (!this.newCourse) {
          this.courseTitleFrom = this.coursesAC.name
        }
        if (this.hasGroupFrom) {
          this.coursesAC.name = this.courseTitleFrom
          this.courseTitleTo = this.courseTitleFrom
        } else if (!this.hasGroupFrom) {
          this.coursesAC.name = ''
        }
      } else if (this.activeStep === 'nd' && !this.newCourse) { // step 2 zu step 3
        // ––––––––––––––––––––––––––––––– NAVIGATION –––––––––––––––––––––––––––––––––––––
        this.activeStep = 'rd' // navdot setzen
        this.forwardItem = 'Partner finden!' // buttongroup forwarditem setzen
        this.stepsDone.push('nd') // step 2 zu absolvierten steps hinzufügen
        // –––––––––––––––––––––––––––––––– ACTIONS ––––––––––––––––––––––––––––––––––––––
        this.courseTitleTo = this.coursesAC.name
      } else if (this.activeStep === 'rd') {
        // –––––––––––––––––––––––––––––––– ACTIONS ––––––––––––––––––––––––––––––––––––––
        if (this.hasGroupFrom) { // swopcard mit gruppen abschicken
          this.createSearchedGroups()
          this.createSearchedCoursesSingle()
          M.createSwopCard(this.searchedCourses, this.searchedGroups, this.courseTitleFrom.substring(0, this.courseTitleFrom.indexOf(' –')), this.courseGroupFrom)
        } else if (!this.hasGroupFrom) { // swopcard ohne gruppen abschicken
          this.createSearchedCourses()
          M.createSwopCard(this.searchedCourses, this.searchedGroups, this.courseTitleFrom.substring(0, this.courseTitleFrom.indexOf(' –')), this.courseGroupFrom)
        }
        this.stepsDone = []
        this.activeStep = ''
        // ––––––––––––––––––––––––––––––– NAVIGATION –––––––––––––––––––––––––––––––––––––
        this.$router.push('dashboard') // umleitung auf dashboard
      } else if (this.newCourse) { // 'Neuen Kurs erstellen' nach Kurserstellungs-Dialog
      // ––––––––––––––––––––––––––––––– NAVIGATION –––––––––––––––––––––––––––––––––––––
      // –––––––––––––––––––––––––––––––– ACTIONS ––––––––––––––––––––––––––––––––––––––
        M.createCourse(this.courseTitleFrom, this.courseIdFrom) // Erstellung des neuen Kurses
        this.coursesAC.data.push(this.courseIdFrom.concat(' – ').concat(this.courseTitleFrom))
        this.coursesAC.name = this.courseIdFrom.concat(' – ').concat(this.courseTitleFrom)
        this.coursesAC.selected = this.coursesAC.name
        this.backItem = 'Abbrechen' // Anpassen der Buttongroup
        this.forwardItem = 'Weiter' // Anpassen der Buttongroup
        this.newCourse = false // schließen des Formulars/Dialogs
        this.initiateAC() // Neuladen aller Kurse inklusive des neuen
        this.setCourseFrom()
        this.onSuccess()
      }
    },
    back () {
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
    // forgiving formatting daten autocomplete –––––––––––––––––––––––––––––––––––––––––s
    filteredDataArray () {
      return this.coursesAC.data.filter((option) => {
        if (option === 'Deine Veranstaltung ist nicht dabei?') { // Option für denn Fall, dass die gewüsnchte Veranstaltung noch nicht in der Liste ist
          option = this.coursesAC.name // damit steht Deine Veranstaltung ist nicht dabei?' immer als Option zur Verfügung
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
    // db.Course.find()
    this.initiateAC()
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
    width: 8px;
    height: 8px;
    background: #FBDDB8;
    border-radius: 100%;
    margin-left: 5%;
    margin-right: 5%;
    cursor: pointer;

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

.modal .container {
  width: auto;
}

.modal-background {
  background-color: rgba(0, 0, 0, 0.4);
}

</style>
