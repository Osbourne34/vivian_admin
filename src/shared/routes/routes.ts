import { nanoid } from 'nanoid'

export const routes = [
  {
    id: nanoid(),
    title: 'Главное меню',
    link: '/',
  },
  {
    id: nanoid(),
    title: 'Сотрудники',
    children: [
      {
        id: nanoid(),
        title: 'Менеджер Склада',
        link: '/warehouse-manager',
      },
      {
        id: nanoid(),
        title: 'Админ',
        link: '/super-warehouse-manager',
      },
    ],
  },
]
