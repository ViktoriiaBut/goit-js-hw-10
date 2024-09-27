import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const startBtn = document.querySelector('button[data-start]');
const daysValue = document.querySelector('span[data-days]');
const hoursValue = document.querySelector('span[data-hours]');
const minutesValue = document.querySelector('span[data-minutes]');
const secondsValue = document.querySelector('span[data-seconds]');
const datePicker = document.querySelector('#datetime-picker');

startBtn.addEventListener('click', startTimer);

let userSelectedDate = null;
let timerId = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] <= new Date()) {
      return iziToast.error({
        position: 'topRight',
        message: 'Please choose a date in the future',
      });
    }
    userSelectedDate = selectedDates[0];
    startBtn.disabled = false;
  },
};

flatpickr(datePicker, options);

function startTimer() {
  datePicker.disabled = true;
  startBtn.disabled = true;

  timerId = setInterval(updateTimer, 1000);
  return;
}

function updateTimer() {
  const curentTime = userSelectedDate - new Date();

  if (curentTime <= 0) {
    datePicker.disabled = false;
    clearInterval(timerId);
    return;
  }

  const { days, hours, minutes, seconds } = convertMs(curentTime);

  daysValue.textContent = String(days).padStart(2, 0);
  hoursValue.textContent = String(hours).padStart(2, 0);
  minutesValue.textContent = String(minutes).padStart(2, 0);
  secondsValue.textContent = String(seconds).padStart(2, 0);
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