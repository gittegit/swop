const MatchService = require('./MatchService');
const EmailService = require('./EmailService');

const validStatuses = {
  waiting: 'WAITING',
  pending: 'PENDNG',
  declined: 'DECLINED',
  accepted: 'ACCEPTED'
};

const MAX_AMOUNT_OF_SWOPCARDS = 20;
const swopCardExpirationTimeouts = [];
const EXPIRATION_TIME = (2 * 7 * 24 * 60 * 60 * 1000); //2 Wochen in Sekunden

//Die routes sind das Interface des UserServices, es definiert welche Methoden dieses Modul zur Verfügung stellt und wie sie heißen
const routes = {
  createSwopCard: 'CREATE_SWOP_CARD',
  deleteSwopCard: 'DELETE_SWOP_CARD'
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

  if(routes.createSwopCard === route) {
    return createSwopCard(db, params, userId, req, res);
  } else if (routes.deleteSwopCard === route) {
    return deleteSwopCard(db, params, userId, req, res);
  } else {
    res.status(400);
    res.json({ message: 'Your route does not exist' });
  }
  //res.status(200);
  //res.send("Die Aenderungen haben geklappt.");
};

// TODO: von Lukas kopieren & ggf. anpassen
function createSwopCard(db, params, userId, req, res) {
  db.log.debug("Ankommende Swopcard", params);
  let userGlobal;
  let newSwopCard;
  let matchingSwopCardGlobal;

  return db.User.load(userId, {depth: 2})
    .then((user) => {
      const coursePromises = [];
      userGlobal = user; //speicher User innerhalb des Funktionsbody ab, damit später darauf zugegriffen werden kann
      checksIfMaxAmountOfSwopCardsReached(user); //throws Abort
      checkForExistingSwopCards(user, params); //throws Abort
      checkForParams(params); //throws Abort

      //Wichtig: der erste Promise der gepusht wird ist der eigene Kurs
      coursePromises.push(db.Course.load(params.courseId));
      params.searchedCourses.forEach((searchedCoursesId) => {
        coursePromises.push(db.Course.load(searchedCoursesId));
      });
      return Promise.all(coursePromises);
    })
    .then((courses) => {
      newSwopCard = new db.SwopCard();

      //Fehler wird geschmissen, wenn der eigene Kurs nicht exisitiert
      if (!courses[0]) throw 'Dein Kurs ' + params.courseId + ' existiert noch nicht';
      //Fehler wird geschmissen, wenn einer der gesuchten Kurse nicht existiert
      for(var i = 1; i < courses.length; i++) {
        if(!courses[i]) throw 'Dein gesuchter Kurs: ' + params.searchedCourses[i-1] + ' existiert noch nicht';
      }

      //Erstelle SwopCard
      newSwopCard.course = courses.shift(); // entfernt das erste Objekt(der eigene Kurs) und returnt es
      newSwopCard.searchedCourses = new Set(courses); // die gesuchten Kurse
      newSwopCard.searchedGroups = (function() { // Macht alles zu uppercase
        const groupsTemp = [];
        params.searchedGroups.forEach((e) => {
          groupsTemp.push(e.toUpperCase());
        });
        return groupsTemp;
      })();
      newSwopCard.myGroup = params.group.toUpperCase();
      newSwopCard.createdBy = userGlobal;
      newSwopCard.match = null;
      newSwopCard.status = validStatuses.waiting;

      //Setze ACLs der Swopcard
      newSwopCard.acl.allowWriteAccess(db.User.me)
        .allowReadAccess(db.User.me)
        .allowWriteAccess('/db/Role/2')
        .allowReadAccess('/db/Role/2');
      //TODO: speichere den Löschzeitpunkt der Karte ab
      return newSwopCard.insert();
    })
    .then((swopCard) => {
      //TODO: push den in den DelteTimer
      //setExpirationDate(SwopCardId, db, userId, req, res)
      //Finde Match
      setExpirationDate(newSwopCard.id, db, userId, req, res, userGlobal)
      return MatchService.find(db, newSwopCard);
    })
    .then((matchingSwopCard) => {
      //Sofern ein Match gefunden wurde wird ein Match Object erstellt
      matchingSwopCardGlobal = matchingSwopCard;
      //Wenn kein Match gefunden wurde wird null returnt und kein Match erstellt
      if(!matchingSwopCard) {
        return new Promise((resolve, reject) => {
          resolve(null);
        });

      } else {
        //Wenn Match gefunden wurde wird ein MatchObjekt erstellt
        const tooBeMatchedSwopCards = {
          swopCard1: newSwopCard.id,
          swopCard2: matchingSwopCard.id
        };
        return MatchService.create(db, tooBeMatchedSwopCards);
      }
    })
    .then((matchObj) => {
      //speicher Swopcard und Match beim User ab
      newSwopCard.match = matchObj;
      userGlobal.swopCards.add(newSwopCard);
      return userGlobal.save();
    })
    .then(() => {
      // db.log.debug('user nach dem saven', user);
      return userGlobal.load({depth:4})
    })
    .then((user) => {
      return user.toJSON({depth:4})
    })
    .then((rausSendeUser) => {
      res.status(200);
      res.send({
        success: {
          message: 'Swopcard wurde erfolgreich erstellt',
          newSwopCard,
          user: rausSendeUser
        }
      });
    })
    .then(() => {
      db.log.info('lade createdBy', matchingSwopCardGlobal.id)
      if(matchingSwopCardGlobal) return db.SwopCard.load(matchingSwopCardGlobal.id, {depth:3});
    })
    .then((swopCard) => {
      db.log.info('user ,meeeeeee', userGlobal.restrictedUserInfo.email)
      if(matchingSwopCardGlobal) {
        EmailService.sendMatchFound(userGlobal.restrictedUserInfo.email);
        EmailService.sendMatchFound(swopCard.createdBy.restrictedUserInfo.email);
      }
    })
    .catch((err) => {
      //res.status(400);
      //res.send({Fehler: JSON.stringify(err)});
      throw new Abort (err);
    });
}

function deleteSwopCard(db, params, userId, req, res) {
  let currentUser;
  let currentSwopCard;

  db.log.level = 'debug';
  db.log.debug("params", params);

  // REFACTOR
  return db.User.load(userId, {depth: 1}).then((user) => {
    // load swopCard, um sie beim Set-Loeschen zu uebergeben
    currentUser = user;

    return db.SwopCard.load(params.id);
  }).then((swopCard) => {
    currentSwopCard = swopCard;
    if (swopCard.match !== null) {
      // returned das Match-Object
      // TODO: wenn eine SwopCard geloescht wird, sollte der andere User eine E-Mail erhalten
      // TODO: danach wird der Match geloescht
      db.log.debug("match", swopCard.match);
      return MatchService.deleteMatch(db, res, swopCard.match.id);
    }
    return swopCard;
  }).then(() => {
    var user = currentUser;
    var swopCard = currentSwopCard;
    // aus dem Set die SwopCard loeschen
    user.swopCards.delete(swopCard);
    db.log.debug("swopCards", user.swopCards);
    return user.save();
  }).then(() => {
    // loeschen aus den swopCards Set hat geklappt
    var swopCard = currentSwopCard;
    return swopCard.delete();
  }).then(() => {
    return db.User.load(db.User.me.id, {depth:3})
  }).then((user) => {
    // swopCard loeschen hat geklappt
    res.status(200);
    const rausSendeUser = user.toJSON({depth:3})
    res.json({
      success: {
        message: 'Swopcard wurde erfolgreich geloescht.',
        user: rausSendeUser,
        test: 'hallo'
      }
    });
  }).catch((err) => {
    throw new Abort(err);
  });
}

/**
 * Fügt eine neue SwopCard zum User hinzu
 *
 */
function addSwopCardToUser(db, newSwopCard) {
  db.log.debug("userGlobal", userGlobal);
  userGlobal.swopCards.add(newSwopCard);
  return userGlobal.save();
}

/**
 * Überprüft, ob die einer der Kurse nicht existiert.
 * @param courses {Array}, die aufgelösten Kurse, wobei der erste Kurs der eigene Kurs des Users sein muss und die restlichen die/der Gesuchte/n
 * @throws Error, sofern einer der Kurse nicht existiert
 */
function checkForNotExistingCourses(courses) {
  //Fehler wird geschmissen, wenn der eigene Kurs nicht exisitiert
  if (!courses[0]) throw new Error('Your course ' + params.courseId + ' does not exist yet');
  //Fehler wird geschmissen, wenn einer der gesuchten Kurse nicht existiert
  for(var i = 1; i < courses.length; i++) {
    if(!courses[i]) throw new Error ('Your searched Course: ' + params.searchedCourses[i-1] + ' does not exist yet');
  }
}

/**
 * Überprüft, ob eine eine Swopcard bereit für eine Veranstaltung angeleget wurde oder nicht
 * @user das User Objekt, das die Swopcards hält
 * @params die Parameter, die bei der Get-Request im Body übergeben wurden
 * @throws {Abort} sofern eine Swopcard mit dem selben Kurs gefunden wurde
 */
function checkForExistingSwopCards(user, params){
  //TODO: Mittels Queries effizienter gestalten
  user.swopCards.forEach((card) => {
    const coursePath = '/db/Course/' + params.courseId; //most sexiest code alive
    if(coursePath === card.course.toString()) {
      throw new Abort('Du hast bereit eine Swopcard für diese Veranstaltung erstellt', {
        occurence: {
          newCard: coursePath,
          existingCard: card.course
        }
      })
    }
  })
}

/**
 * Überprüft ob die maximale Anzahl an Karten erreicht wurde
 * @param user, das User Objekt
 * @throws {Abort} falls die maximale Anzahl an Swopcard erreicht wurde
 */
function checksIfMaxAmountOfSwopCardsReached(user) {
  if(user.swopCards.size >= MAX_AMOUNT_OF_SWOPCARDS) throw new Abort('Du hast bereits zu viele SwopCards');
}

/**
 * Überprüft die Parameter auf ihre Konsistenz nach Aspekten unserer Business Logik
 * @param params, die Parameter des POST-Requests als JSON
 * @throws {Abort} falls die Parameter nicht korrekt sind
 */
function checkForParams(params) {
  //TODO: noch nicht alle Fälle abgedeckt searchedCourses muss z.b. nochh getestet werden
  if(params.searchedCourses.legth  === 0) throw new Abort('Du musst einen Kurs angeben nach dem du suchst');
  if(params.courseId === "") throw new Abort('Du musst deinen eigenen Kurs angeben');
  if((params.group === null || params.group === "") //empty
    && (params.searchedCourses.indexOf(params.courseId) >= 0) //eigener Kurs in gesuchten enthalten
    && params.searchedCourses.length === 1) //Nur ein Kurs angegeben
    throw new Abort('Du musst eine Gruppe angeben nach der du suchst, wenn du innerhalb der selben Veranstaltung suchst');
  if((params.searchedCourses.indexOf(params.courseId) >= 0) &&
    params.searchedCourses.length > 1) throw new Abort('Wenn du nach mehreren Kursen suchst, dann kann nicht dein eigener dort enthalten sein');
  if((params.searchedCourses.length > 1) && !(params.group === null || params.group === "")) throw new Abort('Wenn du nach mehreren Kursen suchst, kannst du keine Gruppe angeben');
}


/**
 * Setze einen Timer für die Swopcards, wie lange Sie existieren sollen.
 * @param die SwopCardId die nach MAX_AMOUNT_OF_SWOPCARDS Zeit wieder geloescht werden soll
 *
 */
function setExpirationDate(SwopCardId, db, userId, req, res, userGlobal) {
  let params = { id: SwopCardId }
  let newTimeOut = setTimeout((() => {
    deleteSwopCard(db, params, userId, req, res)
    EmailService.sendYourSwopCardExpired(userGlobal.restrictedUserInfo.email)
  }), EXPIRATION_TIME);
  swopCardExpirationTimeouts.push({
    swopCardId: swopCard.id,
    newTimeOut
  })
}


/*
exports.deleteSwopCards = function(db, swopCardArray, userId, req, res) {
    const deltePromises = []
    let userGlobal
    let swopCardGlobal
    return db.User.load(userId, {depth: 1})
        .then((user) => {
            userGlobal = user
            swopCardArray.forEach((swopCard) => {
                return db.SwopCard.load(swopCard.id)
                    .then((swopCard) => {
                        swopCardGlobal = swopCard
                        if (swopCard.match !== null) {
                            return MatchService.deleteMatch(db, swopCard.match.id);
                        } else {
                            return new Promise(function (resolve, reject) {
                                resolve(null)
                            })
                        }
        }).then(() => {
            user.swopCards.delete(swopCard);
        })
        })

    })



    }





    // REFACTOR
    return db.User.load(userId, {depth: 1}).then((user) => {
        // load swopCard, um sie beim Set-Loeschen zu uebergeben
        currentUser = user;

        return db.SwopCard.load(params.id);
    }).then((swopCard) => {
        currentSwopCard = swopCard;
        if (swopCard.match !== null) {
            // returned das Match-Object
            // TODO: wenn eine SwopCard geloescht wird, sollte der andere User eine E-Mail erhalten
            // TODO: danach wird der Match geloescht
            db.log.debug("match", swopCard.match);
            return MatchService.deleteMatch(db, swopCard.match.id);
            // return UpdateMatchStatus.update(db, res, this.swopCard.match.id, 'DECLINED');
        }
        return swopCard;
    }).then(() => {
        var user = currentUser;
        var swopCard = currentSwopCard;
        // aus dem Set die SwopCard loeschen
        user.swopCards.delete(swopCard);
        db.log.debug(user.swopCards);

        return user.save();
    }).then(() => {
        // loeschen aus den swopCards Set hat geklappt
        var swopCard = currentSwopCard;
        return swopCard.delete();
    }).then(() => {
        return db.User.load(db.User.me.id, {depth:3})
    }).catch((err) => {
        throw new Abort(err);
    })
    const promises = [];
    db.log.level = 'debug';
    swopCardArray.forEach((swopCard) => {
        promises.push(deleteSwopCard(db, {id: swopCard.id}, userId, req, res));
    });
    return Promise.all(promises);
}
*/
