class ChangeGuestMailsGroupFromTextToString < ActiveRecord::Migration
  def up
    change_column :guest_mails, :group, :string
  end

  def down
    change_column :guest_mails, :group, :text
  end
end
