<template>
  <div id="newsShow">
    <el-table
      :data="data"
      v-loading="loading"
      border
      style="width: 100%">
      <el-table-column
        fixed
        prop="createTime"
        label="日期"
        width="180"
        :formatter="formatTime">
      </el-table-column>
      <el-table-column
        prop="_id"
        label="编号"
        width="120">
      </el-table-column>
      <el-table-column
        prop="author"
        label="作者"
        width="120">
      </el-table-column>
      <el-table-column
        prop="title"
        label="标题">
      </el-table-column>
      <el-table-column
        prop="text"
        label="内容">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="140">
        <template slot-scope="scope">
          <el-button @click="showData(scope.row)" type="text" size="small">查看</el-button>
          <el-button type="text" @click="handleUpdate(scope.row)" size="small">编辑</el-button>
          <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pageBox">
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
import { mapState, mapActions } from 'vuex'
import Http from '@/utils/http.js'
import { Message, MessageBox } from 'element-ui'

export default {
  name: 'index',
  data () {
    return {
      data: null,
      loading: true,
      total: 0
    }
  },
  computed: {
    ...mapState({
      httpState: 'Http'
    }),
    currentPage () {
      return Number(this.$route.query.page) || 1
    }
  },
  watch: {
    $route () {
      this.init()
    }
  },
  methods: {
    ...mapActions('Http', ['changeIndexData']),
    init () {
      let _this = this
      Http.getQfModel('news', {page: this.currentPage}, function (data) {
        console.log(data)
        _this.data = data.data
        _this.total = data.count
        _this.loading = false
      })
    },
    showData (row) {
      let content = `<div id="newsDetail">
        <div class="title" style="
          font-size: 18px;
          color: #444;
          font-weight: bold;
          text-indent: 30px;
          margin-top: 30px;
        ">${row.title}</div>
        <div class="time" style="
          color: #ccc;
          font-size: 14px;
          margin-top: 20px;
          margin-bottom: 10px;
          text-indent: 30px;
        ">${new Date(row.createTime).toLocaleString()}</div>
        <hr style="height:1px;border:none;border-top:1px solid #eee;">
        <div class="text" style="padding: 30px;">
          <pre style="
            white-space: pre-wrap;
            font-size: 14px;
            line-height: 24px;
            color: #333;
          ">${row.text}</pre>
        </div>
      </div>`
      MessageBox.alert(content, '页面显示效果', {
        dangerouslyUseHTMLString: true,
        showClose: false
      })
    },
    handleUpdate (row) {
      this.$router.push({
        path: '/web/news/update',
        query: {
          id: row._id
        }
      })
    },
    handleDelete (row) {
      let _this = this
      MessageBox.confirm('此操作将永久删除该文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        Http.postQfModel('news/delete', {id: row._id}, function (data) {
          if (data.n === 1 && data.ok === 1) {
            Message({
              type: 'success',
              message: '删除成功！！！'
            })
            _this.init()
          } else {
            Message({
              type: 'info',
              message: '删除失败！！！'
            })
          }
          console.log('删除成功', data)
        }, function () {
          Message({
            type: 'info',
            message: '删除失败！！！'
          })
        })
        // Message({
        //   type: 'success',
        //   message: '删除成功!'
        // })
      }).catch(() => {
        Message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    changePage (page) {
      this.$router.push({
        path: '/web/news',
        query: {
          page: page
        }
      })
      this.loading = true
    },
    formatTime (row) {
      return new Date(row.createTime).toLocaleString()
    }
  },
  mounted () {
    console.log('初始化')
    this.init()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  #newsShow{
    .cell{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap; 
    }
    .pageBox{
      padding: 20px 0;
      text-align: center;
      background: #fff;
    }
  }
  .el-message-box{
    width: 1200px;
    .el-message-box__content{
      max-height: 80vh;
      overflow: auto;
    }
  }
</style>
