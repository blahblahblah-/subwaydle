import { useEffect, useState } from 'react';
import { Header } from 'semantic-ui-react';

const formatNumber = (number) => {
  const numStr = Math.floor(number).toString();
  if (numStr.length === 1) {
    return '0' + numStr;
  }
  return numStr;
}

const Countdown = () => {
  const midnight = new Date();
  midnight.setHours(24);
  midnight.setMinutes(0);
  midnight.setSeconds(0);
  midnight.setMilliseconds(0);

  const [countDown, setCountDown] = useState(
    (midnight - Date.now()) / 1000
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const time = (midnight - Date.now()) / 1000
      if (time <= 0) {
        // eslint-disable-next-line no-restricted-globals
        location.reload();
      }
      setCountDown(time);
    }, 1000);

    return () => clearInterval(interval);
  }, [midnight]);

  return (
    <Header as='h5'>
      Next Subwaydle in { formatNumber(countDown/3600) }:{ formatNumber(countDown/60 % 60) }:{ formatNumber(countDown % 60) }
    </Header>
  );
}

export default Countdown;
