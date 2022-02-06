require "csv"
require "json"

routes = ["1", "2", "3", "4", "5", "6", "7", "A1", "A2", "B", "C", "D", "E", "F", "G", "J", "L", "M", "N", "Q", "R", "W", "SI", "FS", "GS", "H"]

data = {}

routes.each do |r|
  route_shape_data = []
  route_shape_csv = File.read("data/common/shapes/#{r}.csv")
  csv = CSV.parse(route_shape_csv)
  csv.each do |row|
    # Mapbox expects GeoJSON [long, lat], while GTFS has them as [lat, long]
    route_shape_data << [row[1].to_f, row[0].to_f]
  end
  data[r] = route_shape_data
end

puts "Writing to JSON file"

file = File.open("../src/data/shapes.json", "w")
file.puts JSON.pretty_generate(data)
file.close