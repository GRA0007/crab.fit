import { Metadata } from 'next'

import Content from '/src/components/Content/Content'
import CreateForm from '/src/components/CreateForm/CreateForm'
import Header from '/src/components/Header/Header'

import Redirect from './Redirect'

export const metadata: Metadata = {
  title: 'Create a Crab Fit',
}

/**
 * Used in the Crab Fit browser extension, to be rendered only in an iframe
 */
const Page = async () => <>
  <Content isSlim>
    <Header isFull isSmall />
  </Content>

  <Content isSlim>
    <CreateForm noRedirect />
  </Content>

  <Redirect />
</>

export default Page
