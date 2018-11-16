// Installed with `npm link /path/to/webapi-parser/js/module/`
// after running `sbt buildJS` in webapi-parser project.
const wap = require('webapi-parser').WebApiParser
const path = require('path')

const ramlStr = `
  #%RAML 1.0
  title: API with Types
  types:
    User:
      type: object
      properties:
        firstName: string
        lastName:  string
        age:
          type: integer
          minimum: 0
          maximum: 125
  /users/{id}:
    get:
      responses:
        200:
          body:
            application/json:
              type: User
`

function testWap () {
  let model
  // const fpath = path.join(__dirname, './spec/api.raml')
  // return wap.raml10.parseFile(`file://${fpath}`)
  return wap.raml10.parseString(ramlStr)
    .then(function (m) {
      console.log('\n> Parsed RAML1.0', m)
      return wap.raml10.resolve(m)
    })
    .then(function (m) {
      model = m
      console.log('\n> Resolved RAML1.0', model)
      return wap.oas20.generateString(model)
    })
    .then(function (generated) {
      console.log('\n> Generated OAS2', generated)
      return wap.raml10.validate(model)
    })
    .then(function (report) {
      console.log('\n> RAML validation report', report.results)
    })
    .catch(function (err) {
      console.log(err)
    })
}

testWap()
