(function (Interaction, Events, Utils, undefined) {
  'use strict';

  var Mixin = {};

  Mixin.cardClick = function (card, element) {
    element.addEventListener('click', this.mouseClick(card, element));
  };

  Mixin.mouseClick = function (card, element) {
    // Avoid this action on event propagation from children or if
    // another interaction is active
    if (this.currentInteraction === null) {
      Events.publish('cardClicked', [card, element]);
    }
  };

  Mixin.mouseDown = function (event) {
    // Avoid this action on event propagation from children
    if (event.currentTarget === event.target) {
      // Start interaction with created objects
      var card = this.createCard(event.target);
      this.planner.drawCard(card);

      // TODO: fix me
      // Utils.index(this) doesn't match strictly domId. After full migration to data-attribute,
      // we can use this value to find the correct domId
      var domId = card.columns[0];
      this.startInteraction('dragCreation', card, this.planner.mapCard.get(card)[domId], Utils.index(event.target), event.clientY);
      event.preventDefault();
    }
  };

  Mixin.mouseDownResize = function (card, element, event) {
    this.startInteraction('resize', card, element, this.planner._attributeToIndex(card.start), Utils.offset(element).top - document.body.scrollTop);
    Utils.addClass(this.currentElement, 'resizable');

    event.preventDefault();
  };

  Mixin.mouseMove = function (event) {
    if (this.currentInteraction === 'dragCreation' || this.currentInteraction === 'resize') {
      this.resize(event.clientY);

      event.preventDefault();
    }
  };

  Mixin.mouseUp = function (event) {
    if (this.currentInteraction === 'dragCreation') {
      Events.publish('cardCreated', [this.currentCard, this.currentElement]);

      this.stopInteraction();
      event.preventDefault();
    } else if (this.currentInteraction === 'resize') {
      // TODO: fix this interaction because this way is terribly WRONG!
      Events.publish('cardUpdated', [this.currentCard, this.currentElement]);
      Utils.removeClass(this.currentElement, 'resizable');

      this.stopInteraction();
      event.preventDefault();
    }
  };

  // Mixin for Interaction
  // ------------------

  Interaction.prototype = Utils.extend(Interaction.prototype, Mixin);

})(Planner.Plugins.Interaction, Planner.Events, Planner.Utils);