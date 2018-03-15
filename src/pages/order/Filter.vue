<template>
  <div id="orderFilter">
    <el-tabs type="border-card"
      @tab-click="tabChange"
    >
      <el-tab-pane showData="total">
        <span slot="label"><i class="el-icon-date"></i> 按产品筛选</span>
        <el-select v-model="product" filterable placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id">
            <span style="float: left">{{ item.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.id }}</span>
          </el-option>
        </el-select>
        <el-button type="danger" @click="filter">确定</el-button>
        <div class="result">
          <div class="count" v-if="data">总订单:<span>{{data.total}}</span>已完成:<span>{{data.done}}</span>总金额:<span>{{data.money}}</span></div>
          <e-charts class="calendar" :options="option"></e-charts>
        </div>
      </el-tab-pane>
      <el-tab-pane showData="day">
        <span slot="label"><i class="el-icon-date"></i> 按时间筛选</span>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Http from '@/utils/http.js'
import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/component/tooltip'
import 'echarts/extension/dataTool/index'
import 'echarts/lib/chart/heatmap'

export default {
  name: 'users',
  data () {
    return {
      data: null,
      total: 0,
      loading: true,
      options: [],
      product: '',
      option: {
        tooltip: {
          position: 'top'
        },
        visualMap: {
          min: 0,
          max: 1000,
          calculable: true,
          orient: 'horizontal',
          left: 'center',
          top: 'top'
        },
        calendar: [{
          range: '2018',
          cellSize: ['auto', 20]
        }, {
          top: 260,
          range: '2017',
          cellSize: ['auto', 20]
        }, {
          top: 450,
          range: '2016',
          cellSize: ['auto', 20]
        }],
        series: [{
          type: 'heatmap',
          coordinateSystem: 'calendar',
          calendarIndex: 0,
          data: [['2017-01-02', 900], ['2017-01-02', 877], ['2017-01-02', 699]]
        }, {
          type: 'heatmap',
          coordinateSystem: 'calendar',
          calendarIndex: 1,
          data: [['2017-01-02', 900], ['2017-01-02', 877], ['2017-01-02', 699]]
        }, {
          type: 'heatmap',
          coordinateSystem: 'calendar',
          calendarIndex: 2,
          data: [['2017-01-02', 900], ['2017-01-02', 877], ['2017-01-02', 699]]
        }]
      }
    }
  },
  components: {
    ECharts
  },
  watch: {
    $route () {
      this.init()
    }
  },
  computed: {
    currentPage () {
      return Number(this.$route.query.page) || 1
    }
  },
  methods: {
    init () {
      let _this = this
      Http.getQfModel('mysql/getProduct', '', function (data) {
        console.log(data)
        _this.options = data.data
      })
    },
    tabChange () {
      console.log(131)
    },
    filter () {
      let _this = this
      let param = {id: this.product}
      Http.postQfModel('mysql/getProductInfo', param, function (data) {
        console.log(data)
        _this.data = data
        _this.setOption(data.data)
      })
    },
    setOption (data) {
      data = this.formatData(data)
      console.log(111111, data)
    },
    formatData (data) {
      let max = 0
      let dates = []
      data.forEach(function (e, i) {
        if (e.count > max) {
          max = e.count
        }
        dates.push([e.date, e.count])
      })
      return {
        max: max,
        dates: dates
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
  #orderFilter{
    .result{
      padding: 20px 0;
      font-size: 20px;
      color: #666;
      span{
        font-size: 24px;
        font-weight: bold;
        padding: 0 10px;
        color: #e75151;
      }
    }
    .calendar{
      width: 1000px;
      margin: 0 auto;
    }
  }
</style>
