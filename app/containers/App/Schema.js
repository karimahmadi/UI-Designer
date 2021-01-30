export const Schema = {
  type: 'form',
  name: 'form001',
  properties: {},
  childs: [{
    type:'grid',
    name:'grid001',
    properties:{container:true},
    childs:[
      {
        type:'grid',
        name:'grid002',
        properties:{item:true,xs:12,sm:12,md:12,lg:12},
        childs:[],
      }
    ],
  }],
};
