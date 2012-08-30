class AddSpecialNeedsToGuests < ActiveRecord::Migration
  def change
    add_column :guests, :special_needs, :text
  end
end