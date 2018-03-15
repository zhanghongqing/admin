<template>
  <div id="users">
    <div class="countNum">
      <el-table
        :data="countOrder"
        v-loading="loading"
        border
        style="width: 100%">
        <el-table-column
          prop="date"
          label="时间">
        </el-table-column>
        <el-table-column
          prop="done"
          label="已完成订单数量">
        </el-table-column>
        <el-table-column
          prop="undone"
          label="未完成订单数量">
        </el-table-column>
        <el-table-column
          prop="total"
          label="全部订单数量">
        </el-table-column>
        <el-table-column
          prop="money"
          label="已完成订单金额"
          :formatter="formatNum">
        </el-table-column>
      </el-table>
    </div>
    <el-tabs type="border-card"
      @tab-click="tabChange"
    >
      <el-tab-pane showData="total">
        <span slot="label"><i class="el-icon-date"></i> 总增长</span>
      </el-tab-pane>
      <el-tab-pane showData="day">
        <span slot="label"><i class="el-icon-date"></i> 每日增长</span>
      </el-tab-pane>
      <el-tab-pane showData="days">
        <span slot="label"><i class="el-icon-date"></i> 7日内增长</span>
      </el-tab-pane>
      <el-tab-pane showData="weeks">
        <span slot="label"><i class="el-icon-date"></i> 7周内增长</span>
      </el-tab-pane>
      <el-tab-pane showData="months">
        <span slot="label"><i class="el-icon-date"></i> 7月内增长</span>
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
      orderCount: null,
      loading: true
    }
  },
  components: {
    ECharts
  },
  computed: {
    countOrder () {
      return JSON.parse(this.orderCount)
    }
  },
  methods: {
    init () {
      let _this = this
      Http.getQfModel('mysql/getOrder', '', function (data) {
        console.log(data)
        _this.orderCount = data.countOrder
        _this.loading = false
      })
    },
    tabChange () {
      console.log(131)
    },
    formatNum (row) {
      return Math.floor(row.money)
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
</style>
