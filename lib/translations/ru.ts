export const ru = {
  // Navigation
  builder: "Конструктор",
  checkSchema: "Проверить схему",
  
  // Builder page
  formBuilder: "Конструктор форм",
  addNewField: "+ Добавить поле",
  formTitle: "Название формы",
  save: "Сохранить",
  download: "Скачать",
  downloadAndClear: "Скачать и очистить",
  upload: "Загрузить",
  clear: "Очистить",
  removeField: "Удалить поле",
  noFieldsYet: "Поля еще не добавлены. Добавьте выше.",
  schemaJson: "JSON схема",
  
  // Field editor
  name: "Имя",
  label: "Метка",
  type: "Тип",
  rank: "Ранг",
  required: "Обязательное",
  min: "Мин",
  max: "Макс",
  minLength: "Мин. длина",
  maxLength: "Макс. длина",
  pattern: "Шаблон (RegExp)",
  decimalPlaces: "Знаки после запятой",
  
  // Field types
  string: "строка",
  integer: "целое число",
  decimal: "десятичное число",
  datetime: "дата и время",
  
  // Watch page
  checkSchemaForm: "Проверить схему формы",
  uploadSchema: "Загрузить схему",
  uploadSchemaDescription: "Загрузите JSON схему для отображения и тестирования формы здесь.",
  noFieldsInSchema: "В схеме нет полей.",
  submit: "Отправить",
  reset: "Сбросить",
  submissionResult: "Результат отправки (JSON)",
  
  // Messages
  schemaSaved: "Схема сохранена в localStorage",
  schemaLoaded: "Схема загружена из файла",
  schemaCleared: "Схема очищена",
  downloadedAndCleared: "Скачано и очищено",
  schemaDownloaded: "Схема скачана",
  schemaUploaded: "Схема загружена",
  formSubmitted: "Форма успешно отправлена",
  fixValidationErrors: "Исправьте ошибки валидации",
  invalidSchema: "Неверный файл схемы",
  failedToParse: "Не удалось разобрать JSON",
  failedToLoad: "Не удалось загрузить файл схемы. Убедитесь, что это валидный JSON.",
  
  // Confirmations
  clearConfirmation: "Вы уверены, что хотите очистить текущую схему? Несохраненные изменения будут потеряны.",
  
  // Theme
  light: "Светлая",
  dark: "Темная",
  
  // Language
  language: "Язык",
  english: "English",
  russian: "Русский",
  
  // Home page
  welcome: "Добро пожаловать",
  appDescription: "Это приложение предоставляет конструктор форм и страницу для заполнения форм.",
  
  // Placeholders and defaults
  fieldLabel: "Метка поля",
  myForm: "Моя форма",
  form: "форма",
  loading: "загрузка...",
  toggleTheme: "Переключить тему",
  
  // Settings
  settings: "Настройки",
  changeLanguage: "Изменить язык",
  changeTheme: "Изменить тему",
} as const;
