class TruncateRsvpsForInvitations < ActiveRecord::Migration
  def change
    Invitation.all.each do |invitation|
      invitation.generate_rsvp
      invitation.save
    end
  end
end
