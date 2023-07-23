import { nanoid } from 'nanoid'

export const routes = [
  {
    id: nanoid(),
    title: 'Дашбоард',
    link: '/',
  },
  {
    id: nanoid(),
    title: 'Сотрудники',
    link: '/employees',
  },
]
