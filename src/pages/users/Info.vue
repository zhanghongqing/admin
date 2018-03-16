<template>
  <div id="info">
    <div class="userinfoContainer">
      <el-table
        :data="datas"
        v-loading="loading"
        border
        style="width: 100%">
        <el-table-column
          prop="create_time"
          label="注册时间"
          :formatter="formatTime">
        </el-table-column>
        <el-table-column
          prop="mobile"
          label="手机号">
        </el-table-column>
        <el-table-column
          prop="username"
          label="用户名">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="140">
          <template slot-scope="scope">
            <el-button @click="showInfo(scope.row)" type="text" size="small">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import Http from '@/utils/http.js'

export default {
  name: 'userinfo',
  data () {
    return {
      datas: [],
      currentPage: 1,
      loading: true,
      total: 0,
      pageSize: 10
    }
  },
  watch: {
    $route () {
      this.currentPage = this.$route.query.page
      this.init()
    }
  },
  methods: {
    init () {
      let _this = this
      console.log(this.$route.query.page, this.pageSize)
      let param = {
        page: this.currentPage,
        pageSize: this.pageSize
      }
      Http.postQfModel('mysql/studentsInfo', param, function (data) {
        console.log(data)
        _this.datas = data.data
        _this.total = data.count
        _this.loading = false
      })
    },
    showInfo (row) {
      this.$router.push({
        path: '/users/student',
        query: {
          id: row.id
        }
      })
    },
    handleSizeChange (val) {
      this.loading = true
      console.log(`每页 ${val} 条`)
      this.currentPage = 1
      this.$router.push({
        path: '/users/info',
        query: {
          page: 1
        }
      })
      this.pageSize = val
      this.init()
    },
    handleCurrentChange (val) {
      this.loading = true
      console.log(`当前页: ${val}`)
      this.$router.push({
        path: '/users/info',
        query: {
          page: val
        }
      })
    },
    formatTime (row) {
      return new Date(row.create_time).toLocaleString()
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  #info{
    .pagination{
      padding: 20px 0;
      text-align: center;
    }
  }
</style>
