class Guest < ActiveRecord::Base
  belongs_to :invitation, :inverse_of => :guests
  belongs_to :table, :inverse_of => :guests

  attr_accessible :name, :special_needs, :under_4, :invitation_id, :invitation_attributes, :table_id, :table_attributes
  validates_presence_of :name, :invitation

  HUMANIZED_ATTRIBUTES = {
    :special_needs => 'Special requests',
    :under_4 => 'Under age 4?'
  }

  scope :attending, includes(:invitation).where('invitations.going' => true).order('invitations.id')

  def self.human_attribute_name(attr, options={})
    HUMANIZED_ATTRIBUTES[attr.to_sym] || super
  end

  def to_s
    name
  end
end
