// Place all the behaviors and hooks related to the matching controller here.
//= require jquery
//= require libs/jquery-ui.custom
//= require libs/underscore
//= require libs/backbone
//= require libs/backbone.marionette
//= require libs/backbone-relational
//= require libs/backbone.collectionsubset

/* global $, Backbone, Marionette, _, tables, guests*/

(function () {
  'use strict';

  var csrfToken = $('meta[name="csrf-token"]').attr('content'),

    maxGuests = 10,

    colors = {},

    sortableOpts = {
      connectWith: '.guest_list',
      cursor: 'move',
      stop: function () {
        $('.table_guests').sortable('enable');
      },
      revert: true
    },

    randomHex = function () {
      var pad = '00';
      return (pad + Math.floor(Math.random()*192).toString(16)).slice(-pad.length);
    },

    Guest = Backbone.RelationalModel.extend(),

    GuestCollection = Backbone.Collection.extend({
      model: Guest
    }),

    tableCollection = new Backbone.Collection(tables, {
      model: Backbone.RelationalModel.extend({
        initialize: function () {
          this.on('change add:guests remove:guests', function () {
            this.save();
          });
        },
        relations: [{
          type: Backbone.HasMany,
          key: 'guests',
          keyDestination: 'guest_ids',
          relatedModel: Guest,
          collectionType: GuestCollection,
          includeInJSON: 'id',
          reverseRelation: {
            key: 'table',
            keySource: 'table_id',
            includeInJSON: 'id'
          }
        }],
        toJSON: function() {
          return { table: _.omit(Backbone.RelationalModel.prototype.toJSON.call(this), ['id']) };
        },
        validate: function (attrs) {
          if (!attrs.name.length) {
            return "must have a name";
          }
          if (attrs.table_type !== 'dance_floor') {
            if (attrs.guests.length > maxGuests) {
              return "can't have more than " + maxGuests + " guests";
            }
          } else {
            if (attrs.guests.length > 0) {
              return "can't have any guests";
            }
          }
        },
        url: function() {
          var base = '/tables';
          if (this.isNew()) {
            return base;
          }
          return base + '/' + this.id;
        }
      })
    }),

    guestCollection = new GuestCollection(guests),

    unassignedGuestCollection = guestCollection.subcollection({
      filter: function (guest) {
        return !guest.get('table');
      }
    }),

    GuestCollectionView = Marionette.CollectionView.extend({
      onRender: function () {
        var that = this;
        that.$el.sortable($.extend(sortableOpts, {
          over: function () {
            $(this).closest('.table').addClass('hover');
          },
          out: function () {
            $(this).closest('.table').removeClass('hover');
          }
        }));
      },
      itemView: Marionette.ItemView.extend({
        initialize: function () {
          var invitationId = this.model.get('invitation_id');
          // categorize guests by invitation by color
          if (!colors[invitationId]) {
            colors[invitationId] =
              randomHex() +
              randomHex() +
              randomHex();
          }
          this.$el.css('color', '#' + colors[invitationId])
            .mousedown(function () {
              $('.table_guests').not($(this).parent()).each(function () {
                var $this = $(this);

                if ($this.find('li').length >= maxGuests) {
                  $this.sortable('disable');
                } else {
                  $this.sortable('enable');
                }
              });
            });
        },
        events: {
          'dragged': 'assign'
        },
        assign: function (e, table) {
          this.model.set('table', table);
        },
        tagName: 'li',
        className: 'guest',
        template: '#guest_template'
      })
    }),

    UnassignedGuestCollectionView = GuestCollectionView.extend({
      onRender: function () {
        this.$el.sortable($.extend(sortableOpts, {
          receive: function (e, ui) {
            ui.item.trigger('dragged', []);
          }
        }));
      }
    }),

    unassignedGuestCollectionView = new UnassignedGuestCollectionView({
      el: '#guests',
      collection: unassignedGuestCollection
    }),

    tableCollectionView = new Marionette.CollectionView({
      el: '#tables',
      collection: tableCollection,
      itemView: Marionette.ItemView.extend({
        onRender: function () {
          var that = this,
            guestCollectionView = new GuestCollectionView({
              el: this.$el.find('.table_guests'),
              collection: this.model.get('guests')
            });
          that.$el.css({
            position: 'absolute',
            left: that.model.get('x'),
            top: that.model.get('y')
          }).draggable({
            cancel: 'h2',
            containment: 'parent',
            cursor: 'move',
          }).on('sortreceive', function (e, ui) {
            ui.item.trigger('dragged', [that.model]);
          });
          guestCollectionView.render();
        },
        events: {
          'dragstop': function (e, ui) {
            this.model.set({x: ui.position.left, y: ui.position.top});
          },
          'click .close_button': function () {
            var that = this;
            this.$el.fadeOut(function () {
              var models = that.model.get('guests').models, i, len;
              // models array will reduce in size as we iterate - always remove first
              for (i = 0, len = models.length; i < len; i += 1) {
                models[0].set('table', undefined);
              }
              that.model.destroy();
            });
          },
          'blur h2': function (e) {
            this.model.set('name', $(e.currentTarget).text());
          },
          'keydown h2': function (e) {
            if (e.which === 13) {
              $(e.currentTarget).trigger('blur');
              e.preventDefault();
            }
          }
        },
        className: function () {
          return 'table ' + this.model.get('table_type');
        },
        template: '#table_template'
      })
    });

  $.ajaxSetup({
    beforeSend: function (xhr, settings) {
      if (settings.crossDomain) {
        return;
      }
      if (settings.type === "GET") {
        return;
      }
      if (csrfToken) {
        return xhr.setRequestHeader('X-CSRF-Token', csrfToken);
      }
    }
  });

  $('#new_table').submit(function (e) {
    var o = {}, a = $(this).serializeArray();
    e.preventDefault();
    $.each(a, function() {
      if (o[this.name] !== undefined) {
        if (!o[this.name].push) {
          o[this.name] = [o[this.name]];
        }
        o[this.name].push(this.value || '');
      } else {
        o[this.name] = this.value || '';
      }
    });

    if (o.table_type === 'dance_floor' && o.name === '') {
      o.name = 'Dance floor';
    }

    // wait: true causes validate to run before model is added to collection
    tableCollection.create(o, {wait: true});
  });

  tableCollectionView.render();
  unassignedGuestCollectionView.render();
}());