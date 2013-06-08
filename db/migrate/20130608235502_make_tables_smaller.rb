class MakeTablesSmaller < ActiveRecord::Migration
  def up
    Table.all.each do |table|
      table.x = table.x.nil? ? 0 : table.x * 3/4
      table.y = table.y.nil? ? 0 : table.y * 3/4
      table.save
    end
  end

  def down
    Table.all.each do |table|
      table.x = table.x.nil? ? 0 : table.x / (3/4)
      table.y = table.y.nil? ? 0 : table.y / (3/4)
      table.save
    end
  end
end
