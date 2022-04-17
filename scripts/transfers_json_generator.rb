require "csv"
require "json"

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

file = File.open("../src/data/transfers.json", "w")
file.puts JSON.pretty_generate(transfers)
file.close