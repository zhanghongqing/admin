<template>
  <div id="users">
    <div class="countNum">
      <div class="item">总注册用户:<span v-if="datas">{{datas.count}}</span></div>
      <div class="item">今日注册用户:<span v-if="datas">{{datas.today}}</span></div>
    </div>
    <el-tabs type="border-card"
      @tab-click="tabChange"
    >
      <el-tab-pane>
        <span slot="label"><i class="el-icon-date"></i> 总增长</span>
        <e-charts :options="total"></e-charts>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-date"></i> 每日增长</span>
        <e-charts :options="polar"></e-charts>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-date"></i> 7日内增长</span>
        <e-charts :options="total"></e-charts>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-date"></i> 7周内增长</span>
        <e-charts :options="total"></e-charts>
      </el-tab-pane>
      <el-tab-pane>
        <span slot="label"><i class="el-icon-date"></i> 7月内增长</span>
        <e-charts :options="total"></e-charts>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Http from '@/utils/http.js'
import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/chart/line'

export default {
  name: 'users',
  data () {
    return {
      datas: null,
      countData: null,
      polar: null,
      total: null
    }
  },
  components: {
    ECharts
  },
  watch: {
    countData () {
      let data = []
      let totalData = []
      let _this = this
      let newData = [...this.countData]
      newData.sort(function (a, b) {
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      })
      console.log(newData)
      let curNum = 0
      newData.forEach(function (e, i) {
        data.push(_this.randomData(e))
        let item = _this.addData(curNum, e)
        curNum = item.value[1]
        totalData.push(item)
      })
      this.changeDate('polar', data)
      this.changeDate('total', totalData)
    }
  },
  methods: {
    init () {
      let _this = this
      console.log(123)
      Http.getQfModel('mysql/students', '', function (data) {
        console.log(data)
        _this.datas = data
      })
      Http.getQfModel('mysql/userCount', '', function (data) {
        console.log(data)
        _this.countData = data
      })
    },
    tabChange () {
      console.log(1314)
    },
    changeDate (name, data) {
      this[name] = {
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            params = params[0]
            let date = new Date(params.name)
            return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' : ' + params.value[1]
          },
          axisPointer: {
            animation: false
          }
        },
        xAxis: {
          type: 'time',
          splitLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%'],
          splitLine: {
            show: false
          }
        },
        series: [{
          name: '注册',
          type: 'line',
          showSymbol: false,
          hoverAnimation: false,
          data: data
        }]
      }
    },
    randomData (ele) {
      let date = new Date(ele.date)
      return {
        name: date.toString(),
        value: [
          ele.date,
          ele.count
        ]
      }
    },
    addData (num, ele) {
      let date = new Date(ele.date)
      num += ele.count
      return {
        name: date.toString(),
        value: [
          ele.date,
          num
        ]
      }
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .echarts {
    height: 300px;
  }
  #users{
    .countNum{
      width: 100%;
      overflow: hidden;
      margin-left: 20px;
      .item{
        float: left;
        font-size: 24px;
        margin-right: 20px;
        color: #888;
        padding: 20px 0;
        span{
          padding: 0 20px;
          color: #e75151;
          font-weight: bold;
          font-size: 40px;
        }
      }
    }
  }
</style>
