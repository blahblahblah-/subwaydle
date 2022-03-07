require "csv"
require 'json'

stations = {}

stations_csv = File.read('data/common/stations.csv')
csv = CSV.parse(stations_csv, headers: true)
csv.each do |row|
  stations[row['GTFS Stop ID']] = {
    name: row['Stop Name'].gsub(/ - /, '-').gsub(/-/, '–'),
    longitude: row['GTFS Longitude'].to_f,
    latitude: row['GTFS Latitude'].to_f,
    borough: row['Borough'],
  }
end

puts "Writing to JSON file"

file = File.open("../src/data/stations.json", "w")
file.puts JSON.pretty_generate(stations)
file.close