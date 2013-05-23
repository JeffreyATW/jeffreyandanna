// Place all the behaviors and hooks related to the matching controller here.
//= require jquery
//= require libs/jquery-ui.custom
//= require libs/underscore
//= require libs/backbone
//= require libs/backbone.marionette

var Table = Backbone.Model.extend({

  }),

  tableCollection = new Backbone.Collection(tables, {
    model: Table,
    url: '/tables'
  }),

  TableView = Marionette.ItemView.extend({
    template: '#table_template'
  });

  tableCollectionView = new Marionette.CollectionView({
    collection: tableCollection,
    itemView: TableView
  });

  tableCollectionView.render();