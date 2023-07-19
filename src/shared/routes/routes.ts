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
        title: 'Менеджер склада',
        link: '/warehouse-manager',
      },
      {
        id: nanoid(),
        title: 'Генеральный заведующий складом',
        link: '/super-warehouse-manager',
      },
      {
        id: nanoid(),
        title: 'Админ',
        link: '/employees/admins',
      },
      {
        id: nanoid(),
        title: 'Ассистент',
        link: '/assistants',
      },
      {
        id: nanoid(),
        title: 'Доставщик',
        link: '/supervisors',
      },
      {
        id: nanoid(),
        title: 'Супер админ',
        link: '/super-admins',
      },
    ],
  },
]
