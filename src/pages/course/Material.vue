<template>
  <div id="courseUpdate">
    <el-table
      :data="materials"
      v-loading="loading"
      border
      style="width: 100%">
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
    <el-button class="addMaterial" type="primary" icon="el-icon-circle-plus-outline" @click="addMaterial">添加讲义</el-button>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="80px" class="ruleForm" :class="{ hide: inputHide }">
      <el-form-item label="名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="作者">
        <el-tag
          class="teacherTag"
          :key="index"
          v-for="(teacher, index) in ruleForm.teachers"
          closable
          type="info"
          :disable-transitions="false"
          @close="handleClose1(teacher)">
          <img :src="teacher.image_url"><br>
          {{teacher.name}}
        </el-tag>
        <el-autocomplete
          class="teacher-new"
          v-if="inputVisible1"
          v-model="state2"
          ref="saveTagInput1"
          size="small"
          :fetch-suggestions="querySearch1"
          placeholder="请选择教师"
          @select="handleSelect1"
          @keyup.enter.native="handleInputConfirm1"
        >
          <template slot-scope="props">
            <div class="img">
              <img :src="props.item.image_url">
            </div>
            <div class="name">{{ props.item.name }}</div>
          </template>
        </el-autocomplete>
        <el-button v-else class="button-new-tag" :loading="teacherLoading" size="small" @click="showInput1">+ 选择作者</el-button>
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
      materials: null,
      loading: true,
      teacherLoading: true,
      inputHide: true,
      ruleForm: {
        name: '',
        teachers: [],
        downUrl1: '',
        downUrl2: ''
      },
      rules: {
        name: [
          { validator: checkName, trigger: 'blur' }
        ],
        downUrl1: [
          { validator: checkUrl, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      httpState: 'Http'
    })
  },
  watch: {
    data () {
      let _this = this
      this.data.forEach(function (e, i) {
        e.authors.forEach(function (t, index) {
          let bool = _this.teachers.find((ele) => {
            return ele.name === t.name
          })
          if (!bool) {
            _this.teachers.push({
              name: t.name,
              image_url: t.image_url
            })
          }
        })
        _this.teacherLoading = false
      })
    }
  },
  methods: {
    ...mapActions('Http', ['changeIndexData']),
    init () {
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
        _this.materials = data.data[0].materials
        _this.loading = false
        _this.courseData = data.data[0]
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
        _this.data = data.data
      }, function (error) {
        console.log(error)
      })
    },
    showData (r) {
      console.log(r)
      MessageBox.alert(r, '讲义', {
        dangerouslyUseHTMLString: true
      })
    },
    handleDelete (r) {
      let _this = this
      MessageBox.confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        let materials = JSON.parse(JSON.stringify(this.courseData.materials))
        materials.forEach(function (e, i) {
          if (e.id === r.id) {
            materials.splice(i, 1)
          }
        })
        let params = Object.assign({}, this.courseData)
        params.materials = materials
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
    submitForm (formName) {
      let _this = this
      // let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let param = {
            id: '',
            name: this.ruleForm.name,
            desc: '',
            authors: [],
            image_url: '',
            detail_url: '',
            sale_url: 'http://www.taobao.com',
            download_urls: [],
            is_ready: 1,
            is_free: 1,
            original_price: 0,
            current_price: 0,
            create_time: new Date().getTime(),
            update_time: new Date().getTime()
          }
          this.ruleForm.teachers.forEach(function (e, i) {
            param.authors.push({
              name: e.name,
              type: 'teacher',
              image_url: '',
              detail_url: ''
            })
          })
          param.download_urls.push(this.ruleForm.downUrl1, this.ruleForm.downUrl2)
          let params = Object.assign({}, this.courseData)
          params.materials.push(param)
          Http.updateCourse(params, this.httpState, function (data) {
            console.log(11111, data)
            if (data.status === '0') {
              Message({
                type: 'success',
                message: '修改成功！！！'
              })
            } else {
              Message({
                type: 'info',
                message: '修改失败！！！'
              })
            }
            setTimeout(function () {
              _this.$router.push({
                path: '/course/edit',
                query: {
                  id: _this.$route.query.id
                }
              })
            }, 1000)
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
    addMaterial () {
      this.inputHide = false
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
</style>
