class Table < ActiveRecord::Base
  attr_accessible :name, :notes, :guest_ids

  has_many :guests

  validates_presence_of :name
  validates_length_of :guests, :maximum => 8
end