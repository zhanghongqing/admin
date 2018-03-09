<template>
  <div id="book">
    <div class="slider">
      <el-carousel :interval="4000" type="card" height="200px">
        <el-carousel-item v-for="(item, index) in data" :key="index">
          <img :src="item.imgUrl" style="width: 100%;">
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="chooseImgContainer" v-if="isShowChoose">
      <div class="chooseTitle">选择图片</div>
      <div class="tabs">
        <el-tabs v-model="curType" @tab-click="handleClick">
          <el-tab-pane label='全部' name="all">全部</el-tab-pane>
          <el-tab-pane v-for="(type, tindex) in types" :key="tindex" :label="type" :name="type">
            {{type}}
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="imglist"> 
        <div class="imgitem" v-for="(img, index) in imgData" :key="index" @click="confirmImg(img)">
          <img :src="'http://www.qiangfen.com' + img.path">
        </div>
      </div>
      <div class="page">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="10"
          :total="imgTotal"
          :current-page="currentPage"
          @current-change="changePage">
        </el-pagination>
      </div>
    </div>
    <div class="btns">
      <el-button @click="changeAddState">添加book</el-button>
      <el-button @click="updateBanner">修改</el-button>
      <el-button @click="changSortState" v-if="!isShowSort">调整顺序</el-button>
      <el-button type="danger" @click="sortConfirm" v-if="isShowSort">确认顺序</el-button>
      <el-button type="danger" @click="sortCancel" v-if="isShowSort">取消排序</el-button>
    </div>
    <div class="addForm" v-if="isShowAddForm">
      <div class="title">添加book</div>
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="70px" class="ruleForm">
        <el-form-item label="选择图片" prop="imgUrl">
          <el-input class="chooseImg" v-model="ruleForm.imgUrl" disabled></el-input><el-button @click="chooseImg">选择图片</el-button>
          <div class="showImg">
            <img :src="ruleForm.imgUrl">
          </div>
        </el-form-item>
        <el-form-item label="跳转地址" prop="toUrl">
          <el-input v-model="ruleForm.toUrl"></el-input>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="sortContainer" v-if="isShowSort">
      <div class="sortItem" v-for="(item, index) in data" :key="index">
        <div class="title">{{item.title}}</div>
        <div class="index" contenteditable="true" :seqid="item._id" ref="seq">{{item.bIndex}}</div>
      </div>
    </div>
    <div class="updeteBanner" v-if="isShowChangeTable">
      <el-table
        :data="data"
        border
        style="width: 100%">
        <el-table-column
          fixed
          label="图片"
          width="300">
          <template slot-scope="scope">
            <img :src="scope.row.imgUrl" style="width: 100%;">
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
          width="180">
        </el-table-column>
        <el-table-column
          prop="bIndex"
          label="序号"
          width="60">
        </el-table-column>
        <el-table-column
          prop="toUrl"
          label="跳转地址">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="100">
          <template slot-scope="scope">
            <el-button type="text" @click="handleUpdate(scope.row)" size="small">修改</el-button>
            <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="changeForm" v-if="isShowChangeForm">
      <div class="title">修改book</div>
      <el-form :model="changeForm" status-icon :rules="rules" ref="changeForm" label-width="70px" class="changeForm">
        <el-form-item label="id" prop="id">
          <el-input v-model="changeForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="选择图片" prop="imgUrl">
          <el-input class="chooseImg" v-model="changeForm.imgUrl" disabled></el-input><el-button @click="chooseImg">选择图片</el-button>
          <div class="showImg">
            <img :src="changeForm.imgUrl">
          </div>
        </el-form-item>
        <el-form-item label="跳转地址" prop="toUrl">
          <el-input v-model="changeForm.toUrl"></el-input>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="changeForm.title"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm1('changeForm')">提交</el-button>
          <el-button @click="resetForm('changeForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Http from '@/utils/http.js'
import { Message, MessageBox, Notification } from 'element-ui'

export default {
  name: 'index',
  data () {
    let checkImgUrl = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('图片地址不能为空'))
      }
      setTimeout(() => {
        callback()
      }, 1000)
    }
    let checkToUrl = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('跳转地址不能为空'))
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
      isShowChoose: false,
      types: [],
      imgData: null,
      imgTotal: 0,
      curType: 'all',
      data: null,
      loading: true,
      currentChildren: [],
      total: 0,
      isShowAddForm: false,
      isShowChangeForm: false,
      isShowSort: false,
      isShowChangeTable: true,
      ruleForm: {
        imgUrl: '',
        toUrl: '',
        title: ''
      },
      changeForm: {
        imgUrl: '',
        toUrl: '',
        title: ''
      },
      rules: {
        imgUrl: [
          { validator: checkImgUrl, trigger: 'blur' }
        ],
        toUrl: [
          { validator: checkToUrl, trigger: 'blur' }
        ],
        title: [
          { validator: checkTitle, trigger: 'blur' }
        ]
      },
      changeRules: {
        imgUrl: [
          { validator: checkImgUrl, trigger: 'blur' }
        ],
        toUrl: [
          { validator: checkToUrl, trigger: 'blur' }
        ],
        title: [
          { validator: checkTitle, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      httpState: 'Http'
    }),
    currentPage () {
      return Number(this.$route.query.page) || 1
    }
  },
  watch: {
    $route () {
      this.init()
    }
  },
  methods: {
    ...mapActions('Http', ['changeIndexData']),
    init () {
      let _this = this
      Http.getQfModel('indexs/book', '', function (data) {
        _this.data = data.data
        _this.total = data.count
      })
    },
    loadChooseImg (page, type) {
      let _this = this
      Http.postQfModel('imgs', {page: page, type: type}, function (data) {
        _this.imgData = data.data
        _this.imgTotal = data.count
        // _this.loading = false
      })
    },
    loadType () {
      let _this = this
      Http.getQfModel('imgs/getType', '', function (data) {
        _this.types = data
      })
    },
    changeAddState () {
      this.isShowAddForm = true
      this.isShowChangeTable = false
      this.isShowSort = false
      this.isShowChangeForm = false
    },
    updateBanner () {
      this.isShowChangeTable = true
      this.isShowAddForm = false
      this.isShowSort = false
      this.isShowChangeForm = false
    },
    changSortState () {
      this.isShowSort = true
      this.isShowAddForm = false
      this.isShowChangeTable = false
      this.isShowChangeForm = false
    },
    handleUpdate (row) {
      this.changeForm.imgUrl = row.imgUrl
      this.changeForm.title = row.title
      this.changeForm.toUrl = row.toUrl
      this.changeForm.id = row._id
      this.isShowChangeForm = true
      this.isShowSort = false
      this.isShowAddForm = false
      this.isShowChangeTable = false
    },
    chooseImg () {
      this.isShowChoose = true
      this.loadType()
      this.loadChooseImg(1, 'all')
    },
    confirmImg (img) {
      this.ruleForm.imgUrl = 'http://www.qiangfen.com' + img.path
      this.changeForm.imgUrl = 'http://www.qiangfen.com' + img.path
      this.isShowChoose = false
    },
    handleClick (tab, event) {
      this.loadChooseImg(1, this.curType)
    },
    changePage (page) {
      this.loadChooseImg(page, this.curType)
    },
    sortConfirm () {
      let indexs = []
      let _this = this
      this.$refs.seq.forEach(function (e, i) {
        indexs.push({
          index: Number(e.innerText),
          id: e.attributes.seqid.nodeValue
        })
      })
      indexs = indexs.sort(function (a, b) {
        return a.index - b.index
      })
      if (indexs[0].index !== 1) {
        Notification.error({
          title: '无法提交',
          message: '请确认最小值为1'
        })
        return
      }
      if (indexs.length !== this.total) {
        Notification.error({
          title: '无法提交',
          message: '请确认数字顺序为1-' + this.total
        })
        return
      }
      if (indexs[indexs.length - 1].index !== this.total) {
        Notification.error({
          title: '无法提交',
          message: '请确认数字顺序为1-' + this.total
        })
        return
      }
      let isNum = true
      indexs.forEach(function (e, i) {
        if (e.index !== i + 1) {
          isNum = false
        }
      })
      if (!isNum) {
        Notification.error({
          title: '无法提交',
          message: '请确认数字为连续的1-' + this.total
        })
        return
      }
      indexs.forEach(function (e, i) {
        Http.postQfModel('indexs/book/update?id=' + e.id, {bIndex: e.index}, function (data) {
          if (data === 0) {
            return
          }
          if (data.nModified === 1) {
            _this.init()
          } else {
          }
        })
      })
      this.isShowSort = false
    },
    sortCancel () {
      this.isShowSort = false
    },
    handleDelete (row) {
      let _this = this
      MessageBox.confirm('此操作将删除该选项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        Http.postQfModel('indexs/book/delete', {id: row._id}, function (data) {
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
      }).catch((error) => {
        console.log(error)
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
          let param = Object.assign({}, this.ruleForm, {bIndex: this.total + 1})
          Http.postQfModel('indexs/book/add', param, function (data) {
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
              _this.resetForm('ruleForm')
              _this.isShowAddForm = false
              _this.init()
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
    submitForm1 (formName) {
      let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let param = {
            imgUrl: this.changeForm.imgUrl,
            toUrl: this.changeForm.toUrl,
            title: this.changeForm.title
          }
          Http.postQfModel('indexs/book/update?id=' + this.changeForm.id, param, function (data) {
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
              _this.resetForm('changeForm')
              _this.isShowChangeForm = false
              _this.isShowChangeTable = true
              _this.init()
            } else {
              Message({
                message: '修改失败！！！',
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
  #book{
    padding-bottom: 50px;
    .slider{
      width: 600px;
      margin: 20px auto;
    }
    .addForm{
      padding: 20px;
      .title{
        line-height: 40px;
        margin-bottom: 10px;
        font-size: 18px;
        color: #666;
      }
      .chooseImg{
        width: calc(100% - 120px);
        margin-right: 20px;
      }
    }
    .changeForm{
      padding: 20px;
      .title{
        line-height: 40px;
        margin-bottom: 10px;
        font-size: 18px;
        color: #666;
      }
      .chooseImg{
        width: calc(100% - 120px);
        margin-right: 20px;
      }
    }
    .showImg{
      width: 400px;
      overflow: hidden;
      img{
        width: 100%;
        float: left;
        margin-top: 20px;
      }
    }
    .btns{
      padding: 20px;
    }
    .sortContainer{
      padding: 20px;
      .sortItem{
        overflow: hidden;
        line-height: 30px;
        .title{
          float: left;
          padding: 0 20px;
        }
        .index{
          float: left;
          padding: 0 20px;
        }
      }
    }
    .updeteBanner{
      padding: 20px;
    }
    .chooseImgContainer{
      width: 100vw;
      height: 100vh;
      background: #fff;
      overflow: auto;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 99999;
      .chooseTitle{
        line-height: 60px;
        text-indent: 20px;
        font-size: 20px;
      }
      .tabs{
        padding: 20px;
      }
      .chooseType{
        padding-left: 20px;
        .typeItem{
          float: left;
          padding: 4px 10px;
          border: 1px solid #999;
          color: #666;
          margin-right: 10px;
        }
      }
      .imglist{
        width: 100%;
        overflow: hidden;
        .imgitem{
          width: 300px;
          height: 200px;
          float: left;
          margin: 20px;
          transition: all .3s ease;
          box-shadow: 0 0 6px rgba(0,0,0,0.2);
          &:hover{
            cursor: pointer;
            box-shadow: 0 0 14px rgba(0,0,0,0.4);
          }
          img{
            width: 100%;
          }
        }
      }
      .page{
        padding: 20px 0;
        text-align: center;
      }
    }

    .el-carousel__item h3 {
      color: #475669;
      font-size: 14px;
      opacity: 0.75;
      line-height: 200px;
      margin: 0;
    }
    
    .el-carousel__item:nth-child(2n) {
      background-color: #99a9bf;
    }
    
    .el-carousel__item:nth-child(2n+1) {
      background-color: #d3dce6;
    }
  }
</style>
