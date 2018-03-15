<template>
  <div id="users">
    <div class="countNum">
      <div class="item">总注册用户:<span v-if="datas">{{datas.count}}</span></div>
      <div class="item">
        今日注册用户:<span v-if="datas">{{datas.days[0].count}}</span>
        昨日注册用户:<span v-if="datas">{{datas.days[1].count}}</span>
      </div>
      <div class="item">
        本周注册用户:<span v-if="datas">{{datas.weeks[0].count}}</span>
        上周注册用户:<span v-if="datas">{{datas.weeks[1].count}}</span>
      </div>
      <div class="item">
        本月注册用户:<span v-if="datas">{{datas.months[0].count}}</span>
        上月注册用户:<span v-if="datas">{{datas.months[1].count}}</span>
      </div>
    </div>
    <el-tabs type="border-card"
      @tab-click="tabChange"
    >
      <el-tab-pane showData="total">
        <span slot="label"><i class="el-icon-date"></i> 总增长</span>
        <e-charts :options="curOptions"></e-charts>
      </el-tab-pane>
      <el-tab-pane showData="day">
        <span slot="label"><i class="el-icon-date"></i> 每日增长</span>
        <e-charts :options="curOptions"></e-charts>
      </el-tab-pane>
      <el-tab-pane showData="days">
        <span slot="label"><i class="el-icon-date"></i> 7日内增长</span>
        <e-charts :options="curOptions"></e-charts>
      </el-tab-pane>
      <el-tab-pane showData="weeks">
        <span slot="label"><i class="el-icon-date"></i> 7周内增长</span>
        <e-charts :options="curOptions"></e-charts>
      </el-tab-pane>
      <el-tab-pane showData="months">
        <span slot="label"><i class="el-icon-date"></i> 7月内增长</span>
        <e-charts :options="curOptions"></e-charts>
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
      sortData: {
        total: null,
        day: null
      },
      handleData: {
        days: [],
        weeks: [],
        months: []
      },
      curOptions: null
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
      this.sortData.total = totalData
      this.sortData.day = data
      this.changeDate('total')
    },
    datas () {
      let _this = this
      this.datas.days.forEach(function (e, i) {
        _this.handleData.days.push(_this.randomData(e))
      })
      this.datas.weeks.forEach(function (e, i) {
        _this.handleData.weeks.push(_this.randomData(e))
      })
      this.datas.months.forEach(function (e, i) {
        _this.handleData.months.push(_this.randomData(e))
      })
    }
  },
  methods: {
    init () {
      let _this = this
      Http.getQfModel('mysql/students', '', function (data) {
        console.log(data)
        _this.datas = data
      })
      Http.getQfModel('mysql/userCount', '', function (data) {
        console.log(data)
        _this.countData = data
      })
    },
    tabChange (tab, b) {
      this.changeDate(tab.$attrs.showData)
    },
    changeDate (tab) {
      let curData = null
      switch (tab) {
        case 'total':
          curData = this.sortData.total
          break
        case 'day':
          curData = this.sortData.day
          break
        case 'days':
          curData = this.handleData.days
          break
        case 'weeks':
          curData = this.handleData.weeks
          break
        case 'months':
          curData = this.handleData.months
          break
      }
      this.curOptions = {
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
          data: curData
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
      padding: 20px 0;
      width: 100%;
      overflow: hidden;
      margin-left: 20px;
      .item{
        font-size: 24px;
        margin-right: 20px;
        color: #888;
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
