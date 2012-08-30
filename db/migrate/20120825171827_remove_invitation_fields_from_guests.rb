class RemoveInvitationFieldsFromGuests < ActiveRecord::Migration
  def change
    remove_column :guests, :address
    remove_column :guests, :responded
    remove_column :guests, :going
    remove_column :guests, :plus_one
    remove_column :guests, :rsvp
    change_table :guests do |t|
      t.references :invitation
    end
  end
end
