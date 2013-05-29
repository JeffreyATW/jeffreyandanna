class InvitationMailer < ActionMailer::Base
  default from: 'Jeffrey and Anna <wedding@jeffreyandanna.us>'

  def invitation_email(invitation, subject, body)
    mail(:to => invitation.email, :subject => subject) do |format|
      format.text { render :text => ERB.new(body).result(invitation.get_binding) }
    end
  end
end