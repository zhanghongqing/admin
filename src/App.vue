<template>
  <div id="app">
    <el-container>
      <el-header class="qfheader" height="60px">
        <div class="logo">
          <img src="http://www.qiangfen.com/static/img/logo.png">
        </div>
        <div class="title" @click="toHome">抢分后台管理</div>
        <div class="user">
          <el-dropdown>
            <span class="el-dropdown-link">
              {{userName}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click="test"><router-link to='/login' class="tologin">重新登录</router-link></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-container class="body">
        <el-aside :width="navWidth">
          <AsideNav />
        </el-aside>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Http from '@/utils/http.js'
import { Message } from 'element-ui'
import AsideNav from './components/AsideNav'
// import QFheader from '@/components/QFheader'

export default {
  name: 'app',
  components: {
    AsideNav
  },
  computed: {
    ...mapState({
      httpState: 'Http',
      appState: 'AppState'
    }),
    navWidth () {
      return this.appState.navIsCol ? '65px' : '300px'
    },
    userName () {
      return Http.GetCookie('username')
    }
  },
  methods: {
    test () {
      console.log(123)
    },
    init () {
      this.getToken()
    },
    ...mapActions('Http', ['changeToken']),
    getToken () {
      let _this = this
      Http.getToken(this.httpState, function (data) {
        _this.changeToken({token: 'Bearer ' + data.access_token})
        setTimeout(function () {
          _this.getToken()
        }, (data.expires_in - 100) * 1000)
      }, function (error) {
        Message({
          message: '获取token失败',
          type: 'warning'
        })
        console.log(error)
      })
    },
    toHome () {
      this.$router.push({path: '/'})
    }
  },
  mounted () {
    console.log(this)
    this.init()
  }
}
</script>

<style lang="scss">
.tologin{
  color: #666;
  text-decoration: none;
}
.qficon {
   width: 1em; height: 1em;
   vertical-align: -0.15em;
   fill: currentColor;
   overflow: hidden;
}
*{
  margin: 0;
  padding: 0;
}
#app {
  font-family: '微软雅黑','Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333;
  .body{
    height: calc(100vh - 60px);
  }
  .el-header, .el-footer {
    background-color: #f4f4f4;
  }
  .el-aside {
    background-color: #fcfcfc;
    overflow: visible;
    position: relative;
  }
  .el-main {
    color: #333;
    padding: 0;
    position: relative;
    box-shadow: 6px 0 6px -6px rgba(0,0,0,0.2) inset;
  }
  .qfheader{
    background: #f4f4f4;
    padding: 0;
    line-height: 60px;
    text-align: center;
    .logo{
      width: 60px;
      height: 100%;
      float: left;
      background: #fff;
      overflow: hidden;
      img{
        height: 34px;
        margin-top: 13px;
        margin-left: 3px;
      }
    }
    .title{
      width: 240px;
      height: 100%;
      float: left;
      font-size: 20px;
      font-weight: bold;
      border-right: 1px solid #aaa;
      cursor: pointer;
    }
    .user{
      float: right;
      margin-right: 40px;
    }
  }
}
</style>
