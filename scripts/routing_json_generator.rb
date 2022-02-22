require "csv"
require "json"

patterns = {
  "weekday" => ["1", "2", "3", "4", "5", "6", "7", "A1", "A2", "B", "C", "D", "E", "F", "G", "J", "L", "M", "N", "Q", "R", "W", "SI", "FS", "GS", "H"],
  "weekend" => ["1", "2", "3", "4", "5", "6", "7", "A1", "A2", "C", "D", "E", "F", "G", "J", "L", "M", "N", "Q", "R", "SI", "FS", "GS", "H"],
}


patterns.each do |p, routes|
  routings = {}

  routes.each do |r|
    routings[r] = []
    route_csv = File.read("data/#{p}/stops/#{r}.csv")
    csv = CSV.parse(route_csv)
    csv.each do |row|
      routings[r] << row[0]
    end
  end

  puts "Writing to #{p} JSON file"

  file = File.open("../src/data/#{p}/routings.json", "w")
  file.puts JSON.pretty_generate(routings)
  file.close
end