class Guest < ApplicationRecord
  belongs_to :invitation, :inverse_of => :guests
  belongs_to :table, :inverse_of => :guests

  validates_presence_of :name, :invitation

  HUMANIZED_ATTRIBUTES = {
    :special_needs => 'Special requests',
    :under_4 => 'Under age 4?'
  }

  scope :attending, -> { includes(:invitation).where('invitations.going' => true).order('invitations.id') }
  scope :not_attending, -> { includes(:invitation).where('invitations.going' => false, 'invitations.responded' => true).order('invitations.id') }
  scope :responded, -> { includes(:invitation).where('invitations.responded' => true).order('invitations.id') }
  scope :not_responded, -> { includes(:invitation).where('invitations.responded' => false, 'invitations.going' => false, 'invitations.invited' => true).order('invitations.id') }

  def self.human_attribute_name(attr, options={})
    HUMANIZED_ATTRIBUTES[attr.to_sym] || super
  end

  def save_the_date_sent
    invitation.present? ? invitation.save_the_date_sent : nil
  end

  def invited
    invitation.present? ? invitation.invited : nil
  end

  def going
    invitation.present? ? invitation.going : nil
  end

  def responded
    invitation.present? ? invitation.responded : nil
  end

  def to_s
    name
  end
end
