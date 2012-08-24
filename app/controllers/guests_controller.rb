class GuestsController < ApplicationController
  def edit
    @guest = Guest.find_by_rsvp(params[:guest][:rsvp])
  end

  def update
    @guest = Guest.find(params[:guest])

    if @foo.update_attributes(params[:guest])
      flash[:notice] = "Your information has been updated!"
      redirect_to @guest
    else
      flash[:alert] = "There was an error saving your information."
      render :edit
    end
  end
end
