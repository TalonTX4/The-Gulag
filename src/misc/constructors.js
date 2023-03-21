class constructors {
  static profileFields(req, profileFields, inputArray) {
    // array.from working as an alternative to a forEach function since forEach cannot be called on a NodeList
    Array.from(inputArray, (item) => {
      let value = req.body[item]
      if (value) profileFields[item] = value
    })

    return profileFields
  }
}

module.exports = constructors
