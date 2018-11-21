const elasticsearch = require("elasticsearch");

const client = new elasticsearch.Client({
  host: "127.0.0.1:9200",
  log: "error"
});

const search = function search(index, body) {
  return client.search({ index: index, body: body });
};
var volume = 18;
var year = 2013;

module.exports = function searchFilter() {
  // var body = {
  //   from: 0,
  //   size: 4,
  //   body: {
  //     query: {
  //       filtered: {
  //         filter: {
  //           // only return documents that are
  //           // public or owned by the current user
  //           or: [
  //             {
  //               term: { volume: "18" }
  //             },
  //             {
  //               term: { year: "1987" }
  //             }
  //           ]
  //         }
  //       }
  //     }
  //   }
  // };

  var body = {
    query: {
      constant_score: {
        filter: {
          bool: {
            must: [{ term: { volume } }, { term: { year } }]
          }
        }
      }
    }
  };

  console.log(
    `retrieving documents whose journal matches '${body.query}' (displaying ${
      body.size
    } items at a time)...`
  );
  search("library", body)
    .then(results => {
      console.log(`found ${results.hits.total} items in ${results.took}ms`);
      if (results.hits.total > 0) console.log(`returned journals:`);
      results.hits.hits.forEach(hit => console.log(hit._source.journal));
    })
    .catch(console.error);
};
