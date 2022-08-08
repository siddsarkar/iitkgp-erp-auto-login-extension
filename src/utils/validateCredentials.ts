enum FieldValidationStatus {
  SomeFieldIsEmpty,
  AllFieldsFilled
}

const validateCredentials = (credObjFromStorage: { [key: string]: unknown }): FieldValidationStatus => {
  if (
    credObjFromStorage.username !== '' &&
    credObjFromStorage.password !== '' &&
    credObjFromStorage.q1 !== 'Your erp question 1' &&
    credObjFromStorage.q2 !== 'Your erp question 2' &&
    credObjFromStorage.q3 !== 'Your erp question 3' &&
    credObjFromStorage.a1 !== '' &&
    credObjFromStorage.a2 !== '' &&
    credObjFromStorage.a3 !== ''
  ) {
    return FieldValidationStatus.AllFieldsFilled
  } else {
    return FieldValidationStatus.SomeFieldIsEmpty
  }
}

export { FieldValidationStatus }
export default validateCredentials
