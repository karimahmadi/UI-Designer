export const Schema = {
    childs: [
      {
        type: 'grid',
        properties: {
          container: true,
        },
        childs: [
          {
            type:'grid',
            properties:{
              item:true,
              xs:6,
              sm:6,
              md:6,
              lg:6,
              left:true,
            },
            childs:[
              {
                type:'inputLabel',
                properties:{},
                childs:[
                  {
                    type:'text',
                    value:'عنوان برچسب : ',
                  },
                ],
              },
            ],
          },
          {
            type:'grid',
            properties:{
              item:true,
              xs:6,
              sm:6,
              md:6,
              lg:6,
            },
            childs:[
              {
                type:'input',
                properties:{
                  name:'inputName',
                  value:'123',
                },                
              },
            ],
          },
        ],
      },
    ],
  };