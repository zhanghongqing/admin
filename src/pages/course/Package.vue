<template>
  <div id="package">
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
          <!-- <el-button type="text" @click="handleUpdate(scope.row)" size="small">编辑</el-button> -->
          <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button class="addCourse" type="primary" icon="el-icon-circle-plus-outline" @click="addCourse">添加课程</el-button>
    <div class="addCourseBox" :class="{ hide: inputHide }">
      添加套餐课程
      <el-cascader
        :options="options"
        :show-all-levels="false"
        @change="chooseOk"
        ref="choose"
        :placeholder="inputTip"
        :disabled="isNoLoaded"
      ></el-cascader>
      <el-button class="addCourse" icon="el-icon-circle-plus-outline" @click="add">确定添加</el-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Http from '@/utils/http.js'
import { Message, MessageBox } from 'element-ui'
import DetailAlert from '@/components/DetailAlert'

export default {
  name: 'index',
  data () {
    return {
      data: null,
      courseData: null,
      alldata: null,
      loading: true,
      inputHide: true,
      categorys: [],
      inputTip: '获取备选课程列表中......',
      isNoLoaded: true,
      options: []
    }
  },
  components: {
    DetailAlert
  },
  computed: {
    ...mapState({
      httpState: 'Http'
    })
  },
  watch: {
    alldata () {
      let _this = this
      console.log(this.alldata)
      this.alldata.forEach(function (data, index) {
        if (data.type !== 'package') {
          data.categories.forEach(function (category, ci) {
            _this.options.forEach(function (opt, oi) {
              if (category.name === opt.value) {
                opt.children.push({
                  label: data.name,
                  value: data
                })
              }
            })
          })
        }
      })
      this.isNoLoaded = false
      this.inputTip = '加载完成！！！'
    }
  },
  methods: {
    ...mapActions('Http', ['changeDetailData', 'changeDetailAlert']),
    init () {
      let _this = this
      Http.getHomeData(this.httpState, function (data) {
        console.log(data)
        _this.categorys = data.data.category
        _this.categorys.forEach(function (e, i) {
          _this.options[i] = {
            value: e.name,
            label: e.name,
            children: []
          }
        })
      }, function (error) {
        console.log(error)
        Message({
          type: 'info',
          message: '获取课程分类列表失败！！！'
        })
      })
      Http.getCourses({
        // "category_id": "",
        // "category_name": "",
        course_id: this.$route.query.id
        // "course_name": "",
        // "course_type": "",
        // "course_status": "",
        // page_num: this.currentPage,
        // page_size: 5
      }, this.httpState, function (data) {
        if (data.data.length === 0) {
          setTimeout(function () {
            _this.init()
          }, 500)
          return
        }
        console.log(111, data)
        _this.data = data.data[0].sub_courses
        _this.courseData = data.data[0]
        _this.loading = false
      }, function (error) {
        console.log(error)
      })
      this.getCourses()
    },
    getCourses () {
      let _this = this
      Http.getCourses({
        page_num: 1,
        page_size: 200
      }, this.httpState, function (data) {
        if (data.data.length === 0) {
          setTimeout(function () {
            _this.getCourses()
          }, 20)
          return
        }
        _this.alldata = data.data
      }, function (error) {
        console.log(error)
      })
    },
    add () {
      let _this = this
      let val = this.$refs.choose.currentValue
      if (val.length === 0) {
        MessageBox.alert('还未选择课程！', '提示', {
          dangerouslyUseHTMLString: true
        })
        return
      }
      let params = Object.assign({}, this.courseData)
      params.sub_courses.push(val[1])
      Http.updateCourse(params, this.httpState, function (data) {
        console.log(11111, data)
        if (data.status === '0') {
          Message({
            type: 'success',
            message: '修改成功！！！'
          })
          _this.init()
          _this.isNoLoaded = false
          _this.inputTip = '获取备选课程列表中......'
          _this.options = []
        } else {
          Message({
            type: 'info',
            message: '修改失败！！！'
          })
        }
      }, function (error) {
        console.log(error)
        Message({
          type: 'info',
          message: '修改失败！！！'
        })
      })
    },
    chooseOk (a) {
      console.log(a)
    },
    addCourse () {
      this.inputHide = false
    },
    showData (row) {
      console.log(row)
      this.changeDetailData({detailData: row})
      this.changeDetailAlert()
    },
    handleDelete (row) {
      let _this = this
      MessageBox.confirm('此操作将移出此课程, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        let subCourses = JSON.parse(JSON.stringify(this.courseData.sub_courses))
        subCourses.forEach(function (e, i) {
          if (e.id === row.id) {
            subCourses.splice(i, 1)
          }
        })
        let params = Object.assign({}, this.courseData)
        params.sub_courses = subCourses
        Http.updateCourse(params, this.httpState, function (data) {
          console.log(11111, data)
          if (data.status === '0') {
            Message({
              type: 'success',
              message: '删除成功！！！'
            })
            _this.init()
          } else {
            Message({
              type: 'info',
              message: '修改失败！！！'
            })
          }
        }, function (error) {
          console.log(error)
          Message({
            type: 'info',
            message: '修改失败！！！'
          })
        })
      }).catch(() => {
        Message({
          type: 'info',
          message: '已取消删除'
        })
      })
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
  #package{
    .addCourse{
      margin: 20px;
    }
    .addCourseBox{
      &.hide{
        display: none;
      }
    }
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
    width: 500px;
    .el-message-box__content{
      max-height: 80vh;
      overflow: auto;
    }
  }
</style>
