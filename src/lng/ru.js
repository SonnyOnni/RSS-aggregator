export default {
  translation: {
    header: 'RSS агрегатор',
    paragraph: {
      afterHeader: 'Начните читать RSS сегодня! Это легко, это красиво.',
      example: 'Пример: https://ru.hexlet.io/lessons.rss',
    },
    form: {
      input: 'Ссылка RSS',
      btn: 'Добавить',
    },
    feedback: {
      valid: 'RSS успешно загружен',
      errors: {
        empty_field: 'Не должно быть пустым',
        invalid: 'Ссылка должна быть валидным URL',
        loaded: 'RSS уже существует',
        network: 'Ошибка сети',
        parser: 'Ресурс не содержит валидный RSS',
        type: 'Неподдерживаемый тип RSS',
      },
    },
  },
};
