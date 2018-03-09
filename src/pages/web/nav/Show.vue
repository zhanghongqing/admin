<template>
  <div id="navShow">
    <div class="navs">
      <div :class="{hnavItem: true, allnone: allnonebool}" v-for="(nav, nIndex) in data" :key="nIndex">
        <div class="name">{{nav.content[0]}}</div>
        <div class="en">{{nav.content[1]}}</div>
        <div class="bg"></div>
        <div :class="{seq: true, up: isUp}" v-if="seqShow" ref="seqs" :seqid="nav._id" :contenteditable="isUp">{{nav.nIndex}}</div>
        <div class="ctrl">
          <div class="cbtn" @click="changeNav(nav)">修改</div>
          <div class="cbtn" @click="handleDelete(nav._id)">删除</div>
        </div>
        <div class="subList" v-if="nav.isDrop">
          <div class="listItem" v-for="(item, iIndex) in nav.children" :key="iIndex">
            <a href="javascript:;">{{item.title}}</a>
            <div class="ctrlBtn delete" @click="handleDelete1(nav._id, item._id)">删除</div>
            <div class="ctrlBtn update" @click="updateChildrenItem(nav._id, item, nav)">修改</div>
          </div>
          <div class="listItem">
            <div class="addItem" @click="addNavItem(nav)">
              <svg class="qficon" aria-hidden="true">
                <use xlink:href="#icon-plus"></use>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="seqContent"></div>
    <div class="controlBtns">
      <el-button @click="showAdd">添加</el-button>
      <el-button @click="navSort" v-if="!allnonebool">调整顺序</el-button>
      <el-button type="danger" @click="sortConfirm" v-if="allnonebool">确认顺序</el-button>
      <el-button type="danger" @click="sortCancel" v-if="allnonebool">取消排序</el-button>
    </div>
    <div class="addForm" v-if="isShowAddForm">
      <div class="title">添加导航菜单选项</div>
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="70px" class="ruleForm">
        <el-form-item label="导航内容" prop="content">
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
          <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Nav</el-button>
        </el-form-item>
        <el-form-item label="跳转地址" prop="toUrl">
          <el-input v-model="ruleForm.toUrl"></el-input>
        </el-form-item>
        <el-form-item label="下拉" prop="isDrop">
          <el-select v-model="ruleForm.isDrop" placeholder="可以下拉？">
            <el-option label="true" :value="true"></el-option>
            <el-option label="false" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="changeForm" v-if="isShowChangeForm">
      <div class="title">修改导航菜单选项</div>
      <el-form :model="changeForm" status-icon :rules="changeRules" ref="changeForm" label-width="70px" class="changeForm">
        <el-form-item label="id" prop="id">
          <el-input v-model="changeForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="导航内容" prop="content">
          <el-tag
            :key="tag"
            v-for="tag in dynamicTags1"
            closable
            :disable-transitions="false"
            @close="handleClose1(tag)">
            {{tag}}
          </el-tag>
          <el-input
            class="input-new-tag"
            v-if="inputVisible1"
            v-model="inputValue1"
            ref="saveTagInput"
            size="small"
            @keyup.enter.native="handleInputConfirm1"
            @blur="handleInputConfirm1"
          >
          </el-input>
          <el-button v-else class="button-new-tag" size="small" @click="showInput1">+ New Nav</el-button>
        </el-form-item>
        <el-form-item label="跳转地址" prop="toUrl">
          <el-input v-model="changeForm.toUrl"></el-input>
        </el-form-item>
        <el-form-item label="下拉" prop="isDrop">
          <el-select v-model="changeForm.isDrop" placeholder="可以下拉？">
            <el-option label="true" :value="true"></el-option>
            <el-option label="false" :value="false"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitChangeForm('changeForm')">提交</el-button>
          <el-button @click="resetChangeForm('changeForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="addChildForm" v-if="isShowNavItemForm">
      <div class="title">添加导航子菜单选项</div>
      <el-form :model="addChildForm" status-icon :rules="addChildRules" ref="addChildForm" label-width="70px" class="addChildForm">
        <el-form-item label="id" prop="id">
          <el-input v-model="addChildForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="title">
          <el-input v-model="addChildForm.title"></el-input>
        </el-form-item>
        <el-form-item label="跳转地址" prop="toUrl">
          <el-input v-model="addChildForm.toUrl"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitAddChildrenForm('addChildForm')">提交</el-button>
          <el-button @click="resetAddChildrenForm('addChildForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="updateChildForm" v-if="isShowNavItemUpForm">
      <div class="title">修改导航子菜单选项</div>
      <el-form :model="updateChildForm" status-icon :rules="addChildRules" ref="updateChildForm" label-width="70px" class="updateChildForm">
        <el-form-item label="id" prop="id">
          <el-input v-model="updateChildForm.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="cid" prop="cid">
          <el-input v-model="updateChildForm.cid" disabled></el-input>
        </el-form-item>
        <el-form-item label="名称" prop="title">
          <el-input v-model="updateChildForm.title"></el-input>
        </el-form-item>
        <el-form-item label="跳转地址" prop="toUrl">
          <el-input v-model="updateChildForm.toUrl"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitUpdateChildrenForm('updateChildForm')">提交</el-button>
          <el-button @click="resetUpdateChildrenForm('updateChildForm')">重置</el-button>
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
        return callback(new Error('名称不能为空'))
      }
      setTimeout(() => {
        callback()
      }, 1000)
    }
    return {
      data: null,
      loading: true,
      currentChildren: [],
      total: 0,
      isShowAddForm: false,
      isShowChangeForm: false,
      isShowNavItemForm: false,
      isShowNavItemUpForm: false,
      allnonebool: false,
      isUp: false,
      seqShow: false,
      ruleForm: {
        toUrl: '',
        isDrop: ''
      },
      changeForm: {
        toUrl: '',
        isDrop: '',
        id: ''
      },
      addChildForm: {
        toUrl: '',
        title: ''
      },
      updateChildForm: {
        toUrl: '',
        title: ''
      },
      rules: {
        toUrl: [
          { validator: checkToUrl, trigger: 'blur' }
        ],
        isDrop: [
          { required: true, message: '请至少选择一个类型', trigger: 'change' }
        ]
      },
      changeRules: {
        toUrl: [
          { validator: checkToUrl, trigger: 'blur' }
        ],
        isDrop: [
          { required: true, message: '请至少选择一个类型', trigger: 'change' }
        ]
      },
      addChildRules: {
        toUrl: [
          { validator: checkToUrl, trigger: 'blur' }
        ],
        title: [
          { validator: checkTitle, trigger: 'blur' }
        ]
      },
      updateChildRules: {
        toUrl: [
          { validator: checkToUrl, trigger: 'blur' }
        ],
        title: [
          { validator: checkTitle, trigger: 'blur' }
        ]
      },
      dynamicTags: [],
      inputVisible: false,
      inputValue: '',
      dynamicTags1: [],
      inputVisible1: false,
      inputValue1: ''
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
      Http.getQfModel('nav', '', function (data) {
        console.log('导航数据', data)
        _this.data = data.data
        _this.total = data.count
      })
    },
    showAdd () {
      this.isShowAddForm = true
      this.isShowChangeForm = false
      this.isShowNavItemForm = false
      this.isShowNavItemUpForm = false
    },
    addNavItem (nav) {
      this.isShowNavItemForm = false
      this.addChildForm.id = nav._id
      this.currentChildren = nav.children
      this.isShowAddForm = false
      this.isShowChangeForm = false
      this.isShowNavItemForm = true
      this.isShowNavItemUpForm = false
    },
    changeNav (data) {
      console.log(data)
      this.changeForm.id = data._id
      this.dynamicTags1 = data.content
      this.changeForm.toUrl = data.toUrl
      this.changeForm.isDrop = data.isDrop
      this.isShowAddForm = false
      this.isShowChangeForm = true
      this.isShowNavItemForm = false
      this.isShowNavItemUpForm = false
    },
    updateChildrenItem (id, item, nav) {
      this.updateChildForm.id = id
      this.updateChildForm.cid = item._id
      this.updateChildForm.title = item.title
      this.updateChildForm.toUrl = item.toUrl
      this.currentChildren = nav.children
      this.isShowNavItemUpForm = true
      this.isShowAddForm = false
      this.isShowChangeForm = false
      this.isShowNavItemForm = false
    },
    navSort () {
      this.seqShow = true
      let _this = this
      setTimeout(function () {
        _this.allnonebool = true
        _this.isUp = true
      }, 50)
    },
    sortConfirm () {
      let indexs = []
      let _this = this
      console.log(this.$refs)
      this.$refs.seqs.forEach(function (e, i) {
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
        Http.postQfModel('nav/update?id=' + e.id, {nIndex: e.index}, function (data) {
          if (data === 0) {
            return
          }
          if (data.nModified === 1) {
            _this.init()
          } else {
          }
        })
      })
      this.allnonebool = false
      this.isUp = false
      setTimeout(function () {
        _this.seqShow = false
      }, 350)
    },
    sortCancel () {
      this.allnonebool = false
      this.isUp = false
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
    handleClose (tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },
    showInput1 () {
      this.inputVisible1 = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm1 () {
      let inputValue = this.inputValue1
      if (inputValue) {
        this.dynamicTags1.push(inputValue)
      }
      this.inputVisible1 = false
      this.inputValue1 = ''
    },
    handleClose1 (tag) {
      this.dynamicTags1.splice(this.dynamicTags1.indexOf(tag), 1)
    },
    handleDelete (nid) {
      console.log(nid)
      let _this = this
      MessageBox.confirm('此操作将删除该选项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        Http.postQfModel('nav/delete', {id: nid}, function (data) {
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
    handleDelete1 (nid, iid) {
      console.log(nid)
      let _this = this
      MessageBox.confirm('此操作将删除该选项, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        Http.postQfModel('nav/deleteEle', {id: nid, itemId: iid}, function (data) {
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
          let param = Object.assign({}, this.ruleForm, {children: [], content: this.dynamicTags, nIndex: this.total + 1})
          Http.postQfModel('nav/add', param, function (data) {
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
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    submitChangeForm (formName) {
      let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let param = {
            isDrop: this.changeForm.isDrop,
            toUrl: this.changeForm.toUrl,
            content: this.dynamicTags1
          }
          Http.postQfModel('nav/update?id=' + this.changeForm.id, param, function (data) {
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
    resetChangeForm (formName) {
      this.$refs[formName].resetFields()
    },
    submitAddChildrenForm (formName) {
      let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let param = {
            children: [...this.currentChildren, {
              title: this.addChildForm.title,
              toUrl: this.addChildForm.toUrl
            }]
          }
          Http.postQfModel('nav/update?id=' + this.addChildForm.id, param, function (data) {
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
              _this.init()
              _this.isShowNavItemForm = false
              _this.resetForm('addChildForm')
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
    resetAddChildrenForm (formName) {
      this.$refs[formName].resetFields()
    },
    submitUpdateChildrenForm (formName) {
      let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let newChildren = [...this.currentChildren]
          this.currentChildren.forEach(function (e, i) {
            if (e._id === _this.updateChildForm.cid) {
              newChildren[i] = {
                _id: e._id,
                title: _this.updateChildForm.title,
                toUrl: _this.updateChildForm.toUrl
              }
            }
          })
          let param = {
            children: newChildren
          }
          Http.postQfModel('nav/update?id=' + this.updateChildForm.id, param, function (data) {
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
              _this.init()
              _this.isShowNavItemUpForm = false
              _this.resetForm('updateChildForm')
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
    resetUpdateChildrenForm (formName) {
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
  .allnone{
    pointer-events: none;
  }
  .qficon{
    width: 16px;
    height: 16px;
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
  .el-message-box{
    width: 1200px;
    .el-message-box__content{
      max-height: 80vh;
      overflow: auto;
    }
  }
  .addForm{
    padding: 20px;
  }
  .changeForm{
    padding: 20px;
  }
  .addChildForm{
    padding: 20px;
  }
  .updateChildForm{
    padding: 20px;
  }
  .seqContent{
    width: 100%;
    height: 60px;
    background: #fff;
    position: relative;
    z-index: 1;
    border-bottom: 1px solid #eee;
  }
  .controlBtns{
    padding: 20px;
  }
  #navShow{
    .title{
      margin-bottom: 20px;
    }
  }
  .navs{
    background: #fdfdfd;
    box-shadow: 0 0 4px rgba(0,0,0,0.1);
    position: relative;
    z-index: 2;
    margin-top: 50px;
    .hnavItem{
      padding: 15px 15px;
      display: inline-block;
      height: 100%;
      box-sizing: border-box;
      transition: all .3s ease;
      position: relative;
      &:after{
        content: '';
        display: block;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        background: #fdfdfd;
        z-index: 0;
      }
      .ctrl{
        width: 36px;
        height: 36px;
        line-height: 18px;
        position: absolute;
        bottom: 100%;
        left: 50%;
        margin-left: -18px;
        z-index: 999;
        background: #a4e2c6;
        margin-bottom: -36px;
        z-index: 0;
        transition: all ease .3s;
        box-shadow: 0 2px 4px -2px rgba(0,0,0,0.2) inset;
        .cbtn{
          font-size: 12px;
          text-align: center;
          color: #fff;
          text-shadow: 0 0 1px #888;
          cursor: pointer;
          &:hover{
            color: #eee;
            background: #CCE6DA;
          }
        }
      }
      &.active{
        .bg{
          height: 65px;
        }
        .name{
          color: #fff;
          transform: translate(0, 20px);
        }
        .en{
          color: #fff;
          transform: translate(0, -20px);
        }
        .bg{
          height: 65px;
        }
      }
      &:hover{
        .bg{
          height: 65px;
        }
        .name{
          color: #fff;
          transform: translate(0, 20px);
        }
        .en{
          color: #fff;
          transform: translate(0, -20px);
        }
        .ctrl{
          margin-bottom: 0;
        }
      }
      .bg{
        position: absolute;
        bottom: 0;
        left: 4px;
        width: calc(100% - 4px);
        height: 0;
        z-index: 1;
        background: #e75151;
        transition: all .3s ease;
      }
      .name{
        line-height: 20px;
        font-size: 14px;
        color: #666;
        text-align: center;
        transition: all .3s ease;
        position: relative;
        transform: translate(0, 0);
        z-index: 2;
      }
      .en{
        line-height: 20px;
        font-size: 14px;
        color: #666;
        text-align: center;
        font-family: 'arial';
        font-size: 12px;
        transition: all .3s ease;
        position: relative;
        transform: translate(0, 0);
        z-index: 2;
      }
      .seq{
        width: 40px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        background: #fff;
        border-radius: 10px;
        box-shadow: 0 0 5px rgba(0,0,0,0.2);
        position: absolute;
        top: calc(100% + 10px);
        left: 50%;
        margin-left: -20px;
        margin-top: -60px;
        transition: all .3s ease;
        pointer-events: auto;
        &.up{
          margin-top: 0;
        }
      }
      .subList{
        position: absolute;
        top: 100%;
        left: 0;
        z-index: 2;
        width: 100px;
        background: #fff;
        display: none;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
        .listItem{
          width: 100px;
          height: 40px;
          line-height: 40px;
          position: relative;
          .addItem{
            width: 100%;
            line-height: 30px;
            cursor: pointer;
            text-align: center;
            &:hover{
              background: #eee;
            }
          }
          a{
            display: inline-block;
            text-indent: 20px;
            width: 100%;
            height: 100%;
            background: #fff;
            text-decoration: none;
            font-size: 14px;
            color: #666;
            position: relative;
            z-index: 2;
            &:hover{
              background: #eee;
            }
          }
          .ctrlBtn{
            width: 40px;
            height: 24px;
            line-height: 24px;
            background: #fff;
            font-size: 12px;
            text-align: center;
            box-shadow: 0 0 6px rgba(0,0,0,0.1);
            transition: all .3s ease;
            position: absolute;
            top: 50%;
            z-index: 1;
            margin-top: -12px;
            cursor: pointer;
            &.delete{
              left: 100%;
              margin-left: -40px;
            }
            &.update{
              right: 100%;
              margin-right: -40px;
            }
            &:hover{
              color: #e75151;
            }
          }
          &:hover{
            .delete{
              margin-left: 0px;
            }
            .update{
              margin-right: 0px;
            }
          }
          &.active{
            background: #eee;
            a{
              color: #e75151;
            }
          }
        }
      }
      &.allnone{
        .ctrl{
          display: none;
        }
        .subList{
          display: none !important;
        }
      }
      &:hover .subList{
        display: block;
      }
    }
  }
</style>
