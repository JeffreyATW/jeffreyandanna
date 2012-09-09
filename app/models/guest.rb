class Guest < ActiveRecord::Base
  belongs_to :invitation, :inverse_of => :guests

  attr_accessible :name, :special_needs, :invitation_id, :invitation_attributes
  validates_presence_of :name, :invitation

  def to_s
    name
  end
end
