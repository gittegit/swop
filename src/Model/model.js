import db from 'baqend'

/**
Das Modell dient als Schnittstelle zur Datenbank
*/
class Modul {
  constructor () {
    this.swopCards
    this.user
    this.matches
  }

  /**
  * Initialisiert die User Daten einmal zu Begin
  * @returns {Promise}
  */
  initUserData () {
    if (this.user || this.matches || this.swopCards) {
      return new Promise(function (resolve, reject) {
        resolve('Userdaten waren schon initialisiert')
      })
    } else {
      return db.User.load(db.User.me.id, {depth: 3})
        .then((user) => {
          this.parseAndSaveUserData(user)
        })
    }
  }

  parseAndSaveUserData (currentUser) {
    this.user = currentUser
    const swopTemp = new Map()
    const matchesTemp = new Map()
    currentUser.swopCards.forEach((swopCard) => {
      swopCard.updatedAt = new Date(swopCard.updatedAt)
      swopCard.createdAt = new Date(swopCard.createdAt)
      swopTemp.set(swopCard.id, swopCard)
      if (swopCard.match) matchesTemp.set(swopCard.match.id, swopCard.match)
    })
    this.swopCards = swopTemp
    this.matches = matchesTemp
  }

  parseAndSaveRestrictedUserInfoData (restrictedUserInfo) {
    this.user.restrictedUserInfo.name = restrictedUserInfo.name
    this.user.restrictedUserInfo.email = restrictedUserInfo.email
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
    this.user = null
    this.swopCards = null
    this.matches = null
    return db.User.logout()
  }

  /**
   * registriert einen neuen User
   * @param displayName
   * @param username
   * @param password
   * @returns {*|Promise.<model.User>}
   */
  register (displayName, username, password) {
    var restrictedUserInfo = new db.RestrictedUserInfo({email: username, displayName: displayName})
    return restrictedUserInfo.save().then(() => {
      return db.User.register(username, password)
    })
    // return db.modules.post('createUser', {username: username, password: password, displayName: displayName})
      // return db.modules.post('updateRestrictedUserInfo', {id: userObject.id, displayName: displayName})
  }

  getDisplayName () {
    return this.user.restrictedUserInfo.displayName
  }

  getEmail () {
    return this.user.restrictedUserInfo.email
  }

  getLoginEmail () {
    return this.user.username
  }

  /**
   * updates the displayName of the user
   * @param displayName
   * @returns {Promise.<*>}
   */
  updateUsername (displayName) {
    // return db.modules.post('updateDisplayName', {displayName: displayName})
    return db.modules.post('UserService', {route: 'UPDATE_DISPLAY_NAME', displayName: displayName})
      .then((val) => {
        this.parseAndSaveRestrictedUserInfoData(val.success.updatedRestrictedUserInfo)
        return new Promise(function (resolve, reject) {
          resolve(val)
        })
      })
  }

  /**
   * Updatet die Email an die die Swopbenachrichtigungen geschickt werden und
   * @param email
   * @returns {Promise.<*>}
   */
  updateEmail (email) {
    email = email.toLowerCase()
    return db.modules.post('UserService', {route: 'UPDATE_EMAIL', email: email})
      .then((val) => {
        this.parseAndSaveRestrictedUserInfoData(val.success.updatedRestrictedUserInfo)
        return new Promise(function (resolve, reject) {
          resolve(val)
        })
      })
  }

  /**
   * Deletes the user for EVER
   * @returns {*|{value}}
   */
  deleteUser () {
    return db.modules.post('UserService', {route: 'DELETE_USER'})
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
      .resultList()
        .then((result) => {
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
    return db.modules.post('SwopCardService', {
      route: 'CREATE_SWOP_CARD',
      searchedCourses: searchedCourses,
      searchedGroups: searchedGroups,
      courseId: courseId,
      group: group
    })
    .then((val) => {
      const parsedValue = JSON.parse(JSON.stringify(val))
      this.parseAndSaveUserData(parsedValue.success.user)
      this.getMySwopCards().then((e) => {
        return new Promise(function (resolve, reject) {
          // console.log('M nach erstellung von Swopcard', M)
          // console.log('swopcards nach der Erstellung', e)
          resolve(val)
        })
      })
    })
    // .then((val) => {
    //   console.log('Swopcard erstellt', val) // TODO: WTF WTF WTF
    //   promiseValue = val
    //   return this.loadUserData()
    // })
    // .then(() => {
    //   console.log('Swopcard erstellt', this.swopCards)
    //   return new Promise(function (resolve, reject) {
    //     resolve(promiseValue)
    //   })
    // })
  }

  /**
  *Returns a Swopcard
  *@param swopCardId id der Swopcard
  *@returns Swopcard
  */
  getSwopCard (swopCardId) {
    return this.swopCards.get(swopCardId)
  }

  /**
  *Legacy Function, returns a swopcard
  *
  */
  loadSwopCardById (swopCardId) {
    return this.getSwopCard(swopCardId)
  }

  /**
   * get all swopCards from the current User
   * @returns {Promise} containing the Swopcards as an Array
   */
  getMySwopCards () {
    const swoppies = Array.from(this.swopCards.values())
    swoppies.sort(function (a, b) {
      return a.createdAt.getTime() - b.createdAt.getTime()
    })
    return new Promise(function (resolve, reject) {
      // console.log('getMySwopCards 3')
      resolve(swoppies)
    })
  }

  /**
   * Deletes a swopcard by its given id
   * @param id of the swopCard
   * @returns {Promise.<*>}
   */
  deleteSwopCard (id) {
    return db.modules.post('SwopCardService', {
      route: 'DELETE_SWOP_CARD',
      id: id
    })
    .then((val) => {
      this.parseAndSaveUserData(val.success.user)
      return new Promise(function (resolve, reject) {
        resolve(val)
      })
    })
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

  /**
    * Überprüft LOKAL ob der User zu einem gegebenen Match den Status verändern
    * kann, also ob der User den Match schon accepted oder declined hat
    * @return {boolean} true, if the user has not accepted/declined yet, false
    * if the user has already accepted/declined a match
    * @throws {Error}
  */
  isMatchStatusChangeable (matchId) {
    let matchObj
    // Es ist egal ob der Pfad oder nur die Id übergeben wird
    if (!matchId.startsWith('/db/Match/')) matchId = 'db/Match/' + matchId
    // find the right MatchObj
    matchObj = this.matches.get(matchId)
    // if (!matchObj) throw 'No match was found with that id that belongs to you'
    // find out if db.User.me is user1 oder user2 and check that status
    // console.log(matchObj, db.User.me.id)
    if (matchObj.user1.user.id === db.User.me.id) {
      return matchObj.status1 === 'WAITING'
    } else if (matchObj.user2.user.id === db.User.me.id) {
      return matchObj.status2 === 'WAITING'
    }
  }

  /**
    * Gibt lokal den Status eines Matches aus
    *@return {String[]} wobei der erste Eintrag der Match Status des eigenen
    * Users ist und der zweite der Match Status des anderen Users ist
    * @throws {Error}
  */
  getMatchStatus (matchId) {
    let matchObj
    // Es ist egal ob der Pfad oder nur die Id übergeben wird
    if (!matchId.startsWith('/db/Match/')) matchId = 'db/Match/' + matchId
    // find the right MatchObj
    matchObj = this.matches.get(matchId)
    // if (!matchObj) throw 'No match was found with that id that belongs to you'
    // find out if db.User.me is user1 oder user2
    if (matchObj.user1.user.id === db.User.me.id) {
      return [matchObj.status1, matchObj.status2]
    } else if (matchObj.user2.user.id === db.User.me.id) {
      return [matchObj.status2, matchObj.status1]
    }
  }

  getMatchUserDetail (matchId) {
    let matchObj
    // Es ist egal ob der Pfad oder nur die Id übergeben wird
    if (!matchId.startsWith('/db/Match/')) matchId = 'db/Match/' + matchId
    // find the right MatchObj
    matchObj = this.matches.get(matchId)

    if (matchObj.user1.user.id === db.User.me.id) {
      return matchObj.user2.restrictedUserInfo
    } else if (matchObj.user2.user.id === db.User.me.id) {
      return matchObj.user1.restrictedUserInfo
    }
  }

  /**
   * accepts the match from db.User.me by the given match Id
   * @param matchId
   * @returns {Promise.<*>}
   */
  acceptMatch (matchId) {
    return db.modules.post('acceptMatch', {id: matchId})
    .then((val) => {
      this.parseAndSaveUserData(val.success.user)
      return new Promise(function (resolve, reject) {
        resolve(val)
      })
    })
  }

  /**
   * declines the match from db.User.me by the given match Id
   * @param matchId
   * @returns {Promise.<*>}
   */
  declineMatch (matchId) {
    return db.modules.post('declineMatch', {id: matchId})
    .then((val) => {
      this.parseAndSaveUserData(val.success.user)
      return new Promise(function (resolve, reject) {
        resolve(val)
      })
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
