class CreateInvitations < ActiveRecord::Migration
  def change
    create_table :invitations do |t|
      t.text :address
      t.boolean :responded
      t.boolean :going
      t.string :rsvp

      t.timestamps
    end
  end
end
