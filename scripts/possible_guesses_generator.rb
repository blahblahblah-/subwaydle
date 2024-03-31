require "csv"
require "set"
require "json"
require "geokit"

patterns = {
  "weekday" => ["1", "2", "3", "4", "5", "6", "7", "A1", "A2", "B", "C", "D", "E", "F", "G", "J", "L", "M", "N", "Q", "R", "W", "SI", "FS", "GS", "H"],
  "weekend" => ["1", "2", "3", "4", "5", "6", "7", "A1", "A2", "C", "D", "E", "F", "G", "J", "L", "M", "N", "Q", "R", "SI", "FS", "GS", "H"],
  "night" => ["1", "2", "3", "4", "5", "6", "7", "A1", "A2", "D", "E", "F", "G", "J", "L", "M", "N", "Q", "R", "SI", "FS", "H"],
  "accessible" => ["1", "2", "3", "4", "5", "6", "7", "A1", "A2", "B", "C", "D", "E", "F", "G", "J", "L", "M", "N", "Q", "R", "W", "SI", "FS", "GS", "H"],
}

transfers = {}

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

patterns.each do |p, routes|
  answers = Set.new
  solutions = {}
  station_stops = {}
  routings = {}
  latlng = {}

  stations_csv = File.read('data/common/Stations.csv')
  csv = CSV.parse(stations_csv, headers: true)
  csv.each do |row|
    station_stops[row['GTFS Stop ID']] = []
    latlng[row['GTFS Stop ID']] = Geokit::LatLng.new(row['GTFS Latitude'],row['GTFS Longitude'])
  end

  routes.each do |r|
    routings[r] = []
    route_csv = File.read("data/#{p}/stops/#{r}.csv")
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
          transfers1 << s2

          transfers1.each do |t1|
            station_stops[t1].each do |r2|
              next if r2 == r1
              if routings[r2].include?(s1)
                r2_s1_index = routings[r2].index(s1)
                r2_t1_index = routings[r2].index(t1)
                next if (r2_t1_index - r2_s1_index).abs <= i1n
              end
              i2 = routings[r2].index(t1)
              [routings[r2][i2..-1], routings[r2][0..i2].reverse].each do |subrouting2|
                next if next_station1 && (subrouting2.include?(next_station1) || [transfers[next_station1]].flatten.compact.any? { |s| subrouting2.include?(s) })
                subrouting2.each_with_index do |s3, i2n|
                  next if i2n == 0
                  break if subrouting1.include?(s3) || [transfers[s3]].flatten.compact.any? { |s| path1.include?(s) }

                  path2 = subrouting2[0..i2n]
                  next_station2 = subrouting2[i2n + 1]
                  transfers2 = [transfers[s3]].flatten.compact
                  transfers2 << s3

                  transfers2.each do |t2|
                    station_stops[t2].each do |r3|
                      next if r3 == r2
                      if routings[r3].include?(t1)
                        r3_t1_index = routings[r3].index(t1)
                        r3_t2_index = routings[r3].index(t2)
                        next if (r3_t2_index - r3_t1_index).abs <= i2n
                      end
                      i3 = routings[r3].index(t2)

                      [routings[r3][i3..-1], routings[r3][0..i3].reverse].each do |subrouting3|
                        next if next_station2 && (subrouting3.include?(next_station2) || [transfers[next_station2]].flatten.compact.any? { |s| subrouting3.include?(s) })
                        subrouting3.each_with_index do |s4, i3n|
                          next if i3n == 0
                          break if subrouting1.include?(s4) || subrouting2.include?(s4) || [transfers[s4]].flatten.compact.any? { |s| path1.include?(s) } || [transfers[s4]].flatten.compact.any? { |s| path2.include?(s) }

                          path3 = subrouting3[0..i3n]

                          route_exists_from_begin_to_end = false
                          ([transfers[s1]].flatten.compact + [s1]).each do |ts1|
                            ([transfers[s4]].flatten.compact + [s4]).each do |ts2|
                              station_stops[ts2].each do |sr|
                                if routings[sr].include?(ts1)
                                  one_route_stops = (routings[sr].index(ts1) - routings[sr].index(ts2)).abs
                                  currnet_route_stops = path1.size + path2.size + path3.size - 2
                                  if one_route_stops < currnet_route_stops
                                    route_exists_from_begin_to_end = true
                                  end
                                end
                              end
                            end
                          end

                          combo = [r1, r2, r3].map do |x|
                            if x.start_with?("A")
                              "A"
                            else
                              x
                            end
                          end

                          as_the_crow_flies = latlng[s1].distance_to(latlng[s4])
                          estimated_travel_distance = latlng[s1].distance_to(latlng[s2]) + latlng[s2].distance_to(latlng[t1]) + latlng[t1].distance_to(latlng[s3]) + latlng[s3].distance_to(latlng[t2]) + latlng[t2].distance_to(latlng[s4])
                          travel_distance_factor = estimated_travel_distance / as_the_crow_flies

                          if !answers.include?(combo)
                            # puts "#{s1} #{r1} #{s2}-#{t1} #{r2} #{s3}-#{t2} #{r3} #{as_the_crow_flies} mi vs. #{estimated_travel_distance} mi (#{travel_distance_factor})"
                            answers << combo
                            solutions[combo] = [
                              {
                                origin: s1,
                                first_transfer_arrival: s2,
                                first_transfer_departure: t1,
                                second_transfer_arrival: s3,
                                second_transfer_departure: t2,
                                destination: s4,
                                travel_distance_factor: route_exists_from_begin_to_end ? 100 : travel_distance_factor,
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
                              travel_distance_factor: route_exists_from_begin_to_end ? 100 : travel_distance_factor,
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

  picked_solutions = solutions.map { |k, v|
    possible_solutions = v.sort_by { |s| s[:travel_distance_factor] }.slice(0, [1, v.size / 3].max).shuffle
    picked = possible_solutions.find { |s| s[:travel_distance_factor] < 1.6 } || possible_solutions.first
    [k.join("-"), picked]
  }.to_h

  bad_solutions = picked_solutions.select { |_, v| v[:travel_distance_factor] >= 1.6 }.map { |k, _| k}.map { |k| k.split("-") }

  file = File.open("../src/data/#{p}/answers.json", "w")
  file.puts JSON.pretty_generate((answers.to_a - bad_solutions).shuffle)
  file.close

  file = File.open("../src/data/#{p}/solutions.json", "w")
  file.puts JSON.pretty_generate(picked_solutions)
  file.close
end