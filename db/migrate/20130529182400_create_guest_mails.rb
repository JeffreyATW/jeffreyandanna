class CreateGuestMails < ActiveRecord::Migration
  def change
    create_table :guest_mails do |t|
      t.string :subject
      t.text :body
      t.text :group

      t.timestamps
    end
  end
end
