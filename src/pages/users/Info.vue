<template>
  <div id="info">
    <el-table
      :data="datas"
      border
      style="width: 100%">
      <el-table-column
        prop="create_time"
        label="注册时间">
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
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage4"
      :page-sizes="[10, 20, 30, 40, 50]"
      :page-size="10"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
import Http from '@/utils/http.js'

export default {
  name: 'userinfo',
  data () {
    return {
      datas: [],
      currentPage4: 1,
      total: 0
    }
  },
  methods: {
    init () {
      let _this = this
      console.log(123)
      Http.getQfModel('mysql/studentsInfo', '', function (data) {
        console.log(data)
        _this.datas = data.data
        _this.total = data.count
      })
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
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
  }
</style>
