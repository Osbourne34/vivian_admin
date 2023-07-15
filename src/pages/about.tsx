import { ReactElement } from 'react'
import Layout from '@/shared/layouts/layout'

const About = () => {
  return <div>About</div>
}

About.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>
}

export default About
