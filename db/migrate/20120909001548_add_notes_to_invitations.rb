class AddNotesToInvitations < ActiveRecord::Migration
  def change
    add_column :invitations, :notes, :text
  end
end
