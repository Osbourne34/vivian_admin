import { nanoid } from 'nanoid'

import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import PinDropRoundedIcon from '@mui/icons-material/PinDropRounded'
import ExploreRoundedIcon from '@mui/icons-material/ExploreRounded'
import MenuRoundedIcon from '@mui/icons-material/MenuRounded'
import LanRoundedIcon from '@mui/icons-material/LanRounded'

import { OverridableComponent } from '@mui/material/OverridableComponent'
import { SvgIconTypeMap } from '@mui/material'

type Route = {
  id: string
  title: string
  link: string
  Icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & { muiName: string }
}

export const routes: Route[] = [
  {
    id: nanoid(),
    title: 'Дашбоард',
    link: '/',
    Icon: DashboardRoundedIcon,
  },
  {
    id: nanoid(),
    title: 'Сотрудники',
    link: '/employees',
    Icon: PeopleAltRoundedIcon,
  },
  {
    id: nanoid(),
    title: 'Клиенты',
    link: '/clients',
    Icon: PeopleAltOutlinedIcon,
  },
  {
    id: nanoid(),
    title: 'Регионы',
    link: '/branches',
    Icon: PinDropRoundedIcon,
  },
  {
    id: nanoid(),
    title: 'Ориентиры',
    link: '/orients',
    Icon: ExploreRoundedIcon,
  },
  {
    id: nanoid(),
    title: 'Категорий',
    link: '/categories',
    Icon: MenuRoundedIcon,
  },
  {
    id: nanoid(),
    title: 'Роли',
    link: '/roles',
    Icon: LanRoundedIcon,
  },
]
