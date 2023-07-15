export interface Response {
  status: boolean
}

export interface ResponseWithData<T> extends Response {
  data: T
}

export interface ResponseWithMessage extends Response {
  message: string
}
