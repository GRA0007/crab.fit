import Content from '/src/components/Content/Content'
import Footer from '/src/components/Footer/Footer'
import Header from '/src/components/Header/Header'

const Layout = async ({ children }: { children: React.ReactNode }) => <>
  <Content>
    {/* @ts-expect-error Async Server Component */}
    <Header />
  </Content>

  {children}

  {/* @ts-expect-error Async Server Component */}
  <Footer />
</>

export default Layout
