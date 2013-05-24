class RenameTypeToTableTypeOnTables < ActiveRecord::Migration
  def change
    rename_column :tables, :type, :table_type
  end
end