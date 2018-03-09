<template>
  <div id="newsAdd">
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="60px" class="ruleForm">
      <el-form-item label="作者" prop="author">
        <el-input v-model="ruleForm.author"></el-input>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="ruleForm.title"></el-input>
      </el-form-item>
      <el-form-item label="内容" prop="text">
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
import { Message } from 'element-ui'
// import FileSaver from 'file-saver'

export default {
  name: 'index',
  data () {
    let checkAuthor = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('作者不能为空'))
      }
      setTimeout(() => {
        callback()
      }, 1000)
    }
    let checkTitle = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('标题不能为空'))
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
    return {
      data: null,
      file: '',
      ruleForm: {
        author: '',
        title: '',
        text: ''
      },
      rules: {
        author: [
          { validator: checkAuthor, trigger: 'blur' }
        ],
        title: [
          { validator: checkTitle, trigger: 'blur' }
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
  methods: {
    ...mapActions('Http', ['changeIndexData']),
    init () {
      let _this = this
      Http.getQfModel('news/detail', {id: this.$route.query.id}, function (data) {
        let formData = data[0]
        _this.ruleForm.author = formData.author
        _this.ruleForm.title = formData.title
        _this.ruleForm.text = formData.text
      })
    },
    submitForm (formName) {
      let _this = this
      // let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm)
          Http.postQfModel('news/update?id=' + this.$route.query.id, this.ruleForm, function (data) {
            console.log(11111, data)
            if (data === 0) {
              Message({
                message: '修改失败！！！',
                type: 'warning'
              })
              return
            }
            if (data.nModified === 1) {
              Message({
                message: '修改成功！！！',
                type: 'success'
              })
            } else {
              Message({
                message: '修改失败！！！',
                type: 'warning'
              })
            }
            setTimeout(function () {
              _this.$router.push({
                path: '/web/news'
              })
            }, 1000)
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
    // saveAsJson () {
    //   let data = {
    //     name: 'zhanghongqing',
    //     age: 12,
    //     array: [{
    //       name: 'zzz'
    //     }, {
    //       name: 'zzz1'
    //     }]
    //   }
    //   let blob = new Blob([JSON.stringify(data)], { type: '' })
    //   FileSaver.saveAs(blob, '/static/model/test.json')
    // }
  },
  mounted () {
    this.init()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  #newsAdd{
    padding: 20px;
  }
</style>
