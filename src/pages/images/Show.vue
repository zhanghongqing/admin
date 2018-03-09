<template>
  <div id="showImgs">
    <div class="title">{{$route.query.type == 'all' ? '全部' : $route.query.type}}</div>
    <div class="imgList">
      <div class="imgItem" v-for="(img, index) in data" :key="index">
        <img :src="'http://www.qiangfen.com' + img.path">
        <div class="ctrl">
          <el-button type="danger" @click="checkImg(img.path)">查看</el-button>
          <el-button type="danger" @click="handleDelete(img._id, img.path)">删除</el-button>
        </div>
      </div>
    </div>
    <div class="page">
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="10"
        :total="total"
        :current-page="currentPage"
        @current-change="changePage">
      </el-pagination>
    </div>
    <div class="typeList" :class="{show: isShowPanel}">
      <div class="ctrlBtn" @click="showPanel">
        <svg class="qficon" aria-hidden="true" v-if="!isShowPanel">
          <use xlink:href="#icon-liebiao"></use>
        </svg>
        <svg class="qficon" aria-hidden="true" v-if="isShowPanel">
          <use xlink:href="#icon-guanbi"></use>
        </svg>
      </div>
      <el-menu
        class="el-menu-vertical-demo"
        :default-active="$route.path"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
        :unique-opened="true"
        router>
        <el-menu-item index="/images?type=all">全部</el-menu-item>
        <el-menu-item :index="item.router" v-for="(item, index) in navDatas" :key="index">{{item.title}}</el-menu-item>
      </el-menu>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Http from '@/utils/http.js'
import { Message, MessageBox } from 'element-ui'

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
      navData: null,
      navDatas: [],
      total: 1,
      currentPage: 1,
      isShowPanel: false,
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
  watch: {
    navData () {
      let newData = []
      this.navData.forEach(function (e, i) {
        newData.push({
          title: e,
          router: '/images?type=' + e
        })
      })
      this.navDatas = newData
    },
    $route () {
      this.init()
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
      this.isShowPanel = false
      let _this = this
      Http.postQfModel('imgs', {page: this.$route.query.page || 1, type: this.$route.query.type || 'all'}, function (data) {
        console.log(data)
        _this.data = data.data
        _this.total = data.count
        // _this.loading = false
      })
      Http.getQfModel('imgs/getType', '', function (data) {
        console.log(data)
        _this.navData = data
      })
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    handleChange (file, filelist) {
      console.log(file, filelist)
    },
    showPanel () {
      this.isShowPanel = !this.isShowPanel
    },
    checkImg (url) {
      window.open('http://www.qiangfen.com' + url)
    },
    changePage (page) {
      this.$router.push({
        path: '/images',
        query: {
          page: page,
          type: this.$route.query.type
        }
      })
    },
    handleDelete (id, path) {
      let _this = this
      MessageBox.confirm('此操作将永久删除该文章, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        Http.postQfModel('imgs/delete', {id: id, path: path}, function (data) {
          if (data.n === 1 && data.ok === 1) {
            Message({
              type: 'success',
              message: '删除成功！！！'
            })
            _this.init()
          } else {
            Message({
              type: 'info',
              message: '删除失败！！！'
            })
          }
          console.log('删除成功', data)
        }, function () {
          Message({
            type: 'info',
            message: '删除失败！！！'
          })
        })
        // Message({
        //   type: 'success',
        //   message: '删除成功!'
        // })
      }).catch(() => {
        Message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    submitForm (formName) {
      let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(_this.data)
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
  .el-main{
    overflow: hidden;
  }
  #showImgs{
    position: relative;
    width: 100%;
    height: 100%;
    .title{
      line-height: 60px;
      text-indent: 20px;
      font-size: 24px;
      color: #555;
    }
    .imgList{
      padding: 10px;
      width: 100%;
      overflow: hidden;
      .imgItem{
        width: 300px;
        height: 200px;
        background: #fff;
        float: left;
        margin: 10px;
        box-shadow: 0 0 6px rgba(0,0,0,0.1);
        overflow: hidden;
        position: relative;
        cursor: pointer;
        img{
          width: 100%;
        }
        &:hover{
          .ctrl{
            margin-left: 0;
          }
        }
        .ctrl{
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.4);
          line-height: 200px;
          text-align: center;
          position: absolute;
          top: 0;
          left: 0;
          margin-left: -300px;
          transition: all .3s ease;
        }
      }
    }
    .page{
      padding: 20px 0;
      text-align: center;
    }
    .typeList{
      width: 200px;
      height: 100%;
      background: #545c64;
      position: absolute;
      top: 0;
      right: 0;
      transition: all .3s ease;
      margin-right: -200px;
      &.show{
        margin-right: 0;
      }
      .ctrlBtn{
        width: 30px;
        height: 30px;
        position: absolute;
        right: 100%;
        top: 0;
        margin-right: 10px;
        margin-top: 10px;
        cursor: pointer;
        .qficon{
          width: 30px;
          height: 30px;
        }
      }
    }
  }
</style>
