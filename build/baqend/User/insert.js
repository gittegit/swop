/* Require additional modules and handlers here */
// var module = require('module');
// var myCode = require('../myModule');
// var updateHandler = require('./update');

/**
 * This handler is invoked every time a new object of this type is inserted
 * The object can be modified in this handler before it is saved.
 *
 * @param {baqend.EntityManager} db The database instance which can be used to load and save additional objects
 * @param {baqend.binding.User} db.User.me The actual unresolved user who requests the operation or null if the user
 * is not logged in
 * @param {baqend.binding.Entity} obj The object which is inserted
 * @param {baqend.binding.Entity} this The object which is inserted
 *
 * @throws Abort(reason[, data]) to abort the insertion with the specified reason
 */
exports.onInsert = function(db, obj) {
  const universityEmail = "uni-hamburg.de"
  db.log.level = 'debug'

  if (obj.username.endsWith(universityEmail)) {

    obj.swopCards = new Set()
    obj.acl
      .allowWriteAccess('/db/Role/2')
      .allowReadAccess('/db/Role/2')

    return db.RestrictedUserInfo.find()
      .equal('email', obj.username)
      .singleResult((restrictedUserInfo) => {
        db.log.debug("rui", restrictedUserInfo)
        restrictedUserInfo.acl
          .allowWriteAccess('/db/Role/2')
          .allowReadAccess('/db/Role/2')
          .allowWriteAccess(obj)
          .allowReadAccess(obj)
        db.log.debug("rui2", restrictedUserInfo)

        restrictedUserInfo.user = obj
        return restrictedUserInfo.save()
      })
      .then((restrictedUserInfo) => {
        db.log.debug("rui3", restrictedUserInfo)
        obj.restrictedUserInfo = restrictedUserInfo
        db.log.debug("obj", obj)
        return obj
      })
  } else {
    throw new Abort('Bitte verwende die Mail-Adresse deiner Universität.')
  }
};
