import { nanoid } from 'nanoid'

import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded'
import PinDropRoundedIcon from '@mui/icons-material/PinDropRounded'

import { OverridableComponent } from '@mui/material/OverridableComponent'
import { SvgIconTypeMap } from '@mui/material'

type Route = {
  id: string
  title: string
  link: string
  Icon: OverridableComponent<SvgIconTypeMap<{}, "svg">> & { muiName: string}
}

export const routes:Route[]  = [
  {
    id: nanoid(),
    title: 'Дашбоард',
    link: '/',
    Icon: DashboardRoundedIcon
  },
  {
    id: nanoid(),
    title: 'Сотрудники',
    link: '/employees',
    Icon: PeopleAltRoundedIcon
  },
  {
    id: nanoid(),
    title: 'Регионы',
    link: '/branches',
    Icon: PinDropRoundedIcon
  },
]
