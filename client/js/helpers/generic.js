(function (Helpers, Handlebars, undefined) {
  'use strict';

  // Local data
  // ----------

  var _dayColumns = [
    {id: 0, name: 'World Domination'},
    {id: 1, name: 'Jupiter Project'},
    {id: 2, name: 'Dyson Sphere'},
    {id: 3, name: 'Voyager 1 Retrieval'},
    {id: 4, name: 'Comets Harvestings'},
    {id: 5, name: 'Europa Drilling'},
    {id: 6, name: 'TMA-1 Investigation'}
  ];

  var _hourRows = [
    {name: '00:00'},
    {name: '01:00'},
    {name: '02:00'},
    {name: '03:00'},
    {name: '04:00'},
    {name: '05:00'},
    {name: '06:00'},
    {name: '07:00'},
    {name: '08:00'},
    {name: '09:00'},
    {name: '10:00'},
    {name: '11:00'},
    {name: '12:00'},
    {name: '13:00'},
    {name: '14:00'},
    {name: '15:00'},
    {name: '16:00'},
    {name: '17:00'},
    {name: '18:00'},
    {name: '19:00'},
    {name: '20:00'},
    {name: '21:00'},
    {name: '22:00'},
    {name: '23:00'}
  ];

  var _dayRows = [
    {name: '1'},
    {name: '2'},
    {name: '3'},
    {name: '4'},
    {name: '5'},
    {name: '6'},
    {name: '7'},
    {name: '8'},
    {name: '9'},
    {name: '10'},
    {name: '11'},
    {name: '12'},
    {name: '13'},
    {name: '14'},
    {name: '15'},
    {name: '16'},
    {name: '17'},
    {name: '18'},
    {name: '19'},
    {name: '10'},
    {name: '21'},
    {name: '22'},
    {name: '23'},
    {name: '24'},
    {name: '25'},
    {name: '26'},
    {name: '27'},
    {name: '28'},
    {name: '29'},
    {name: '30'},
    {name: '31'},
  ];

  // Planner helpers
  // ---------------

  // Default constructor options
  Helpers.getDefaultColumns = function () {
    return _dayColumns;
  };

  Helpers.getDefaultRows = function () {
    return _dayRows;
  };

  Helpers.generateId = function (options) {
    options.lastId = options.lastId || 999;

    return ++options.lastId;
  };

  // Register Handlebars helpers
  // ---------------------------

  Handlebars.registerHelper('times', function (n, block) {
    var accumulator = '';

    for (var i = 0; i < n; ++i) {
      accumulator += block.fn(i);
    }

    return accumulator;
  });

})(Planner.Helpers = Planner.Helpers || {}, Handlebars);
