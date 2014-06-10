class AddNoPaperInviteToInvitations < ActiveRecord::Migration
  def change
    add_column :invitations, :no_paper_invite, :boolean
  end
end
