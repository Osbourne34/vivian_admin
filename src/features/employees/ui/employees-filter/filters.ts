export enum Verify {
  All = '',
  Verifieds = 'verifieds',
  Unverifieds = 'unverifieds',
}

export enum Status {
  All = '',
  Active = 'active',
  Disactive = 'disactive',
  Trasheds = 'trasheds',
}

export const verifyValues = [
  {
    id: 1,
    value: Verify.All,
    label: 'Все',
  },
  {
    id: 2,
    value: Verify.Verifieds,
    label: 'Верифицированные',
  },
  {
    id: 3,
    value: Verify.Unverifieds,
    label: 'Неверифицированные',
  },
]

export const statusValues = [
  {
    id: 1,
    value: Status.All,
    label: 'Все',
  },
  {
    id: 2,
    value: Status.Active,
    label: 'Активные',
  },
  {
    id: 3,
    value: Status.Disactive,
    label: 'Неактивные',
  },
  {
    id: 4,
    value: Status.Trasheds,
    label: 'Удалённые',
  },
]
