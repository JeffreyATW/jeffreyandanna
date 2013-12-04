class Task < ActiveRecord::Base
  has_many :child_tasks, class_name: 'Task', inverse_of: :parent_task, foreign_key: 'parent_task_id'
  belongs_to :parent_task, class_name: 'Task', inverse_of: :child_tasks
  belongs_to :creator, class_name: 'User'

  default_scope order(:parent_task_id, :id)

  validates_presence_of :title, :creator

  def is_child_task?
    !parent_task.nil?
  end
end