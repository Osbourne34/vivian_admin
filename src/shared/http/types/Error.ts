type ValidationError = Array<{ input: string; message: string }>

export interface Error {
  status: boolean
  message?: string
  errors?: ValidationError
}
