<template>
  <div id="menu">
    <div class="showMenu" v-if="isShowTable">
      <el-table
        :data="menuData"
        v-loading="loading"
        border
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table
              :data="props.row.subList"
              style="width: 100%">
              <el-table-column
                label="名称"
                width="180">
                <template slot-scope="scope">
                  {{ scope.row.subName }}
                  <!-- <el-popover trigger="hover" placement="top">
                    <p>姓名: {{ scope.row.name }}</p>
                    <p>住址: {{ scope.row.address }}</p>
                    <div slot="reference" class="name-wrapper">
                      <el-tag size="medium">{{ scope.row.name }}</el-tag>
                    </div>
                  </el-popover> -->
                </template>
              </el-table-column>
              <el-table-column
                label="跳转地址">
                <template slot-scope="scope">
                  <i class="el-icon-time"></i>
                  <span style="margin-left: 10px">{{ scope.row.toUrl }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="handleEdit(scope.$index, scope.row, props.row)">编辑</el-button>
                  <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete1(scope.$index, scope.row, props)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column
          prop="icon"
          label="图标"
          width="60">
          <template slot-scope="scope">
            <svg class="qficon" aria-hidden="true">
              <use :xlink:href="scope.row.icon"></use>
            </svg>
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="名称">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="时间"
          :formatter="formatTime">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="180">
          <template slot-scope="scope">
            <el-button type="text" @click="addChild(scope.row)" size="small">添加子菜单</el-button>
            <el-button type="text" @click="handleUpdate(scope.row)" size="small">修改</el-button>
            <el-button @click="handleDelete(scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="btns">
        <el-button @click="showAddForm">添加菜单项</el-button>
        <el-button @click="changSortState" v-if="!isShowSort">调整顺序</el-button>
        <el-button @click="sres">查看效果</el-button>
      </div>
    </div>
    <MenuAdd v-if="isShowAddForm"/>
    <MenuUpdate :data="updateData" v-if="isShowUpdateForm"/>
    <MenuAddChild :data="updateData" v-if="isShowAddChildForm" />
    <MenuUpdateChild :data="updateData" :index="curIndex" :curData="cData" v-if="isShowUpdateChildForm" />
    <div class="sortContainer" v-if="isShowSort">
      <div class="sortItem" v-for="(item, index) in menuData" :key="index">
        <div class="title">{{item.title}}</div>
        <div class="index" contenteditable="true" :seqid="item._id" ref="seq">{{item.mIndex}}</div>
      </div>
      <el-button type="danger" @click="sortConfirm" v-if="isShowSort">确认顺序</el-button>
      <el-button type="danger" @click="sortCancel" v-if="isShowSort">取消排序</el-button>
    </div>
    <div class="showRes" v-if="isShowRes">
      <el-button class="back" @click="closeback">返回</el-button>
      <div id="banner">
        <div class="bannerNav">
          <div class="bnItem" v-for="(menu, mIndex) in menuData" :key="mIndex">
            <div class="name">
              <svg class="QFicon" aria-hidden="true">
                <use :xlink:href="menu.icon"></use>
              </svg>
              <span>{{menu.title}}</span>
            </div>
            <div class="arrow">
              <svg class="QFicon" aria-hidden="true">
                <use xlink:href="#icon-jiantouyou"></use>
              </svg>
            </div>
            <div class="smalls">
              <div v-for="(small, sIndex) in menu.smallTitle">{{small}}</div>
            </div>
            <div class="panel">
              <div class="panelItem">
                <div class="hd">{{menu.title}}</div>
                <div class="bod">
                  <div class="courseList">
                    <div class="listItem" v-for="(item, index) in menu.subList" :key="index">
                      <a :href="item.toUrl" target="_blank">{{item.subName}}</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Http from '@/utils/http.js'
import { Message, MessageBox, Notification } from 'element-ui'
import MenuAdd from './subPages/MenuAdd'
import MenuAddChild from './subPages/MenuAddChild'
import MenuUpdate from './subPages/MenuUpdate'
import MenuUpdateChild from './subPages/MenuUpdateChild'

export default {
  name: 'index',
  components: {
    MenuAdd,
    MenuUpdate,
    MenuAddChild,
    MenuUpdateChild
  },
  data () {
    return {
      menuData: null,
      loading: false,
      data: null,
      total: 0,
      isShowAddForm: false,
      isShowUpdateForm: false,
      isShowAddChildForm: false,
      isShowUpdateChildForm: false,
      isShowSort: false,
      isShowTable: true,
      curIndex: 0,
      updateData: null,
      cData: null,
      isShowRes: false
    }
  },
  methods: {
    init () {
      let _this = this
      Http.getQfModel('indexs/menu', '', function (data) {
        console.log(data)
        _this.menuData = data.data
        _this.total = data.count
      })
    },
    sres () {
      this.isShowRes = true
    },
    changSortState () {
      this.changeState()
      this.isShowSort = true
    },
    showAddForm () {
      this.changeState()
      this.isShowAddForm = true
    },
    handleUpdate (row) {
      this.updateData = row
      this.changeState()
      this.isShowUpdateForm = true
    },
    addChild (row) {
      this.updateData = row
      this.changeState()
      this.isShowAddChildForm = true
    },
    handleEdit (i, r, p) {
      this.curIndex = i
      this.updateData = p
      this.cData = r
      this.changeState()
      this.isShowUpdateChildForm = true
    },
    changeState () {
      this.isShowAddForm = false
      this.isShowUpdateForm = false
      this.isShowTable = false
      this.isShowAddChildForm = false
      this.isShowUpdateChildForm = false
      this.isShowSort = false
    },
    closeback () {
      this.isShowRes = false
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
        Http.postQfModel('indexs/menu/update?id=' + e.id, {mIndex: e.index}, function (data) {
          if (data === 0) {
            return
          }
          if (data.nModified === 1) {
            _this.init()
          } else {
          }
        })
      })
      this.changeState()
      this.isShowTable = true
    },
    sortCancel () {
      this.changeState()
      this.isShowTable = true
    },
    formatTime (row) {
      return new Date(row.createTime).toLocaleString()
    },
    handleDelete (row) {
      let _this = this
      MessageBox.confirm('此操作将删除该选项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        Http.postQfModel('indexs/menu/delete', {id: row._id}, function (data) {
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
    handleDelete1 (i, r, p) {
      let _this = this
      MessageBox.confirm('此操作将删除该选项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        console.log(i, r, p)
        let pa = [...p.row.subList]
        pa.splice(i, 1)
        Http.postQfModel(`indexs/menu/update?id=${p.row._id}`, {subList: pa}, function (data) {
          if (data === 0) {
            Message({
              message: '删除失败！！！',
              type: 'warning'
            })
            return
          }
          if (data.nModified === 1) {
            Message({
              message: '删除成功！！！',
              type: 'success'
            })
            _this.init()
          } else {
            Message({
              message: '删除失败！！！',
              type: 'warning'
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
    #menu{
      #banner{
        width: 220px;
        height: 420px;
        box-shadow: 0 0 10px rgba(0,0,0,0.2);
        position: absolute;
        top: 60px;
        left: 20px;
      }
      #banner .bannerNav{
        width: 220px;
        height: 100%;
        background: #fff;
      }
      #banner .bannerNav .bnItem{
        width: 100%;
        border-bottom: 1px solid #eee;
        position: relative;
      }
      #banner .bannerNav .bnItem:hover{
        background: #eee;
      }
      #banner .bannerNav .bnItem:hover span{
        color: #e75151;
      }
      #banner .bannerNav .bnItem:hover .QFicon{
        color: #e75151;
      }
      #banner .bannerNav .bnItem:hover .panel{
        color: #e75151;
        display: block;
      }
      #banner .bannerNav .name{
        display: inline-block;
        font-size: 14px;
        line-height: 40px;
      }
      #banner .bannerNav .name span{
        vertical-align: middle;
        margin-left: 6px;
        color: #666;
      }
      #banner .bannerNav .name .QFicon{
        width: 24px;
        height: 24px;
        vertical-align: middle;
        margin-left: 10px;
      }
      #banner .bannerNav .arrow{
        float: right;
        line-height: 40px;
        margin-right: 6px;
      }
      #banner .bannerNav .smalls{
        overflow: hidden;
        color: #999;
        line-height: 20px;
        font-size: 12px;
      }
      #banner .bannerNav .smalls div{
        display: inline-block;
        margin-left: 10px;
        margin-bottom: 6px;
      }
      #banner .bannerNav .arrow .QFicon{
        width: 16px;
        height: 16px;
        vertical-align: middle;
      }
      #banner .bannerNav .panel{
        width: 600px;
        background: #fff;
        position: absolute;
        left: 100%;
        top: 0;
        padding: 20px;
        box-sizing: border-box;
        box-shadow:  0 0 10px rgba(0,0,0,0.1);
        display: none;
      }
      #banner .bannerNav .panel .panelItem{
        width: 100%;
      }
      #banner .bannerNav .panel .panelItem .hd{
        width: 100%;
        line-height: 40px;
        font-size: 14px;
        color: #777;
      }
      #banner .bannerNav .panel .panelItem .bod{
        width: 100%;
      }
      #banner .bannerNav .panel .panelItem .bod .courseList{
        width: 100%;
      }
      #banner .bannerNav .panel .panelItem .bod .courseList .listItem{
        display: inline-block;
        margin-left: 10px;
        line-height: 30px;
        font-size: 12px;
        color: #999;
      }
      #banner .bannerNav .panel .panelItem .bod .courseList .listItem a{
        color: #999;
        text-decoration: none;
      }
      #banner .bannerNav .panel .panelItem .bod .courseList .listItem a:hover{
        color: #e75151;
      }
    .qficon{
      width: 30px;
      height: 30px;
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
    .showRes{
      width: 100vw;
      height: 100vh;
      background: #fff;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 9999;
      .back{
        margin: 10px 0 0 20px;
      }
    }
  }
</style>
