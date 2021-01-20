/**
 * Container Generator
 */


const getLastMyBusinessContainerComponents = require('../utils/getLastMyBusinessContainerComponents');

module.exports = {
  description: 'Add a business',
  prompts: [
    {
      type: 'input',
      name: 'moduleName',
      message: 'What your business (module) name?',
      default: 'MyBusiness',
    },
    {
      type: 'checkbox',
      name: 'neededContainerComponent',
      message: 'select default CRUD component to generat:',
      default: 'MyBusiness',
      choices:[{name:'create',checked: true}, {name:'edit',checked: true}, {name:'view',checked: true}, {name:'delete',checked: true}]
    },
    {
      type: 'confirm',
      name: 'wantRouting',
      default: true,
      message:
        'Do you want to add routing?',
    },
    {
      type: 'input',
      name: 'crudModulePrefix',
      message: 'What your CRUD modules prefix?',
      default: 'MyCRUD',
      validate: value => {
        if (/.+/.test(value)) {
          return true;
        }
        return 'The name is required';
      },
      when: ans =>ans.neededContainerComponent
    },
    {
      type: 'confirm',
      name: 'memo',
      default: false,
      message: 'Do you want to wrap your component in React.memo?',
    },
    {
      type: 'confirm',
      name: 'wantActionsAndReducer',
      default: true,
      message:
        'Do you want an actions/constants/selectors/reducer tuple for this container?',
    },
    {
      type: 'confirm',
      name: 'wantSaga',
      default: true,
      message: 'Do you want sagas for asynchronous flows? (e.g. fetching data)',
    },
    {
      type: 'confirm',
      name: 'wantMessages',
      default: false,
      message: 'Do you want i18n messages (i.e. will this component use text)?',
    },
    {
      type: 'confirm',
      name: 'wantLoadable',
      default: true,
      message: 'Do you want to load resources asynchronously?',
    },
  ],
  actions: data => {
    // if entered MyBusiness add number to it
    if(data.moduleName  === "MyBusiness")
    {
      data.moduleName +=(parseInt(getLastMyBusinessContainerComponents())+1);
    }
    // Generate index.js and index.test.js
    const actions = [
      {
        type: 'add',
        path: '../../app/containers/{{properCase moduleName}}/index.js',
        templateFile: './business/index.js.hbs',
        abortOnFail: true,
      },
      {
        type: 'add',
        path: '../../app/containers/{{properCase moduleName}}/tests/index.test.js',
        templateFile: './business/test.js.hbs',
        abortOnFail: true,
      },
      {
        type: 'add',
        path: '../../app/containers/{{properCase moduleName}}/route.js',
        templateFile: './business/route.js.hbs',
        abortOnFail: true,
      },

    ]


    // If component wants messages
    if (data.wantMessages) {
      actions.push({
        type: 'add',
        path: '../../app/containers/{{properCase moduleName}}/messages.js',
        templateFile: './business/messages.js.hbs',
        abortOnFail: true,
      });
    }
    // If they want actions and a reducer, generate actions.js, constants.js,
    // reducer.js and the corresponding tests for actions and the reducer
    if (data.wantActionsAndReducer) {
      // Actions
      actions.push({
        type: 'add',
        path: '../../app/containers/{{properCase moduleName}}/actions.js',
        templateFile: './business/actions.js.hbs',
        abortOnFail: true,
      });
      actions.push({
        type: 'add',
        path: '../../app/containers/{{properCase moduleName}}/tests/actions.test.js',
        templateFile: './business/actions.test.js.hbs',
        abortOnFail: true,
      });

      // Constants
      actions.push({
        type: 'add',
        path: '../../app/containers/{{properCase moduleName}}/constants.js',
        templateFile: './business/constants.js.hbs',
        abortOnFail: true,
      });

      // Selectors
      actions.push({
        type: 'add',
        path: '../../app/containers/{{properCase moduleName}}/selectors.js',
        templateFile: './business/selectors.js.hbs',
        abortOnFail: true,
      });
      actions.push({
        type: 'add',
        path:
            '../../app/containers/{{properCase moduleName}}/tests/selectors.test.js',
        templateFile: './business/selectors.test.js.hbs',
        abortOnFail: true,
      });

      // Reducer
      actions.push({
        type: 'add',
        path: '../../app/containers/{{properCase moduleName}}/reducer.js',
        templateFile: './business/reducer.js.hbs',
        abortOnFail: true,
      });
      actions.push({
        type: 'add',
        path: '../../app/containers/{{properCase moduleName}}/tests/reducer.test.js',
        templateFile: './container/reducer.test.js.hbs',
        abortOnFail: true,
      });
    }

    // Sagas
    if (data.wantSaga) {
      actions.push({
        type: 'add',
        path: '../../app/containers/{{properCase moduleName}}/saga.js',
        templateFile: './business/saga.js.hbs',
        abortOnFail: true,
      });
      actions.push({
        type: 'add',
        path: '../../app/containers/{{properCase moduleName}}/tests/saga.test.js',
        templateFile: './business/saga.test.js.hbs',
        abortOnFail: true,
      });
    }

    if (data.wantLoadable) {
      actions.push({
        type: 'add',
        path: '../../app/containers/{{properCase moduleName}}/Loadable.js',
        templateFile: './component/loadable.js.hbs',
        abortOnFail: true,
      });
    }

    /**
         * create
         */
    if (data.neededContainerComponent.indexOf("create") !== -1)
    {
      actions.push(
        {
          type: 'add',
          path: '../../app/containers/{{properCase moduleName}}/{{properCase crudModulePrefix}}Create/index.js',
          templateFile: './business/create/index.js.hbs',
          abortOnFail: true,
        },
        {
          type: 'add',
          path: '../../app/containers/{{properCase moduleName}}/{{properCase crudModulePrefix}}Create/tests/index.test.js',
          templateFile: './business/create/test.js.hbs',
          abortOnFail: true,
        },
        {
          type: 'add',
          path: '../../app/containers/{{properCase moduleName}}/{{properCase crudModulePrefix}}Create/messages.js',
          templateFile: './business/create/messages.js.hbs',
          abortOnFail: true,
        },

        // Actions
        {
          type: 'add',
          path: '../../app/containers/{{properCase moduleName}}/{{properCase crudModulePrefix}}Create/actions.js',
          templateFile: './business/create/actions.js.hbs',
          abortOnFail: true,
        },
        {
          type: 'add',
          path: '../../app/containers/{{properCase moduleName}}/{{properCase crudModulePrefix}}Create/tests/actions.test.js',
          templateFile: './business/create/actions.test.js.hbs',
          abortOnFail: true,
        },

        // Constants
        {
          type: 'add',
          path: '../../app/containers/{{properCase moduleName}}/{{properCase crudModulePrefix}}Create/constants.js',
          templateFile: './business/create/constants.js.hbs',
          abortOnFail: true,
        },

        // Selectors
        {
          type: 'add',
          path: '../../app/containers/{{properCase moduleName}}/{{properCase crudModulePrefix}}Create/selectors.js',
          templateFile: './business/create/selectors.js.hbs',
          abortOnFail: true,
        },
        {
          type: 'add',
          path:
            '../../app/containers/{{properCase moduleName}}/{{properCase crudModulePrefix}}Create/tests/selectors.test.js',
          templateFile: './business/create/selectors.test.js.hbs',
          abortOnFail: true,
        },

        // Reducer
        {
          type: 'add',
          path: '../../app/containers/{{properCase moduleName}}/{{properCase crudModulePrefix}}Create/reducer.js',
          templateFile: './business/create/reducer.js.hbs',
          abortOnFail: true,
        },
        {
          type: 'add',
          path: '../../app/containers/{{properCase moduleName}}/{{properCase crudModulePrefix}}Create/tests/reducer.test.js',
          templateFile: './business/create/reducer.test.js.hbs',
          abortOnFail: true,
        },

        // Saga
        {
          type: 'add',
          path: '../../app/containers/{{properCase moduleName}}/{{properCase crudModulePrefix}}Create/saga.js',
          templateFile: './business/create/saga.js.hbs',
          abortOnFail: true,
        },
        {
          type: 'add',
          path: '../../app/containers/{{properCase moduleName}}/{{properCase crudModulePrefix}}Create/tests/saga.test.js',
          templateFile: './business/create/saga.test.js.hbs',
          abortOnFail: true,
        },
      )
    }
    /**
       * edit
       */
    if (data.neededContainerComponent.indexOf("edit") !== -1)
    {
      actions.push(
        {
          type: 'add',
          path: '../../app/containers/{{properCase moduleName}}/{{properCase crudModulePrefix}}Edit/index.js',
          templateFile: './business/edit/index.js.hbs',
          abortOnFail: true,
        },
        {
          type: 'add',
          path: '../../app/containers/{{properCase moduleName}}/{{properCase crudModulePrefix}}Edit/tests/index.test.js',
          templateFile: './business/edit/test.js.hbs',
          abortOnFail: true,
        },
        {
          type: 'add',
          path: '../../app/containers/{{properCase moduleName}}/{{properCase crudModulePrefix}}Edit/messages.js',
          templateFile: './business/edit/messages.js.hbs',
          abortOnFail: true,
        },

        // Actions
        {
          type: 'add',
          path: '../../app/containers/{{properCase moduleName}}/{{properCase crudModulePrefix}}Edit/actions.js',
          templateFile: './business/edit/actions.js.hbs',
          abortOnFail: true,
        },
        {
          type: 'add',
          path: '../../app/containers/{{properCase moduleName}}/{{properCase crudModulePrefix}}Edit/tests/actions.test.js',
          templateFile: './business/edit/actions.test.js.hbs',
          abortOnFail: true,
        },

        // Constants
        {
          type: 'add',
          path: '../../app/containers/{{properCase moduleName}}/{{properCase crudModulePrefix}}Edit/constants.js',
          templateFile: './business/edit/constants.js.hbs',
          abortOnFail: true,
        },

        // Selectors
        {
          type: 'add',
          path: '../../app/containers/{{properCase moduleName}}/{{properCase crudModulePrefix}}Edit/selectors.js',
          templateFile: './business/edit/selectors.js.hbs',
          abortOnFail: true,
        },
        {
          type: 'add',
          path:
              '../../app/containers/{{properCase moduleName}}/{{properCase crudModulePrefix}}Edit/tests/selectors.test.js',
          templateFile: './business/edit/selectors.test.js.hbs',
          abortOnFail: true,
        },

        // Reducer
        {
          type: 'add',
          path: '../../app/containers/{{properCase moduleName}}/{{properCase crudModulePrefix}}Edit/reducer.js',
          templateFile: './business/edit/reducer.js.hbs',
          abortOnFail: true,
        },
        {
          type: 'add',
          path: '../../app/containers/{{properCase moduleName}}/{{properCase crudModulePrefix}}Edit/tests/reducer.test.js',
          templateFile: './business/edit/reducer.test.js.hbs',
          abortOnFail: true,
        },

        // Saga
        {
          type: 'add',
          path: '../../app/containers/{{properCase moduleName}}/{{properCase crudModulePrefix}}Edit/saga.js',
          templateFile: './business/edit/saga.js.hbs',
          abortOnFail: true,
        },
        {
          type: 'add',
          path: '../../app/containers/{{properCase moduleName}}/{{properCase crudModulePrefix}}Edit/tests/saga.test.js',
          templateFile: './business/edit/saga.test.js.hbs',
          abortOnFail: true,
        },
      )
    }
    /**
       * view
       */
    if (data.neededContainerComponent.indexOf("view") !== -1)
    {
      actions.push(
        {
          type: 'add',
          path: '../../app/containers/{{properCase moduleName}}/{{properCase crudModulePrefix}}View/index.js',
          templateFile: './business/view/index.js.hbs',
          abortOnFail: true,
        },
        {
          type: 'add',
          path: '../../app/containers/{{properCase moduleName}}/{{properCase crudModulePrefix}}View/tests/index.test.js',
          templateFile: './business/view/test.js.hbs',
          abortOnFail: true,
        },
        {
          type: 'add',
          path: '../../app/containers/{{properCase moduleName}}/{{properCase crudModulePrefix}}View/messages.js',
          templateFile: './business/view/messages.js.hbs',
          abortOnFail: true,
        },
        // Actions
        {
          type: 'add',
          path: '../../app/containers/{{properCase moduleName}}/{{properCase crudModulePrefix}}View/actions.js',
          templateFile: './business/view/actions.js.hbs',
          abortOnFail: true,
        },
        {
          type: 'add',
          path: '../../app/containers/{{properCase moduleName}}/{{properCase crudModulePrefix}}View/tests/actions.test.js',
          templateFile: './business/view/actions.test.js.hbs',
          abortOnFail: true,
        },

        // Constants
        {
          type: 'add',
          path: '../../app/containers/{{properCase moduleName}}/{{properCase crudModulePrefix}}View/constants.js',
          templateFile: './business/view/constants.js.hbs',
          abortOnFail: true,
        },

        // Selectors
        {
          type: 'add',
          path: '../../app/containers/{{properCase moduleName}}/{{properCase crudModulePrefix}}View/selectors.js',
          templateFile: './business/view/selectors.js.hbs',
          abortOnFail: true,
        },
        {
          type: 'add',
          path:
            '../../app/containers/{{properCase moduleName}}/{{properCase crudModulePrefix}}View/tests/selectors.test.js',
          templateFile: './business/view/selectors.test.js.hbs',
          abortOnFail: true,
        },

        // Reducer
        {
          type: 'add',
          path: '../../app/containers/{{properCase moduleName}}/{{properCase crudModulePrefix}}View/reducer.js',
          templateFile: './business/view/reducer.js.hbs',
          abortOnFail: true,
        },
        {
          type: 'add',
          path: '../../app/containers/{{properCase moduleName}}/{{properCase crudModulePrefix}}View/tests/reducer.test.js',
          templateFile: './business/view/reducer.test.js.hbs',
          abortOnFail: true,
        },

        // Saga
        {
          type: 'add',
          path: '../../app/containers/{{properCase moduleName}}/{{properCase crudModulePrefix}}View/saga.js',
          templateFile: './business/view/saga.js.hbs',
          abortOnFail: true,
        },
        {
          type: 'add',
          path: '../../app/containers/{{properCase moduleName}}/{{properCase crudModulePrefix}}View/tests/saga.test.js',
          templateFile: './business/view/saga.test.js.hbs',
          abortOnFail: true,
        },
      )
    }
    /**
       * delete
       */
    if (data.neededContainerComponent.indexOf("delete") !== -1)
    {
      actions.push(
        {
          type: 'add',
          path: '../../app/containers/{{properCase moduleName}}/{{properCase crudModulePrefix}}Delete/index.js',
          templateFile: './business/delete/index.js.hbs',
          abortOnFail: true,
        },
        {
          type: 'add',
          path: '../../app/containers/{{properCase moduleName}}/{{properCase crudModulePrefix}}Delete/tests/index.test.js',
          templateFile: './business/delete/test.js.hbs',
          abortOnFail: true,
        },
        {
          type: 'add',
          path: '../../app/containers/{{properCase moduleName}}/{{properCase crudModulePrefix}}Delete/messages.js',
          templateFile: './business/delete/messages.js.hbs',
          abortOnFail: true,
        },
        // Actions
        {
          type: 'add',
          path: '../../app/containers/{{properCase moduleName}}/{{properCase crudModulePrefix}}Delete/actions.js',
          templateFile: './business/delete/actions.js.hbs',
          abortOnFail: true,
        },
        {
          type: 'add',
          path: '../../app/containers/{{properCase moduleName}}/{{properCase crudModulePrefix}}Delete/tests/actions.test.js',
          templateFile: './business/delete/actions.test.js.hbs',
          abortOnFail: true,
        },

        // Constants
        {
          type: 'add',
          path: '../../app/containers/{{properCase moduleName}}/{{properCase crudModulePrefix}}Delete/constants.js',
          templateFile: './business/delete/constants.js.hbs',
          abortOnFail: true,
        },

        // Selectors
        {
          type: 'add',
          path: '../../app/containers/{{properCase moduleName}}/{{properCase crudModulePrefix}}Delete/selectors.js',
          templateFile: './business/delete/selectors.js.hbs',
          abortOnFail: true,
        },
        {
          type: 'add',
          path:
            '../../app/containers/{{properCase moduleName}}/{{properCase crudModulePrefix}}Delete/tests/selectors.test.js',
          templateFile: './business/delete/selectors.test.js.hbs',
          abortOnFail: true,
        },

        // Reducer
        {
          type: 'add',
          path: '../../app/containers/{{properCase moduleName}}/{{properCase crudModulePrefix}}Delete/reducer.js',
          templateFile: './business/delete/reducer.js.hbs',
          abortOnFail: true,
        },
        {
          type: 'add',
          path: '../../app/containers/{{properCase moduleName}}/{{properCase crudModulePrefix}}Delete/tests/reducer.test.js',
          templateFile: './business/delete/reducer.test.js.hbs',
          abortOnFail: true,
        },

        // Saga
        {
          type: 'add',
          path: '../../app/containers/{{properCase moduleName}}/{{properCase crudModulePrefix}}Delete/saga.js',
          templateFile: './business/delete/saga.js.hbs',
          abortOnFail: true,
        },
        {
          type: 'add',
          path: '../../app/containers/{{properCase moduleName}}/{{properCase crudModulePrefix}}Delete/tests/saga.test.js',
          templateFile: './business/delete/saga.test.js.hbs',
          abortOnFail: true,
        },
      )
    }

    actions.push({
      type: 'prettify',
      path: `/containers/${data.moduleName}`,
    });

    return actions;
  },
};
