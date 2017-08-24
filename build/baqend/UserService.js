const SwopCardService = require('./SwopCardService');

//Die routes sind das Interface des UserServices, es definiert welche Methoden dieses Modul zur Verfügung stellt und wie sie heißen
const routes = {
  updateDisplayName: 'UPDATE_DISPLAY_NAME',
  updateEmail: 'UPDATE_EMAIL',
  deleteUser: 'DELETE_USER'
};

/**
 * Der UserService stellt verschiedene Methoden zum bearbeiten des eigenen Users bereit. Jede Route sendet ihrere eigenen Responses und ist für Fehlerbehandlung zuständig. Die post Funktion dient einzig allein der Weiterleitung.
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

  if(routes.updateDisplayName === route) {
    return updateDisplayName(db, params, userId, req, res);
  } else if (routes.updateEmail === route) {
    return updateEmail(db, params, userId, req, res);
  } else if (routes.deleteUser === route) {
    return deleteUser(db, params, userId, req, res);
  } else {
    res.status(400);
    res.json({ message: 'Your route does not exist' });
    res.send()
  }
  //res.status(200);
  //res.send("Die Aenderungen haben geklappt.");
};

/**
 * TODO: 23.08.17 - deleteUser() soll auch alle swopCards loeschen, das ist aber aktuell nicht moeglich, wenn swopCards gematched wurden
 */
function deleteUser(db, params, userId, req, res) {
  db.log.info('Delete User: Start');
  let currentUser;

  res.status(404);
  res.send('Das Loeschen eines Users ist aktuell nicht moeglich.');
  // // lade den User inkl. RestrictedUserObject, um dies ebenfalls zu loeschen
  // return db.User.load(userId, {depth: 2})
  //     .then((user) => {
  //         currentUser = user;
  //         let swopCards = Array.from(user.swopCards);
  //         db.log.debug("deleted User:", user);
  //         db.log.debug("swopCards", swopCards);

  //         return SwopCardService.deleteSwopCards(db, swopCards, userId, req, res);
  //         // const deletePromises = [];
  //         // swopCards.forEach((swopCard) => {
  //         //     db.log.debug("swopId", swopCard.id);
  //         //     return S
  //         //     // deletePromises.push(SwopCardService.deleteSwopCard(db, {id: swopCard.id}, userId, req, res));
  //         // })
  //         // return Promise.all(deletePromises);
  //     }).then((test) => {
  //         db.log.debug("test", test);
  //     // })
  //         // db.log.debug('Delete User', user)
  //         // //TODO: zwei asynchrone Prozesse, nocheinmal then
  //         // return Promise.all([user.restrictedUserInfo.delete(), user.delete()]);
  //     // })
  //     // .then(() => {
  //     //     sendSuccess("User erfolgreich geloescht!")
  //     })
  //     .catch((err) => {
  //         throw new Abort('User wurde erfolgreich geloescht')
  //     });
}

/**
 * KANN AUCH CLIENTSEITIG IMPLEMENTIERT WERDEN
 * Updatet den Displaynamen des Users
 * @param db
 * @param params, Parameter des Post-Requests, muss Feld 'displayName' enthalten'
 */
function updateDisplayName(db, params, userId, req, res) {
  return db.User.load(userId, {depth: 2})
    .then((user) => {
      user.restrictedUserInfo.displayName = params.displayName;
      return user.restrictedUserInfo.save();
    })
    .then((updatedRestrictedUserInfo) => {
      sendSuccess("Du hast deinen Namen geändert.", updatedRestrictedUserInfo, db, res);
    })
    .catch((err) => {
      throw new Abort('Name konnte nicht geändert werden')
    });
}

/**
 * KANN AUCH CLIENTSEITIG IMPLEMENTIERT WERDEN
 * Updatet die Email-Adresse des Users
 * @param db
 * @param params, Parameter des Post-Requests, muss Feld 'email' enthalten'
 */
function updateEmail(db, params, userId, req, res) {
  //TODO: Muss Email sein
  db.log.level = 'debug';
  return db.User.load(userId, {depth: 2})
    .then((user) => {
      user.restrictedUserInfo.email = params.email;
      return user.restrictedUserInfo.save();
    })
    .then((updatedRestrictedUserInfo) => {
      sendSuccess("Du hast deine erfolgreich E-Mail geändert.", updatedRestrictedUserInfo, db, res)
    })
    .catch((err) => {
      throw new Abort('Email konnte nicht geändert werden')
    });
}


/**
 * Sendet den Status 200 und ein success Obj an den Requester
 * @param msg, die msg die übergeben werden soll
 */
function sendSuccess(msg, updatedRestrictedUserInfo, db, res) {
  res.status(200);
  res.json({
    success: {
      message: msg,
      updatedRestrictedUserInfo
    }
  });
}
