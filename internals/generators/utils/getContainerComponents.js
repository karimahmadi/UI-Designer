/**
 * getContainerComponents
 *
 * Check whether the given component exist in either the components or containers directory
 */

const fs = require('fs');
const path = require('path');

const pageContainers = fs.readdirSync(
  path.join(__dirname, '../../../app/containers'),
);

function getContainerComponents()
{
  return pageContainers.filter(container => ['App','HomePage','LanguageProvider','NotFoundPage'].indexOf(container) === -1)
}

module.exports = getContainerComponents;
