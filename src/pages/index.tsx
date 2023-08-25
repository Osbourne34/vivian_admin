import { ReactElement } from 'react'
import { Layout } from '@/shared/layouts/layout'

const Home = () => {
  return <div>Home Page</div>
}

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default Home
