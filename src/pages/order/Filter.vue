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
        <el-button type="danger" @click="filter('all')">确定</el-button>
        <div class="result" v-if="data">
          <div class="count">总订单:<span>{{data.total}}</span>已完成:<span>{{data.done}}</span>总金额:<span>{{data.money}}</span></div>
          <el-tabs type="border-card"
            @tab-click="tabChange1"
          >
            <el-tab-pane showData="total">
              <span slot="label"><i class="el-icon-date"></i> 热力图</span>
              <div class="btns">
                <el-button size="mini" @click="filter('all')">全部订单数量</el-button>
                <el-button size="mini" @click="filter('done')">已完成订单数量</el-button>
                <el-button size="mini" @click="filter('money')">已完成订单金额</el-button>
                <div class="showTitle">{{ct}}</div>
              </div>
              <e-charts v-loading="eloading" class="calendar" @click="showOrders" :style="{height: ch}" :options="option"></e-charts>
            </el-tab-pane>
            <el-tab-pane showData="day">
              <span slot="label"><i class="el-icon-date"></i> 柱形折线图</span>
              <e-charts v-loading="eloading" @click="showOrders" :style="{height: '400px', width: '1000px'}" :options="barOption"></e-charts>
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
        all: '全部订单数量',
        done: '已完成订单数量',
        money: '已完成订单金额'
      },
      ct: '全部订单数量',
      barOption: {
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
          data:['蒸发量', '降水量', '平均温度']
        },
        xAxis: [
          {
            type: 'category',
            data: ['1','2','3','4','5','6','7','8','9','10','11','12'],
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [{
          type: 'value',
          name: '水量',
          min: 0,
          max: 250,
          interval: 50,
          axisLabel: {
            formatter: '{value} ml'
          }
        }, {
          type: 'value',
          name: '温度',
          min: 0,
          max: 25,
          interval: 5,
          axisLabel: {
            formatter: '{value} °C'
          }
        }],
        series: [{
          name:'蒸发量',
          type:'bar',
          data:[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
        }, {
          name:'降水量',
          type:'bar',
          data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
        }, {
          name:'平均温度',
          type:'line',
          yAxisIndex: 1,
          data:[2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
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
    tabChange1 () {
      console.log(131)
    },
    showOrders (data) {
      console.log(data)
    },
    filter (type) {
      this.eloading = true
      this.ct = this.showTitle[type]
      let _this = this
      let param = {
        id: this.product,
        dataType: type
      }
      Http.postQfModel('mysql/getProductInfo', param, function (data) {
        _this.data = data
        _this.setOption(data.data)
      })
    },
    setOption (data) {
      data = this.formatData(data)
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
      this.eloading = false
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
