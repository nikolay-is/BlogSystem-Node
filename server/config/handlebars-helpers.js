const Handlebars = require('handlebars')

Handlebars.registerHelper('ifCond', function (v1, v2, options) {
  if (v1 === v2) {
    // console.log('Bingo')
    return options.fn(this)
  }
  return options.inverse(this)
})

// {{#ifCond v1 v2}}
//     {{v1}} is equal to {{v2}}
// {{else}}
//     {{v1}} is not equal to {{v2}}
// {{/ifCond}}
