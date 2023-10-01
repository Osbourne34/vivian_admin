import Head from 'next/head'

import { Card, CardContent, Container, Typography } from '@mui/material'
import { LoginForm } from '@/features/auth'

const Login = () => {
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>

      <div className="flex min-h-screen items-center bg-[url('/images/bg/main-bg.svg')] bg-cover bg-center bg-no-repeat">
        <Container maxWidth="sm">
          <Card elevation={6}>
            <img
              width={172}
              height={57}
              src="/images/logo.png"
              alt="logo"
              className="mx-auto mt-5 block"
            />

            <CardContent>
              <Typography variant="h4" align="center" mb={2.5}>
                Войти
              </Typography>

              <LoginForm />
            </CardContent>
          </Card>
        </Container>
      </div>
    </>
  )
}

export default Login
