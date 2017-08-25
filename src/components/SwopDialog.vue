<template>
<div class="main-content">
  <div class="container">

    <!-- Inhalt / Formulare -->
    <div class="columns is-centered">
      <div class="column is-9 is-narrow is-form">
      <div>
        <h1 v-if="activeStep === 'rd'" class="title is-3 has-text-centered">Deine Tauschanfrage</h1>
        <h1 v-else class="title is-3 has-text-centered">Neue Tauschanfrage</h1>
      </div>

        <!-- –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->
        <!-- ––––––––––––––––––––– ANZEIGER STEPWISE-NAVIGATION ––––––––––––––––––––––––– -->
        <!-- –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->
        <ul class="nav-dots-container">
          <li class="nav-dot" :class="{ 'active': activeStep == 'st', 'done': stepsDone.length > 0}"></li>
          <li class="nav-dot" :class="{ 'active': activeStep == 'nd', 'done': stepsDone.length > 1}"></li>
          <li class="nav-dot" :class="{ 'active': activeStep == 'rd', 'done': stepsDone.length > 2}"></li>
        </ul>

        <!-- –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->
        <!-- –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->
        <!-- –––––––––––––––––––– STEP 1: AKTUELLE VERANSTALTUNG –––––––––––––––––––––––– -->
        <!-- –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->
        <!-- –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->

        <div v-if="activeStep === 'st'">
          <h4 class="description is-5 has-text-centered">Aus welcher Veranstaltung möchtest Du <strong>heraus</strong> wechseln?</h4>
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


          <!-- –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->
          <!-- ––––––––––––––––––––––––––––– GRUPPE HINZUFÜGEN –––––––––––––––––––––––––––– -->
          <!-- –––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––– -->

          <div v-if="hasGroupFrom && !hasGroupFromSet">
            <div v-if="courseGroupFrom === ''" class="field has-addons margin-bottom margin-top">
              <!-- bei leerer Eingabe kann die Gruppe nicht gesetzt werden -->
              <p class="control is-expanded">
                <input :class="{'input': true, 'group': true}" type="text" placeholder="Deine aktuelle Untergruppe" @keyup.enter="onFailure('Du kannst keine leere Gruppe angeben')" v-model="courseGroupFrom">
              </p>
              <p class="control">
                <a class="button is-secondary" @click="onFailure('Du kannst keine leere Gruppe angeben')" :disabled="courseGroupFrom === ''">
                  <i class="fa fa-check"></i>
                </a>
              </p>
            </div>
            <div v-else class="field has-addons margin-bottom margin-top">
              <p class="control is-expanded">
                <input :class="{'input': true, 'group': true}" type="text" placeholder="Deine aktuelle Untergruppe" @keyup.enter="hasGroupFromSet=true" v-model="courseGroupFrom">
              </p>
              <p class="control">
                <a class="button is-secondary" @click="hasGroupFromSet=true">
                  <i class="fa fa-check"></i>
                </a>
              </p>
            </div>
          </div>

          <div class="margin-top margin-bottom" v-if="hasGroupFromSet">
            <a class="button is-secondary" @click="hasGroupFrom=false, hasGroupFromSet=false, courseGroupFrom='', courseGroupToArray = new Array()">
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

          <!-- –––––––––––– FALL A: KEINE GRUPPE –> MEHRERE VERANSTALTUNGEN ––––––––––––– -->
          <div v-if="!hasGroupFrom">

            <div class="floatingItems">
              <div v-for="(courseTitleToItem, index) in courseTitleToArray" ref="crs" :key="courseTitleToItem.courseIndex">
                <a class="button is-primary is-floating" @click="removeCourseTo(index)">
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

            <div class="floatingItems margin-top">
              <div v-for="(courseGroupToItem, index) in courseGroupToArray" ref="crs" :key="courseGroupToItem.groupIndex">
                <a class="button is-secondary is-floating" @click="removeGroup(index)">
                  <span>Gruppe: {{groupName(index)}}</span>
                  <span class="icon is-small">
                    <i class="fa fa-times"></i>
                  </span>
                </a>
              </div>
            </div>

            <div v-if="groupAdding === ''" class="field has-addons margin-top">
              <!-- bei leerer Eingabe kann die Gruppe nicht gesetzt werden -->
              <p class="control is-expanded">
                <input :class="{'input': true, 'group': true}" type="text" placeholder="Deine Wunsch-Untergruppe" @keyup.enter="onFailure('Du kannst keine leere Gruppe angeben')" v-model="groupAdding">
              </p>
              <p class="control">
                <a class="button is-secondary" @click="onFailure('Du kannst keine leere Gruppe angeben')" :disabled="groupAdding === ''">
                  <i class="fa fa-plus"></i>
                </a>
              </p>
            </div>
            <div v-else class="field has-addons margin-top">
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
          <div class="has-text-centered swop-uebersicht">
            <p>Du möchtest von</p>
            <p><strong>{{courseTitleFrom}}<span v-if="courseGroupFrom !== ''">, Gruppe {{courseGroupFrom}}</span></strong></p>
            <p>nach</p>
            <p><span v-for="courseTitleTo in courseTitleToArray">
              <strong>{{courseTitleTo.courseName}}</strong>
              <span v-if="courseTitleTo.courseIndex !== (-1 + courseTitleToArray.length)"> oder </span>
            </span></p>
            <p><span v-if="hasGroupFrom">
              <strong>{{courseTitleTo}},</strong>
            </span></p>
            <p><span v-for="courseGroupTo in courseGroupToArray">
              <strong>
                Gruppe {{courseGroupTo.groupName}}
              </strong>
                <span v-if="courseGroupTo.groupIndex !== (-1 + courseGroupToArray.length)"> oder
              </span>
            </span></p>
            <p>wechseln?</p>
          </div>
        </div>
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

                  <!-- Input Name-->
                  <b-field class="has-addons margin-bottom" v-if="!hasNewCourseTitleSet">
                    <div class="control is-expanded is-grouped">
                      <b-input placeholder="Vollständiger Name der Veranstaltung" v-model="newCourseTitle" @keyup.native="hasNewCourseTitle=true" @keyup.native.enter="setNewCourseTitle(), jump('id')" autofocus></b-input>
                    </div>
                    <div :class="{'control': true}">
                      <a :class="{'is-primary': true, 'button': true}" :disabled="!hasNewCourseTitle" @click="setNewCourseTitle"><i class="fa fa-check"></i></a>
                    </div>
                  </b-field>

                  <div class="field has-addons margin-top" v-if="hasNewCourseTitleSet">
                    <p class="control is-expanded">
                      <input :class="{'input': true, 'courseIsSet': true}" type="text" v-model="newCourseTitle" readonly>
                    </p>
                    <p class="control">
                      <a class="button is-primary" @click="hasNewCourseTitleSet=false">
                            <i class="fa fa-pencil-square-o"></i>
                          </a>
                    </p>
                  </div>

                  <!-- Input ID -->
                  <b-field class="has-addons margin-top" v-if="!hasNewCourseIdSet">
                    <div class="control is-expanded is-grouped">
                      <b-input id="id" placeholder="ID der Veranstaltung" v-model="newCourseId" @keyup.native="hasNewCourseId=true" @keyup.native.enter="setNewCourseId()"></b-input>
                    </div>
                    <div :class="{'control': true}">
                      <a :class="{'is-primary': true, 'button': true}" :disabled="!hasNewCourseId" @click="setNewCourseId"><i class="fa fa-check"></i></a>
                    </div>
                  </b-field>

                  <div class="field has-addons margin-top" v-if="hasNewCourseIdSet">
                    <p class="control is-expanded">
                      <input :class="{'input': true, 'courseIsSet': true}" type="text" v-model="newCourseId" readonly>
                    </p>
                    <p class="control">
                      <a class="button is-primary" @click="hasNewCourseIdSet=false">
                          <i class="fa fa-pencil-square-o"></i>
                        </a>
                    </p>
                  </div>

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
      // –––––––––––––––––––––––––––––––––––– STEP 1 ––––––––––––––––––––––––––––––––––––––
      courseFromSet: false, // coursefrom erfolgreich gesetzt
      courseTitleFrom: '', // Titel der aktuellen Veranstaltung
      courseGroupFrom: '', // Untergruppe der aktuellen Veranstaltung
      // ––––––––––––––––––––––––––––––––  HILFSVARIABLEN  ––––––––––––––––––––––––––––––––
      hasGroupFrom: false,
      courseFromSelected: false,
      hasGroupFromSet: false,
      // –––––––––––––––––––––––––––––––––––– STEP 2 ––––––––––––––––––––––––––––––––––––––
      courseTitleTo: '', // Titel der gewünschten Veranstaltung
      courseTitleToArray: [], // Array aller courseTitleTo-Strings
      searchedCourses: [],
      courseGroupTo: '', // Zwischenspeichern der Untergruppe der gewünschten Veranstaltung (gesamte Liste in courseGroupToArray)
      courseGroupToArray: [], // Array aller courseGroupTo-Strings
      searchedGroups: [],
      // –––––––––––––––––––––––––––––––– HILFSVARIABLEN ––––––––––––––––––––––––––––––––––
      courseToSelected: false,
      courseCounter: 0,
      groupAdding: '',
      groupCounter: 0,
      // –––––––––––––––––––––––––––– KURSTERSTELLUNGS-MODAL ––––––––––––––––––––––––––––––
      newCourse: false,
      newCourseTitle: '',
      hasNewCourseTitle: false,
      hasNewCourseTitleSet: false,
      newCourseId: '',
      hasNewCourseId: false,
      hasNewCourseIdSet: false,
      // ––––––––––––––––––––––––––––––– STEP-ÜBERGREIFEND –––––––––––––––––––––––––––––––––
      // –––––––––––––––––––––––––––––– KURSE-AUTOCOMPLETE  ––––––––––––––––––––––––––––––––
      coursesAC: {
        data: [
          ''
        ],
        name: '',
        selected: null
      },
      courses: [], // wird bei created () mit gesamter Kurslise aus DB befüllt
      courseid: '', // Zwischenspeicher Kurs-Id (nach Umwandlung aus Directory zu String)
      coursesArray: [], // Array aller Kurse, beschränkt auf courseItem (für Autocomplete) und courseid (zum Matchen)
      // –––––––––––––––––––––––––––– NAVIGATION ACTIONS ––––––––––––––––––––––––––––––––––
      activeStep: 'st', // st, nd, rd
      stepsDone: [], // absolvierte steps
      // –––––––––––––––––––––––––––– NAVIGATION BUTTONGROUP ––––––––––––––––––––––––––––––
      forwardItem: 'Weiter',
      forwardLink: {
        name: 'dashboard'
      },
      backItem: 'Abbrechen',
      backLink: {
        name: 'dashboard'
      },
      // –––––––––––––––––––––––––––––– SONSTIGES ––––––––––––––––––––––––––––––––––
      search: '',
      selected: null,
      isLoggedIn: null
    }
  },

  methods: {
    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    // ––––––––––––––––––––––––– VERANSTALTUNGEN AUSWÄHLEN ––––––––––––––––––––––––––––––
    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––

    // –––––––––––––––––––––––––––––––––––– STEP 1 ––––––––––––––––––––––––––––––––––––––
    setCourseFrom () { // Setzen des courseTitleFrom (Umwandlung Autocomplete zu readonly Input)
      if (this.coursesAC.name === this.coursesAC.selected) {
        this.courseTitleFrom = this.coursesAC.name
        this.courseFromSet = true
      }
    },

    // –––––––––––––––––––––––––––––––––––– STEP 2 ––––––––––––––––––––––––––––––––––––––
    addCourseTo () { // Wunschveranstaltung(en) zu Liste hinzufügen
      if (this.coursesAC.name === this.coursesAC.selected && this.coursesAC.name !== '') {
        if (this.coursesAC.name === 'Deine Veranstaltung ist nicht dabei?') {
          this.openCourseCreation()
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
    removeCourseTo (index) {
      this.courseTitleToArray.splice(index, 1)
      this.courseCounter = (-1) + this.courseCounter
    },

    // ––––––––––––––––––––––––––––– HILFSFUNKTIONEN  –––––––––––––––––––––––––––––––––––
    courseItemName (index) { // gibt Name der ausgewählten Veranstaltungen aus Liste wider
      return this.courseTitleToArray[index].courseName
    },
    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    // –––––––––––––––––––––––– NEUE VERANSTALTUNG ERSTELLEN ––––––––––––––––––––––––––––
    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    openCourseCreation () { // Navigation zu Kurserstellungs-Modal setzen
      if (this.activeStep === 'st') {
        this.courseTitleFrom = null
      } else if (this.activeStep === 'nd') {
        this.courseTitleTo = null
      }
      this.newCourse = true
      this.forwardItem = 'Erstellen' // buttongroup forwarditem setzen
      this.backItem = 'Abbrechen' // buttongroup backitem setzen
    },
    setNewCourseTitle () {
      this.hasNewCourseTitleSet = true
    },
    setNewCourseId () {
      this.hasNewCourseIdSet = true
    },
    createCourse () {
      M.createCourse(this.newCourseTitle, this.newCourseId)
        .then(() => {
          this.courses = []
          this.initiateAC()
          this.newCourse = false // schließen des Formulars/Dialogs
          this.onSuccess('courseCreated')
        }).catch((error) => {
          this.onFailure(error.cause.message)
        })
    },
    // ––––––––––––––––––––––––––––– HILFSFUNKTIONEN  –––––––––––––––––––––––––––––––––––
    removeSpaces (string) {
      string = string.replace(/\s/g, '-')
      return string
    },
    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    // ––––––––––––––––––––––––––––– GRUPPEN ANGEBEN ––––––––––––––––––––––––––––––––––––
    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
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
      } else if (this.activeStep === 'nd') {
        this.courseGroupToArray.splice(index, 1)
      }
    },
    groupName (index) { // gibt Name der ausgewählten Gruppen aus Liste wider
      return this.courseGroupToArray[index].groupName
    },
    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    // ––––––––––––––––––––––––––– TAUSCHKARTENERSTELLUNG –––––––––––––––––––––––––––––––
    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    createSearchedCourses () { // Formatierung der Kursliste für DB (Veranstaltung ohne Untergruppe)
      for (var i = 0; i < this.courseTitleToArray.length; i++) {
        this.searchedCourses.push(this.courseTitleToArray[i].courseName.substring(0, this.courseTitleToArray[i].courseName.indexOf(' –')))
      }
    },
    createSearchedCoursesSingle () { // Formatierung der Kursliste für DB (Veranstaltung mit Untergruppe)
      this.searchedCourses = new Array(this.courseTitleFrom.substring(0, this.courseTitleFrom.indexOf(' –')))
    },
    createSearchedGroups () { // Formatierung der Gruppenliste für DB
      for (var i = 0; i < this.courseGroupToArray.length; i++) {
        this.searchedGroups.push(this.courseGroupToArray[i].groupName)
      }
    },
    createSwopCard () {
      M.createSwopCard(this.searchedCourses, this.searchedGroups, this.courseTitleFrom.substring(0, this.courseTitleFrom.indexOf(' –')), this.courseGroupFrom)
      .then(() => {
        this.onSuccess('swopCardCreated')
        this.$router.push('dashboard') // umleitung auf dashboard
      }).catch((error) => {
        this.onFailure(error.cause.message.message)
      })
    },
    // ––––––––––––––––––––––––––––– HILFSFUNKTIONEN  –––––––––––––––––––––––––––––––––––
    jump (to) { // fokus auf nächstes feld in kurserstellungs-modal
      if (to === 'id') {
        document.getElementById('id').focus()
      }
    },
    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    // ––––––––––––––––––––––––––––––––– FEEDBACK –––––––––––––––––––––––––––––––––––––––
    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    onSuccess (successMessage) { // Benachrichtigung über Erfolg von ausgeführten Aktionen
      var message
      if (successMessage === 'courseCreated') {
        message = 'Deine Veranstaltung wurde erfolgreich erstellt!'
      } else if (successMessage === 'swopCardCreated') {
        message = 'Deine Tauschkarte wurde erfolgreich erstellt!'
      }
      this.$toast.open({
        message: message,
        type: 'is-success',
        position: 'is-top'
      })
    },
    onFailure (errorMessage) { // Benachrichtigung über Fehlschlagen von ausgeführten Aktionen (nach Frontend- und Backendvalidierung)
      var message
      if (errorMessage === 'courseFromNotSet') {
        message = 'Bitte wähle Deine Veranstaltung aus.'
      } else if (errorMessage === 'courseTitleToArrayEmpty') {
        message = 'Bitte gib mindestens eine Wunschveranstaltung an.'
      } else if (errorMessage === 'courseGroupToArrayEmpty') {
        message = 'Bitte gib mindestens eine Wunschgruppe an.'
      } else if (errorMessage === null) {
        message = 'Oops, irgendentwas scheint schief gelaufen zu sein.'
      } else {
        message = errorMessage + '.'
      }
      this.$toast.open({
        message: message,
        type: 'is-danger',
        position: 'is-top'
      })
    },

    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    // –––––––––––––––––––––––––––––– AUTOCOMPLETE ––––––––––––––––––––––––––––––––––––––
    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    createAutocomplete () {
      for (var course in this.courses) {
        this.coursesAC.data.push(this.getCourseId(this.courses[course].id).concat(' – ').concat(this.courses[course].name))
      }
      this.coursesAC.data.push('Deine Veranstaltung ist nicht dabei?')
    },

    // ––––––––––––––––––––––––––––– HILFSFUNKTIONEN  –––––––––––––––––––––––––––––––––––
    getCourseId (courseid) { // Filtert reine ID aus ID-Directory aus DB
      courseid = courseid.substring(11)
      return courseid
    },
    selectOrCreate () { // wählt Item in Autocomplete auf Enter oder Klick korrekt aus; verhindet leere Eingaben
      if (this.activeStep === 'st') {
        if (this.coursesAC.selected === null) {
          this.courseFromSelected = false
        } else if (this.coursesAC.selected !== null) {
          this.coursesAC.name = this.coursesAC.selected
          this.coursesAC.selected === null
          this.courseFromSelected = true
          if (this.coursesAC.name === 'Deine Veranstaltung ist nicht dabei?') {
            this.coursesAC.name = ''
            this.openCourseCreation() // Öffnen des Kurserstellungs-Modals
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
            this.openCourseCreation()
          }
        }
      }
    },
    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    // ––––––––––––––––––––––––––––––– NAVIGATION  ––––––––––––––––––––––––––––––––––––––
    // ––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––––
    forward () {
      if (this.activeStep === 'st' && !this.newCourse) { // Step 1 nach Step 2
        // ––––––––––––––––––––––––––––––– NAVIGATION –––––––––––––––––––––––––––––––––––––
        if (this.courseFromSet) {
          this.activeStep = 'nd' // Navdots
          this.backItem = 'Zurück' // Buttongroup Backitem
          this.stepsDone.push('st') // Step 1 done
          // –––––––––––––––––––––––––––––––– ACTIONS –––––––––––––––––––––––––––––––––––––
          this.courseTitleFrom = this.coursesAC.name // Aktuellen Kurs speichern
          if (this.hasGroupFrom) {
            this.coursesAC.name = this.courseTitleFrom
            this.courseTitleTo = this.courseTitleFrom
          } else if (!this.hasGroupFrom) {
            this.coursesAC.name = ''
            this.coursesAC.selected = ''
          }
        } else { // Fehlermeldung bei nicht gesetzter aktueller Veranstaltung
          this.onFailure('courseFromNotSet')
        }
      } else if (this.activeStep === 'nd' && !this.newCourse) { // Step 2 nach Step 3
        if (this.courseTitleToArray.length !== 0 || this.courseGroupToArray.length !== 0) {
          // ––––––––––––––––––––––––––––––– NAVIGATION –––––––––––––––––––––––––––––––––––––
          this.activeStep = 'rd' // Navdots
          this.forwardItem = 'Tauschpartner finden!' // Buttongroup Forwarditem
          this.stepsDone.push('nd') // Step 2 done
          // –––––––––––––––––––––––––––––––– ACTIONS ––––––––––––––––––––––––––––––––––––––
          this.courseTitleTo = this.coursesAC.name
        } else { // Fehlermeldung bei nicht gesetzter Wunschveranstaltung oder Wunschgruppe
          if (this.hasGroupFrom) {
            this.onFailure('courseGroupToArrayEmpty')
          } else {
            this.onFailure('courseTitleToArrayEmpty')
          }
        }
      } else if (this.activeStep === 'rd') { // Bestätigung Step 3
        if (this.hasGroupFrom) {
          this.createSearchedCoursesSingle() // Formatierung Kurses für DB
          this.createSearchedGroups() // Formatierung der Gruppenliste für DB
          this.createSwopCard() // Tauschkarten mit Gruppen abschicken
        } else if (!this.hasGroupFrom) {
          this.createSearchedCourses() // Formatierung der Kursliste für DB
          this.createSwopCard() // Tauschkarten ohne Gruppen abschicken
        }
      } else if (this.newCourse) { // Bestätigung Kurserstellung
        this.newCourseId = this.removeSpaces(this.newCourseId)
        if (this.activeStep === 'st') {
          this.createCourse()
          this.coursesAC.name = this.newCourseId.concat(' – ').concat(this.newCourseTitle)
          this.coursesAC.selected = this.coursesAC.name
          this.backItem = 'Abbrechen' // Anpassen der Buttongroup
          this.setCourseFrom()
        }
        if (this.activeStep === 'nd') {
          this.createCourse()
          this.coursesAC.name = this.newCourseId.concat(' – ').concat(this.newCourseTitle)
          this.coursesAC.selected = this.coursesAC.name
          this.backItem = 'Zurück'
          this.addCourseTo()
        }
        this.hasNewCourseTitle = false
        this.hasNewCourseTitleSet = false
        this.hasNewCourseId = false
        this.hasNewCourseIdSet = false
        this.newCourseTitle = ''
        this.newCourseId = ''
        this.forwardItem = 'Weiter' // Buttongroup Forwarditem
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
          this.coursesAC.data = []
          this.createAutocomplete()
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
    margin-left: 2%;
    margin-right: 2%;
}
.nav-dots-container .nav-dot.active {
    background: #F39016;
    transform: scale(1.618);
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
  width: auto !important;
}

.modal-background {
  background-color: rgba(0, 0, 0, 0.4);
}
@media only screen and (min-width: 451px) {
.is-5.description{
  margin-bottom: 2rem;
}
}

</style>
