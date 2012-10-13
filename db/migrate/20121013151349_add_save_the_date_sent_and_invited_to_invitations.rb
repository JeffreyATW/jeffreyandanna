class AddSaveTheDateSentAndInvitedToInvitations < ActiveRecord::Migration
  def change
    add_column :invitations, :save_the_date_sent, :boolean
    add_column :invitations, :invited, :boolean
  end
end
