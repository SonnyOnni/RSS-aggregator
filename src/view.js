const input = document.querySelector('input');
const feedback = document.querySelector('.feedback');

const view = (currentState) => {
  if (currentState.isValid === 'invalid') {
    input.classList.add('red-border');
    input.classList.add('is-invalid');
    feedback.classList.add('text-danger');
    feedback.textContent = 'Ссылка должна быть валидным URL';
  }
  if (currentState.isValid === 'valid') {
    input.classList.remove('red-border');
    input.classList.remove('is-invalid');
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    feedback.textContent = 'RSS успешно загружен';
  }
  if (currentState.isValid === 'loaded') {
    input.classList.remove('red-border');
    feedback.classList.add('text-danger');
    feedback.textContent = 'RSS уже существует';
  }
};

export default view;
