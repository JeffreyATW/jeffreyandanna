ruby '2.6.6'
source 'https://rubygems.org'

# Run `gem install mailcatcher` (do not add to Gemfile) to locally test mailers.

gem 'rails', '~> 5.2.6'

# Bundle edge Rails instead:
# gem 'rails', :git => 'git://github.com/rails/rails.git'

gem 'haml'
gem 'feedjira'
gem 'rails_admin', '~> 1.4.3'
gem 'rabl'
gem 'dotenv-rails', :groups => [:development, :test, :production]

gem 'bigdecimal', '1.3.5'

# Gems used only for assets and not required
# in production environments by default.
gem 'sass-rails'
gem 'rails-sass-images'
gem 'autoprefixer-rails'

# See https://github.com/sstephenson/execjs#readme for more supported runtimes
# gem 'therubyracer', :platforms => :ruby

gem 'uglifier', '>= 1.0.3'

group :development, :production, :staging do
  gem 'pg', '~> 0.18.4'
end

group :test, :development do
  gem 'sqlite3'
end

group :staging do
  gem 'rails_12factor'
end

group :production do
  gem 'therubyracer', '>=0.12.3', :platforms => :ruby
end

gem 'jquery-rails'

# To use ActiveModel has_secure_password
# gem 'bcrypt-ruby', '~> 3.0.0'

# To use Jbuilder templates for JSON
# gem 'jbuilder'

# Use unicorn as the app server
# gem 'unicorn'

# Deploy with Capistrano
group :development do
  gem 'capistrano-rails',   '~> 1.6.1', require: false
  gem 'capistrano-bundler', '~> 1.6.0', require: false
end

gem 'devise'

gem 'mandrill-api'
