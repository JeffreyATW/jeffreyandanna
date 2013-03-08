class AddUnder4ToGuests < ActiveRecord::Migration
  def change
    add_column :guests, :under_4, :boolean
  end
end