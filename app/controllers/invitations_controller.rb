class InvitationsController < ApplicationController
  before_filter :find_rsvp, :only => %w{edit update}
  before_filter :authenticate_user!, :only => 'index'
  layout false, except: %w{new create}

  def index
    @invitations = Invitation.all

    respond_to do |format|
      format.xml do
        stream = render_to_string(:template=> "invitations/index" )
        send_data(stream, :type=> "text/xml", :filename => "invitations.xml")
      end
      format.xls
    end
  end

  def edit
    @invitation = Invitation.find_by_rsvp(find_rsvp)

    render :edit
  end

  def update
    unless find_rsvp
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
        if @invitation.update_attributes(params[:invitation].permit(:going, :email, :address, :guests_attributes => [:_destroy, :name, :special_needs, :under_4, :id]))
          flash.now[:notice] = "Thank you for updating your information!"
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

  def new
    @invitation = Invitation.new
    render layout: 'addresses'
  end

  def create
    permitted_params = params[:invitation].permit(:address, :email, :notes)
    @invitation =
        (params[:invitation][:email].present? ? Invitation.where(['lower(email) = ?', params[:invitation][:email].downcase]).first : nil) ||
        Invitation.new(permitted_params)
    unless @invitation.persisted?
      guests = params[:name].split(/ and |,|&/)
      guests.map! do |guest|
        Guest.new(:name => guest.strip)
      end
      @invitation.guests = guests
    end

    respond_to do |format|
      if (@invitation.persisted? && @invitation.update_attributes(permitted_params)) || (@invitation.new_record? && @invitation.save)
        flash[:notice] = 'Your address was submitted. Thank you!'
        format.html { render action: 'thanks', layout: 'addresses' }
      else
        flash[:alert] = 'Something went wrong with your submission. Please check for errors, or contact Adal or Lily!'
        format.html { render action: 'new', layout: 'addresses' }
      end
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
