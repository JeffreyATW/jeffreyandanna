class ChangeInvitationsBooleansToNotNull < ActiveRecord::Migration
  def change
    change_column :invitations, :responded, :boolean, null: false, default: false
    change_column :invitations, :going, :boolean, null: false, default: false
    change_column :invitations, :invited, :boolean, null: false, default: false
    change_column :invitations, :save_the_date_sent, :boolean, null: false, default: false
  end
end
