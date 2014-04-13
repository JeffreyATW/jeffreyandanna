require "#{Rails.root}/lib/rails_admin_mail_guests"

RailsAdmin.config do |config|

  ### Popular gems integration

  ## == Devise ==
  config.authenticate_with do
    warden.authenticate! scope: :user
  end
  config.current_user_method(&:current_user)

  ## == Cancan ==
  # config.authorize_with :cancan

  ## == PaperTrail ==
  # config.audit_with :paper_trail, 'User', 'PaperTrail::Version' # PaperTrail >= 3.0.0

  ### More at https://github.com/sferik/rails_admin/wiki/Base-configuration

  config.actions do
    dashboard                     # mandatory
    index                         # mandatory
    #history_index
    #history_show
    new

    mail_guests

    export
    bulk_delete
    show
    edit
    delete
    show_in_app
  end

  config.main_app_name = ['Adal and Lily', 'Admin']

  config.model Guest do
    #   # Found associations:
    #   # Found columns:
    #     configure :id, :integer
    #     configure :name, :string
    #     configure :address, :text
    #     configure :responded, :boolean
    #     configure :going, :boolean
    #     configure :plus_one, :boolean
    #     configure :rsvp, :string
    #     configure :created_at, :datetime
    #     configure :updated_at, :datetime   #   # Sections:
    list do
      field :name
      field :responded, :boolean do
        sortable 'invitations.responded'
      end
      field :going, :boolean do
        sortable 'invitations.going'
      end
      field :under_4
      field :special_needs
      field :invitation
      field :table
    end
    #   export do; end
    show do
      field :name
      field :save_the_date_sent, :boolean
      field :invited, :boolean
      field :responded, :boolean
      field :going, :boolean
      field :special_needs
      field :under_4
      field :invitation
      field :table
    end
    edit do
      field :name
      field :special_needs
      field :under_4
      field :invitation do
        nested_form false
      end
      field :table
    end
    #   create do; end
    #   update do; end
  end

  config.model Invitation do
    #   # Found associations:
    #   # Found columns:
    #     configure :id, :integer
    #     configure :name, :string
    #     configure :address, :text
    #     configure :responded, :boolean
    #     configure :going, :boolean
    #     configure :rsvp, :string
    #     configure :created_at, :datetime
    #     configure :updated_at, :datetime   #   # Sections:
    list do
      field :guests
      field :address
      field :email
      field :invited
      field :responded
      field :going
      field :save_the_date_sent
      field :no_paper_invite
      field :rsvp
    end
    show do
      field :guests
      field :address
      field :email
      field :save_the_date_sent
      field :invited
      field :responded
      field :going
      field :no_paper_invite
      field :rsvp
      field :notes
    end
    edit do
      field :guests
      field :address
      field :email
      field :save_the_date_sent
      field :invited
      field :responded
      field :going
      field :no_paper_invite
      field :notes
    end
    #   export do; end
    #   show do; end
    #   edit do; end
    #   create do; end
    #   update do; end
  end

  config.model Table do
    list do
      field :name
      field :notes
      field :guests do
        column_width 800
      end
    end
    edit do
      field :name
      field :notes
      field :guests do
        associated_collection_scope do
          table = bindings[:object]
          Proc.new { |scope|
            scope = scope.where(table_id: nil)
          }
        end
      end
    end
    #   export do; end
    #   show do; end
    #   edit do; end
    #   create do; end
    #   update do; end
  end

  config.model Task do
    list do
      items_per_page 100
      field :title do
        pretty_value do
          bindings[:object].is_child_task? ? "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;#{value}".html_safe : value
        end
      end
      field :done
      field :parent_task
      field :child_tasks
      field :creator
      field :created_at
      field :due_date
    end
    edit do
      group :default do
        field :title
        field :description
        field :child_tasks
        field :done
      end
      group :advanced do
        active false
        field :creator do
          default_value do
            bindings[:view]._current_user.id
          end
        end
        field :parent_task
        field :created_at
        field :due_date
      end
    end
  end

  config.model GuestMail do
    list do
      field :subject
      field :group
      field :created_at
    end
    show do
      field :subject
      field :group
      field :body
      field :created_at
    end
  end
end
