require "bundler/capistrano"

set :application, "jeffreyandanna"
set :repository,  "git@jeffreyandanna.github.com:JeffreyATW/jeffreyandanna.git"

set :scm, :git
# Or: `accurev`, `bzr`, `cvs`, `darcs`, `git`, `mercurial`, `perforce`, `subversion` or `none`

set :deploy_to, "/home/jeffreyatw/webapps/jeffreyandannawelcome"

role :web, "web308.webfaction.com"                          # Your HTTP server, Apache/etc
role :app, "web308.webfaction.com"                          # This may be the same as your `Web` server
role :db,  "web308.webfaction.com", :primary => true # This is where Rails migrations will run

set :user, "jeffreyatw"
set :use_sudo, false
default_run_options[:pty] = true

default_environment['PATH'] = "/home/jeffreyatw/webapps/jeffreyandannawelcome/gems/bin:$PATH"
default_environment['GEM_PATH'] = "/home/jeffreyatw/webapps/jeffreyandannawelcome/gems"
default_environment['GEM_HOME'] = "/home/jeffreyatw/webapps/jeffreyandannawelcome/gems"

# if you're still using the script/reaper helper you will need
# these http://github.com/rails/irs_process_scripts

# If you are using Passenger mod_rails uncomment this:
# namespace :deploy do
#   task :start do ; end
#   task :stop do ; end
#   task :restart, :roles => :app, :except => { :no_release => true } do
#     run "#{try_sudo} touch #{File.join(current_path,'tmp','restart.txt')}"
#   end
# end

namespace :deploy do
  desc "Restart nginx"
  task :restart do
    run "#{deploy_to}/bin/restart"
  end
end

namespace :db do

  desc "Populates the Production Database"
  task :seed do
    puts "\n\n=== Populating the Production Database! ===\n\n"
    run "cd #{current_path}; rake db:seed RAILS_ENV=production"
  end

end