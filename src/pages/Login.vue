<template>
  <div id="login">
    <div class="loginBox">
      <div class="title">登录</div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" :status-icon="true" class="demo-ruleForm">
        <el-form-item class="formItem" label="帐号" prop="userName">
          <el-input
            placeholder="请输入帐号"
            v-model="ruleForm.userName"
            clearable>
          </el-input>
        </el-form-item>
        <el-form-item class="formItem" label="密码" prop="passWord">
          <el-input
            type="password"
            placeholder="请输入密码"
            v-model="ruleForm.passWord"
            clearable>
          </el-input>
        </el-form-item>
        <div class="loginBtns">
          <el-button class="btn" type="info" icon="el-icon-search" round size="medium" @click="submitForm('ruleForm')">登录</el-button>
          <el-button class="btn" type="info" icon="el-icon-search" round size="medium" @click="resetForm('ruleForm')">重置</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Http from '@/utils/http.js'
import { Message, MessageBox } from 'element-ui'
import md5 from 'js-md5'

export default {
  name: 'login',
  data () {
    return {
      ruleForm: {
        userName: '',
        passWord: ''
      },
      rules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        passWord: [
          { required: true, message: '请输入密码', trigger: 'blur' }
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
      console.log('登录')
    },
    login () {
      let _this = this
      console.log(this.ruleForm.userName, this.ruleForm.passWord)
      Http.postQfModel('adminUser', {
        username: this.ruleForm.userName,
        password: md5(this.ruleForm.passWord)
      }, function (data) {
        console.log(data)
        if (data.status === 0) {
          MessageBox.alert('用户名错误，请确认用户名', '提示', {
            confirmButtonText: '确定'
          })
        } else if (data.status === 1) {
          MessageBox.alert('密码错误，请确认密码', '提示', {
            confirmButtonText: '确定'
          })
        } else if (data.status === 2) {
          Message({
            message: '登录成功！',
            type: 'success'
          })
          setTimeout(function () {
            console.log(123)
            Http.delCookie('username')
            Http.delCookie('password')
            Http.SetCookie('username', _this.ruleForm.userName)
            Http.SetCookie('password', md5(_this.ruleForm.passWord))
            _this.toHomePage()
          }, 500)
        }
      }, function (error) {
        Message({
          message: '用户名或密码错误，请重新输入！',
          type: 'warning'
        })
        console.log('错误是', error)
      })
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.login()
          console.log()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    toHomePage () {
      this.$router.push({path: '/'})
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
  #login{
    width: 100vw;
    height: 100vh;
    background: #fff;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2000;
    .loginBox{
      width: 400px;
      height: 300px;
      background: #ddd;
      margin: 100px auto;
      .title{
        width: 100%;
        height: 100px;
        font-size: 24px;
        line-height: 100px;
        font-weight: bold;
        text-align: center;
      }
      .formItem{
        padding: 0 40px 0 0;
      }
      .loginBtns{
        text-align: center;
        .btn{
          margin: 10px 5px 40px;
        }
      }
    }
  }
</style>
