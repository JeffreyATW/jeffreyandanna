ruby '2.0.0'
source 'https://rubygems.org'

# Run `gem install mailcatcher` (do not add to Gemfile) to locally test mailers.

gem 'rails', '4.0.2'

# Bundle edge Rails instead:
# gem 'rails', :git => 'git://github.com/rails/rails.git'

gem 'haml'
gem 'feedzirra'
gem 'rails_admin'
gem 'rabl'
gem 'dotenv-rails', :groups => [:development, :test, :production]

# Gems used only for assets and not required
# in production environments by default.
gem 'sass-rails'
gem 'compass-rails', '2.0.alpha.0'

# See https://github.com/sstephenson/execjs#readme for more supported runtimes
# gem 'therubyracer', :platforms => :ruby

gem 'uglifier', '>= 1.0.3'

group :test, :development do
  gem 'sqlite3'
end

group :staging do
  gem 'rails_12factor'
  gem 'pg'
end

group :production do
  gem 'mysql2'
  gem 'therubyracer', :platforms => :ruby
end

gem 'jquery-rails'

# To use ActiveModel has_secure_password
# gem 'bcrypt-ruby', '~> 3.0.0'

# To use Jbuilder templates for JSON
# gem 'jbuilder'

# Use unicorn as the app server
# gem 'unicorn'

# Deploy with Capistrano
gem 'capistrano'

gem 'devise'

gem 'mandrill-api'
