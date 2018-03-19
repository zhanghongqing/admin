<template>
  <div id="newsAdd">
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="60px" class="ruleForm">
      <el-form-item label="作者" prop="author">
        <el-input v-model="ruleForm.author"></el-input>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="ruleForm.title"></el-input>
      </el-form-item>
      <el-form-item label="分类" prop="type">
        <el-select v-model="ruleForm.type" placeholder="请选择类型">
          <el-option label="英语" value="英语"></el-option>
          <el-option label="数学" value="数学"></el-option>
          <el-option label="政治" value="政治"></el-option>
          <el-option label="英语四六级" value="英语四六级"></el-option>
          <el-option label="专业课" value="专业课"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="内容">
        <!-- <el-input type="textarea" :rows="20" v-model="ruleForm.text"></el-input> -->
        <div id="editor-container"></div>
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
import Quill from 'quill'

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
    return {
      data: null,
      file: '',
      ruleForm: {
        author: '',
        title: '',
        type: ''
      },
      rules: {
        author: [
          { validator: checkAuthor, trigger: 'blur' }
        ],
        title: [
          { validator: checkTitle, trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请至少选择一个类型', trigger: 'change' }
        ]
      },
      editor: null
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
      let toolbarOptions = [
        ['bold', 'italic', 'underline', 'strike'],
        ['blockquote', 'code-block'],
        [{ 'header': 1 }, { 'header': 2 }],
        [{'list': 'ordered'}, {'list': 'bullet'}],
        [{'script': 'sub'}, {'script': 'super'}],
        [{'indent': '-1'}, {'indent': '+1'}],
        [{'direction': 'rtl'}],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{'color': []}, { 'background': [] }],
        [{'font': []}],
        [{'align': []}],
        ['clean']
      ]

      let quill = new Quill('#editor-container', {
        modules: {
          toolbar: toolbarOptions
        },
        placeholder: 'Compose an epic...',
        theme: 'snow'
      })
      console.log(quill)
      this.editor = quill
      // let _this = this
      // if (this.httpState.indexData !== '') {
      //   return
      // }
    },
    submitForm (formName) {
      // let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let param = Object.assign({}, {text: this.editor.container.firstChild.innerHTML}, this.ruleForm)
          Http.postQfModel('down/add', param, function (data) {
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
  @import url('https://cdn.bootcss.com/quill/1.3.6/quill.snow.min.css');

  #newsAdd{
    padding: 20px;
    .ql-picker{
      height: auto;
    }
    .ql-toolbar{
      background: #fff;
      border-color: #dcdfe6;
      border-radius: 5px 5px 0 0;
    }
    #editor-container{
      height: 400px;
      background: #fff;
      border-color: #dcdfe6;
      border-radius: 0 0 5px 5px;
    }
  }
</style>
