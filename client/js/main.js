(function (undefined) {
  'use strict';

  // Auxiliar functions
  // ------------------

  var generateDateFromNow = function (day) {
    var now = new Date();
    now.setDate(day);
    now.setHours(0);
    now.setMinutes(0);

    return now;
  };

  // Some card mocks
  // ---------------

  document.addEventListener('DOMContentLoaded', function () {
    var card1 = new Planner.Models.Card({
      id: 1,
      title: 'Having a long dinner',
      content: 'Just a comment',
      start: generateDateFromNow(2),
      end: generateDateFromNow(5),
      columns: [1]
    });

    var card2 = new Planner.Models.Card({
      id: 2,
      title: 'DjangoCon meeting!',
      content: '@Orvieto',
      start: generateDateFromNow(5),
      end: generateDateFromNow(14),
      columns: [3]
    });

    var card3 = new Planner.Models.Card({
      id: 3,
      title: 'Hello IT',
      content: 'Standard nerds',
      start: generateDateFromNow(13),
      end: generateDateFromNow(15),
      columns: [2]
    });

    var card4 = new Planner.Models.Card({
      id: 4,
      title: 'Having another dinner :(',
      content: 'Just a comment',
      start: generateDateFromNow(20),
      end: generateDateFromNow(28),
      columns: [0]
    });

    var card5 = new Planner.Models.Card({
      id: 5,
      title: 'GUH!',
      content: 'What!?',
      start: generateDateFromNow(4),
      end: generateDateFromNow(14),
      columns: [4]
    });

    // Planner options
    var element = document.querySelector('.js-planner');
    var options = {
      plugins: [
        'slider',
        'collision',
        'mobile',
        'interaction',
        'hourline'
      ]
    };

    // Init and draw cards
    var planner = new Planner(element, options);
    planner.drawCard(card1);
    planner.drawCard(card2);
    planner.drawCard(card3);
    planner.drawCard(card4);

    window.planner = planner;
  });

})();
