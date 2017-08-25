import db from 'baqend'

/**
* Das Model dient als Schnittstelle zur Datenbank, es stellt Getter und Setter
* Methoden zur Manipulation der User, SwopCard, Course und Match Daten bereit.
* Es hält ein lokales Abbild der Userdaten als Felder, die jedes Mal Aktualisiert
* werden, wenn eine neue Anfrage beispielsweise mittels createSwopCard()
* gestellt wird. Die Daten können zudem mittels initUserData() und refreshHard()
* manuell neu geladen werden.
*/
class Modul {
  constructor () {
    this.swopCards // {Map}
    this.user // {Object}
    this.matches // {Map}
    // db.connect('restless-bolt-1') Wird momentan in der main.js geladen
  }

  /**
  * Versucht Serverdaten vom Server zu laden. "Versucht", weil anscheinend
  * Userdaten gecached werden und nicht jedes mal eine neue Anfrage rausgesendet
  * wird.
  * @returns {Promise|Object}
  */
  refreshHard () {
    return db.User.load(db.User.me.id, {depth: 3})
      .then((user) => {
        this.parseAndSaveUserData(user)
      //   return new Promise(function (resolve, reject) {
      //     ({message: 'Userdaten wurden neu geladen'})
      //   })
      })
  }

  /**
  * Lädt Userdaten vom Server, sofern diese noch nicht initialisiert waren
  * @returns {Promise|Object}
  */
  initUserData () {
    if (this.user) {
      return new Promise(function (resolve, reject) {
        resolve({message: 'Userdaten waren schon geladen'})
      })
    } else {
      return this.refreshHard()
    }
  }

  /**
  * Aktualisiert die lokalen Userdaten, d.h. this.user, this.swopCards und
  * this.matches
  * @param {currentUser} User mit den zuaktualisierenden Daten
  */
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

  /**
  * Aktualisiert die lokalen restrictedUserInfo Daten, d.h. Emailadresse und
  * Displaynamen
  * @param {restrictedUserInfo} restrictedUserInfo die die zuaktualisierenden
  * Daten enthält
  */
  parseAndSaveRestrictedUserInfoData (restrictedUserInfo) {
    this.user.restrictedUserInfo.displayName = restrictedUserInfo.displayName
    this.user.restrictedUserInfo.email = restrictedUserInfo.email
  }

  /**
  * Loggt den User ein
  * @param {username} String der username (Emailadresse) des Users
  * @param {pw} String Passwort des Users
  * @return {Promise}
  */
  login (username, pw) {
    username = username.toLowerCase()
    return db.User.login(username, pw)
  }

  /**
  * Loggt den User aus
  * @return {Promise}
  */
  logout () {
    this.user = null
    this.swopCards = null
    this.matches = null
    return db.User.logout()
  }

  /**
   * Registriert einen neuen User
   * @param {displayName} String der gewünschte Displayname des Users
   * @param {username} String die Emailadresse des Users
   * @param {password} String das gewünschte Passwort des Users
   * @returns {Promise|Object}
   */
  register (displayName, username, password) {
    username = username.toLowerCase()
    const restrictedUserInfo = new db.RestrictedUserInfo({
      email: username,
      displayName: displayName
    })
    return restrictedUserInfo.save().then(() => {
      return db.User.register(username, password)
    })
  }

  /**
  * Gibt den Displaynamen des eingeloggten Users aus
  * @returns {String} der Displaynamen des eingeloggten Users
  */
  getDisplayName () {
    return this.user.restrictedUserInfo.displayName
  }

  /**
  * Gibt die Emailadresse eingeloggten Users aus
  * @returns {String} die Emailadresse des eingeloggten Users
  */
  getEmail () {
    return this.user.restrictedUserInfo.email
  }

  /**
  * Gibt den usernamen des eingeloggten Users aus
  * @returns {String} der username des eingeloggten Users
  */
  getLoginEmail () {
    return this.user.username
  }

  /**
   * Updatet den Displaynamen des aktuellen Users.
   * @param {email} String der gewünschte neue Name
   * @returns {Promise|JSON} welches angibt ob die Aktion erfolgreich war und das
   * aktualisierte RestrictedUserInfo Objekt enthält
   */
  updateUsername (displayName) {
    return db.modules.post('UserService', {route: 'UPDATE_DISPLAY_NAME', displayName: displayName})
      .then((val) => {
        this.parseAndSaveRestrictedUserInfoData(val.success.updatedRestrictedUserInfo)
        return new Promise(function (resolve, reject) {
          resolve(val)
        })
      })
  }

  /**
   * Updatet die Email an die die Swopbenachrichtigungen geschickt werden in
   * der RestrictedUserInfo.
   * @param {email} String die gewünschte neue Email
   * @returns {Promise|JSON} welches angibt ob die Aktion erfolgreich war und das
   * aktualisierte RestrictedUserInfo Objekt enthält
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
   * Löscht den User aus der Datenbank. Schmeißt im Moment noch gewollt einen
   * Error.
   * @returns {Promise|Object}
   */
  deleteUser () {
    return db.modules.post('UserService', {route: 'DELETE_USER'})
  }

  /**
   * Ändert das Passwort des aktuellen Users
   * @param {String} oldPassword das aktuelle Passwort des Users
   * @param {String} newPassword das neue Passwort des Users
   * @returns {Promise|Object}
   */
  changePassword (oldPassword, newPassword) {
    return db.User.newPassword(db.User.me.username, oldPassword, newPassword)
  }

  /**
   * Erstellt einen neuen Kurs
   * @param {name} String Name der zuerstellenden Veranstaltung
   * @param {courseId} String Veranstaltungsid der
   * @returns {Promise|JSON}
   */
  createCourse (name, courseId) {
    return db.modules.post('createCourse', {id: courseId, name: name})
  }

  /**
  * Gibt alle aktuell in Datenbank gespeicherten Kurse in der Datenbank aus.
  * @return {Promise|JSON}
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
  * Erstellt eine neue Swopcard und speichert Sie in der Datenbank ab
  * @param {searchedCourses} Array Ids als Strings der Kurse die gesucht werden
  * @param {searchedGroups} Array Gruppennamen als Strings der Gruppen die
  * gesucht werden, wenn keine gesucht werden leeres Array [] übergeben
  * @param {courseId} String die Id des Veranstaltung aus der User raus will
  * @param {group|String} String die Gruppe in der sich der User befindet, wenn
  * keine Gruppen existiert leeren String "" übergeben.
  * @return {Promise|JSON} welches angibt ob die Aktion erfolgreich war und das
  * aktualisierte User Objekt enthält
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
      // const parsedValue = JSON.parse(JSON.stringify(val))
      this.parseAndSaveUserData(val.success.user)
      return new Promise(function (resolve, reject) {
        resolve(val)
      })
      // this.getMySwopCards().then((e) => {
      //   return new Promise(function (resolve, reject) {
      //     resolve(val)
      //   })
      // })
    })
  }

  /**
  * Gibt eine bestimmte SwopCard aus
  * @param {swopCardId} String: Id der SwopCard, die ausgegeben werdne soll
  * @returns {SwopCard}
  */
  getSwopCard (swopCardId) {
    return this.swopCards.get(swopCardId)
  }

  /**
  * Gibt alle SwopCards des aktuellen Users aus. War mal asynchron, deswegen
  * wird hier noch ein Promise zurückgegben.
  * @returns {Promise} Enthält die SwopCards als sortiertes Array
  */
  getMySwopCards () {
    const swoppies = Array.from(this.swopCards.values())
    // TODO: nicht jedes mal sortieren
    swoppies.sort(function (a, b) {
      return b.createdAt.getTime() - a.createdAt.getTime()
    })
    return new Promise(function (resolve, reject) {
      resolve(swoppies)
    })
  }

  /**
   * Löscht eine SwopCard des aktuellen Users
   * @param {id} String die Id der SwopCard die gelöscht werden soll
   * @returns {Promise|JSON} welches angibt ob die Aktion erfolgreich war und das
   * aktualisierte User Objekt enthält
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
  * Überprüft ob der User zu einem gegebenen Match den Status verändern
  * kann, also ob der User den Match schon akzeptiert oder abgelehnt hat.
  * @param {matchId} String die Id des Matches für die überprüft werden soll,
  * ob der Status mittels des aktuellen Users änderbar ist.
  * @return {boolean} true, falls der User noch nicht akzeptiert/abgelehnt
  * hat, sonst false.
  */
  isMatchStatusChangeable (matchId) {
    let matchObj
    // Es ist egal ob der Pfad oder nur die Id übergeben wird
    if (!matchId.startsWith('/db/Match/')) matchId = 'db/Match/' + matchId
    // get the right match
    matchObj = this.matches.get(matchId)
    if (matchObj.user1.user.id === db.User.me.id) {
      return matchObj.status1 === 'WAITING'
    } else if (matchObj.user2.user.id === db.User.me.id) {
      return matchObj.status2 === 'WAITING'
    }
  }

  /**
  * Gibt die aktuellen Stati beider User eines Matches aus.
  * @param {matchId} String die Id des Matches für die beide Stati ausgegeben
  *  werden sollen.
  * @return {String[]} wobei der erste Eintrag der Match Status des eigenen
  * Users ist und der zweite der Match Status des anderen Users ist.
  */
  getMatchStatus (matchId) {
    let matchObj
    // Es ist egal ob der Pfad oder nur die Id übergeben wird
    if (!matchId.startsWith('/db/Match/')) matchId = 'db/Match/' + matchId
    // get the right MatchObj
    matchObj = this.matches.get(matchId)
    if (matchObj.user1.user.id === db.User.me.id) {
      return [matchObj.status1, matchObj.status2]
    } else if (matchObj.user2.user.id === db.User.me.id) {
      return [matchObj.status2, matchObj.status1]
    }
  }

  /**
  * Gibt das RestrictedUserInfo Objekt des anderen Users eines Matches aus,
  * sofern dieses schon vom MatchService gesetzt wurde.
  * @param {matchId} String die Id des Matches für die das RUI des anderen
  * Users ausgegeben werden soll
  * @returns {RestrictedUserInfo} ({displayName: String, email: String})
  */
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
   * Akzeptiert den Match zu einer gegebenen MatchId vom aktuellen User aus ab
   * @param {matchId} String die Id des Matches
   * @returns {Promise|JSON} welches angibt ob die Aktion erfolgreich war und das
   * aktualisierte User Objekt enthält
   */
  acceptMatch (matchId) {
    return db.modules.post('MatchService', {
      route: 'ACCEPT_MATCH',
      id: matchId
    })
    .then((val) => {
      this.parseAndSaveUserData(val.success.user)
      return new Promise(function (resolve, reject) {
        resolve(val)
      })
    })
  }

  /**
   * Lehnt den Match zu einer gegebenen MatchId vom aktuellen User aus ab
   * @param {matchId} String die Id des Matches
   * @returns {Promise|JSON} welches angibt ob die Aktion erfolgreich war und das
   * aktualisierte User Objekt enthält
   */
  declineMatch (matchId) {
    return db.modules.post('MatchService', {
      route: 'DECLINE_MATCH',
      id: matchId
    }).then((val) => {
      this.parseAndSaveUserData(val.success.user)
      return new Promise(function (resolve, reject) {
        resolve(val)
      })
    })
  }

  /**
    gibt einen Teststring aus. Zum testen der Einbindung des Moduls.
    @return {String}
  */
  getTestString () {
    return 'Test String'
  }
}

const M = new Modul()

module.exports = M
