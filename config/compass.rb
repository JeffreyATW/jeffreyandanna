# Require any additional compass plugins here.
project_type = :rails

on_sprite_saved do |filename|
  system "pngcrush -ow #{filename}" if File.exists?(filename)
end