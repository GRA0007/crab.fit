import Content from '/src/components/Content/Content'
import Footer from '/src/components/Footer/Footer'
import Header from '/src/components/Header/Header'

const Layout = async ({ children }: { children: React.ReactNode }) => <>
  <Content>
    <Header />
  </Content>

  {children}

  <Footer />
</>

export default Layout
