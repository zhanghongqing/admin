<template>
  <div id="addForm">
    <div class="title">添加</div>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="70px" class="ruleForm">
      <el-form-item label="图标" prop="icon">
        <el-input v-model="ruleForm.icon"></el-input>
      </el-form-item>
      <el-form-item label="名称" prop="title">
        <el-input v-model="ruleForm.title"></el-input>
      </el-form-item>
      <el-form-item label="小标题" prop="smallTitle">
        <el-tag
          :key="tag"
          v-for="tag in dynamicTags"
          closable
          :disable-transitions="false"
          @close="handleClose(tag)">
          {{tag}}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
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
        return callback(new Error('图标不能为空'))
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
        icon: '',
        title: ''
      },
      rules: {
        icon: [
          { validator: checkImgUrl, trigger: 'blur' }
        ],
        title: [
          { validator: checkTitle, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init () {
      console.log(this)
    },
    handleClose (tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm () {
      let inputValue = this.inputValue
      if (inputValue) {
        this.dynamicTags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    returnPage () {
      let parent = this.$parent
      parent.isShowAddForm = false
      parent.isShowTable = true
    },
    submitForm (formName) {
      let _this = this
      let parent = this.$parent
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let param = Object.assign({}, this.ruleForm, {smallTitle: this.dynamicTags, mIndex: parent.menuData.length + 1})
          Http.postQfModel('indexs/menu/add', param, function (data) {
            console.log(11111, data)
            if (data === 0) {
              Message({
                message: '添加失败！！！',
                type: 'warning'
              })
              return
            }
            if (data.__v === 0) {
              Message({
                message: '添加成功！！！',
                type: 'success'
              })
              _this.init()
              _this.dynamicTags = []
              _this.resetForm('ruleForm')
              parent.isShowAddForm = false
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

  .el-tag + .el-tag {
    margin-left: 10px;
  }
  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }
  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
  }

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
