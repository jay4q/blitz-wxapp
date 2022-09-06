import { nativeComponentList } from './components/libs'
import { pages } from './configs/pages'

export default defineAppConfig({
  pages: pages,
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#f5f5f5',
    navigationBarTitleText: process.env.WXAPP_PUBLIC_APP_NAME,
    navigationBarTextStyle: 'black',
  },
  usingComponents: {
    ...nativeComponentList,
  },
})
