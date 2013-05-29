require 'rails_admin/config/actions'
require 'rails_admin/config/actions/base'

module RailsAdminMailGuests
end

module RailsAdmin
  module Config
    module Actions
      class MailGuests < Base
        RailsAdmin::Config::Actions.register(self)
        register_instance_option :root? do
          'icon-envelope'
        end

        register_instance_option :controller do
          Proc.new do
            @options = [['Attending', 'attending'],
                        ['Responded', 'responded'],
                        ['Not Attending', 'not_attending'],
                        ['Not Responded', 'not_responded']]
            if request.method == 'GET'
            elsif request.method == 'POST'
              if @options.map{|option| option[1]}.include? params[:mail][:group]
                invitations = Invitation.send(params[:mail][:group]).where('email != ""')
                invitations.each do |invitation|
                  InvitationMailer.invitation_email(invitation, params[:mail][:subject], params[:mail][:body]).deliver
                end
                flash.alert = 'Mail sent to guests.'
              else
                flash.notice = 'No don\'t :('
              end
              redirect_to back_or_index
            end
          end
        end

        register_instance_option :link_icon do
          'icon-folder-open'
        end

        register_instance_option :http_methods do
          [:get, :post]
        end
      end
    end
  end
end