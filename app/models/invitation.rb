class Invitation < ActiveRecord::Base
  has_many :guests, :dependent => :destroy, :inverse_of => :invitation
  accepts_nested_attributes_for :guests, :allow_destroy => true

  #attr_accessible :address, :save_the_date_sent, :invited, :going, :responded, :guests_attributes, :email, :notes
  before_save :ensure_has_one_guest
  before_create :generate_rsvp
  validates_associated :guests
  validates_format_of :email, :with => /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\Z/i, :allow_blank => true

  HUMANIZED_ATTRIBUTES = {
    :id => "ID",
    :rsvp => "RSVP",
    :email => "Email address",
    :guests => "Guest(s)"
  }

  scope :attending, -> { where(going: true) }
  scope :not_attending, -> { where(going: false, responded: true) }
  scope :responded, -> { where(responded: true) }
  scope :not_responded, -> { where(going: false, responded: false, invited: true) }

  def self.human_attribute_name(attr, options={})
    HUMANIZED_ATTRIBUTES[attr.to_sym] || super
  end

  def to_s
    name
  end

  def name
    "#{guests.first}#{guests.length > 1 ? " + #{guests.length - 1}" : ""}"
  end

  def address_name
    families = []
    last_names = {}
    new_last_names = {}
    guests.each do |guest|
      # Discard if name has question marks
      unless guest.name =~ /\?/
        names = guest.name.split(' ')
        # Discard if last name isn't uppercase, it's a placeholder
        if names.last =~ /[A-Z]/
          # If last name ends with a period, it's a suffix
          if names.last =~ /\. *$/
            # Add to last name list for penultimate word
            (last_names[names[-2]] ||= []) << guest.name
          else
            (last_names[names.last] ||= []) << guest.name
          end
        end
      end
    end
    last_names.each do |last_name, names|
      hash_to_use = last_names
      key_to_use = last_name
      if names.length > 1
        first_person_names = names.first.split(' ')
        # If first person has more than two names
        if first_person_names.length > 2
          second_person_names = names[1].split(' ')
          # Check to see if subsequent person has same penultimate name
          if second_person_names.length > 2 && second_person_names[-2] == first_person_names[-2]
            # Create new key for new last name
            hash_to_use = new_last_names
            key_to_use = first_person_names[-2] + ' ' + last_name
            last_names.delete last_name
          end
        end
        hash_to_use[key_to_use] = names.map{|name| name.split(' ').first}
      else
        # Store all words except last name, will be concatenated next
        last_names[last_name] = [names.first.sub(/ [^ ]+ *$/, '')]
      end
    end
    last_names.merge! new_last_names
    last_names.each do |last_name, first_names|
      if last_name == 'Guest'
        families << last_name
      elsif first_names.length > 4 || last_name == 'Rosa'
        families << "The #{last_name} Family"
      else
        families << first_names.to_sentence + ' ' + last_name
      end
    end
    families.to_sentence
  end

  def generate_rsvp
    self.rsvp = ('A'..'Z').to_a.shuffle[0,4].join
  end

  def get_binding
    binding
  end

  private

  def ensure_has_one_guest
    if self.guests.length < 1 || (self.guests.length == 1 && self.guests.first._destroy == true)
      errors.add(:base, 'An invitation must have at least one guest.')
      false
    else
      true
    end
  end
end
