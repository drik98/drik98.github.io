/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
const fs = require("fs")
const yaml = require("js-yaml")
exports.createPages = ({ actions }) => {
  const { createPage } = actions
  const path = "./src/content/rezepte"
  const files = fs.readdirSync(path, "utf-8")
  const rezepte = Array.from(files).map(file => yaml.safeLoad(fs.readFileSync(path + "/" + file, "utf-8")))
  rezepte.forEach(ymlDoc => {
    createPage({
      path: ymlDoc.path,
      component: require.resolve("./src/templates/rezeptTemplate.js"),
      context: {
        rezept: ymlDoc
      },
    })
  });
  createPage({
    path: "/",
    component: require.resolve("./src/templates/indexTemplate.js"),
    context: {
      rezepte
    },
  })
}

// because of wow.js using the window object without checking if it defined, the test will fail 
// because of that the wowjs will not be tested
exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
  if (stage === "build-html") {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /wowjs/,
            use: loaders.null(),
          },
        ],
      },
    })
  }
}