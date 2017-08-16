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
   * @return Promise
   */
  getAllCourses () {
    return db.Course.find()
      .ascending('name')
      .resultList().then((result) => {
        return result
      })
  }

  /**
  * Erstellt eine Swopcard und speichert Sie in der Datenbank ab
  @param courseId: String, die Id des Kurses
  @param group: String, optional, die Gruppe in der sich der User befindet
  @param searchedCourses: [String], Ids der Kurse die gesucht werden
  @param searchedGroups: [String], Gruppennamen der Gruppen die gesucht werden
  @throws Error sofern ein Kurs nicht existiert
  @return Promise
  */
  createSwopCard (searchedCourses, searchedGroups, courseId, group) {
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
