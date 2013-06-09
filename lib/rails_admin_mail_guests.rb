require 'rails_admin/config/actions'
require 'rails_admin/config/actions/base'
require 'mandrill'

module RailsAdminMailGuests
end

module RailsAdmin
  module Config
    module Actions
      class MailGuests < Base
        RailsAdmin::Config::Actions.register(self)
        register_instance_option :root? do
          true
        end

        register_instance_option :controller do
          Proc.new do
            @options = [['Self (for testing)', 'self'],
                        ['Broken address (for testing)', 'broken'],
                        ['Attending', 'attending'],
                        ['Responded', 'responded'],
                        ['Not Attending', 'not_attending'],
                        ['Not Responded', 'not_responded']]
            if request.method == 'GET'
            elsif request.method == 'POST'
              if @options.map{|option| option[1]}.include? params[:mail][:group]
                if params[:mail][:group] == 'self' || params[:mail][:group] == 'broken'
                  broken = 'broken@blah.nope'
                  email = params[:mail][:group] == 'self' ? current_user.email : broken
                  invitation = Invitation.new(email: email, address: <<EOF
123 Main St
San Francisco, CA
EOF
)
                  guest = Guest.new(name: email)
                  invitation.guests << guest
                  invitation.generate_rsvp
                  invitations = [invitation]
                  flash.alert = params[:mail][:group] == 'self' ? 'Mail sent to your email address.' : "Mail sent to a bogus address (#{broken})."
                else
                  invitations = Invitation.send(params[:mail][:group]).where('email != ""')
                  flash.alert = 'Mail sent to guests.'
                end
                Mandrill::API.new.messages.send({
                  subject: params[:mail][:subject],
                  from_name: 'Jeffrey and Anna',
                  from_email: 'wedding@jeffreyandanna.us',
                  text: params[:mail][:body],
                  to: invitations.map{|invitation| {email: invitation.email}},
                  merge_vars: invitations.map{|invitation|
                    {rcpt: invitation.email, vars: [
                      {name: 'name', content: invitation.address_name},
                      {name: 'rsvp', content: invitation.rsvp},
                      {name: 'address', content: invitation.address},
                      {name: 'email', content: invitation.email}
                    ]}
                  }
                })
                #InvitationMailer.invitation_email(invitations, params[:mail][:subject], params[:mail][:body]).deliver
                GuestMail.create(group: @options.detect{|option| option[1] == params[:mail][:group]}[0], subject: params[:mail][:subject], body: params[:mail][:body])
              else
                flash.notice = 'No don\'t :('
              end
              redirect_to back_or_index
            end
          end
        end

        register_instance_option :link_icon do
          'icon-envelope-alt'
        end

        register_instance_option :http_methods do
          [:get, :post]
        end
      end
    end
  end
end