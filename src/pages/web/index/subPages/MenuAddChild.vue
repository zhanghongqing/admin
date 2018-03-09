<template>
  <div id="addForm">
    <div class="title">添加子菜单</div>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="70px" class="ruleForm">
      <el-form-item label="名称" prop="subName">
        <el-input v-model="ruleForm.subName"></el-input>
      </el-form-item>
      <el-form-item label="跳转地址" prop="toUrl">
        <el-input v-model="ruleForm.toUrl"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
        <el-button @click="returnPage">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Http from '@/utils/http.js'
import { Message } from 'element-ui'

export default {
  name: 'index',
  data () {
    let checkImgUrl = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('跳转地址不能为空'))
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
    return {
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      ruleForm: {
        toUrl: '',
        subName: ''
      },
      rules: {
        toUrl: [
          { validator: checkImgUrl, trigger: 'blur' }
        ],
        subName: [
          { validator: checkTitle, trigger: 'blur' }
        ]
      }
    }
  },
  props: ['data'],
  methods: {
    init () {
      console.log(this.data)
    },
    returnPage () {
      let parent = this.$parent
      parent.isShowAddChildForm = false
      parent.isShowTable = true
    },
    submitForm (formName) {
      let _this = this
      let parent = this.$parent
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let newArr = [...this.data.subList]
          newArr.push(this.ruleForm)
          let param = Object.assign({}, {subList: newArr})
          Http.postQfModel(`indexs/menu/update?id=${this.data._id}`, param, function (data) {
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
              _this.init()
              _this.dynamicTags = []
              _this.resetForm('ruleForm')
              parent.isShowAddChildForm = false
              parent.isShowTable = true
              parent.init()
            } else {
              Message({
                message: '添加失败！！！',
                type: 'warning'
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      console.log(this.$refs)
      this.$refs[formName].resetFields()
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
  #addForm{
    .title{
      line-height: 40px;
      font-size: 20px;
      color: #666;
      margin-bottom: 20px;
    }
    padding: 20px;
  }
</style>
