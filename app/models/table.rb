class Table < ActiveRecord::Base
  has_many :guests

  attr_accessible :name, :notes, :guest_ids, :x, :y, :table_type

  validates_presence_of :name
  validates_length_of :guests, :maximum => 8
end