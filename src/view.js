const input = document.querySelector('input');
const feedback = document.querySelector('.feedback');

const view = (currentState) => {
  if (currentState.isValid.result === 'invalid') {
    input.classList.add('red-border');
    input.classList.add('is-invalid');
    feedback.classList.add('text-danger');
    feedback.textContent = currentState.isValid.result.feedback;
  }
  if (currentState.isValid.result === 'valid') {
    input.classList.remove('red-border');
    input.classList.remove('is-invalid');
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    feedback.textContent = currentState.isValid.result.feedback;
  }
  if (currentState.isValid.result === 'loaded') {
    input.classList.remove('red-border');
    feedback.classList.add('text-danger');
    feedback.textContent = currentState.isValid.result.feedback;
  }
};

export default view;
