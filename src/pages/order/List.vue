<template>
  <div id="orderList">
    <div class="listTable">
      <el-table
        :data="data"
        v-loading="loading"
        border
        style="width: 100%">
        <el-table-column
          label="产品名称">
          <template slot-scope="scope">
            <router-link :to="productUrl(scope.row)" class="productUrl">{{scope.row.product_name}}</router-link>
          </template>
        </el-table-column>
        <el-table-column
          label="用户"
          width="160">
          <template slot-scope="scope">
            <router-link :to="studentId(scope.row)" class="productUrl">{{scope.row.mobile}}</router-link>
          </template>
        </el-table-column>
        <el-table-column
          prop="create_time"
          label="创建时间"
          width="200"
          :formatter="formatTime">
        </el-table-column>
        <el-table-column
          prop="current_product_price"
          label="价格"
          width="100"
          :formatter="formatNum">
        </el-table-column>
        <el-table-column
          label="状态"
          width="100"
          :formatter="formatStatus">
        </el-table-column>
      </el-table>
    </div>
    <div class="listPage">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :current-page="currentPage"
        @current-change="changePage">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import Http from '@/utils/http.js'

export default {
  name: 'users',
  data () {
    return {
      data: null,
      total: 0,
      loading: true
    }
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
      let param = {
        product_id: this.$route.query.product_id || '',
        page: this.$route.query.page || 1
      }
      Http.postQfModel('mysql/getOrderList', param, function (data) {
        console.log(data)
        _this.data = data.data
        _this.total = data.count
        _this.loading = false
      })
    },
    changePage (page) {
      this.loading = true
      this.$router.push({
        path: '/order/list',
        query: Object.assign({}, this.$route.query, {
          page: page
        })
      })
    },
    formatNum (row) {
      return Number(row.current_product_price).toFixed(2)
    },
    formatTime (row) {
      return new Date(row.create_time).toLocaleString()
    },
    productUrl (row) {
      return `/order/list?product_id=${row.product_id}`
    },
    studentId (row) {
      return `/users/student?id=${row.sid}`
    },
    formatStatus (row) {
      if (row.status === 'TO_PAY') {
        return '未完成'
      } else {
        return '已完成'
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
  #orderList{
    .productUrl{
      color: #666;
      text-decoration: none;
      &:hover{
        color: #e75151;
      }
    }
    .listPage{
      text-align: center;
      padding: 20px 0;
    }
  }
</style>
