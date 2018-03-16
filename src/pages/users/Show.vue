<template>
  <div id="users" v-loading="loading">
    <div class="countNum" v-if="data">
      <div class="item">
        总注册用户:<span>{{studentTotal}}</span>
        今日注册用户:<span>{{data.days[data.days.length - 1].count}}</span>
        昨日注册用户:<span>{{data.days[data.days.length - 2].count}}</span>
      </div>
    </div>
    <el-tabs type="border-card"
      @tab-click="tabChange"
      v-if="data">
      <el-tab-pane showData="total">
        <span slot="label"><i class="el-icon-date"></i> 总增长趋势</span>
        <e-charts class="chart" :options="curOptions"></e-charts>
      </el-tab-pane>
      <el-tab-pane showData="days">
        <span slot="label"><i class="el-icon-date"></i> 每日增长</span>
        <e-charts class="chart" :options="curOptions"></e-charts>
      </el-tab-pane>
      <el-tab-pane showData="months">
        <span slot="label"><i class="el-icon-date"></i> 每月增长</span>
        <e-charts class="chart" :options="curOptions"></e-charts>
      </el-tab-pane>
      <el-tab-pane showData="weeks">
        <span slot="label"><i class="el-icon-date"></i> 每周增长</span>
        <e-charts class="chart" :options="curOptions"></e-charts>
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
      data: null,
      loading: true,
      handleData: {
        total: [],
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
    data () {
      this.studentTotal = this.data.months.reduce((t, o) => {
        return t + o.count
      }, 0)
      let mce = 0
      this.handleData.total = this.data.days.map((e, i, o) => {
        mce += e.count
        return this.formatData(e, mce)
      })
      this.handleData.days = this.data.days.map((e, i, o) => {
        return this.formatData(e, e.count)
      })
      this.handleData.months = this.data.months.map((e, i, o) => {
        return this.formatData(e, e.count)
      })
      this.handleData.weeks = this.data.weeks.map((e, i, o) => {
        return this.formatData(e, e.count)
      })
      this.loading = false
      this.changeDate('total')
    }
  },
  methods: {
    init () {
      let _this = this
      Http.getQfModel('mysql/students', '', function (data) {
        console.log(data)
        _this.data = data
      })
    },
    tabChange (tab, b) {
      this.changeDate(tab.$attrs.showData)
    },
    changeDate (tab) {
      let curData = null
      switch (tab) {
        case 'total':
          curData = this.handleData.total
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
            return params.name + ' : ' + params.value[1]
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
    formatData (e, mce) {
      return {
        name: e.date,
        value: [
          e.date,
          mce
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
    min-height: 200px;
    .chart{
      width: 1000px;
      margin: 0 auto;
    }
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
