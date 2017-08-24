const SwopCardService = require('./SwopCardService');
/**
 * Sucht für eine gegebene Swopcard einen Match. Unterscheidet in zwei Fälle: 1. man sucht in derselben Veranstaltung nach einer anderen Gruppe oder 2. man sucht nach einer anderen Veranstaltung, ohne dabei Gruppen anzugeben
 * @param db, die datenbank
 * @param swopcard, die Swopcard für die ein Match gesucht werden soll
 * @return Promise
 */

const validStatuses = {
  waiting: 'WAITING',
  declined: 'DECLINED',
  accepted: 'ACCEPTED'
};

const routes = {
  acceptMatch: 'ACCEPT_MATCH',
  declineMatch: 'DECLINE_MATCH'
};

/**
 * Der MatchService ...
 * @param db
 * @param req, Express Request Object. The Request-JSON-Object must contain a
 * route and the needed parameters for that route
 * @param res Express Response Object
 */
exports.post = function(db, req, res) {
  if (!db.User.me) throw new Abort('Du musst dich einloggen.');

  const params = req.body;
  const route = params.route;
  const userId = req.userId;

  db.log.level = 'debug';

  if (routes.acceptMatch === route){
    return acceptMatch(db, params, userId, req, res);
  } else if (routes.declineMatch === route) {
    return declineMatch(db, params, userId, req, res);
  }
};

function acceptMatch(db, params, userId, req, res) {
  if (!db.User.me) throw new Abort('Du bist nicht eingeloggt.');

  return update(db, res, params.id, 'ACCEPTED');
}

function declineMatch(db, params, userId, req, res) {
  if (!db.User.me) throw new Abort('Du bist nicht eingeloggt.');

  return update(db, res, params.id, 'DECLINED');
}

function update(db, res, id, status) {
  // Ueberpruefung, ob status: {accepted, declined} ist
  if(validStatuses.accepted === status || validStatuses.declined === status) {
    // Match-Objekt laden
    return db.Match.load(id, {depth: 2}).then((matchObject) => {
      // Ueberpruefung, ob db.User.me entweder user1 oder user2 ist
      if (matchObject.user1.user === db.User.me) {
        // db.User.me = user1
        // ueberpruefen, ob der Status vorher auf waiting war
        if (matchObject.status1 !== validStatuses.waiting) {
          throw new Abort('user1: Dein Status ist bereits gesetzt.');
        }
        // status auf den neuen Status setzen (accepted or declined)
        matchObject.status1 = status;
      } else if (matchObject.user2.user === db.User.me) {
        // db.User.me = user2
        // ueberpruefen, ob der Status vorher auf waiting war
        if (matchObject.status2 !== validStatuses.waiting) {
          throw new Abort('user2: Dein Status ist bereits gesetzt.');
        }
        // status auf den neuen Status setzen (accepted or declined)
        matchObject.status2 = status;
      } else {
        throw new Abort('Du bist keiner der beiden Match-User.');
      }
      // TODO: Promise Chain
      return matchObject.save();
    }).then((matchObject) => {
      // TODO: wenn beide accepted haben schicke E-Mail raus und setze Status von SwopCards auf accepted
      if (matchObject.status1 === validStatuses.accepted && matchObject.status2 === validStatuses.accepted) {
        // TODO: sendEmail Funktion
        return acceptSwop(db, res, matchObject.id);
      } else if (matchObject.status1 === validStatuses.declined || matchObject.status2 === validStatuses.declined) {
        // wenn eines declined wurde, fuehre deleteMatch aus -> handling von swopCard status auf declined & waiting
        // return UpdateMatchStatus.deleteMatch(db, res, matchObject.id);
        return MatchService.deleteMatch(db, res, matchObject.id);
      }
    }).then(() => {
      return db.User.load(db.User.me.id, {depth:3})
    }).then((user) => {
      res.status(200);
      const rausSendeUser = user.toJSON({depth:3})
      res.json({
        success: {
          message: 'Match wurde erfolgreich akzeptiert',
          user: rausSendeUser
        }
      });
    }).then(() => {
      res.status(200);
      res.send("Status aendern hat geklappt.");
    }).catch((err) => {
      throw new Abort(err);
    });
  }
}

function acceptSwop(db, res, matchId) {
  db.log.level = 'debug';
  if (!db.User.me) throw new Abort('Du bist der falsche User.');

  var matchObject;
  var restrictedUserInfo1;
  var restrictedUserInfo2;

  return db.Match.load(matchId, {depth: 4}).then((match) => {
    match.user1.swopCard.status = 'ACCEPTED';
    match.user2.swopCard.status = 'ACCEPTED';

    matchObject = match;

    return db.RestrictedUserInfo.find()
      .equal('user', match.user1.user)
      .singleResult();
  }).then((rui1) => {
    //Erlaube User 2 Zugriff auf RUI1
    rui1.acl.allowReadAccess(matchObject.user2.user);
    restrictedUserInfo1 = rui1;
    return rui1.save();
  }).then(() => {
    var match = matchObject;
    //Erlaube User 1 Zugriff auf RUI2
    return db.RestrictedUserInfo.find()
      .equal('user', match.user2.user)
      .singleResult();
  }).then((rui2) => {
    var match = matchObject;
    rui2.acl.allowReadAccess(match.user1.user);
    restrictedUserInfo2 = rui2;

    db.log.debug(matchObject);
    return rui2.save();
  }).then(() => {
    var match = matchObject;

    return match.user1.swopCard.save();
  }).then(() => {
    var match = matchObject;

    return match.user2.swopCard.save();
  }).then(() => {
    return db.Match.load(matchId, {depth: 2});
  }).then((match) => {
    match.user1.restrictedUserInfo = restrictedUserInfo1;
    match.user2.restrictedUserInfo = restrictedUserInfo2;

    db.log.debug("user1", match.user1);

    return match.save();
  })
    .then(() => {
      return db.User.load(db.User.me.id, {depth:4})
    })
    .then((user) => {
      return user.toJSON({depth:4})
    })
    .then((rausSendeUser) => {
      res.status(200);
      res.send({
        success: {
          message: 'Toll. Du hast noch auch erfolgreich akzeptiert. Super!',
          user: rausSendeUser
        }
      });
    })
}

exports.find = function (db, u) {
  if (u.myGroup === "" && u.searchedGroups.length === 0) {
    //suchen nach anderen Veranstaltungen
    const pattern = new RegExp(buildRegexPattern(Array.from(u.searchedCourses)));
    return db.SwopCard.find()
    //.equal('active', true)
      .notEqual('createdBy', u.createdBy)
      .equal('status', 'WAITING')
      .containsAny('searchedCourses', u.course) //Alle Kurse bei denen die KursId der SwopCard gesucht werden
      .matches('course', pattern)
      .ascending('createdAt')
      .singleResult();
  } else if ((u.course.id === (Array.from(u.searchedCourses))[0].id) && (Array.from(u.searchedCourses)).length === 1) {
    const pattern = new RegExp(buildRegexPattern(u.searchedGroups));
    //Suche innerhalb derselben Veranstaltung
    return db.SwopCard.find()
    //.equal('active', true)
      .notEqual('createdBy', u.createdBy)
      .equal('status', 'WAITING')
      .containsAny('searchedGroups', u.myGroup)
      .matches('myGroup', pattern)
      .ascending('createdAt')
      .singleResult();
  } else {
    return new Promise(function (resolve, reject) {
      reject({err: "Die Swopcard Daten sind nicht korrekt",
        swopcard: u
      }); //sollte nie dazu kommen
    });
  }
};


/**
 * Konkateniert die Elemente eines Arrays mit dem Oder-Operator
 * @param array, das zu verpatternde Array, muss Array sein
 * @return ein anchored Regex Pattern (Muss noch mittels RegExp() in eine Expression umgewandelt werden)
 */
function buildRegexPattern(array) {
  let regexPattern = "^" + array[0];
  for(let i = 1; i < array.length; i++) {
    regexPattern = regexPattern + "|" + array[i];
  }
  return regexPattern;
}


/**
 * Erstellt ein MatchObj zu Swopcards
 * @params bestehend aus den Referenzen swopcard1 und swopcard2, der zumatchenden SwopCards
 *
 */
exports.create = function(db, params) {

  db.log.level = 'debug';
  db.log.debug("params", params)
  // lade beide SwopCards, die uebergeben werden
  // lade beide SwopCards, die uebergeben werden
  return db.SwopCard.load(params.swopCard1).then((swopCard1) => {
    return db.SwopCard.load(params.swopCard2).then((swopCard2) => {
      // TODO: User-Objekte der beiden SwopCards laden
      let matchUser1 = new db.MatchUserDetails({
        user: swopCard1.createdBy,
        swopCard: swopCard1
      });

      let matchUser2 = new db.MatchUserDetails({
        user: swopCard2.createdBy,
        swopCard: swopCard2
      });

      matchObject = new db.Match({
        status1: "WAITING",
        status2: "WAITING",
        user1: matchUser1,
        user2: matchUser2
      });

      matchObject.acl
        .allowReadAccess("/db/Role/2")
        .allowWriteAccess("/db/Role/2")
        .allowReadAccess(swopCard1.createdBy)
        .allowWriteAccess(swopCard1.createdBy)
        .allowReadAccess(swopCard2.createdBy)
        .allowWriteAccess(swopCard2.createdBy);

      return matchObject.save().then((matchObject) => {
        // update SwopCards to save the match-Obj.
        // match-Attr. von den SwopCards auf die soeben erstellte Match-Karte referenzieren
        swopCard1.match = matchObject;
        swopCard1.status = 'PENDING';
        return swopCard1.save().then(() => {
          swopCard2.match = matchObject;
          swopCard2.status = 'PENDING';
          return swopCard2.save().then(() => {
            return new Promise((resolve, reject) => {
              resolve(matchObject)
            })
          })
        })
      })
    })
  }).catch((err) => {
    throw new Abort(err);
  })
};

exports.deleteMatch = function(db, res, matchId) {
  db.log.debug("matchId", matchId);

  let match;
  let user1;

  return db.Match.load(matchId, {depth: 2}).then((matchObject) => {
    // pruefen, welcher User er ist
    db.log.debug('matchObjectToDelete', matchObject);
    match = matchObject;
    if (matchObject.user1.user === db.User.me) {
      // db.User.me = user1
      // aendere SwopCard Status von User2
      user1 = true;
      swopCard = matchObject.user2.swopCard;
      db.log.debug('swopCard', swopCard);
      matchObject.user2.swopCard.status = 'WAITING';
      db.log.debug('matchObjectAfterChange', matchObject.user2.swopCard);
      return matchObject.user2.swopCard.save();
    } else if (matchObject.user2.user === db.User.me) {
      // db.User.me = user2
      // aendere SwopCard Status von User1
      user1 = false;
      swopCard = matchObject.user1.swopCard;
      db.log.debug('swopCard', swopCard);
      matchObject.user1.swopCard.status = 'WAITING';
      db.log.debug('matchObjectAfterChange', matchObject.user1.swopCard);
      return matchObject.user1.swopCard.save();
    }
  }).then((swopCardOfOtherUser) => {
    db.log.debug('swopCardOfOther', swopCardOfOtherUser);
    swopCardOfOtherUser.match = null;
    return swopCardOfOtherUser.save();
  }).then(() => {
    return match.delete();
  }).then(() => {
    return db.User.load(db.User.me.id, {depth:3})
  }).then((user) => {
    // match loeschen hat geklappt
    res.status(200);
    const rausSendeUser = user.toJSON({depth:3})
    return new Promise(function (resolve, reject) {
      resolve(null);
    });
    // res.json({
    //     success: {
    //         message: 'Match wurde erfolgreich geloescht.',
    //         user: rausSendeUser
    //     }
    // });
  })
};
