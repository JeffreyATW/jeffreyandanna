# RailsAdmin config file. Generated on August 22, 2012 22:17
# See github.com/sferik/rails_admin for more informations

require "#{Rails.root}/lib/rails_admin_mail_guests"

RailsAdmin.config do |config|

  # If your default_local is different from :en, uncomment the following 2 lines and set your default locale here:
  # require 'i18n'
  # I18n.default_locale = :de

  config.actions do
    dashboard
    index
    history_index
    new

    mail_guests

    show
    edit
    delete
    history_show
    export
  end

  config.authenticate_with do
    warden.authenticate! scope: :user
  end
  config.current_user_method(&:current_user)

  # If you want to track changes on your models:
  # config.audit_with :history, User

  # Or with a PaperTrail: (you need to install it first)
  # config.audit_with :paper_trail, User

  # Set the admin name here (optional second array element will appear in a beautiful RailsAdmin red ©)
  config.main_app_name = ['James and Christina', 'Admin']
  # or for a dynamic name:
  # config.main_app_name = Proc.new { |controller| [Rails.application.engine_name.titleize, controller.params['action'].titleize] }


  #  ==> Global show view settings
  # Display empty fields in show views
  # config.compact_show_view = false

  #  ==> Global list view settings
  # Number of default rows per-page:
  # config.default_items_per_page = 20

  #  ==> Included models
  # Add all excluded models here:
  # config.excluded_models = [Guest]

  # Add models here if you want to go 'whitelist mode':
  # config.included_models = [Guest]

  # Application wide tried label methods for models' instances
  # config.label_methods << :description # Default is [:name, :title]

  #  ==> Global models configuration
  # config.models do
  #   # Configuration here will affect all included models in all scopes, handle with care!
  #
  #   list do
  #     # Configuration here will affect all included models in list sections (same for show, export, edit, update, create)
  #
  #     fields_of_type :date do
  #       # Configuration here will affect all date fields, in the list section, for all included models. See README for a comprehensive type list.
  #     end
  #   end
  # end
  #
  #  ==> Model specific configuration
  # Keep in mind that *all* configuration blocks are optional.
  # RailsAdmin will try his best to provide the best defaults for each section, for each field.
  # Try to override as few things as possible, in the most generic way. Try to avoid setting labels for models and attributes, use ActiveRecord I18n API instead.
  # Less code is better code!
  # config.model MyModel do
  #   # Cross-section field configuration
  #   object_label_method :name     # Name of the method called for pretty printing an *instance* of ModelName
  #   label 'My model'              # Name of ModelName (smartly defaults to ActiveRecord's I18n API)
  #   label_plural 'My models'      # Same, plural
  #   weight -1                     # Navigation priority. Bigger is higher.
  #   parent OtherModel             # Set parent model for navigation. MyModel will be nested below. OtherModel will be on first position of the dropdown
  #   navigation_label              # Sets dropdown entry's name in navigation. Only for parents!
  #   # Section specific configuration:
  #   list do
  #     filters [:id, :name]  # Array of field names which filters should be shown by default in the table header
  #     items_per_page 100    # Override default_items_per_page
  #     sort_by :id           # Sort column (default is primary key)
  #     sort_reverse true     # Sort direction (default is true for primary key, last created first)
  #     # Here goes the fields configuration for the list view
  #   end
  # end

  # Your model's configuration, to help you get started:

  # All fields marked as 'hidden' won't be shown anywhere in the rails_admin unless you mark them as visible. (visible(true))

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
       field :guests do
         filterable true
         queryable true
         searchable :name
         sortable :name
         pretty_value do
           # reload object in case invitations were searched for guest names.
           # without reloading, only the guests that match the search will be returned.
           bindings[:object].guests(true)
           pretty_value
         end
       end
       field :address
       field :email
       field :invited
       field :responded
       field :going
       field :save_the_date_sent
       field :rsvp
     end
     show do
       field :guests
       field :address do
         pretty_value do
           bindings[:view].simple_format value
         end
       end
       field :email
       field :save_the_date_sent
       field :invited
       field :responded
       field :going
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
      field :notes
      field :rsvp do
        help 'Optional. Leave blank to generate a random code.'
      end
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

# Monkeypatch get_collection to include searching of has_many_associations.
module RailsAdmin
  MainController.class_eval do
    def get_collection(model_config, scope, pagination)
      associations = model_config.list.fields.select { |f|
        f.type == :belongs_to_association || f.type == :has_many_association && !f.polymorphic?
      }.collect { |f| f.association.name }
      options = {}
      options = options.merge(page: (params[Kaminari.config.param_name] || 1).to_i, per: (params[:per] || model_config.list.items_per_page)) if pagination
      options = options.merge(include: associations) unless associations.blank?
      options = options.merge(get_sort_hash(model_config))
      options = options.merge(query: params[:query]) if params[:query].present?
      options = options.merge(filters: params[:f]) if params[:f].present?
      options = options.merge(bulk_ids: params[:bulk_ids]) if params[:bulk_ids]
      model_config.abstract_model.all(options, scope)
    end
  end
end