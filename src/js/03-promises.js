import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  form: document.querySelector('.form'),
  firstDelay: document.querySelector('input[name="delay"]'),
  stepDelay: document.querySelector('input[name="step"]'),
  amount: document.querySelector('input[name="amount"]'),
};

refs.form.addEventListener('submit', onSubmit);

function onSubmit(e) {
  e.preventDefault();

  const amount = Number(refs.amount.value);
  const step = Number(refs.stepDelay.value);
  let delay = Number(refs.firstDelay.value);

  let position = 0;

  for (let i = 0; i < amount; i++) {
    position += 1;

    createPromise(position, delay)
      .then(({ position, delay }) => {
        Notify.success(`✅ Fulfilled promise ${position} in ${delay}ms`);
      })
      .catch(({ position, delay }) => {
        Notify.failure(`❌ Rejected promise ${position} in ${delay}ms`);
      });
    delay += step;
  }
}

function createPromise(position, delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const shouldResolve = Math.random() > 0.3;
      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        reject({ position, delay });
      }
    }, delay);
  });
}
