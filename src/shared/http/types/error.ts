type ValidationError = Array<{ input: string; message: string }>

export interface Error {
  status: boolean | 401
  message?: string
  errors?: ValidationError
}
