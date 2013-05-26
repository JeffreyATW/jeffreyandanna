class Task < ActiveRecord::Base
  has_many :child_tasks, class_name: 'Task', inverse_of: :parent_task, foreign_key: 'parent_task_id'
  belongs_to :parent_task, class_name: 'Task', inverse_of: :child_tasks
  belongs_to :creator, class_name: 'User'

  attr_accessible :creator_id, :description, :done, :parent_task_id, :title, :due_date, :child_task_ids, :created_at

  validates_presence_of :title, :creator
end