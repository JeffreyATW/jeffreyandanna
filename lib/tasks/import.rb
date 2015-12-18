task :import do
  require 'roo'
  require 'net/http'

  Net::HTTP.start("jeffreyatw.com") do |http|
      resp = http.get("/static/temp/guests.xlsx")
      open("guests.xlsx", "wb") do |file|
        Roo::Excelx.open(file)
      end
  end

end