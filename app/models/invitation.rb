class Invitation < ActiveRecord::Base
  has_many :guests#, :inverse_of => :invitation
  accepts_nested_attributes_for :guests, :allow_destroy => true

  attr_accessible :address, :going, :plus_one, :responded, :guests_attributes

  before_create :generate_rsvp
  validates_presence_of :guests

  HUMANIZED_ATTRIBUTES = {
    :plus_one => "+1",
    :id => "ID",
    :rsvp => "RSVP",
    :guests => "Guest(s)"
  }

  def self.human_attribute_name(attr, options={})
    HUMANIZED_ATTRIBUTES[attr.to_sym] || super
  end

  def to_s
    name
  end

  def name
    "#{guests.first}#{guests.length > 1 ? " + #{guests.length - 1}" : ""}"
  end

  private
  def generate_rsvp
    self.rsvp = ('A'..'Z').to_a.shuffle[0,8].join
  end
end
