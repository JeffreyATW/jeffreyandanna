class Guest < ActiveRecord::Base
  belongs_to :invitation, :inverse_of => :guests

  attr_accessible :name, :special_needs, :invitation_id, :invitation_attributes
  validates_presence_of :name, :invitation

  HUMANIZED_ATTRIBUTES = {
    :special_needs => "Special requests"
  }

  def self.human_attribute_name(attr, options={})
    HUMANIZED_ATTRIBUTES[attr.to_sym] || super
  end

  def to_s
    name
  end
end
