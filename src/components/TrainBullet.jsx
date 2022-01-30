import routes from '../data/routes.json';
import './TrainBullet.scss';

const classNames = (size) => {
  if (size === 'small') {
    return 'small route bullet';
  } else if (size === 'medium') {
    return 'medium route bullet';
  }
  return 'route bullet';
}

const style = (train, shortenedAlternateName, size) => {
  const { color, text_color, name } = train;
  let nameLength = name.length + (shortenedAlternateName?.length || 0);
  let styleHash = {
    backgroundColor: `${color}`
  };

  if (text_color) {
    styleHash.color = `${text_color}`;
  }

  if (size === 'small' && nameLength > 2) {
    styleHash.letterSpacing = '-.06em';
  }

  return styleHash;
}

const innerStyle = (name, size, shortenedAlternateName) => {
  let nameLength = name.length + (shortenedAlternateName?.length || 0);
  if (size === 'small' && nameLength > 2) {
    return { fontSize: '.9em' };
  }
}

const TrainBullet = (props) => {
  const { id, size } = props;
  const train = routes[id];
  const { name } = train;

  const alternateName = train.alternate_name
  let shortenedAlternateName = alternateName && alternateName[0];
  let match;
  if (match = alternateName?.match(/^(?<number>[0-9]+)/)) {
    shortenedAlternateName = match.groups.number;
  }


  return (
    <div className={classNames(size)} style={style(train, shortenedAlternateName, size)}>
      <div style={innerStyle(name, size, shortenedAlternateName)}>{name}<sup>{shortenedAlternateName}</sup></div>
    </div>
  );
}

export default TrainBullet;