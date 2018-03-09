<template>
  <div id="newsShow">
    <div class="changeCategory">
      当前课程分类：<span class="name">{{currentCategory === '' ? '全部' : currentCategory}}</span>
      <el-dropdown class="changeDrop" trigger="click" @command="handleCommand">
        <span class="el-dropdown-link">
          选择课程分类<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="">全部</el-dropdown-item>
          <el-dropdown-item v-for="(category, index) in categorys" :key="index" :command="category.name">{{category.name}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <DetailAlert />
    <el-table
      :data="data"
      v-loading="loading"
      border
      style="width: 100%">
      <el-table-column
        fixed
        label="图片"
        width="160">
        <template slot-scope="scope">
          <img :src="scope.row.image_url">
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="标题">
      </el-table-column>
      <el-table-column
        prop="amount_to_pay"
        label="价格"
        width="70">
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="创建时间"
        :formatter="formatTime"
        width="180">
      </el-table-column>
      <el-table-column
        prop="desc"
        label="介绍">
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
        :page-size="5"
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
import { Message, MessageBox, Notification } from 'element-ui'
import DetailAlert from '@/components/DetailAlert'

export default {
  name: 'index',
  data () {
    return {
      data: null,
      loading: true,
      total: 0,
      categorys: [],
      currentCategory: ''
    }
  },
  components: {
    DetailAlert
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
    ...mapActions('Http', ['changeDetailData', 'changeDetailAlert']),
    init () {
      let _this = this
      Http.getHomeData(this.httpState, function (data) {
        console.log(data)
        _this.categorys = data.data.category
      }, function (error) {
        console.log(error)
        Message({
          type: 'info',
          message: '获取课程分类失败！！！'
        })
      })
      Http.getCourses({
        // category_id: ,
        // category_name: this.currentCategory,
        // "course_id": "",
        // "course_name": "",
        // "course_type": "",
        // "course_status": "",
        page_num: this.currentPage,
        page_size: 5
      }, this.httpState, function (data) {
        if (data.data.length === 0) {
          setTimeout(function () {
            _this.init()
          }, 500)
          return
        }
        console.log(111, data)
        _this.data = data.data
        _this.loading = false
        _this.total = data.page_info.total_count
      }, function (error) {
        console.log(error)
      })
    },
    handleCommand (v) {
      if (v === '') {
        this.currentCategory = ''
        this.init()
        return
      }
      console.log(v)
      this.currentCategory = v
      this.loading = true
      this.getCategoryData(v)
    },
    showData (row) {
      console.log(row)
      this.changeDetailData({detailData: row})
      this.changeDetailAlert()
    },
    getCategoryData (name) {
      let _this = this
      Http.getCourseList(name, this.httpState, function (data) {
        console.log(data)
        _this.data = data.data
        _this.loading = false
        _this.total = 0
      }, function (error) {
        console.log(error)
        Message({
          type: 'info',
          message: '获取课程分类失败！！！'
        })
      })
    },
    handleUpdate (row) {
      this.$router.push({
        path: '/course/edit',
        query: {
          id: row.id
        }
      })
    },
    handleDelete (row) {
      if (sessionStorage.getItem('qiangfengo') > 0) {
        Notification({
          title: '提示',
          message: '对不起你不能进行此操作！！！',
          type: 'warning'
        })
        return
      }
      let _this = this
      MessageBox.confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        Http.deleteCourse({
          course_id: row.id
        }, this.httpState, function (data) {
          console.log(data)
        }, function (error) {
          console.log(error)
        })
        _this.init()
      }).catch(() => {
        Message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    changePage (page) {
      this.$router.push({
        path: '/course',
        query: {
          page: page
        }
      })
      this.loading = true
    },
    formatTime (row) {
      return new Date(row.create_time).toLocaleString()
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
    .changeCategory{
      width: 340px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      position: fixed;
      top: 15px;
      left: 320px;
      font-size: 14px;
      .name{
        font-size: 16px;
        font-weight: bold;
        color: #666;
      }
      .changeDrop{
        margin-left: 10px;
        cursor: pointer;
        color: #e75151;
        &:hover{
          opacity: 0.6;
        }
      }
    }
    img{
      width: 100%;
    }
    .cell{
      overflow: hidden;
      text-overflow: ellipsis;
      max-height: 98px;
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
