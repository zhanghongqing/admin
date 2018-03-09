<template>
  <div id="editDetail">
    <div class="title" v-for="(item, key) in data" :key="key">{{item.name}}</div>
    <div class="handlesList">
      <div class="handleItem" v-for="(item, key) in listData" :key="key">
        <div class="show">
          <div class="left">
            <el-button @click="showData(item.name, item.data, item.type)">查看</el-button>
          </div>
          <div class="right">
            <el-button @click="update(item.key)">修改</el-button>
          </div>
          <div class="name">{{item.name}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Http from '@/utils/http.js'
import { Notification, MessageBox } from 'element-ui'

export default {
  name: 'editor',
  data () {
    return {
      data: null,
      listData: []
    }
  },
  computed: {
    ...mapState({
      httpState: 'Http'
    })
  },
  methods: {
    ...mapActions('Http', ['changeDetailData', 'changeDetailAlert']),
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
        _this.listData = [{
          name: '课程名称',
          data: data.data[0].name,
          type: 'text',
          key: 'name'
        }, {
          name: '课程图片',
          data: data.data[0].image_url,
          type: 'img',
          key: 'image_url'
        }, {
          name: '课程详情',
          data: data.data[0].desc,
          type: 'pretext',
          key: 'desc'
        }, {
          name: '课程价格',
          data: data.data[0].current_price,
          type: 'text',
          key: 'current_price'
        }, {
          name: '课程标签',
          data: data.data[0].tags,
          type: 'taglist',
          key: 'tags'
        }, {
          name: '主讲教师',
          data: data.data[0].authors,
          type: 'teacherlist',
          key: 'authors'
        }, {
          name: '课程讲义',
          data: data.data[0].materials,
          type: 'materials',
          key: 'materials'
        }, {
          name: '课程视频',
          data: data.data[0].video_info,
          type: 'videos',
          key: 'video_info'
        }, {
          name: '套餐课程管理',
          data: data.data[0].sub_courses,
          type: 'package',
          key: 'sub_courses'
        }]
      }, function (error) {
        console.log(error)
      })
    },
    update (key) {
      if (key === 'sub_courses' && this.data[0].type !== 'package') {
        Notification({
          title: '提示',
          message: '非套餐不能修改此项！！',
          type: 'warning'
        })
        return
      }
      if (key === 'tags' || key === 'authors') {
        Notification({
          title: '提示',
          message: '现在还不能修改此项！！',
          type: 'warning'
        })
        return
      }
      if (key === 'sub_courses') {
        this.$router.push({
          path: '/course/package',
          query: {
            id: this.$route.query.id
          }
        })
        return
      }
      if (key === 'materials') {
        if (this.data[0].type === 'package') {
          Notification({
            title: '提示',
            message: '套餐不能修改此项！！',
            type: 'warning'
          })
          return
        }
        this.$router.push({
          path: '/course/material',
          query: {
            id: this.$route.query.id
          }
        })
        return
      }
      if (key === 'video_info') {
        if (this.data[0].type === 'package') {
          Notification({
            title: '提示',
            message: '套餐不能修改此项！！',
            type: 'warning'
          })
          return
        }
        this.$router.push({
          path: '/course/video',
          query: {
            id: this.$route.query.id
          }
        })
        return
      }
      this.$router.push({
        path: '/course/update',
        query: {
          id: this.$route.query.id,
          key: key
        }
      })
    },
    showData (title, data, type) {
      let content
      switch (type) {
        case 'text':
          content = `<h3 style="line-height: 60px;text-align: center;font-size: 18px;">${data}</h3>`
          break
        case 'pretext':
          content = `<pre style="white-space: pre-wrap;">${data}</pre>`
          break
        case 'img':
          content = `<img src="${data}" style="width: 100%;">`
          break
        case 'taglist':
          content = ''
          data.forEach(function (e, i) {
            content += `<div style="border: 1px solid #eee;background: #f9f9f9;color: #444;padding: 6px 10px;border-radius: 5px;float: left;margin: 10px;">${e.name}</div>`
          })
          break
        case 'teacherlist':
          content = ''
          data.forEach(function (e, i) {
            content += `<div style="overflow: hidden;">
              <div style="width: 100px;float: left;">
                <div style="width: 100%;">
                  <img style="width: 100%;" src="${e.image_url}">
                </div>
                <div style="width: 100%;line-height: 60px;text-align: center;font-size: 20px;">${e.name}</div>
              </div>
              <div style="width: calc(100% - 100px);float: left;padding-left: 10px;padding-bottom: 10px;box-sizing: border-box;">${e.desc}</div>
            </div>`
          })
          break
        default:
          content = data
          break
      }
      MessageBox.alert(content, title, {
        dangerouslyUseHTMLString: true
      })
    },
    formatTime (row) {
      return new Date(row.create_time).toLocaleString()
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
  .el-message-box{
    width: 500px;
    .el-message-box__content{
      max-height: 80vh;
      overflow: auto;
    }
  }
  #editDetail{
    .title{
      width: 100%;
      height: 100px;
      line-height: 100px;
      text-align: center;
      font-size: 24px;
      font-weight: bold;
      color: #fff;
      text-shadow: 0 2px 5px rgba(0,0,0,0.9);
    }
    .handlesList{
      width: 100%;
      .handleItem{
        width: 25%;
        height: 200px;
        float: left;
        .show{
          .name{
            line-height: 180px;
            text-align: center;
            font-size: 36px;
            font-weight: bold;
            font-family: "楷体";
          }
          width: calc(100% - 20px);
          margin: 10px;
          margin-bottom: 0;
          height: 180px;
          text-align: center;
          position: relative;
          background: #fafafa;
          transition: all ease .3s;
          overflow: hidden;
          &:hover{
            box-shadow: 0 0 6px 0px rgba(0,0,0,0.1);
            .left{
              margin: 0;
            }
            .right{
              margin: 0;
            }
          }
          .left{
            width: 50%;
            height: 100%;
            background: rgba(0,0,0,0.3);
            position: absolute;
            left: 0;
            top: 0;
            line-height: 180px;
            margin-left: -50%;
            transition: all ease .3s;
          }
          .right{
            width: 50%;
            height: 100%;
            background: rgba(0,0,0,0.3);
            position: absolute;
            right: 0;
            top: 0;
            line-height: 180px;
            margin-right: -50%;
            transition: all ease .3s;
          }
        }
      }
    }
  }
</style>
