class CreateGuests < ActiveRecord::Migration
  def change
    create_table :guests do |t|
      t.string :name
      t.text :address
      t.boolean :responded
      t.boolean :going
      t.boolean :plus_one
      t.string :rsvp

      t.timestamps
    end
  end
end
