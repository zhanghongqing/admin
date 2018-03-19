<template>
  <div id="orders">
    <div class="countNum">
      <el-table
        :data="orderCount"
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
  </div>
</template>

<script>
import Http from '@/utils/http.js'
import ECharts from 'vue-echarts/components/ECharts.vue'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/chart/line'

export default {
  name: 'orders',
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
  methods: {
    init () {
      let _this = this
      Http.getQfModel('mysql/getOrder', '', function (data) {
        console.log(data)
        _this.orderCount = JSON.parse(data.data)
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
  #orders{
    padding: 0;
  }
</style>
