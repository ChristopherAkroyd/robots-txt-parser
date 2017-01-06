const url = require('url');

function hasProtocol(link) {
  return !!url.parse(link).protocol;
}

function hasHttpProtocol(link) {
  return link.indexOf('http') > -1 || link.indexOf('https') > -1;
}

function addProtocol(link) {
  return `http://${link}`;
}

function getProtocol(link) {
  return url.parse(link).protocol || '';
}

function getHostname(link) {
  return url.parse(link).hostname;
}

function formatLink(rawLink) {
  let link = rawLink;
  // No protocol on the link, this can screw up url parsing with node url so add a protocol.
  if (!hasProtocol(rawLink)) {
    link = addProtocol(link);
  }
  // The protocol the link has is non-http, fix that and stick the hostname back on.
  if (!hasHttpProtocol(link)) {
    link = addProtocol(getHostname(link));
  }
  // Return the base link.
  return `${getProtocol(link)}//${getHostname(link)}`;
}

function applyRecords(path, records) {
  const recordTests = records.map(record => (
    {
      applies: record.path.test(path),
      specificity: record.specificity,
    }
  ));
  // Return only the records which apply to this path.
  return recordTests.filter((record => record.applies));
}

function maxSpecificity(records) {
  const specificity = records.map(record => record.specificity);
  return Math.max(...specificity);
}

module.exports = {
  hasHttpProtocol,
  addProtocol,
  getHostname,
  getProtocol,
  hasProtocol,
  formatLink,
  applyRecords,
  maxSpecificity,
};
