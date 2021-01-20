const containerComponents = require('./getContainerComponents') ;
const inquirer = require('inquirer');
function createModuleList()
{
  return containerComponents().concat(new inquirer.Separator()).concat(['Create new business (module)']);
}
module.exports = createModuleList;
