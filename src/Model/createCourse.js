// lade beide SwopCards, die uebergeben werden
return db.SwopCard.load(params.swopCard1).then((swopCard1) => {
  return db.SwopCard.load(params.swopCard2).then((swopCard2) => {
    // TODO: User-Objekte der beiden SwopCards laden
    return swopCard1.createdBy.load().then((user1) => {
      return swopCard2.createdBy.load().then((user2) => {
        // RestrictedUserInfo der User-Objekte laden
        return user1.restrictedUserInfo.load().then((restricted1) => {
          return user2.restrictedUserInfo.load().then((restricted2) => {
            // Referenz vom Match-Objekt zu den User-Objekten und RestrictedUserInfo-Objekten setzen
            var matchUser1 = new db.Create({
              user: user1,
              restrictedUserInfo: restricted1,
              swopCard: swopCard1
            });

            var matchUser2 = new db.Create({
              user: user2,
              restrictedUserInfo: restricted2,
              swopCard: swopCard2
            });

            // neues Match-Objekt erstellen
            matchObject = new db.Match({
              status1: "WAITING",
              status2: "WAITING",
              user1: matchUser1,
              user2: matchUser2
            })
            matchObject.acl.allowReadAccess(user1);
            matchObject.acl.allowReadAccess(user2);

            return matchObject.insert().then((matchObj) => {
              // update SwopCards to save the match-Obj.
              // match-Attr. von den SwopCards auf die soeben erstellte Match-Karte referenzieren
              swopCard1.match = matchObj;
              swopCard1.status = 'PENDING';
              return swopCard1.save().then(() => {
                swopCard2.match = matchObj;
                swopCard2.status = 'PENDING';
                return swopCard2.save().then(() => {
                  res.status(200);
                  res.send("Das Erstellen des Match-Objekts hat funktioniert.");
                })
              })
            })
          })
        })

      });
    }).catch((err) => {
      throw new Abort(err);
    })
  })
}).catch((err) => {
  throw new Abort(err);
})
