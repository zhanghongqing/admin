<template>
  <div id="asideNav">
    <!-- <el-menu
      :default-active="$route.path"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      router >
      <el-menu-item index="/">首页</el-menu-item>
      <el-submenu index="/list">
        <template slot="title">课程</template>
        <el-menu-item v-for="(item, index) in httpState.indexData.category" :index="item.detail_url" :key="index">{{item.name}}</el-menu-item>
      </el-submenu>
    </el-menu> -->
    <el-radio-group v-model="isCollapse">
      <el-radio-button id="toggleNavWd" :label="!isCollapse">{{isCollapse ? "展开" : "收起"}}</el-radio-button>
    </el-radio-group>
    <el-menu
      id="navMenu"
      :default-active="$route.path"
      class="el-menu-vertical-demo"
      :class="{isShow: !isCollapse}"
      :collapse="isCollapse"
      :unique-opened="true"
      router>
      <el-submenu :index="item1.router" v-for="(item1, index1) in navData" :key="index1">
        <template slot="title">
          <svg class="qficon" aria-hidden="true">
            <use :xlink:href="item1.icon"></use>
          </svg>
          <span slot="title">{{item1.title}}</span>
        </template>
        <el-menu-item :index="item2.router" v-for="(item2, index2) in item1.sub" :key="index2" v-if="!item2.handles">{{item2.name}}</el-menu-item>
        <el-submenu :index="item2.router" v-for="(item2, index2) in item1.sub" :key="index2" v-if="!!item2.handles">
          <span slot="title">{{item2.name}}</span>
          <el-menu-item :index="item3.router" v-for="(item3, index3) in item2.handles" :key="index3">{{item3.title}}</el-menu-item>
        </el-submenu>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
// import Http from '@/utils/http.js'
import navDatas from '@/utils/navData.js'

export default {
  name: 'AsideNav',
  data () {
    return {
      isCollapse: false,
      navData: navDatas.data
    }
  },
  computed: {
    ...mapState({
      httpState: 'Http',
      appState: 'AppState'
    })
  },
  methods: {
    ...mapActions('Http', ['changeToken', 'changeIndexData']),
    ...mapActions('AppState', ['changeNav']),
    init () {
      this.changeNav({navState: this.isCollapse})
    },
    handleSelect (key, keyPath) {
    }
    // handleOpen (key, keyPath) {
    //   console.log(key, keyPath)
    // },
    // handleClose (key, keyPath) {
    //   console.log(key, keyPath)
    // }
  },
  watch: {
    isCollapse () {
      this.changeNav({navState: this.isCollapse})
    }
  },
  mounted () {
    console.log(this)
    this.init()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  .el-radio-group{
    width: 100%;
    .el-radio-button{
      width: 100%;
      .el-radio-button__inner{
        width: 100%;
        border-color: #f6f6f6;
      }
    }
  }
  #asideNav{
    width: 100%;
    height: 100%;
    #navMenu{
      height: calc(100% - 40px);
      &.isShow{
        overflow-y: auto;
      }
    }
    .el-submenu__title{
      .qficon{
        width: 30px;
        height: 30px;
        vertical-align: middle;
      }
      span{
        vertical-align: middle;
      }
    }
  }
</style>
