/* Require additional modules and handlers here */
//var module = require('module');
//var myCode = require('./otherModule');
//var updateHandler = require('./MyClass/update');
var util = require('util');

/**
 * This method is invoked if an GET or POST request is send to this module resource
 * Additional backend functionality can be implemented in such method
 *
 * @param {baqend.EntityManager} db The database instance which can be used to load and save additional objects
 * @param {baqend.binding.User} db.User.me The actual unresolved user who requests the operation or null if the user
 * is not logged in
 * @param {Object} data The request payload, the decoded query parameters of a GET request or the parsed body of a
 * POST request
 * @param {express.Request} req The express request object {@link http://expressjs.com/api.html#req}
 * @param {Object} this The module context
 * @return {Promise<*>|Object|Array|String} A json value or string which is send back to the client
 *
 * @throws Abort(reason[, data]) to abort the request with the specified reason
 */
exports.post = function(db, req, res) {
  var params = req.body;
  params.id = params.id.replace(/\./g, "-");

  // Ueberpruefung, ob die ID oder der Name bereits vergeben sind
  var queryBuilder = db.Course.find();
  var conditionId = queryBuilder.equal('id', '/db/Course/' + params.id);
  var conditionName = queryBuilder.equal('name', params.name);

  return queryBuilder.or(conditionId, conditionName).resultList().then((courses) => {
    db.log.debug('query builder betreten', courses)
    // check if courses contains entries to prevent double insert for courses
    if (Object.keys(courses).length === 0) {
      res.status(200);
      // no entry in course exists, so insert a new course object
      var course = new db.Course({id: params.id, name: params.name});
      course.insert();
      res.send({
        succes: {
          message: "Das Hinzufuegen des Kurses hat geklappt."
        }
      });
    } else {
      throw 'Es existiert bereits eine Veranstaltung mit dem selben Namen oder ID'
    }
  }).catch((err) => {
    throw new Abort(err)
  });
}

// return courses returned ein Promise, welches beim Funktionsaufruf bei zB isValid().then((courses)...) nochmal behandelt werden muss
function isValid(db, id, name) {
  var queryBuilder = db.Course.find();
  var conditionId = queryBuilder.equal('id', '/db/Course/' + id);
  var conditionName = queryBuilder.equal('name', name);
  courses = queryBuilder.or(conditionId, conditionName).resultList();
  return courses;
}



/*
 Require additional modules and handlers here
//var module = require('module');
//var myCode = require('./otherModule');
//var updateHandler = require('./MyClass/update');
var util = require('util');


 * This method is invoked if an GET or POST request is send to this module resource
 * Additional backend functionality can be implemented in such method
 *
 * @param {baqend.EntityManager} db The database instance which can be used to load and save additional objects
 * @param {baqend.binding.User} db.User.me The actual unresolved user who requests the operation or null if the user
 * is not logged in
 * @param {Object} data The request payload, the decoded query parameters of a GET request or the parsed body of a
 * POST request
 * @param {express.Request} req The express request object {@link http://expressjs.com/api.html#req}
 * @param {Object} this The module context
 * @return {Promise<*>|Object|Array|String} A json value or string which is send back to the client
 *
 * @throws Abort(reason[, data]) to abort the request with the specified reason

exports.post = function(db, req, res) {
    var params = req.body;
    params.id = params.id.replace(/\./g, "-");

    // Ueberpruefung, ob die ID oder der Name bereits vergeben sind
    const queryBuilder = db.Course.find();
    const conditionId = queryBuilder.equal('id', '/db/Course/' + params.id);
    const conditionName = queryBuilder.equal('name', params.name);

    return queryBuilder
        .or(conditionId, conditionName)
        .resultList()
        .then((courses) => {
            db.log.debug('query builder betreten', courses)
            // check if courses contains entries to prevent double insert for courses
            if (Object.keys(courses).length !== 0) throw new Abort("Die Kurs-ID oder der Kurs-Name existieren bereits.");
            // no entry in course exists, so insert a new course object
            const course = new db.Course({
                id: params.id,
                name: params.name
                });
            return course.insert();
        }).then(() => {
            res.status(200);
            res.send({
                success: {
                    message: "Das Hinzufuegen des Kurses hat geklappt."
                }
            });
        }).catch((err) => {
            throw Abort(err);
        });
}

*/
