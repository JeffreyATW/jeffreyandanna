class Table < ActiveRecord::Base
  has_many :guests

  attr_accessible :name, :notes, :guest_ids, :x, :y

  validates_presence_of :name
  validates_length_of :guests, :maximum => 8
end