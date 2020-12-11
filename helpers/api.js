const fetch = require('node-fetch');
const { urlStat, urlMatches, urlTornaments } = require('./endpoints');

async function getData(api, config) {
  const url = {
    stat: config && urlStat(config),
    matches: config && urlMatches(config),
    tornaments: urlTornaments(),
  };
  const data = await fetch(url[api]);
  const json = await data.json();
  return json
}

// Exports
module.exports = { getData }