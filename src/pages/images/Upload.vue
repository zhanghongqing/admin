<template>
  <div id="imageUpload">
    <div class="imageTitle">添加图片</div>
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="80px" class="ruleForm">
      <el-form-item label="分类" prop="type" v-if="!isNew">
        <el-select v-model="ruleForm.type" placeholder="请选择类型" @change="showInput">
          <el-option v-for="(sed, sindex) in data" :key="sindex" :label="sed" :value="sed"></el-option>
          <el-option label="+新建分类" value="new"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分类" prop="newType" v-if="isNew">
        <el-input v-model="ruleForm.newType"></el-input>
      </el-form-item>
      <el-form-item label="图片上传" prop="title">
        <el-upload
          class="upload-demo"
          ref="upload"
          drag
          :action="uploadUrl"
          :auto-upload="false"
          list-type="picture"
          :limit="1"
          :on-change="handleChange"
          :on-success="uploadSuccess">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将图片拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，一次只能上传一张</div>
        </el-upload>
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

export default {
  name: 'index',
  data () {
    let checkNewType = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('分类不能为空'))
      }
      setTimeout(() => {
        callback()
      }, 1000)
    }
    return {
      data: null,
      file: '',
      isNew: false,
      puploadUrl: 'http://www.qiangfen.com/koa/upload/img',
      uploadUrl: '',
      ruleForm: {
        type: '',
        newType: ''
      },
      rules: {
        newType: [
          { validator: checkNewType, trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请至少选择一个类型', trigger: 'change' }
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
      Http.getQfModel('imgs/getType', '', function (data) {
        console.log(data)
        _this.data = data
        // _this.total = data.count
        // _this.loading = false
      })
    },
    uploadSuccess (res, file, filelist) {
      // let _this = this
      if (res.success) {
        let param = {
          type: this.ruleForm.newType || this.ruleForm.type,
          path: res.data.pictureUrl
        }
        Http.postQfModel('imgs/add', param, function (data) {
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
            setTimeout(function () {
              window.location.reload()
            }, 200)
          } else {
            Message({
              message: '添加失败！！！',
              type: 'warning'
            })
          }
        })
      }
    },
    handleChange (file, filelist) {
      console.log(file, filelist)
    },
    showInput () {
      if (this.ruleForm.type === 'new') {
        this.isNew = true
      }
    },
    submitForm (formName) {
      let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let fileName = this.ruleForm.newType || this.ruleForm.type
          this.uploadUrl = this.puploadUrl + '?filepath=' + fileName
          console.log(this.uploadUrl)
          setTimeout(function () {
            _this.$refs.upload.submit()
          }, 50)
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
  #imageUpload{
    padding: 30px;
    .imageTitle{
      margin-bottom: 30px;
      font-size: 24px;
      color: #555;
    }
  }
</style>
