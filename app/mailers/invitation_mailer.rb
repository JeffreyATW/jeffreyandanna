# Unused. Talking to the Mandrill API instead.
class InvitationMailer < ActionMailer::Base
  default from: 'Jeffrey and Anna <wedding@jeffreyandanna.us>'

  def invitation_email(invitations, subject, body)
    mail(:to => invitations.map{|invitation| invitation.email}, :subject => subject) do |format|
      format.text { render :text => body }
    end
    invitations.each do |invitation|
      headers['X-MC-MergeVars'] = {_rcpt: invitation.email, name: invitation.address_name, rsvp: invitation.rsvp, address: invitation.address, email: invitation.email}.to_json
    end
  end
end