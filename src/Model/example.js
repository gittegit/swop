// create Swopcard

//Suchen in derselben Veranstaltung aber nach anderer Gruppe
const searchedCourses = ['123-23']
const searchedGroups = ['A', 'B']
const courseId = '123-23'
const group = 'C'

M.createSwopCard(searchedCourses, searchedGroups, courseId, group)
  .then(console.log)
  .catch(console.log)

//Suche nach Veranstaltungen
  const searchedCourses2 = ['123-23', '12-12-12']
  const searchedGroups2 = []
  const courseId2 = '223-24-55'
  const group2 = ''

  M.createSwopCard(searchedCourses2, searchedGroups2, courseId2, group2)
    .then(console.log)
    .catch(console.log)
