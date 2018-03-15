<template>
  <div id="orderInfo">
    <el-table
      :data="data"
      v-loading="loading"
      border
      style="width: 100%">
      <el-table-column
        prop="product_name"
        label="产品名称">
        <template slot-scope="scope">
          <router-link :to="productUrl(scope.row)" class="productUrl">{{scope.row.product_name}}</router-link>
        </template>
      </el-table-column>
      <el-table-column
        prop="count(*)"
        label="数量"
        width="100">
      </el-table-column>
      <el-table-column
        prop="money"
        label="总金额"
        width="160"
        :formatter="formatNum">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Http from '@/utils/http.js'

export default {
  name: 'users',
  data () {
    return {
      data: null,
      loading: true
    }
  },
  methods: {
    init () {
      let _this = this
      Http.getQfModel('mysql/getCourseOrder', '', function (data) {
        console.log(data)
        _this.data = data.data
        _this.loading = false
      })
    },
    productUrl (row) {
      return `/order/list?product_id=${row.product_id}`
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
  #orderInfo{
    .productUrl{
      color: #666;
      text-decoration: none;
      &:hover{
        color: #e75151;
      }
    }
  }
</style>
