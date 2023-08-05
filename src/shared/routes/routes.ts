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
    children: [
      {
        id: nanoid(),
        title: 'Список',
        link: '/employees',
      },
      {
        id: nanoid(),
        title: 'Создать',
        link: '/employees/create',
      },
    ],
  },
  {
    id: nanoid(),
    title: 'Регионы',
    children: [
      {
        id: nanoid(),
        title: 'Список',
        link: '/branches',
      },
      {
        id: nanoid(),
        title: 'Создать',
        link: '/branches/create',
      },
    ],
  },
]
