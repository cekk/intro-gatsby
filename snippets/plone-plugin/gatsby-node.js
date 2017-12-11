const axios = require(`axios`);
const crypto = require(`crypto`);

exports.sourceNodes = async ({ boundActionCreators }) => {
  const { createNode } = boundActionCreators;

  const results = await axios.get(
    "http://localhost:8080/Plone/@search?fullobjects&portal_type=News Item",
    {
      headers: {
        accept: "application/json"
      }
    }
  );
  results.data.items.map(async item => {
    let node = {
      ...item,
      path: `/${item.UID}/`,
      internal: {
        type: item["@type"].replace(" ", ""),
        contentDigest: crypto
          .createHash(`md5`)
          .update(JSON.stringify(item))
          .digest(`hex`)
      }
    };
    node.id = item.UID;
    node.parent = null;
    node.children = [];
    createNode(node);
  });
};

// exports.createPages = ({ graphql, boundActionCreators }) => {
//   const { createPage } = boundActionCreators;
//   return new Promise((resolve, reject) => {
//     graphql(`
//       {
//         allNewsItem {
//           edges {
//             node {
//               id
//               path
//             }
//           }
//         }
//       }
//     `).then(result => {
//       result.data.allNewsItem.edges.map(({ node }) => {
//         createPage({
//           path: node.path,
//           component: path.resolve(`./src/templates/news-item.js`),
//           context: {
//             // Data passed to context is available in page queries as GraphQL variables.
//             id: node.id
//           }
//         });
//       });
//       resolve();
//     });
//   });
// };
