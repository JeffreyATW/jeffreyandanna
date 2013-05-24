class AddTypeToTables < ActiveRecord::Migration
  def change
    add_column :tables, :type, :string
  end
end
