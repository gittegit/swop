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
    username = username.toLowerCase()
    return db.User.login(username, pw)
  }

  /**
  Loggt den User aus
  @return Promise
  */
  logout () {
    return db.User.logout()
  }

  register (displayName, username, password) {
    username = username.toLowerCase()
    return db.User.register(username, password)
      // return db.modules.post('updateRestrictedUserInfo', {id: userObject.id, displayName: displayName})
  }

  // /**
  //  * Registriert einen neuen User
  //  * @param displayName
  //  * @param username
  //  * @param password
  //  * @returns {*|Promise.<model.User>}
  //  */
  // register (displayName, username, password) {
  //   return db.User.register(username, password).then(() => {
  //     return db.modules.post('createRestrictedUserInfo', {
  //       displayName: displayName,
  //       email: username
  //     })
  //   })
  // }

  /**
   * getDisplayName from the current user
   * @returns {Promise.<TResult>}
   */
  getDisplayName () {
    return db.User.load(db.User.me.id, {depth: 1}).then((user) => {
      return user.restrictedUserInfo.displayName
    })
  }

  getEmail () {
    return db.User.load(db.User.me.id, {depth: 1}).then((user) => {
      return user.restrictedUserInfo.email
    })
  }

  /**
   * updates the displayName of the user
   * @param displayName
   * @returns {Promise.<*>}
   */
  updateUsername (displayName) {
    return db.modules.post('updateDisplayName', {displayName: displayName})
  }

  /**
   * updates the email of the user, but it is not the login email
   * @param email
   * @returns {Promise.<*>}
   */
  updateEmail (email) {
    return db.modules.post('updateEmail', {email: email})
  }

  /**
   * Deletes the user for EVER
   * @returns {*|{value}}
   */
  delete () {
    return db.modules.post('deleteUser')
  }

  /**
   * change the password
   * @param {String} oldPassword
   * @param {String} newPassword
   * @returns {*|{value}}
   */
  changePassword (oldPassword, newPassword) {
    return db.User.newPassword(db.User.me.username, oldPassword, newPassword)
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
    // var currentUser = db.User.me
    return db.User.load(db.User.me.id, {depth: 2}).then((currentUser) => {
      return Array.from(currentUser.swopCards)
    })
  }

  /**
   * Deletes a swopcard by its given id
   * @param id of the swopCard
   * @returns {Promise.<*>}
   */
  deleteSwopCard (id) {
    return db.modules.post('deleteSwopCard', {id: id})
  }

  /**
   * creates a match with the given swopCards
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
   * updates the Match object with the new status from the current user, which is logged In
   * @param matchId
   * @param {String} newStatus: only ACCEPTED or DECLINED allowed
   * @returns {Promise.<*>}
   */
  updateMatchStatus (matchId, newStatus) {
    return db.modules.post('updateMatchStatus', {
      id: matchId,
      status: newStatus
    })
  }

  getMatchStatus (matchId) {
    return db.modules.post('getMatchStatus', {id: matchId})
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
