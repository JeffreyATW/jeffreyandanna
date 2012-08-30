class Guest < ActiveRecord::Base
  belongs_to :invitation, :inverse_of => :guests
  accepts_nested_attributes_for :invitation, :allow_destroy => true

  attr_accessible :name, :special_needs, :invitation_id, :invitation_attributes
  validates_presence_of :name, :invitation

  def to_s
    name
  end
end
