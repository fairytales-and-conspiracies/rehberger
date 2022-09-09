import { useState, useEffect } from 'react';

const launchDatetimeUTC = process.env.NEXT_PUBLIC_LAUNCH_DATETIME_UTC;

const MILLISECONDS_IN_DAY = 86400000;
const MILLISECONDS_IN_HOUR = 3600000;
const MILLISECONDS_IN_MINUTE = 60000;
const MILLISECONDS_IN_SECOND = 1000;

export default function CountdownTimer(props) {
  const { small } = props;

  const [countdownTimeInMilliseconds, setCountdownTimeInMilliseconds] =
    useState(null);
  const [isCountdownVisible, setIsCountdownVisible] = useState(true);

  useEffect(() => {
    const differenceInMilliseconds = new Date(launchDatetimeUTC) - Date.now();
    setCountdownTimeInMilliseconds(differenceInMilliseconds);
    if (differenceInMilliseconds < 0) {
      setIsCountdownVisible(false);
    }
  }, []);

  useEffect(() => {
    if (isCountdownVisible) {
      const timer = setInterval(() => {
        if (countdownTimeInMilliseconds < 0) {
          clearInterval(timer);
          return;
        }
        setCountdownTimeInMilliseconds(countdownTimeInMilliseconds - 1000);
      }, 1000);

      // Clearing interval when component unmounts
      return () => clearInterval(timer);
    }
  });

  const getFormattedTimeDifferenceFromMilliseconds = (milliseconds) => {
    const days = Math.floor(milliseconds / MILLISECONDS_IN_DAY).toString();
    let remainder = milliseconds % MILLISECONDS_IN_DAY;

    let hours = Math.floor(remainder / MILLISECONDS_IN_HOUR);
    hours = hours < 10 ? '0' + hours : hours.toString();
    remainder %= MILLISECONDS_IN_HOUR;

    let minutes = Math.floor(remainder / MILLISECONDS_IN_MINUTE);
    minutes = minutes < 10 ? '0' + minutes : minutes.toString();
    remainder %= MILLISECONDS_IN_MINUTE;

    let seconds = Math.floor(remainder / MILLISECONDS_IN_SECOND);
    seconds = seconds < 10 ? '0' + seconds : seconds.toString();

    return { days, hours, minutes, seconds };
  };

  const { days, hours, minutes, seconds } =
    getFormattedTimeDifferenceFromMilliseconds(countdownTimeInMilliseconds);

  return isCountdownVisible ? (
    <div className={`countdown-timer ${small ? 'countdown-timer--small' : ''}`}>
      <h3
        className={`countdown-timer__heading ${
          small ? 'countdown-timer__heading--small' : ''
        }`}
      >
        NFT sale starting 28. Sep 2022, 19:00 CET
      </h3>
      <div
        className={`countdown-timer__time ${
          small ? 'countdown-timer__time--small' : ''
        }`}
      >
        <span className="countdown-timer__time-part">
          {days}
          <span
            className={`countdown-timer__time-part-label ${
              small ? 'countdown-timer__time-part-label--small' : ''
            }`}
          >
            days
          </span>
        </span>
        :
        <span className="countdown-timer__time-part">
          {hours}
          <span
            className={`countdown-timer__time-part-label ${
              small ? 'countdown-timer__time-part-label--small' : ''
            }`}
          >
            hours
          </span>
        </span>
        :
        <span className="countdown-timer__time-part">
          {minutes}
          <span
            className={`countdown-timer__time-part-label ${
              small ? 'countdown-timer__time-part-label--small' : ''
            }`}
          >
            minutes
          </span>
        </span>
        :
        <span className="countdown-timer__time-part">
          {seconds}
          <span
            className={`countdown-timer__time-part-label ${
              small ? 'countdown-timer__time-part-label--small' : ''
            }`}
          >
            seconds
          </span>
        </span>
      </div>
    </div>
  ) : null;
}
