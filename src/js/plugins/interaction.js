;(function($, Plugins, Card, Helpers, Events) { 'use strict';

    // Plugin constructor and defaults
    // -------------------------------

    var Crud = function(planner, options) {
        this.planner = planner;
        this.$element = planner.$element;
        this.options = options;

        this.currentCard = null;
    };

    Crud.DEFAULTS = {};

    // Plugin functionalities
    // ----------------------

    Crud.prototype.attachDragCreation = function() {
        var self = this;

        self.$element.find('.planner-column > div').
            on('mousedown', function(event) {
                // Start card creation
                var $this = $(this);
                var startAttribute = Helpers.indexToAttribute($this.index());
                var endAttribute = Helpers.indexToAttribute($this.index() + 1);
                var assignee = [$this.parent().index() + 1];

                // Create a Card object with relative DOM element
                self.currentCard = new Card({start: startAttribute, end: endAttribute, assignees: assignee});
                self.planner.drawCard(self.currentCard);

                self.initialIndex = $this.index();
                self.initialY = event.clientY;

                // Avoid other actions
                event.preventDefault();
            }).
            on('mouseup', function(event) {
                // End card creation
                // TODO add object to a global Card Array before dismiss
                self.currentCard = null;

                // Avoid other actions
                event.preventDefault();
            }).
            on('mousemove', function(event) {
                if (self.currentCard !== null) {
                    var currentCardPosition = Math.floor((event.clientY - self.initialY) / self.options.timeslotHeight) + 1;

                    self.currentCard.end = Helpers.indexToAttribute(self.initialIndex + currentCardPosition);
                    self.currentCard.titleHeader = self.currentCard.generateTitle();

                    self.currentCard.$element.forEach(function (cardDOM) {
                        // Calculate new length
                        var startIndex = Helpers.attributeToIndex(self.currentCard.start);
                        var endIndex = Helpers.attributeToIndex(self.currentCard.end);
                        var cardLength = (endIndex - startIndex) * self.options.timeslotHeight - self.options.cardTitleMargin;

                        // Update DOM values
                        cardDOM.data('end', endIndex);
                        cardDOM.find('.planner-card-time').html(self.currentCard.titleHeader);
                        cardDOM.height(cardLength);
                    });

                    // Avoid other actions
                    event.preventDefault();
                }
            });
    };

    Crud.prototype.attachDragAndDrop = function() {
        var self = this;

        // Add jQuery event 'dataTransfer' property as
        // stated in: http://api.jquery.com/category/events/event-object/
        $.event.props.push('dataTransfer');

        Events.subscribe('cardCreated', function(card, element) {
            $(element).attr('draggable', true);
            $(element).on('dragstart', function(event) {
                $(this).addClass('dragging');
                event.dataTransfer.effectAllowed = 'move';
                event.dataTransfer.setData('text/html', this.innerHTML);
            });
        });
    };

    // Crud plugin definition
    // ----------------------

    var old = $.fn.crud;

    $.fn.crud = function(option) {
        var planner = this;

        return this.$element.each(function() {
            var $this = $(this);
            var data = $this.data('pl.plugins.crud');
            var options = $.extend({}, Crud.DEFAULTS, $this.data('pl.planner').options, typeof option === 'object' && option);

            // If this node isn't initialized, call the constructor
            if (!data) {
                $this.data('pl.plugins.crud', (data = new Crud(planner, options)));
            }

            data.attachDragCreation();
            data.attachDragAndDrop();
        });
    };

    $.fn.crud.constructor = Crud;

    // Crud no conflict
    // ----------------

    $.fn.crud.noConflict = function() {
        $.fn.crud = old;
        return this;
    };

    // Register this plugin to plugins list
    // ------------------------------------

    Plugins.register('interaction', $.fn.crud);

})(jQuery, Planner.Plugins, Planner.Model.Card, Planner.Helpers, Planner.Events);
