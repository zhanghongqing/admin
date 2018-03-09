<template>
  <div id="courseUpdate">
    <el-table
      :data="videos"
      v-loading="loading"
      border
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table
            :data="props.row.videos"
            style="width: 100%">
            <el-table-column
              label="名称">
              <template slot-scope="scope">
                {{ scope.row.name }}
                <!-- <el-popover trigger="hover" placement="top">
                  <p>姓名: {{ scope.row.name }}</p>
                  <p>住址: {{ scope.row.address }}</p>
                  <div slot="reference" class="name-wrapper">
                    <el-tag size="medium">{{ scope.row.name }}</el-tag>
                  </div>
                </el-popover> -->
              </template>
            </el-table-column>
            <el-table-column
              label="日期"
              width="180">
              <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span style="margin-left: 10px">{{ scope.row.create_time }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete1(scope.$index, scope.row, props)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="名称">
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="时间"
        :formatter="formatTime">
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
    <el-button class="addMaterial" type="primary" icon="el-icon-circle-plus-outline" @click="addVideo">添加视频</el-button>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="80px" class="ruleForm" :class="{ hide: inputHide }">
      <el-form-item label="所属目录" prop="from">
        <el-select v-model="ruleForm.from" placeholder="请选择所属目录">
          <el-option v-for="(video, index) in videos" :key="index" :label="video.name" :value="video.id"></el-option>
        </el-select>
        <el-button @click="addFrom">添加目录</el-button>
      </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="是否免费" prop="is_free">
        <el-select v-model="ruleForm.is_free" placeholder="请选择">
          <el-option label="否" :value="0"></el-option>
          <el-option label="是" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="下载地址1" prop="downUrl1">
        <el-input v-model="ruleForm.downUrl1"></el-input>
      </el-form-item>
      <el-form-item label="下载地址2" prop="downUrl2">
        <el-input v-model="ruleForm.downUrl2"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-form :model="ruleForm1" status-icon :rules="rules1" ref="ruleForm1" label-width="80px" class="ruleForm1" :class="{ hide: inputHide1 }">
      <el-form-item label="目录名称" prop="name">
        <el-input v-model="ruleForm1.name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm1('ruleForm1')">提交</el-button>
        <el-button @click="resetForm('ruleForm1')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Http from '@/utils/http.js'
import { Message, MessageBox } from 'element-ui'
// import FileSaver from 'file-saver'

export default {
  name: 'index',
  data () {
    let checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('不能为空'))
      }
      setTimeout(() => {
        callback()
      }, 1000)
    }
    let checkName1 = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('不能为空'))
      }
      setTimeout(() => {
        callback()
      }, 1000)
    }
    let checkUrl = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('不能为空'))
      }
      setTimeout(() => {
        callback()
      }, 1000)
    }
    return {
      courseData: null,
      data: null,
      file: '',
      tags: [],
      total: 100,
      inputVisible: false,
      inputVisible1: false,
      restaurants: [],
      state1: '',
      state2: '',
      teachers: [],
      videos: null,
      loading: true,
      teacherLoading: true,
      inputHide: true,
      inputHide1: true,
      ruleForm: {
        from: '',
        name: '',
        downUrl1: '',
        downUrl2: '',
        is_free: ''
      },
      ruleForm1: {
        name: ''
      },
      rules: {
        from: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        is_free: [
          { required: true, message: '请选择', trigger: 'change' }
        ],
        name: [
          { validator: checkName, trigger: 'blur' }
        ],
        downUrl1: [
          { validator: checkUrl, trigger: 'blur' }
        ]
      },
      rules1: {
        name: [
          { validator: checkName1, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      httpState: 'Http'
    })
  },
  methods: {
    ...mapActions('Http', ['changeIndexData']),
    init () {
      this.inputHide = true
      this.inputHide1 = true
      let _this = this
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
        console.log(data)
        _this.videos = data.data[0].video_info
        _this.loading = false
        _this.courseData = data.data[0]
      }, function (error) {
        console.log(error)
      })
    },
    handleEdit (index, row) {
      console.log(index, row)
      MessageBox.alert('暂时不能编辑', '提示', {
        dangerouslyUseHTMLString: true
      })
    },
    handleDelete1 (index, row, props) {
      let _this = this
      MessageBox.confirm('此操作将永久删除此课程, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        let videos = JSON.parse(JSON.stringify(this.courseData.video_info))
        let pindex = props.$index
        videos[pindex].videos.splice(index, 1)
        let params = Object.assign({}, this.courseData)
        params.video_info = videos
        Http.updateCourse(params, this.httpState, function (data) {
          console.log(11111, data)
          if (data.status === '0') {
            Message({
              type: 'success',
              message: '修改成功！！！'
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
    addFrom () {
      console.log(123)
      this.inputHide = true
      this.inputHide1 = false
    },
    showData (r) {
      console.log(r)
      MessageBox.alert(r, '视频', {
        dangerouslyUseHTMLString: true
      })
    },
    handleDelete (r) {
      let _this = this
      MessageBox.confirm('此操作将永久删除此目录及所包含课程, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        let videos = JSON.parse(JSON.stringify(this.courseData.video_info))
        videos.forEach(function (e, i) {
          if (e.id === r.id) {
            videos.splice(i, 1)
          }
        })
        let params = Object.assign({}, this.courseData)
        params.video_info = videos
        Http.updateCourse(params, this.httpState, function (data) {
          console.log(11111, data)
          if (data.status === '0') {
            Message({
              type: 'success',
              message: '修改成功！！！'
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
    submitForm1 (formName) {
      let _this = this
      // let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let param = {
            id: '',
            name: this.ruleForm1.name,
            desc: this.ruleForm1.name,
            image_url: '',
            detail_url: '',
            videos: [],
            create_time: new Date().getTime(),
            update_time: new Date().getTime(),
            updated: 0,
            update_info: ''
          }
          console.log(this.ruleForm1)
          let params = Object.assign({}, this.courseData)
          params.video_info.push(param)
          Http.updateCourse(params, this.httpState, function (data) {
            console.log(11111, data)
            if (data.status === '0') {
              Message({
                type: 'success',
                message: '添加成功！！！'
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
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    submitForm (formName) {
      let _this = this
      // let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let param = {
            id: '',
            name: this.ruleForm.name,
            type: 'record',
            duration: 0,
            authors: [],
            desc: this.ruleForm.name,
            watch_times: 0,
            image_url: '',
            detail_url: '',
            download_urls: [],
            is_free: this.ruleForm.is_free,
            is_video_ready: 1,
            file_size: 0,
            create_time: new Date().getTime(),
            update_time: new Date().getTime(),
            updated: 0,
            update_info: ''
          }
          param.download_urls.push(this.ruleForm.downUrl1, this.ruleForm.downUrl2)
          let params = Object.assign({}, this.courseData)
          params.video_info.forEach(function (e, i) {
            if (e.id === _this.ruleForm.from) {
              e.videos.push(param)
            }
          })
          Http.updateCourse(params, this.httpState, function (data) {
            console.log(11111, data)
            if (data.status === '0') {
              Message({
                type: 'success',
                message: '添加成功！！！'
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
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    formatTime (row) {
      return new Date(row.create_time).toLocaleString()
    },
    addVideo () {
      this.inputHide = false
      this.inputHide1 = true
    },
    handleClose1 (teacher) {
      console.log(teacher)
      this.ruleForm.teachers.splice(this.ruleForm.teachers.indexOf(teacher), 1)
    },
    showInput1 () {
      if (this.teachers.length === 0) {
        MessageBox.alert('请稍候,备选教师正在加载中......', '提示', {
          confirmButtonText: '确定'
        })
        return
      }
      this.inputVisible1 = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput1.$refs.input.focus()
      })
    },
    handleInputConfirm1 () {
      let state2 = this.state2
      if (state2) {
        this.ruleForm.teachers.push(state2)
      }
      this.inputVisible1 = false
      this.state2 = ''
    },
    querySearch1 (queryString, cb) {
      var teachers = this.teachers
      var results = queryString ? teachers.filter(this.createFilter1(queryString)) : teachers
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter1 (queryString) {
      return (teacher) => {
        return (teacher.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect1 (item) {
      console.log(item)
      this.ruleForm.teachers.push(item)
      this.inputVisible1 = false
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .el-message-box{
    width: 500px;
    .el-message-box__content{
      max-height: 80vh;
      overflow: auto;
    }
  }
  .addMaterial{
    margin: 20px;
  }
  .el-tag + .el-tag {
    margin-left: 10px;
    margin-bottom: 10px;
  }
  .teacherTag {
    width: 80px;
    height: 110px;
    img{
      width: 100%;
      margin-top: 8px;
    }
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 120px;
    margin-left: 10px;
    vertical-align: bottom;
  }
  .teacher-new{
    width: 160px;
  }
  #newsAdd{
    padding: 20px;
  }
  .el-scrollbar{
    .img{
      width: 60px;
      float: left;
      img{
        width: 100%;
      }
    }
    .name{
      float: left;
      text-align: center;
      width: calc(100% - 60px);
      line-height: 60px;
    }
  }
  .ruleForm{
    padding: 20px;
    &.hide{
      display: none;
    }
  }
  .ruleForm1{
    padding: 20px;
    &.hide{
      display: none;
    }
  }
</style>
