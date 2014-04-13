class WelcomeController < ApplicationController
  def index
    #@remaining = (Date.new(2013,8,17) - Date.today).to_i
    if session[:rsvp]
      @invitation = Invitation.find_by_rsvp(session[:rsvp])
      @invitation = @invitation.present? ? @invitation : Invitation.new
    else
      @invitation = Invitation.new
    end

    render :layout => 'addresses'
  end
end