class Invitation < ActiveRecord::Base
  has_many :guests, :dependent => :destroy, :inverse_of => :invitation
  accepts_nested_attributes_for :guests, :allow_destroy => true

  attr_accessible :address, :save_the_date_sent, :invited, :going, :responded, :guests_attributes, :email, :notes
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
    #"#{guests.first}#{guests.length > 1 ? " + #{guests.length - 1}" : ""}"
  end

  def address_name
    families = []
    last_names = {}
    guests.each do |guest|
      # Discard if name has question marks
      unless guest.name =~ /\?/
        names = guest.name.split(' ')
        # Discard if last name isn't uppercase
        if names.last =~ /[A-Z]/
          # If last name ends with a period, it's a suffix
          if names.last =~ /\.$/
            # Add to last name list for penultimate word
            (last_names[names[-2]] ||= []) << names.first
          else
            (last_names[names.last] ||= []) << names.first
          end
        end
      end
    end
    last_names.each do |last_name, first_names|
      if first_names.length > 4
        families << "The #{last_name} Family"
      else
        families << first_names.to_sentence + ' ' + last_name
      end
    end
    families.to_sentence
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
