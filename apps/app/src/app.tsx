import './app.css'
import './utils/polyfill'
import { initCloudbase } from '@/cloudbase'
import { Component } from 'react'

// ! 记得初始化云开发
initCloudbase()

class App extends Component {
  componentDidMount() {}

  componentDidShow() {
    // 这里可以做一些初始化工作
  }

  componentDidHide() {}

  componentDidCatchError() {}

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return this.props.children
  }
}

export default App
