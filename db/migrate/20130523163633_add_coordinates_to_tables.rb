class AddCoordinatesToTables < ActiveRecord::Migration
  def change
    add_column :tables, :x, :integer
    add_column :tables, :y, :integer
  end
end
