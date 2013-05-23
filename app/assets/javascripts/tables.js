// Place all the behaviors and hooks related to the matching controller here.
//= require jquery
//= require libs/jquery-ui.custom
//= require libs/underscore
//= require libs/backbone
//= require libs/backbone.marionette
//= require libs/backbone-relational

var colors = {},

  randomHex = function () {
    var pad = '00';
    return (pad + Math.floor(Math.random()*128).toString(16)).slice(-pad.length);
  },

  Table = Backbone.RelationalModel.extend({
    relations: [{
      type: Backbone.HasMany,
      key: 'guests',
      relatedModel: 'Guest',
      collectionType: 'GuestCollection',
      reverseRelation: {
        key: 'table_id',
        includeInJSON: 'id'
      }
    }]
  }),

  Guest = Backbone.RelationalModel.extend({
    model: Guest
  }),

  GuestCollection = Backbone.Collection.extend({});

  tableCollection = new Backbone.Collection(tables, {
    model: Table,
    url: '/tables'
  }),

  guestCollection = new GuestCollection(guests),

  TableView = Marionette.ItemView.extend({
    initialize: function () {
      this.$el.draggable({
        containment: 'parent'
      });
    },
    className: 'table',
    template: '#table_template'
  });

  GuestView = Marionette.ItemView.extend({
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
    tagName: 'li',
    className: 'guest',
    template: '#guest_template'
  });

  tableCollectionView = new Marionette.CollectionView({
    el: '#tables',
    collection: tableCollection,
    itemView: TableView
  });

  guestCollectionView = new Marionette.CollectionView({
    el: '#guests',
    collection: guestCollection,
    itemView: GuestView
  });

tableCollectionView.render();
guestCollectionView.render();
guestCollectionView.$el.add(tableCollectionView.children.map(function (tableView) {
  return tableView.$el.find('.table_guests')
})).sortable({
  connectWith: '.guest_list'
});