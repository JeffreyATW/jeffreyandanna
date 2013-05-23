// Place all the behaviors and hooks related to the matching controller here.
//= require jquery
//= require libs/jquery-ui.custom
//= require libs/underscore
//= require libs/backbone
//= require libs/backbone.marionette
//= require libs/backbone-relational
//= require libs/backbone.projections

var csrfToken = $('meta[name="csrf-token"]').attr('content'),

  colors = {},

  randomHex = function () {
    var pad = '00';
    return (pad + Math.floor(Math.random()*192).toString(16)).slice(-pad.length);
  },

  Guest = Backbone.RelationalModel.extend(),

  GuestCollection = Backbone.Collection.extend({
    model: Guest
  });

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
        relatedModel: 'Guest',
        collectionType: 'GuestCollection',
        includeInJSON: 'id',
        reverseRelation: {
          key: 'table',
          keySource: 'table_id',
          includeInJSON: 'id'
        }
      }],
      toJSON: function() {
        return { table: _.omit(Backbone.RelationalModel.prototype.toJSON.call(this), ['id']) }
      },
      validate: function (attrs, options) {
        // TODO make this work
        if (attrs.guests > 8) {
          return "can't have more than 8 guests";
        }
      },
      url: function() {
        var base = '/tables';
        if (this.isNew()) return base;
        return base + '/' + this.id;
      }
    })
  }),

  guestCollection = new GuestCollection(guests),

  unassignedGuestCollection = new BackboneProjections.Filtered(guestCollection, {
    filter: function (guest) {
      return !guest.get('table');
    }
  }),

  GuestCollectionView = Marionette.CollectionView.extend({
    onRender: function () {
      this.$el.sortable({
        connectWith: '.guest_list'
      });
    },
    itemView: Marionette.ItemView.extend({
      initialize: function () {
        var invitationId = this.model.get('invitation_id');
        if (!colors[invitationId]) {
          colors[invitationId] =
            randomHex() +
            randomHex() +
            randomHex();
        }
        this.$el.css('color', '#' + colors[invitationId]);
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
      this.$el.sortable({
        connectWith: '.guest_list',
        receive: function (e, ui) {
          ui.item.trigger('dragged', []);
        }
      })
    }
  })

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
          containment: 'parent'
        }).on('sortreceive', function (e, ui) {
          ui.item.trigger('dragged', [that.model]);
        });
        guestCollectionView.render();
      },
      events: {
        'dragstop': function (e, ui) {
          this.model.set({x: ui.position.left, y: ui.position.top});
        }
      },
      className: 'table',
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


tableCollectionView.render();
unassignedGuestCollectionView.render();