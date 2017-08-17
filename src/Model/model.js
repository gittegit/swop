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
   * change the password
   * @param {String} oldPassword
   * @param {String} newPassword
   * @returns {*|{value}}
   */
  changePassword (oldPassword, newPassword) {
    return db.User.me.newPassword(oldPassword, newPassword)
  }

  /**
   * Create a new course
   * @param name String
   * @param courseId String
   * @returns {Promise.<*>}
   */
  createCourse (name, courseId) {
    return db.modules.post('createCourse', {id: courseId, name: name})
  }

  /**
   * Get all courses from the database
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
   * load a swopcard object by its id
   * @param swopCardId
   */
  loadSwopCardById (swopCardId) {
    return db.SwopCard.load(swopCardId)
  }

  /**
   * get all swopCards from the current User
   * @returns Set
   */
  getMySwopCards () {
    var currentUser = db.User.me
    return currentUser.swopCards
      // .matches('createdBy', currentUser)
      // .ascending('createdAt')
      // .resultList().then((swopCards) => {
      //   return swopCards
      // })
  }

  /**
   * Deletes a swopcard by its given id
   * @param id
   * @returns {Promise.<*>}
   */
  deleteSwopCard (id) {
    return db.modules.post('deleteSwopCard', {id: id})
  }

  /**
   * TODO: creates a match with the given swopCards
   * @param {String} swopCard1Id
   * @param {String} swopCard2Id
   */
  createMatch (swopCard1Id, swopCard2Id) {
    return db.modules.post('createMatch', {
      swopCard1: swopCard1Id,
      swopCard2: swopCard2Id
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
