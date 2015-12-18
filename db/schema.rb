# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150128221117) do

  create_table "delayed_jobs", force: :cascade do |t|
    t.integer  "priority",   limit: 4,     default: 0
    t.integer  "attempts",   limit: 4,     default: 0
    t.text     "handler",    limit: 65535
    t.text     "last_error", limit: 65535
    t.datetime "run_at"
    t.datetime "locked_at"
    t.datetime "failed_at"
    t.string   "locked_by",  limit: 255
    t.string   "queue",      limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "delayed_jobs", ["priority", "run_at"], name: "delayed_jobs_priority", using: :btree

  create_table "guest_mails", force: :cascade do |t|
    t.string   "subject",    limit: 255
    t.text     "body",       limit: 65535
    t.string   "group",      limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "guests", force: :cascade do |t|
    t.string   "name",          limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "invitation_id", limit: 4
    t.text     "special_needs", limit: 65535
    t.boolean  "under_4"
    t.integer  "table_id",      limit: 4
  end

  create_table "invitations", force: :cascade do |t|
    t.text     "address",            limit: 65535
    t.boolean  "responded",                        default: false, null: false
    t.boolean  "going",                            default: false, null: false
    t.string   "rsvp",               limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "email",              limit: 255
    t.text     "notes",              limit: 65535
    t.boolean  "save_the_date_sent",               default: false, null: false
    t.boolean  "invited",                          default: false, null: false
  end

  create_table "rails_admin_histories", force: :cascade do |t|
    t.text     "message",    limit: 65535
    t.string   "username",   limit: 255
    t.integer  "item",       limit: 4
    t.string   "table",      limit: 255
    t.integer  "month",      limit: 2
    t.integer  "year",       limit: 8
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "rails_admin_histories", ["item", "table", "month", "year"], name: "index_rails_admin_histories", using: :btree

  create_table "tables", force: :cascade do |t|
    t.string   "name",       limit: 255
    t.text     "notes",      limit: 65535
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "x",          limit: 4
    t.integer  "y",          limit: 4
    t.string   "table_type", limit: 255
  end

  create_table "tasks", force: :cascade do |t|
    t.string   "title",          limit: 255
    t.text     "description",    limit: 65535
    t.integer  "creator_id",     limit: 4
    t.boolean  "done"
    t.integer  "parent_task_id", limit: 4
    t.datetime "created_at"
    t.datetime "updated_at"
    t.datetime "due_date"
  end

  create_table "users", force: :cascade do |t|
    t.string   "email",                  limit: 255, default: "", null: false
    t.string   "encrypted_password",     limit: 255, default: "", null: false
    t.string   "reset_password_token",   limit: 255
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          limit: 4,   default: 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip",     limit: 255
    t.string   "last_sign_in_ip",        limit: 255
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true, using: :btree
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true, using: :btree

end
