export const branchesSort = (
  data: {
    id: number
    name: string
    parent_id: number
    parent_name: string | null
  }[],
) => {
  const parents = data.filter((item) => item.parent_id === 0)
  let result: {
    id: number
    parent_id: number
    name: string
    parent_name: string | null
  }[] = []
  parents.forEach((parent) => {
    result.push(parent)
    result = result.concat(data.filter((item) => parent.id === item.parent_id))
  })

  return result
}
