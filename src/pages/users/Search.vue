<template>
  <div id="info">
    <div class="searchInput">
      <el-form :inline="true" :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="60px" class="ruleForm">
        <el-form-item label="搜索" prop="str">
          <el-input v-model="ruleForm.str"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="searchResult" v-if="datas.length > 0">
      <div class="userinfoContainer">
        <el-table
          :data="datas"
          border
          style="width: 100%">
          <el-table-column
            prop="create_time"
            label="注册时间"
            :formatter="formatTime">
          </el-table-column>
          <el-table-column
            label="手机号">
            <template slot-scope="scope">
              <span v-html="formatMobile(scope.row.mobile)"></span>
            </template>
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
    <div class="none" v-if="datas.length === 0">
      <span>没有搜索结果</span>
    </div>
  </div>
</template>

<script>
import Http from '@/utils/http.js'

export default {
  name: 'userinfo',
  data () {
    let checkAuthor = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('搜索不能为空'))
      }
      setTimeout(() => {
        callback()
      }, 1000)
    }
    return {
      ruleForm: {
        str: ''
      },
      rules: {
        str: [
          { validator: checkAuthor, trigger: 'blur' }
        ]
      },
      datas: [],
      currentPage: 1,
      total: 0,
      pageSize: 10
    }
  },
  watch: {
    $route () {
      this.currentPage = this.$route.query.page
      this.searchRes()
    }
  },
  methods: {
    init () {
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
      console.log(`当前页: ${val}`)
      this.$router.push({
        path: '/users/search',
        query: {
          page: val
        }
      })
    },
    searchRes () {
      let _this = this
      let param = {
        page: this.currentPage,
        pageSize: this.pageSize,
        search: this.ruleForm.str
      }
      Http.postQfModel('mysql/searchStudent', param, function (data) {
        console.log(data)
        _this.datas = data.data
        _this.total = data.count
      })
    },
    formatTime (row) {
      return new Date(row.create_time).toLocaleString()
    },
    formatMobile (val) {
      let pat = new RegExp(this.ruleForm.str)
      return val.replace(pat, (val) => {
        return '<b class="check">' + val + '</b>'
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.currentPage = 1
          this.pageSize = 10
          this.searchRes()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
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
    .searchResult{
      .userinfoContainer{
        .check{
          color: #e75151;
        }
      }
    }
    .searchInput{
      padding: 20px;
    }
    .pagination{
      padding: 20px 0;
      text-align: center;
    }
    .none{
      text-align: center;
      line-height: 100px;
      font-size: 24px;
    }
  }
</style>
