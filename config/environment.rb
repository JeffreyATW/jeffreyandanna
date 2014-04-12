# Load the rails application
require File.expand_path('../application', __FILE__)

# Initialize the rails application
Adalandlily::Application.initialize!

ActionMailer::Base.smtp_settings = {
  :address => 'smtp.mandrillapp.com',
  :domain => 'adalandlily.com',
  :authentication => :plain,
  :user_name => ENV['MANDRILL_USER_NAME'],
  :password => ENV['MANDRILL_APIKEY'],
  :enable_starttls_auto => true,
  :port => 587
}