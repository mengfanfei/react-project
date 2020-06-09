import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Button, message } from 'antd'
import ReactEcharts from 'echarts-for-react'
import './style.css'
import request from '../../request'
import moment from 'moment'


// interface CourseItem {
//   title: string
//   count: number
// }

// interface Data {
//   [key: string]: CourseItem[]
// }

interface State {
  loaded: boolean
  isLogin: boolean
  data: responseResult.DataStructure
}


class Home extends Component {
  state: State = {
    loaded: false,
    isLogin: true,
    data: {}
  }

  componentDidMount() {
    request.get('/api/isLogin').then(res => {
      const data: responseResult.isLogin = res.data
      if (!data) {
        this.setState({
          isLogin: false,
          loaded: true
        })
      } else {
        this.setState({
          loaded: true
        })
      }
    })

    request.get('/showData').then(res => {
      const data: responseResult.DataStructure = res.data
      if (data) {
        this.setState({
          data
        })
      }
    })
  }

  handleLoginoutClick = (): void => {
    request.get('/loginout').then(res => {
      const data: responseResult.loginout = res.data
      if (data) {
        this.setState({
          isLogin: false
        })
      } else {
        message.error('退出失败')
      }
    })
  }

  handleCrowllerClick = (): void => {
    request.get('/getData').then(res => {
      const data: responseResult.getData = res.data
      if (data) {
        message.success('爬取成功')
      } else {
        message.error('爬取失败')
      }
    })
  }

  getOption = (): echarts.EChartOption => {
    const { data } = this.state
    const courseNames: string[] = []
    const times: string[] = []
    const tempData: {
      [key: string]: number[]
    } = {}
    for (let key in data) {
      times.push(moment(Number(key)).format('MM-DD HH:mm'))
      const item = data[key]
      item.forEach(innerItem => {
        const { title, count } = innerItem
        if (!courseNames.includes(title)) {
          courseNames.push(title)
        }
        tempData[title] ? tempData[title].push(count) : (tempData[title] = [count])
      })
    }
    const result: echarts.EChartOption.Series[] = []
    for (let key in tempData) {
      result.push({
        name: key,
        type: 'line',
        data: tempData[key]
      })
    }
    return {
      title: {
        text: '课程在线学习人数'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: courseNames
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: times
      },
      yAxis: {
        type: 'value'
      },
      series: result
    }
  }


  render() {
    const { isLogin, loaded } = this.state
    if (isLogin) {
      if (loaded) {
        return (
          <div className="home-page">
            <div className="buttons">
              <Button type="primary" onClick={this.handleCrowllerClick}>爬取</Button>
              {/* <Button type="primary">展示</Button> */}
              <Button type="primary" onClick={this.handleLoginoutClick}>退出</Button>
            </div>
            <ReactEcharts option={this.getOption()} />
          </div>
        )
      }
      return null
    } else {
      return (
        <Redirect to="/login"></Redirect>
      )
    }
  }
}

export default Home