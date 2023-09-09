export const formErrors = (
  errors: Array<{ input: string; message: string }>,
) => {
  let temp = new Map()
  errors.forEach((item) => {
    let key = temp.get(item.input) ?? []
    key.push(item.message)
    temp.set(item.input, key)
  })

  return temp
}
