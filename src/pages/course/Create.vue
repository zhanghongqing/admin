<template>
  <div id="newsAdd">
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="80px" class="ruleForm">
      <el-form-item label="名称" prop="title">
        <el-input v-model="ruleForm.title"></el-input>
      </el-form-item>
      <el-form-item label="图片地址" prop="image_url">
        <el-input v-model="ruleForm.image_url"></el-input>
        <div class="imgBox">
          <img :src="ruleForm.image_url">
        </div>
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input type="number" v-model="ruleForm.price"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-select v-model="ruleForm.type" placeholder="请选择课程类型">
          <el-option label="课程" value="special"></el-option>
          <el-option label="套餐" value="package"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分类" prop="categoryList">
        <el-checkbox-group v-model="ruleForm.categoryList">
          <el-checkbox v-for="(category, key) in defaultCategoryList" :key="key" :label="category.name"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="标签">
        <el-tag
          :key="tag"
          v-for="tag in ruleForm.tags"
          closable
          type="info"
          :disable-transitions="false"
          @close="handleClose(tag)">
          {{tag}}
        </el-tag>
        <el-autocomplete
          class="input-new-tag"
          v-if="inputVisible"
          v-model="state1"
          ref="saveTagInput"
          size="small"
          :fetch-suggestions="querySearch"
          placeholder="请选择标签"
          @select="handleSelect"
          @keyup.enter.native="handleInputConfirm"
        ></el-autocomplete>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加新标签</el-button>
      </el-form-item>
      <el-form-item label="教师">
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
        <el-button v-else class="button-new-tag" size="small" @click="showInput1">+ 选择新教师</el-button>
      </el-form-item>
      <el-form-item label="有效期" prop="date">
        <el-input v-model="ruleForm.date"></el-input>
      </el-form-item>
      <el-form-item label="详情" prop="text">
        <el-input type="textarea" :rows="20" v-model="ruleForm.text"></el-input>
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

export default {
  name: 'index',
  data () {
    let checkPrice = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('价格不能为空'))
      }
      setTimeout(() => {
        callback()
      }, 1000)
    }
    let checkTitle = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('名称不能为空'))
      }
      setTimeout(() => {
        callback()
      }, 1000)
    }
    let checkText = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('内容不能为空'))
      }
      setTimeout(() => {
        callback()
      }, 1000)
    }
    let checkDate = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('有效期不能为空'))
      }
      setTimeout(() => {
        callback()
      }, 1000)
    }
    return {
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
      defaultCategoryList: [],
      ruleForm: {
        price: '',
        title: '',
        text: '',
        type: '',
        date: '',
        image_url: 'https://www.qiangfen.com/static/img/course/courseDefault.png',
        categoryList: [],
        tags: [],
        teachers: []
      },
      rules: {
        categoryList: [
          { type: 'array', required: true, message: '请至少选择一个分类', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择课程类型', trigger: 'change' }
        ],
        price: [
          { validator: checkPrice, trigger: 'blur' }
        ],
        title: [
          { validator: checkTitle, trigger: 'blur' }
        ],
        date: [
          { validator: checkDate, trigger: 'blur' }
        ],
        text: [
          { validator: checkText, trigger: 'blur' }
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
      console.log(this.data)
      this.total = this.data.length
      let _this = this
      let time1 = new Date().getTime()
      this.data.forEach(function (e, i) {
        e.tags.forEach(function (tag, index) {
          let bool = _this.tags.find((val) => {
            return val === tag.name
          })
          if (!bool) {
            _this.tags.push(tag.name)
          }
        })
      })
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
      })
      let time2 = new Date().getTime()
      console.log(time2 - time1, _this.tags)
      _this.restaurants = _this.tags.map((val) => {
        return {value: val}
      })
    }
  },
  methods: {
    ...mapActions('Http', ['changeIndexData']),
    init () {
      let _this = this
      Http.getHomeData(this.httpState, function (data) {
        console.log(data)
        _this.defaultCategoryList = data.data.category
      }, function (error) {
        console.log(error)
        Message({
          type: 'info',
          message: '获取课程分类列表失败！！！'
        })
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
    submitForm (formName) {
      let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let param = {
            id: '',
            name: _this.ruleForm.title,
            desc: _this.ruleForm.text,
            type: _this.ruleForm.type,
            show_mode: 'list',
            image_url: _this.ruleForm.image_url,
            detail_url: '/asset/api/course/info?id=&name=' + _this.ruleForm.title,
            categories: [],
            status: 'created',
            create_time: new Date().getTime(),
            update_time: new Date().getTime(),
            release_time: 1461070374,
            tags: [],
            books: [],
            materials: [],
            duration: 0,
            authors: [],
            is_free: '0',
            original_price: _this.ruleForm.price,
            current_price: _this.ruleForm.price,
            discount_begin_time: 1464660000,
            discount_price: 0.0,
            discount_end_time: 1465178520,
            watch_times: 0,
            score: 0.0,
            notice: '课程逐步上线中，请坚持每日学习',
            show_notice: '1',
            show_effective_period: '1',
            effective_period: _this.ruleForm.date,
            seq: this.total + 1
            // scope: 'external',
            // purchase_times: 0,
            // web_detail_url: null,
            // sale_url: null,
            // amount_paid: 0.0,
            // amount_to_pay: 199.0,
            // account_id: null,
            // account_type: 'unknown',
            // account_has_logined: '0',
            // account_has_bought: '0',
            // begin_time: 1515570469254,
            // end_time: 1514632743283,
            // bought_time: 1516612325186,
            // effective_period: '18年6月份四六级考试结束',
            // updated: '0',
            // update_info: '',
            // sub_courses: [],
            // video_info: [],
            // show_price: '1',
            // show_info: '',
            // ignore_bought_for_price_calc: '0'
          }
          this.ruleForm.categoryList.forEach(function (e, i) {
            param.categories.push({
              name: e
            })
          })
          this.ruleForm.tags.forEach(function (e, i) {
            param.tags.push({
              id: '',
              name: e,
              desc: e,
              image_url: '',
              detail_url: '/asset/api/course/category?id=&name=' + _this.ruleForm.title
            })
          })
          this.ruleForm.teachers.forEach(function (e, i) {
            param.authors.push({
              name: e.name,
              desc: '',
              type: 'teacher',
              image_url: '',
              detail_url: ''
            })
          })
          console.log(this.ruleForm)
          console.log(param)
          Http.createCourse(param, this.httpState, function (data) {
            console.log(data)
            if (data.status === '0') {
              Message({
                type: 'success',
                message: '创建成功！！！'
              })
            } else {
              Message({
                type: 'info',
                message: '创建失败！！！'
              })
            }
            setTimeout(function () {
              _this.$router.push({
                path: '/course'
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
    handleClose (tag) {
      this.ruleForm.tags.splice(this.ruleForm.tags.indexOf(tag), 1)
    },
    showInput () {
      if (this.restaurants.length === 0) {
        MessageBox.alert('请稍候,备选标签正在加载中......', '提示', {
          confirmButtonText: '确定'
        })
        return
      }
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm () {
      let state1 = this.state1
      if (state1) {
        this.ruleForm.tags.push(state1)
      }
      this.inputVisible = false
      this.state1 = ''
    },
    querySearch (queryString, cb) {
      var restaurants = this.restaurants
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    handleSelect (item) {
      console.log(item)
      this.handleInputConfirm()
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
</style>
