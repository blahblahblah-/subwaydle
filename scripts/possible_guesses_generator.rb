require "csv"
require "set"
require "json"

patterns = {
  "weekday" => ["1", "2", "3", "4", "5", "6", "7", "A1", "A2", "B", "C", "D", "E", "F", "G", "J", "L", "M", "N", "Q", "R", "W", "SI", "FS", "GS", "H"],
  "weekend" => ["1", "2", "3", "4", "5", "6", "7", "A1", "A2", "C", "D", "E", "F", "G", "J", "L", "M", "N", "Q", "R", "SI", "FS", "GS", "H"],
}

transfers = {}
express_stations = []

transfers_csv = File.read('data/common/transfers.txt')
csv = CSV.parse(transfers_csv, headers: true)
csv.each do |row|
  next if row['from_stop_id'] == row['to_stop_id']
  if transfers[row['from_stop_id']]
    transfers[row['from_stop_id']] << row['to_stop_id']
  else
    transfers[row['from_stop_id']] = [row['to_stop_id']]
  end
end

express_csv = File.read('data/common/express.csv')
csv = CSV.parse(express_csv)
csv.each do |row|
  express_stations << row[0]
end

patterns.each do |p, routes|
  answers = Set.new
  solutions = {}
  station_stops = {}
  routings = {}

  stations_csv = File.read('data/common/Stations.csv')
  csv = CSV.parse(stations_csv, headers: true)
  csv.each do |row|
    station_stops[row['GTFS Stop ID']] = []
  end

  routes.each do |r|
    routings[r] = []
    route_csv = File.read("data/#{p}/#{r}.csv")
    csv = CSV.parse(route_csv)
    csv.each do |row|
      station_stops[row[0]] << r
      routings[r] << row[0]
    end
  end

  station_stops.each do |s1, routes|
    routes.each do |r1|
      i1 = routings[r1].index(s1)

      [routings[r1][i1..-1], routings[r1][0..i1].reverse].each do |subrouting1|
        subrouting1.each_with_index do |s2, i1n|
          next if i1n == 0
          path1 = subrouting1[0..i1n]
          next_station1 = subrouting1[i1n + 1]

          transfers1 = [transfers[s2]].flatten.compact
          transfers1 << s2 if express_stations.include?(s2) || transfers1.size > 0

          transfers1.each do |t1|
            station_stops[t1].each do |r2|
              next if r2 == r1
              i2 = routings[r2].index(t1)
              [routings[r2][i2..-1], routings[r2][0..i2].reverse].each do |subrouting2|
                next if next_station1 && subrouting2.include?(next_station1)
                subrouting2.each_with_index do |s3, i2n|
                  next if i2n == 0
                  break if path1.include?(s3)

                  path2 = path1 + subrouting2[0..i2n]
                  next_station2 = subrouting2[i2n + 1]
                  transfers2 = [transfers[s3]].flatten.compact
                  transfers2 << s3 if express_stations.include?(s3) || transfers2.size > 0

                  transfers2.each do |t2|
                    station_stops[t2].each do |r3|
                      next if r3 == r2
                      i3 = routings[r3].index(t2)

                      [routings[r3][i3..-1], routings[r3][0..i3].reverse].each do |subrouting3|
                        next if next_station2 && subrouting3.include?(next_station2)
                        subrouting3.each_with_index do |s4, i3n|
                          next if i3n == 0
                          break if path2.include?(s4)

                          combo = [r1, r2, r3].map do |x|
                            if x.start_with?("A")
                              "A"
                            else
                              x
                            end
                          end
                          if !answers.include?(combo)
                            # puts "#{s1} #{r1} #{s2}-#{t1} #{r2} #{s3}-#{t2} #{r3}"
                            answers << combo
                            solutions[combo] = [
                              {
                                origin: s1,
                                first_transfer_arrival: s2,
                                first_transfer_departure: t1,
                                second_transfer_arrival: s3,
                                second_transfer_departure: t2,
                                destination: s4,
                              }
                            ]
                          else
                            solutions[combo] << {
                              origin: s1,
                              first_transfer_arrival: s2,
                              first_transfer_departure: t1,
                              second_transfer_arrival: s3,
                              second_transfer_departure: t2,
                              destination: s4,
                            }
                          end
                        end
                      end
                    end
                  end
                end
              end
            end
          end
        end
      end
    end
  end

  puts "Writing to JSON file - #{answers.size} entries"

  file = File.open("../src/data/#{p}/answers.json", "w")
  file.puts JSON.pretty_generate(answers.to_a.shuffle)
  file.close

  file = File.open("../src/data/#{p}/solutions.json", "w")
  file.puts JSON.pretty_generate(
    solutions.map { |k, v|
      [k.join("-"), v.shuffle.first]
    }.to_h
  )
  file.close
end