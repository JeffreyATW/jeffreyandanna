class Invitation < ActiveRecord::Base
  has_many :guests, :dependent => :destroy, :inverse_of => :invitation
  accepts_nested_attributes_for :guests, :allow_destroy => true

  attr_accessible :address, :going, :plus_one, :responded, :guests_attributes, :email, :notes
  before_save :ensure_has_one_guest
  before_create :generate_rsvp
  validates_associated :guests
  validates_format_of :email, :with => /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\Z/i, :allow_blank => true

  HUMANIZED_ATTRIBUTES = {
    :plus_one => "+1",
    :id => "ID",
    :rsvp => "RSVP",
    :email => "Email address",
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

  def ensure_has_one_guest
    if self.guests.length < 1 || (self.guests.length == 1 && self.guests.first._destroy == true)
      errors.add(:base, "An invitation must have at least one guest.")
      return false
    else
      return true
    end
  end
end
