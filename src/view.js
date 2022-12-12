const input = document.querySelector('input');

const view = (currentState) => {
  console.log(currentState.isValid);
  if (currentState.isValid === false) {
    input.classList.add('red-border');
  }
  if (currentState.isValid === true) {
    input.classList.remove('red-border');
  }
};

export default view;
