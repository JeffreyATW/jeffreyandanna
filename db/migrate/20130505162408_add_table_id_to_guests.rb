class AddTableIdToGuests < ActiveRecord::Migration
  def change
    add_column :guests, :table_id, :integer
  end
end
