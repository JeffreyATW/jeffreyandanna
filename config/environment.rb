# Load the rails application
require File.expand_path('../application', __FILE__)

# Initialize the rails application
Jeffreyandanna::Application.initialize!

ActionMailer::Base.smtp_settings = {
  :address => 'smtp.mandrillapp.com',
  :domain => 'jeffreyandanna.us',
  :authentication => :plain,
  :user_name => APP_CONFIG['mandrill']['user_name'],
  :password => APP_CONFIG['mandrill']['password'],
  :enable_starttls_auto => true,
  :port => 587
}

ActionMailer::Base.sendmail_settings = {
  :address => 'smtp.mandrillapp.com',
  :domain => 'jeffreyandanna.us',
  :authentication => :plain,
  :user_name => APP_CONFIG['mandrill']['user_name'],
  :password => APP_CONFIG['mandrill']['password'],
  :enable_starttls_auto => true,
  :port => 587
}