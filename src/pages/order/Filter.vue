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
        <div class="result" v-if="data">
          <div class="count">总订单:<span>{{data.total}}</span>已完成:<span>{{data.done}}</span>总金额:<span>{{data.money}}</span></div>
          <el-tabs type="border-card"
            @tab-click="tabChange1"
          >
            <el-tab-pane showData="total">
              <span slot="label"><i class="el-icon-date"></i> 热力图</span>
              <div class="btns">
                <el-button size="mini" @click="setOption('adata')">全部订单数量</el-button>
                <el-button size="mini" @click="setOption('ddata')">已完成订单数量</el-button>
                <el-button size="mini" @click="setOption('mdata')">已完成订单金额</el-button>
                <div class="showTitle">{{ct}}</div>
              </div>
              <e-charts v-loading="eloading" ref="mapChart" class="calendar" @click="showOrders" :style="{height: ch}" :options="option"></e-charts>
            </el-tab-pane>
            <el-tab-pane showData="day">
              <span slot="label"><i class="el-icon-date"></i> 柱形折线图</span>
              <e-charts v-loading="eloading" :style="{height: '400px', width: '1000px'}" :options="barOption"></e-charts>
            </el-tab-pane>
          </el-tabs>
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
import 'echarts/lib/chart/bar'

export default {
  name: 'users',
  data () {
    return {
      data: null,
      total: 0,
      loading: true,
      eloading: true,
      options: [],
      product: '',
      option: null,
      ch: '200px',
      showTitle: {
        adata: '全部订单数量',
        ddata: '已完成订单数量',
        mdata: '已完成订单金额'
      },
      ct: '全部订单数量',
      barOption: null,
      loption: [],
      ldata: null,
      mdata: null
    }
  },
  components: {
    ECharts
  },
  watch: {
    $route () {
      this.init()
    },
    data () {
      let mdata = {
        adata: [],
        ddata: [],
        mdata: []
      }
      let ldata = {
        date: [],
        all: [],
        done: [],
        money: []
      }
      let max1 = 0
      let max2 = 0
      this.data.data.forEach(function (e, i) {
        if (e.count > max1) {
          max1 = e.count
        }
        if (e.money > max2) {
          max2 = e.money
        }
        mdata.adata.push([e.date, e.count])
        mdata.ddata.push([e.date, e.done])
        mdata.mdata.push([e.date, e.money])
        ldata.date.push(e.date)
        ldata.all.push(e.count)
        ldata.done.push(e.done)
        ldata.money.push(e.money)
      })
      this.mdata = mdata
      ldata.max1 = max1
      ldata.max2 = max2
      this.ldata = ldata
      this.setOption('adata')
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
        _this.options = data.data
      })
    },
    tabChange () {
      console.log(131)
    },
    tabChange1 () {
      console.log(131)
    },
    showOrders (data) {
      this.$router.push({
        path: `/order/list`,
        query: {
          product_id: this.product,
          date: data.value[0]
        }
      })
    },
    filter () {
      this.eloading = true
      let _this = this
      let param = {
        id: this.product
      }
      Http.postQfModel('mysql/getProductInfo', param, function (data) {
        _this.data = data
      })
    },
    setOption (type) {
      this.eloading = true
      this.ct = this.showTitle[type]
      let _this = this
      let data = this.formatData(this.mdata[type])
      let my = data.dates[0][0].substring(0, 4)
      let newDates = []
      data.dates.forEach(function (e, i) {
        let index = my - e[0].substring(0, 4)
        if (!newDates[index]) {
          newDates[index] = [e]
        } else {
          newDates[index].push(e)
        }
      })
      let c = []
      let s = []
      newDates.forEach(function (e, i) {
        c.push({
          top: 70 + i * 160,
          range: e[0][0].substring(0, 4),
          cellSize: ['auto', 16]
        })
        s.push({
          type: 'heatmap',
          coordinateSystem: 'calendar',
          calendarIndex: i,
          data: e
        })
      })
      this.ch = (70 + newDates.length * 160) + 'px'
      this.option = {
        tooltip: {
          position: 'top'
        },
        visualMap: {
          min: 0,
          max: data.max,
          calculable: true,
          orient: 'horizontal',
          left: 'center',
          top: 'top'
        },
        calendar: c,
        series: s
      }
      this.barOption = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            crossStyle: {
              color: '#999'
            }
          }
        },
        toolbox: {
          feature: {
            dataView: {show: true, readOnly: false},
            magicType: {show: true, type: ['line', 'bar']},
            restore: {show: true},
            saveAsImage: {show: true}
          }
        },
        legend: {
          data: ['已完成', '全部', '金额']
        },
        xAxis: [
          {
            type: 'category',
            data: this.ldata.date,
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [{
          type: 'value',
          name: '数量',
          min: 0,
          max: Math.floor(this.ldata.max1 * 1.15),
          interval: Math.floor(this.ldata.max1 / 5),
          axisLabel: {
            formatter: '{value} 个'
          }
        }, {
          type: 'value',
          name: '金额',
          min: 0,
          max: Math.floor(this.ldata.max2 * 1.25),
          interval: Math.floor(this.ldata.max2 / 5),
          axisLabel: {
            formatter: '{value} 元'
          }
        }],
        series: [{
          name: '已完成',
          type: 'bar',
          data: this.ldata.done
        }, {
          name: '全部',
          type: 'bar',
          data: this.ldata.all
        }, {
          name: '金额',
          type: 'line',
          yAxisIndex: 1,
          data: this.ldata.money
        }]
      }
      this.eloading = false
      setTimeout(function () {
        _this.$refs.mapChart.resize()
      }, 10)
    },
    formatData (data) {
      let max = 0
      let dates = []
      data.forEach(function (e, i) {
        if (e[1] > max) {
          max = e[1]
        }
        dates.push(e)
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
      .count{
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
    }
    .btns{
      .showTitle{
        float: right;
        display: inline-block;
        margin-right: 40px;
        font-size: 14px;
      }
    }
    .calendar{
      width: 900px;
      margin: 0 auto;
    }
  }
</style>
