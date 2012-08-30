class WelcomeController < ApplicationController
  def index
    @feed = Feedzirra::Feed.fetch_and_parse("http://jeffreyandanna.us/blog/feed/")
    @invitation = Invitation.new

    render :layout => false
  end
end
