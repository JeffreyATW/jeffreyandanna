class InvitationsController < ApplicationController
  before_filter :find_rsvp, :only => %w{edit update}
  #before_filter :authenticate_user!, :only => 'index'
  layout false

  def index
    @invitations = Invitation.all
  end

  def edit
    @invitation = Invitation.find_by_rsvp(find_rsvp)

    render :edit
  end

  def update
    if not find_rsvp
      raise ActionController::RoutingError.new('Not Found')
    end

    @invitation = Invitation.find_by_rsvp(session[:rsvp]) || Invitation.new

    if @invitation.persisted?
      if params[:invitation] && params[:invitation][:rsvp]
        unless @invitation.responded
          @invitation.going = true
        end
        @invitation.responded = true
        @invitation.save
      else
        if @invitation.update_attributes(params[:invitation])
          flash.now[:notice] = "Your information has been updated!"
        else
          flash.now[:alert] = "There was an error saving your information."
        end
      end
      render :edit
    else
      @invitation.errors.add(:base, "We can't find an invitation with that code. Try again!")
      render :partial => "invitations/rsvp"
    end
  end

  private
  def find_rsvp
    if params[:invitation] && params[:invitation][:rsvp]
      session[:rsvp] = params[:invitation][:rsvp].upcase
    elsif session[:rsvp]
      session[:rsvp]
    end
  end
end
