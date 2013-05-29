# Load the rails application
require File.expand_path('../application', __FILE__)

# Initialize the rails application
Jeffreyandanna::Application.initialize!

=begin
if Rails.env == "development"
  Rails.logger.info "Delayed::Job is executed synchronously in #{Rails.env} mode."
  Delayed::Worker.delay_jobs = false
end
=end