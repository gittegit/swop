import db from 'baqend'

/**
Das Modell dient als Schnittstelle zur Datenbank
*/
class Modul {
  constructor () {
    this.swopCards = []
  }

  /**
  Loggt den User ein
  @param username: der username (Emailadresse) des Users
  @param pw: password des Users
  @return Promise
  */
  login (username, pw) {
    return db.User.login(username, pw)
  }

  /**
  Loggt den User aus
  @return Promise
  */
  logout () {
    return db.User.logout()
  }

  /**
  Erstellt einen neuen Kurs
  @param name: name des Kurses
  @param courseId: die Id des Kurses (die bei Stine angegeben wird)
  @return Promise
  */
  createCourse (name, courseId) {
    const newCourse = db.Course()
    newCourse.name = name
    newCourse.validName = false
    newCourse.id = courseId
    return newCourse.insert()
  }

  /**
  @param courseId: String, die Id des Kurses
  @param group: String, optional, die Gruppe in der sich der User befindet
  @param searchedCourses: [String], Ids der Kurse die gesucht werden
  @param searchedGroups: [String], Gruppennamen der Gruppen die gesucht werden
  @throws Error sofern ein Kurs nicht existiert
  @return Promise
  */
  createSwopCard (searchedCourses, searchedGroups, courseId, group) {
    // Ansatz clientseitig die Kurse schon zu validieren
    // const coursePromise = db.Course.load(courseId)
    // const searchedCoursesPromises = []
    // const newSwopCard = new db.Course()
    //
    // searchedCourses.forEach((searchedCourseId) => {
    //   searchedCoursesPromises.push(db.Course.load(searchedCourseId))
    // })
    // // TODO: Vue spuckt Fehler, dass die Funktion undefined ist und die
    // // searched Courses werden nicht hinzugefuegt
    // coursePromise
    //   .then((course) => {
    //     newSwopCard.course = course
    //     newSwopCard.searchedCourses = new Set()
    //
    //     Promise.all(searchedCoursesPromises)
    //       .then((courses) => {
    //         courses.forEach((course) => {
    //           newSwopCard.searchedCourses.add(course)
    //         })
    //       })
    //     newSwopCard.myGroup = group
    //     newSwopCard.searchedGroups = searchedGroups
    //
    //     return (new db.SwopCard(newSwopCard)).insert()
    //   })
    //   .catch(() => {
    //     throw new Error('Something went wrong')
    //   })

    // Eigentlich mega scheiße da die einzelnen Kurse reingeladen werdne muessen
    // Doch mit Backend code... Wieso benutzen wir eig. Daas, man mega scheiße
    // Schmeißt wieder Fehler, dass die methode undefined ist
    // const coursePromises = []
    // const newSwopCard = new db.SwopCard()
    // coursePromises.push(db.Course.load(courseId))
    // searchedCourses.forEach((searchedCoursesId) => {
    //   coursePromises.push(db.Course.load(searchedCoursesId))
    // })
    //
    // Promise.all(coursePromises)
    //   .then((courses) => {
    //     // wichtig: das erste Promise ist der eigene Kurs!
    //     newSwopCard.course = courses.shift() // entfernt das erste Objekt
    //     // die gesuchten Kurse
    //     newSwopCard.searchedCourses = new db.Set(courses)
    //     newSwopCard.searchedGroups = searchedGroups
    //     newSwopCard.group = group
    //     console.log(newSwopCard)
    //     return newSwopCard.insert()
    //   })
    //   .catch((err) => {
    //     throw new Error(err + ' Oops, something went wrong')
    //   })

    // Ansatz die Kurs-Adresse lokal zu erstellen und serverseitig zu überprüfen
  //   const newSwopCard = new db.SwopCard()
  //   const searchedCoursesPaths = []
  //   newSwopCard.course = 'db/Course/' + courseId
  //
  //   searchedCourses.forEach((searchedCourseId) => {
  //     searchedCoursesPaths.push('db/Course/' + searchedCourseId)
  //   })
  //   newSwopCard.searchedCourses = new db.Set([searchedCoursesPaths])
  //
  //   newSwopCard.searchedGroups = searchedGroups
  //   newSwopCard.group = group
  //
  //   return newSwopCard.insert()

    db.modules.post('createSwopCard', {
      searchedCourses,
      searchedGroups,
      courseId,
      group
    })
  }

    /**
    gibt einen Teststring aus
    */
  getTestString () {
    return 'Test String'
  }
}

const M = new Modul()

module.exports = M
