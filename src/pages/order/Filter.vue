<template>
  <div id="orderFilter">
    <el-tabs type="border-card"
      @tab-click="tabChange"
      :value="activeType"
    >
      <el-tab-pane showData="pro" name="pro">
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
            <el-tab-pane>
              <span slot="label"><i class="el-icon-date"></i> 热力图</span>
              <div class="btns">
                <el-button size="mini" @click="setOption('adata')">全部订单数量</el-button>
                <el-button size="mini" @click="setOption('ddata')">已完成订单数量</el-button>
                <el-button size="mini" @click="setOption('mdata')">已完成订单金额</el-button>
                <div class="showTitle">{{ct}}</div>
              </div>
              <e-charts v-loading="eloading" ref="mapChart" class="calendar" @click="showOrders" :style="{height: ch}" :options="option"></e-charts>
            </el-tab-pane>
            <el-tab-pane>
              <span slot="label"><i class="el-icon-date"></i> 柱形折线图</span>
              <e-charts v-loading="eloading" :style="{height: '400px', width: '1000px'}" @click="showOrders" :options="barOption"></e-charts>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-tab-pane>
      <el-tab-pane showData="date" name="date">
        <span slot="label"><i class="el-icon-date"></i> 按时间筛选</span>
        <el-date-picker
          v-model="date"
          type="daterange"
          value-format="yyyy-M-d"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-button style="margin:0 10px;" type="danger" @click="datedata">确定</el-button>
        <span style="color: #e75151;font-size: 14px;">(不包含结束日期)</span>
        <div class="dateResult" v-loading="dateLoading">
          <el-tabs type="border-card"
            @tab-click="tabChange2"
            v-if="dateData"
          >
            <el-tab-pane>
              <span slot="label"><i class="el-icon-date"></i> 热力图</span>
              <div class="btns">
                <el-button size="mini" @click="setDateCalOption('adata')">全部订单数量</el-button>
                <el-button size="mini" @click="setDateCalOption('ddata')">已完成订单数量</el-button>
                <el-button size="mini" @click="setDateCalOption('mdata')">已完成订单金额</el-button>
                <div class="showTitle">{{cdt}}</div>
              </div>
              <e-charts ref="dateMapChart" class="calendar" :style="{height: cdh}" @click="showOrders" :options="dateCalOption"></e-charts>
            </el-tab-pane>
            <el-tab-pane>
              <span slot="label"><i class="el-icon-date"></i> 柱形折线图</span>
              <div class="btns">
                <el-button size="mini" @click="getDateLineOption('day')">日</el-button>
                <el-button size="mini" @click="getDateLineOption('week')">周</el-button>
                <el-button size="mini" @click="getDateLineOption('month')">月</el-button>
                <el-button size="mini" @click="getDateLineOption('year')">年</el-button>
              </div>
              <e-charts v-loading="lineLoading" :style="{height: '400px', width: '1000px'}" @click="showOrders" :options="dateLineOption"></e-charts>
            </el-tab-pane>
            <el-tab-pane>
              <span slot="label"><i class="el-icon-date"></i> 饼图</span>
              <div class="btns">
                <el-button size="mini" @click="setDatePieOption('all')">全部订单数量</el-button>
                <el-button size="mini" @click="setDatePieOption('done')">已完成订单数量</el-button>
                <el-button size="mini" @click="setDatePieOption('money')">已完成订单金额</el-button>
              </div>
              <e-charts ref="datePieChart" style="width: 1000px;height: 600px;" @click="showOrders" :options="datePieOption"></e-charts>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-tab-pane>
    </el-tabs>
    <transition name="el-zoom-in-top">
      <div v-show="isShowList" class="tableContainer">
        <div class="closeList" @click="closeList">
          <svg class="qficon" aria-hidden="true">
            <use xlink:href="#icon-guanbi"></use>
          </svg>
        </div>
        <List />
      </div>
    </transition>
  </div>
</template>

<script>
import Http from '@/utils/http.js'
import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/component/tooltip'
import 'echarts/extension/dataTool/index'
import 'echarts/lib/chart/heatmap'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/pie'
import { Notification } from 'element-ui'
import List from './List'

export default {
  name: 'users',
  data () {
    return {
      data: null,
      total: 0,
      loading: true,
      eloading: true,
      dateLoading: false,
      lineLoading: true,
      isShowList: false,
      options: [],
      product: '',
      option: null,
      ch: '200px',
      cdh: '200px',
      showTitle: {
        adata: '全部订单数量',
        ddata: '已完成订单数量',
        mdata: '已完成订单金额'
      },
      showDateTitle: {
        adata: '全部订单数量',
        ddata: '已完成订单数量',
        mdata: '已完成订单金额'
      },
      ct: '全部订单数量',
      cdt: '全部订单数量',
      barOption: null,
      loption: [],
      dateCalOption: null,
      dateLineOption: null,
      datePieOption: null,
      ldata: null,
      mdata: null,
      pdata: null,
      lddata: null,
      mddata: null,
      date: [],
      activeType: 'pro',
      dateData: null,
      curDateType: 'day'
    }
  },
  components: {
    ECharts,
    List
  },
  watch: {
    data () {
      this.mdata = this.handleMapData(this.data.data)
      this.ldata = this.handleLineData(this.data.data)
      this.setOption('adata')
    },
    dateData () {
      this.mddata = this.handleMapData(this.dateData.data)
      this.lddata = this.handleLineData(this.dateData.data)
      this.pdata = this.handlePieData(this.dateData.piedata)
      this.setDateOption()
    }
  },
  methods: {
    init () {
      let _this = this
      Http.getQfModel('mysql/getProduct', '', function (data) {
        _this.options = data.data
      })
    },
    handleMapData (cdata) {
      let mdata = {
        adata: [],
        ddata: [],
        mdata: []
      }
      cdata.forEach(function (e, i) {
        mdata.adata.push([e.date, e.count])
        mdata.ddata.push([e.date, e.done])
        mdata.mdata.push([e.date, e.money])
      })
      return mdata
    },
    handleLineData (cdata) {
      let ldata = {
        date: [],
        all: [],
        done: [],
        money: []
      }
      let max1 = 0
      let max2 = 0
      cdata.reverse().forEach(function (e, i) {
        if (e.count > max1) {
          max1 = e.count
        }
        if (e.money > max2) {
          max2 = e.money
        }
        ldata.date.push(e.date)
        ldata.all.push(e.count)
        ldata.done.push(e.done)
        ldata.money.push(e.money)
      })
      ldata.max1 = max1
      ldata.max2 = max2
      return ldata
    },
    handlePieData (cdata) {
      let pdata = {
        all: {
          l: [],
          d: [],
          s: {}
        },
        done: {
          l: [],
          d: [],
          s: {}
        },
        money: {
          l: [],
          d: [],
          s: {}
        }
      }
      let len = 11
      cdata.forEach(function (e, i) {
        pdata.all.l.push(e.name)
        pdata.all.s[e.name] = i < len
        pdata.all.d.push({name: e.name, value: e.count, id: e.id})
        if (e.done > 0) {
          pdata.done.l.push(e.name)
          pdata.done.s[e.name] = i < len
          pdata.done.d.push({name: e.name, value: e.done, id: e.id})
        }
        if (e.money > 0) {
          pdata.money.l.push(e.name)
          pdata.money.s[e.name] = i < len
          pdata.money.d.push({name: e.name, value: e.money, id: e.id})
        }
      })
      return pdata
    },
    tabChange () {
      console.log(131)
    },
    tabChange1 () {
      console.log(131)
    },
    tabChange2 () {
      console.log(131)
    },
    showOrders (data) {
      this.isShowList = true
      console.log(data)
      switch (data.seriesName) {
        case 'adata':
          this.changeRoute({product_id: this.product, date: data.value[0], page: 1, status: null, dateType: null, dates: null})
          break
        case 'ddata':
          this.changeRoute({product_id: this.product, date: data.value[0], page: 1, status: 'done', dateType: null, dates: null})
          break
        case 'mdata':
          this.changeRoute({product_id: this.product, date: data.value[0], page: 1, status: 'done', dateType: null, dates: null})
          break
        case 'caladata':
          this.changeRoute({product_id: null, date: data.value[0], page: 1, status: null, dateType: null, dates: null})
          break
        case 'calddata':
          this.changeRoute({product_id: null, date: data.value[0], page: 1, status: 'done', dateType: null, dates: null})
          break
        case 'calmdata':
          this.changeRoute({product_id: null, date: data.value[0], page: 1, status: 'done', dateType: null, dates: null})
          break
        case '全部':
          this.changeRoute({product_id: this.product, date: data.name, page: 1, status: null, dateType: null, dates: null})
          break
        case '金额':
          this.changeRoute({product_id: this.product, date: data.name, page: 1, status: 'done', dateType: null, dates: null})
          break
        case '已完成':
          this.changeRoute({product_id: this.product, date: data.name, page: 1, status: 'done', dateType: null, dates: null})
          break
        case 'date全部':
          this.changeRoute({product_id: null, date: data.name, page: 1, status: null, dateType: this.curDateType, dates: this.date})
          break
        case 'date金额':
          this.changeRoute({product_id: null, date: data.name, page: 1, status: 'done', dateType: this.curDateType, dates: this.date})
          break
        case 'date已完成':
          this.changeRoute({product_id: null, date: data.name, page: 1, status: 'done', dateType: this.curDateType, dates: this.date})
          break
        case 'all':
          this.changeRoute({product_id: data.data.id, date: null, page: 1, status: null, dateType: null, dates: this.date})
          break
        case 'done':
          this.changeRoute({product_id: data.data.id, date: null, page: 1, status: 'done', dateType: null, dates: this.date})
          break
        case 'money':
          this.changeRoute({product_id: data.data.id, date: null, page: 1, status: 'done', dateType: null, dates: this.date})
          break
        default:
          this.changeRoute({})
          break
      }
    },
    changeRoute (query) {
      this.$router.push({
        path: this.$route.fullPath,
        query: query
      })
    },
    closeList () {
      this.isShowList = false
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
    datedata () {
      if (this.date.length < 2) {
        Notification({
          title: '提示',
          message: '请选择开始日期和结束日期',
          type: 'warning'
        })
        return
      }
      this.dateLoading = true
      this.getDateCalData()
    },
    getDateCalData () {
      let _this = this
      let param = {
        date: this.date
      }
      Http.postQfModel('mysql/getDateOrder', param, function (data) {
        _this.dateLoading = false
        _this.dateData = data
      })
    },
    setDateOption () {
      this.setDateCalOption('adata')
      this.setDateLineOption('day')
      this.setDatePieOption('all')
    },
    setDatePieOption (type) {
      let data = this.pdata[type]
      this.datePieOption = {
        title: {
          text: '订单占比统计',
          subtext: '课程',
          x: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          orient: 'vertical',
          right: 10,
          top: 20,
          bottom: 20,
          data: data.l,
          selected: data.s
        },
        series: [{
          name: `${type}`,
          type: 'pie',
          radius: '55%',
          center: ['25%', '50%'],
          data: data.d,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      }
    },
    setDateCalOption (type) {
      this.cdt = this.showTitle[type]
      let _this = this
      let data = this.formatData(this.mddata[type])
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
          name: `cal${type}`,
          type: 'heatmap',
          coordinateSystem: 'calendar',
          calendarIndex: i,
          data: e
        })
      })
      this.cdh = (70 + newDates.length * 160) + 'px'
      this.dateCalOption = {
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
      setTimeout(function () {
        _this.$refs.dateMapChart.resize()
      }, 10)
    },
    getDateLineOption (type) {
      this.lineLoading = true
      this.curDateType = type
      let _this = this
      let param = {
        date: this.date,
        type: type
      }
      Http.postQfModel('mysql/getDateLineOrder', param, function (data) {
        _this.lddata = _this.handleLineData(data.data)
        _this.setDateLineOption()
      })
    },
    setDateLineOption () {
      this.dateLineOption = {
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
            data: this.lddata.date,
            axisPointer: {
              type: 'shadow'
            }
          }
        ],
        yAxis: [{
          type: 'value',
          name: '数量',
          min: 0,
          max: Math.floor(this.lddata.max1 * 1.15),
          interval: Math.floor(this.lddata.max1 / 5),
          axisLabel: {
            formatter: '{value} 个'
          }
        }, {
          type: 'value',
          name: '金额',
          min: 0,
          max: Math.floor(this.lddata.max2 * 1.25),
          interval: Math.floor(this.lddata.max2 / 5),
          axisLabel: {
            formatter: '{value} 元'
          }
        }],
        series: [{
          name: 'date已完成',
          type: 'bar',
          data: this.lddata.done
        }, {
          name: 'date全部',
          type: 'bar',
          data: this.lddata.all
        }, {
          name: 'date金额',
          type: 'line',
          yAxisIndex: 1,
          data: this.lddata.money
        }]
      }
      this.lineLoading = false
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
          name: type,
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
    width: 100%;
    height: calc(100vh - 60px);
    position: relative;
    overflow: auto;
    .tableContainer{
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 3;
      background: #fff;
      .closeList{
        width: 50px;
        height: 50px;
        background: rgba(0,0,0,0.1);
        position: absolute;
        top: 0px;
        right: 0;
        z-index: 2;
        cursor: pointer;
        text-align: center;
        line-height: 70px;
        &:hover{
          background: rgba(0,0,0,0.2);
        }
        .qficon{
          width: 40px;
          height: 40px;
        }
      }
    }
    .dateResult{
      min-height: 100px;
      margin-top: 20px;
    }
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
