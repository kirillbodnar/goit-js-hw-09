import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  startBtn: document.querySelector('button[data-start]'),
  input: document.querySelector('input#datetime-picker'),
  days: document.querySelector('.value[data-days]'),
  hours: document.querySelector('.value[data-hours]'),
  minutes: document.querySelector('.value[data-minutes]'),
  seconds: document.querySelector('.value[data-seconds]'),
};

let selectedDate = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    selectedDate = selectedDates[0];

    dateValidator();
  },
};

let calendar = flatpickr(refs.input, options);

refs.startBtn.addEventListener('click', onStartBtnClick);
refs.startBtn.disabled = true;

function onStartBtnClick() {
  const timer = setInterval(() => {
    const currentDate = Date.now();
    const deltaDate = selectedDate - currentDate;
    const convertedDate = convertMs(deltaDate);
    refs.startBtn.disabled = true;
    refs.input.disabled = true;

    if (deltaDate < 0) {
      clearInterval(timer);
      calendar.clear();
      Notify.warning('The time has run out');
      refs.startBtn.disabled = false;
      refs.input.disabled = false;
      return;
    }
    displayDate(convertedDate);
  }, 1000);
}

function dateValidator() {
  if (selectedDate < options.defaultDate) {
    Notify.failure('Please choose date in the future');
    refs.startBtn.disabled = true;
    calendar.clear();
  } else {
    console.log(selectedDate);
    refs.startBtn.disabled = false;
  }
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function displayDate({ days, hours, minutes, seconds }) {
  refs.days.textContent = addLeadingZero(days);
  refs.hours.textContent = addLeadingZero(hours);
  refs.minutes.textContent = addLeadingZero(minutes);
  refs.seconds.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}
