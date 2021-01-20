const containerComponents = require('./getContainerComponents') ;
function getLastMyBusinessContainerComponents()
{
  let max = 0;
  containerComponents().forEach(contarinerComp => {
    const patt = /^(MyBusiness)[\d]*/i;
    patt.compile(patt);
    let current = patt.exec(contarinerComp);
    if(current)
    {
      if(current[0].split("MyBusiness")[1] > max)
      {
        max = current[0].split("MyBusiness")[1];
      }
    }
  });
  return max;
}
module.exports = getLastMyBusinessContainerComponents;
