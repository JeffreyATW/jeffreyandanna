class Guest < ActiveRecord::Base
  attr_accessible :address, :going, :name, :plus_one, :responded
  validates_presence_of :name
  before_create :generate_rsvp

  HUMANIZED_ATTRIBUTES = {
    :plus_one => "+1",
    :id => "ID",
    :rsvp => "RSVP"
  }

  def self.human_attribute_name(attr, options={})
    HUMANIZED_ATTRIBUTES[attr.to_sym] || super
  end

  private
  def generate_rsvp
    self.rsvp = ('A'..'Z').to_a.shuffle[0,8].join
  end
end
