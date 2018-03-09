<template>
  <div id="courseUpdate">
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="60px" class="ruleForm">
      <el-form-item :label="$route.query.key" prop="mt" v-if="inputType === 'input'">
        <el-input v-model="ruleForm.mt"></el-input>
        <div class="seeImg"  v-if="$route.query.key === 'image_url'">
          <img :src="ruleForm.mt">
        </div>
      </el-form-item>
      <el-form-item :label="$route.query.key" prop="mt" v-if="inputType === 'text'">
        <el-input type="textarea" :rows="20" v-model="ruleForm.mt"></el-input>
      </el-form-item>
      <el-form-item :label="$route.query.key" prop="mt" v-if="inputType === 'num'">
        <el-input type="number" v-model="ruleForm.mt"></el-input>
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
import { Message } from 'element-ui'
// import FileSaver from 'file-saver'

export default {
  name: 'index',
  data () {
    let checkMt = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('不能为空'))
      }
      setTimeout(() => {
        callback()
      }, 1000)
    }
    return {
      data: null,
      ruleForm: {
        mt: ''
      },
      rules: {
        mt: [
          { validator: checkMt, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      httpState: 'Http'
    }),
    inputType () {
      switch (this.$route.query.key) {
        case 'name':
          return 'input'
        case 'desc':
          return 'text'
        case 'image_url':
          return 'input'
        case 'current_price':
          return 'num'
      }
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
        console.log(111, data)
        _this.data = data.data
        _this.ruleForm.mt = data.data[0][_this.$route.query.key]
      }, function (error) {
        console.log(error)
      })
    },
    submitForm (formName) {
      let _this = this
      // let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm)
          let param = Object.assign({}, _this.data[0])
          param[this.$route.query.key] = this.ruleForm.mt
          Http.updateCourse(param, this.httpState, function (data) {
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
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  #courseUpdate{
    padding: 20px;
    .seeImg{
      width: 400px;
      margin-top: 20px;
      box-shadow: 0 0 2px
      img{
        width: 100%;
      }
    }
  }
</style>
