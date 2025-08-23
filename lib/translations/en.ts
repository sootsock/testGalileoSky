export const en = {
  // Navigation
  builder: "Builder",
  checkSchema: "Check Schema",
  
  // Builder page
  formBuilder: "Form Builder",
  addNewField: "+ Add new field",
  formTitle: "Form title",
  save: "Save",
  download: "Download",
  downloadAndClear: "Download & Clear",
  upload: "Upload",
  clear: "Clear",
  removeField: "Remove field",
  noFieldsYet: "No fields yet. Add one above.",
  schemaJson: "Schema JSON",
  
  // Field editor
  name: "Name",
  label: "Label",
  type: "Type",
  rank: "Rank",
  required: "Required",
  min: "Min",
  max: "Max",
  minLength: "Min length",
  maxLength: "Max length",
  pattern: "Pattern (RegExp)",
  decimalPlaces: "Decimal places",
  
  // Field types
  string: "string",
  integer: "integer",
  decimal: "decimal",
  datetime: "datetime",
  
  // Watch page
  checkSchemaForm: "Check Schema Form",
  uploadSchema: "Upload Schema",
  uploadSchemaDescription: "Upload a schema JSON to render and test the form here.",
  noFieldsInSchema: "No fields in schema.",
  submit: "Submit",
  reset: "Reset",
  submissionResult: "Submission Result (JSON)",
  
  // Messages
  schemaSaved: "Schema saved to localStorage",
  schemaLoaded: "Schema loaded from file",
  schemaCleared: "Schema cleared",
  downloadedAndCleared: "Downloaded and cleared",
  schemaDownloaded: "Schema downloaded",
  schemaUploaded: "Schema uploaded",
  formSubmitted: "Form submitted successfully",
  fixValidationErrors: "Please fix validation errors",
  invalidSchema: "Invalid schema file",
  failedToParse: "Failed to parse JSON",
  failedToLoad: "Failed to load schema file. Ensure it is valid JSON.",
  
  // Confirmations
  clearConfirmation: "Are you sure you want to clear the current schema? Unsaved changes will be lost.",
  
  // Theme
  light: "Light",
  dark: "Dark",
  
  // Language
  language: "Language",
  english: "English",
  russian: "Russian",
  
  // Home page
  welcome: "Welcome",
  appDescription: "This app provides a form builder and a form filling page.",
  
  // Placeholders and defaults
  fieldLabel: "Field label",
  myForm: "My Form",
  form: "form",
  loading: "loading...",
  toggleTheme: "Toggle theme",
} as const;

export type TranslationKey = keyof typeof en;
