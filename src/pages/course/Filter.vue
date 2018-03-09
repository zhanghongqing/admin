<template>
  <div id="filter">
    <DetailAlert />
    <div class="showLoading" v-if="loading" v-loading="loading"></div>
    <div class="filertBox">
      <div class="filterTab">
        <div class="ti filter">
          <div class="title">筛选</div>
          <div class="content">
            <div class="fti">
              <div class="label">课程分类</div>
              <div class="filterList">
                <div class="listItem" :class="{ active: filters.category === category }" v-for="(category, cIndex) in filterCategory" :key="cIndex" @click="changeData('category', category)">
                  <div class="line topLine"></div>
                  <div class="line leftLine"></div>
                  <div class="line rightLine"></div>
                  <div class="line bottomLine"></div>
                  {{category}}
                </div>
              </div>
            </div>
            <div class="fti">
              <div class="label">课程类型</div>
              <div class="filterList">
                <div class="listItem" :class="{ active: filters.type === '全部' }" @click="changeData('type', '全部')">
                  <div class="line topLine"></div>
                  <div class="line leftLine"></div>
                  <div class="line rightLine"></div>
                  <div class="line bottomLine"></div>
                  全部
                </div>
                <div class="listItem" :class="{ active: filters.type === 'special' }" @click="changeData('type', 'special')">
                  <div class="line topLine"></div>
                  <div class="line leftLine"></div>
                  <div class="line rightLine"></div>
                  <div class="line bottomLine"></div>
                  课程
                </div>
                <div class="listItem" :class="{ active: filters.type === 'package' }" @click="changeData('type', 'package')">
                  <div class="line topLine"></div>
                  <div class="line leftLine"></div>
                  <div class="line rightLine"></div>
                  <div class="line bottomLine"></div>
                  套餐
                </div>
              </div>
            </div>
            <div class="fti">
              <div class="label">是否免费</div>
              <div class="filterList">
                <div class="listItem" :class="{ active: filters.free === '全部' }" @click="changeData('free', '全部')">
                  <div class="line topLine"></div>
                  <div class="line leftLine"></div>
                  <div class="line rightLine"></div>
                  <div class="line bottomLine"></div>
                  全部
                </div>
                <div class="listItem" :class="{ active: filters.free === '1' }" @click="changeData('free', '1')">
                  <div class="line topLine"></div>
                  <div class="line leftLine"></div>
                  <div class="line rightLine"></div>
                  <div class="line bottomLine"></div>
                  是
                </div>
                <div class="listItem" :class="{ active: filters.free === '0' }" @click="changeData('free', '0')">
                  <div class="line topLine"></div>
                  <div class="line leftLine"></div>
                  <div class="line rightLine"></div>
                  <div class="line bottomLine"></div>
                  否
                </div>
              </div>
            </div>
            <div class="fti">
              <div class="label">课程标签</div>
              <div class="filterList">
                <div class="listItem" :class="{ active: filters.tag === tag }" v-for="(tag, tIndex) in filterTags" :key="tIndex" @click="changeData('tag', tag)">
                  <div class="line topLine"></div>
                  <div class="line leftLine"></div>
                  <div class="line rightLine"></div>
                  <div class="line bottomLine"></div>
                  {{tag}}
                </div>
              </div>
            </div>
            <div class="fti">
              <div class="label">主讲教师</div>
              <div class="filterList">
                <div class="listItem" :class="{ active: filters.teacher === teacher }" v-for="(teacher, tIndex) in filterTeacher" :key="tIndex" @click="changeData('teacher', teacher)">
                  <div class="line topLine"></div>
                  <div class="line leftLine"></div>
                  <div class="line rightLine"></div>
                  <div class="line bottomLine"></div>
                  {{teacher}}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="ti sort">
          <div class="title">排序</div>
          <div class="content">
            <div class="sortList">
              <div class="sortListItem" :class="{ active: filterSortType === '默认' }" @click="changeSortType('默认')">
                <div class="line topLine"></div>
                <div class="line leftLine"></div>
                <div class="line rightLine"></div>
                <div class="line bottomLine"></div>
                默认
              </div>
              <div class="sortListItem" :class="{ active: filterSortType === 'current_price' }" @click="changeSortType('current_price')">
                <div class="line topLine"></div>
                <div class="line leftLine"></div>
                <div class="line rightLine"></div>
                <div class="line bottomLine"></div>
                <span v-if="filterSortType !== 'current_price'">价格</span>
                <span v-else>
                  <span v-if="filterOrder === 'b'">价格<i class="el-icon-caret-bottom"></i></span>
                  <span v-else>价格<i class="el-icon-caret-top"></i></span>
                </span>
              </div>
              <div class="sortListItem" :class="{ active: filterSortType === 'create_time' }" @click="changeSortType('create_time')">
                <div class="line topLine"></div>
                <div class="line leftLine"></div>
                <div class="line rightLine"></div>
                <div class="line bottomLine"></div>
                <span v-if="filterSortType !== 'create_time'">创建时间</span>
                <span v-else>
                  <span v-if="filterOrder === 'b'">创建时间<i class="el-icon-caret-bottom"></i></span>
                  <span v-else>创建时间<i class="el-icon-caret-top"></i></span>
                </span>
              </div>
              <div class="sortListItem" :class="{ active: filterSortType === 'seq' }" @click="changeSortType('seq')">
                <div class="line topLine"></div>
                <div class="line leftLine"></div>
                <div class="line rightLine"></div>
                <div class="line bottomLine"></div>
                <span v-if="filterSortType !== 'seq'">排序编号</span>
                <span v-else>
                  <span v-if="filterOrder === 'b'">排序编号<i class="el-icon-caret-bottom"></i></span>
                  <span v-else>排序编号<i class="el-icon-caret-top"></i></span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="filterContent">
        <div class="filterList">
          <div class="filterItem" v-for="(item, index) in filterRes" :key="index">
            <div class="img">
              <img :src="item.image_url">
              <div class="package" v-if="item.type === 'package'">套餐</div>
            </div>
            <div class="name">
              {{item.name}}
            </div>
            <div class="price">
              <span v-if="item.is_free == 1">免费</span>
              <span v-else>￥ {{item.current_price}}</span>
            </div>
            <div class="tags">
              <div class="tag" v-for="(tag, tagIndex) in item.tags" :key="tagIndex">{{tag.name}}</div>
            </div>
            <div class="teachers">
              <strong>主讲教师：</strong><span v-for="(teacher, tindex) in item.authors" :key="tindex">{{teacher.name}}、</span>
            </div>
            <div class="categoryList">
              <div class="category" v-for="(category, cIndex) in item.categories" :key="cIndex">{{category.name}}</div>
            </div>
            <div class="time">
              {{item.create_time | formatTime}}<span>{{item.seq}}</span>
            </div>
            <div class="tops">
              <div class="btn one">
                <el-button @click="showData(item)" round size="medium ">查看</el-button>
              </div>
              <div class="btn two">
                <el-button round @click="handleUpdate(item)" size="medium ">编辑</el-button>
              </div>
              <div class="btn three">
                <el-button @click="handleDelete(item)" round size="medium ">删除</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Http from '@/utils/http.js'
import { Message, MessageBox, Notification } from 'element-ui'
import DetailAlert from '@/components/DetailAlert'

export default {
  name: 'index',
  data () {
    return {
      data: null,
      loading: true,
      filterRes: null,
      filterCategory: [],
      filterTags: [],
      filterTeacher: [],
      filters: {
        category: '全部',
        type: '全部',
        free: '全部',
        tag: '全部',
        teacher: '全部'
      },
      filterSortType: '默认',
      filterOrder: 'b'
    }
  },
  components: {
    DetailAlert
  },
  computed: {
    ...mapState({
      httpState: 'Http'
    })
  },
  watch: {
    data () {
      this.initFilterList('filterCategory', 'categories')
      this.initFilterList('filterTags', 'tags')
      this.initFilterList('filterTeacher', 'authors')
      this.loading = false
      this.filterData()
    }
  },
  filters: {
    formatTime (val) {
      return new Date(val).toLocaleString()
    }
  },
  methods: {
    ...mapActions('Http', ['changeDetailData', 'changeDetailAlert']),
    init () {
      console.log('aaaaaa', sessionStorage.getItem('qiangfengo'))
      // let loadingInstance = Loading.service({
      //   lock: true,
      //   text: 'Loading',
      //   spinner: 'el-icon-loading',
      //   background: 'rgba(0, 0, 0, 0.7)'
      // })
      this.initData()
      this.getFilterData()
    },
    initData (loading) {
      if (!localStorage.getItem('filterData')) {
        console.log('没有存储')
      } else {
        let filterData = JSON.parse(localStorage.getItem('filterData'))
        this.data = filterData
      }
    },
    changeData (key, val) {
      this.filters[key] = val
      this.filterData()
    },
    changeSortType (key) {
      this.filterSortType = key
      this.filterData()
    },
    filterData () {
      let cd = JSON.parse(JSON.stringify(this.data))
      cd = this.filterCategoryData(cd)
      cd = this.filterTypeData(cd)
      cd = this.filterFreeData(cd)
      cd = this.filterTagData(cd)
      cd = this.filterTeacherData(cd)
      cd = this.sortData(cd)
      this.filterRes = cd
    },
    sortData (ddd) {
      if (this.filterSortType === '默认') {
        return ddd
      }
      if (this.filterOrder === 'b') {
        this.filterOrder = 'a'
      } else {
        this.filterOrder = 'b'
      }
      let newData = null
      let _this = this
      console.log(_this.filterSortType)
      newData = ddd.sort(function (a, b) {
        if (_this.filterOrder === 'b') {
          return b[_this.filterSortType] - a[_this.filterSortType]
        } else {
          return a[_this.filterSortType] - b[_this.filterSortType]
        }
      })
      return newData
    },
    filterCategoryData (ddd) {
      if (this.filters.category === '全部') {
        return ddd
      }
      let _this = this
      let newData = []
      ddd.forEach(function (e, i) {
        e.categories.forEach(function (ele, index) {
          if (ele.name === _this.filters.category) {
            newData.push(e)
          }
        })
      })
      return newData
    },
    filterTagData (ddd) {
      if (this.filters.tag === '全部') {
        return ddd
      }
      let _this = this
      let newData = []
      ddd.forEach(function (e, i) {
        e.tags.forEach(function (ele, index) {
          if (ele.name === _this.filters.tag) {
            newData.push(e)
          }
        })
      })
      return newData
    },
    filterTeacherData (ddd) {
      if (this.filters.teacher === '全部') {
        return ddd
      }
      let _this = this
      let newData = []
      ddd.forEach(function (e, i) {
        e.authors.forEach(function (ele, index) {
          if (ele.name === _this.filters.teacher) {
            newData.push(e)
          }
        })
      })
      return newData
    },
    filterTypeData (ddd) {
      if (this.filters.type === '全部') {
        return ddd
      }
      let _this = this
      let newData = []
      ddd.forEach(function (e, i) {
        if (e.type === _this.filters.type) {
          newData.push(e)
        }
      })
      return newData
    },
    filterFreeData (ddd) {
      if (this.filters.free === '全部') {
        return ddd
      }
      let _this = this
      let newData = []
      ddd.forEach(function (e, i) {
        if (e.is_free === _this.filters.free) {
          newData.push(e)
        }
      })
      return newData
    },
    getFilterData (loading) {
      let _this = this
      Http.getCourses({
        // category_id: ,
        // category_name: this.currentCategory,
        // "course_id": "",
        // "course_name": "",
        // "course_type": "",
        // "course_status": "",
        page_num: this.currentPage,
        page_size: ''
      }, this.httpState, function (data) {
        if (data.data.length === 0) {
          setTimeout(function () {
            _this.init()
          }, 500)
          return
        }
        console.log(111, data)
        _this.data = data.data
        localStorage.setItem('filterData', JSON.stringify(_this.data))
        _this.total = data.page_info.total_count
      }, function (error) {
        console.log(error)
      })
    },
    initFilterList (dataVal, key) {
      let newa = []
      newa.push('全部')
      this.data.forEach(function (e, i) {
        e[key].forEach(function (element, index) {
          let isHave = newa.find((val) => {
            return val === element.name
          })
          if (!isHave) {
            newa.push(element.name)
          }
        })
      })
      this[dataVal] = newa
    },
    showData (row) {
      console.log(row)
      this.changeDetailData({detailData: row})
      this.changeDetailAlert()
    },
    handleUpdate (row) {
      this.$router.push({
        path: '/course/edit',
        query: {
          id: row.id
        }
      })
    },
    handleDelete (row) {
      if (sessionStorage.getItem('qiangfengo') > 0) {
        Notification({
          title: '提示',
          message: '对不起你不能进行此操作！！！',
          type: 'warning'
        })
        return
      }
      let _this = this
      MessageBox.confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        Http.deleteCourse({
          course_id: row.id
        }, this.httpState, function (data) {
          console.log(data)
        }, function (error) {
          console.log(error)
        })
        _this.init()
      }).catch(() => {
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
  #filter{
    overflow-x: hidden;
    padding-bottom: 100px;
    .filertBox{
      width: 100%;
      .filterTab{
        width: 100%;
        padding: 10px;
        box-sizing: border-box;
        line-height: 40px;
        .ti{
          width: 100%;
          .title{
            float: left;
            width: 80px;
            text-align: center;
            font-weight: bold;
          }
          .content{
            float: left;
            width: calc(100% - 80px);
            .fti{
              width: 100%;
              float: left;
              overflow: hidden;
              margin-bottom: 5px;
              .label{
                width: 100px;
                float: left;
                font-size: 15px;
                text-align: center;
              }
              .filterList{
                width: calc(100% - 120px);
                float: left;
                margin-top: 5px;
                .listItem{
                  float: left;
                  line-height: 30px;
                  padding: 0 10px;
                  margin-right: 10px;
                  margin-bottom: 10px;
                  cursor: pointer;
                  position: relative;
                  overflow: hidden;
                  transition: all .3s ease;
                  .line{
                    width: 100%;
                    height: 2px;
                    position: absolute;
                    background: #888;
                    transition: all .3s ease;
                    &.topLine{
                      left: 0;
                      top: 0;
                      margin-left: -100%;
                    }
                    &.leftLine{
                      width: 2px;
                      height: 100%;
                      left: 0;
                      top: 0;
                      margin-top: 100%;
                    }
                    &.rightLine{
                      width: 2px;
                      height: 100%;
                      right: 0;
                      bottom: 0;
                      margin-bottom: 100%;
                    }
                    &.bottomLine{
                      right: 0;
                      bottom: 0;
                      margin-right: -100%;
                    }
                  }
                  &:hover{
                    background: rgba(0,0,0,0.05);
                    .line{
                      margin: 0;
                    }
                  }
                  &.active{
                    background: rgba(0,0,0,0.1);
                    color: #e75151;
                    font-weight: bold;
                    font-size: 15px;
                  }
                }
              }
            }
            .sortList{
              width: 100%;
              margin-top: 5px;
              .sortListItem{
                float: left;
                line-height: 30px;
                padding: 0 10px;
                margin-right: 10px;
                margin-bottom: 10px;
                cursor: pointer;
                position: relative;
                overflow: hidden;
                transition: all .3s ease;
                .line{
                  width: 100%;
                  height: 2px;
                  position: absolute;
                  background: #333;
                  transition: all .3s ease;
                  &.topLine{
                    left: 0;
                    top: 0;
                    margin-left: -100%;
                  }
                  &.leftLine{
                    width: 2px;
                    height: 100%;
                    left: 0;
                    top: 0;
                    margin-top: 100%;
                  }
                  &.rightLine{
                    width: 2px;
                    height: 100%;
                    right: 0;
                    bottom: 0;
                    margin-bottom: 100%;
                  }
                  &.bottomLine{
                    right: 0;
                    bottom: 0;
                    margin-right: -100%;
                  }
                }
                &:hover{
                  background: rgba(0,0,0,0.05);
                  .line{
                    margin: 0;
                  }
                }
                &.active{
                  background: rgba(0,0,0,0.1);
                  color: #e75151;
                  font-weight: bold;
                  font-size: 15px;
                }
              }
            }
          }
        }
      }
      .filterContent{
        width: 100%;
        .filterItem{
          width: 240px;
          height: 350px;
          float: left;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          margin: 20px 0 0 20px;
          transition: all .3s ease;
          position: relative;
          .img{
            width: 100%;
            position: relative;
            overflow: hidden;
            .package{
              position: absolute;
              top: -24px;
              right: 0;
              width: 80px;
              height: 80px;
              background: rgba(255,255,255,0.8);
              line-height: 134px;
              text-align: center;
              transform: rotate(45deg);
              transform-origin: bottom right;
              font-family: '微软雅黑';
              font-weight: bold;
            }
            img{
              width: 100%;
            }
          }
          .name{
            font-size: 12px;
            line-height: 14px;
            height: 28px;
            padding: 0 6px;
            box-sizing: border-box;
          }
          .price{
            color: #e75151;
            margin-left: 10px;
            line-height: 28px;
          }
          .tags{
            width: 100%;
            margin-left: 4px;
            overflow: hidden;
            .tag{
              float: left;
              font-size: 12px;
              background: #F19B0B;
              color: #fff;
              padding: 2px 4px;
              margin-left: 4px;
            }
          }
          .teachers{
            width: 100%;
            height: 32px;
            line-height: 16px;
            font-size: 14px;
            margin-top: 6px;
            padding: 0 6px;
          }
          .categoryList{
            width: 100%;
            display: flex;
            justify-content: space-around;
            margin-top: 6px;
            .category{
              float: left;
              padding: 4px 10px;
              border-radius: 50%;
              text-align: center;
              font-size: 14px;
              border: 2px solid #999;
              color: #999;
              font-weight: bold;
            }
          }
          .time{
            padding: 0 6px;
            margin-top: 6px;
            font-size: 14px;
            color: #aaa;
            span{
              float: right;
              color: #333;
            }
          }
          &:hover{
            box-shadow: 0 0 20px rgba(0,0,0,0.2);
            .tops{
              opacity: 1;
              .btn{
                &.one{
                  margin-left: 0;
                }
                &.two{
                  margin-left: 0;
                }
                &.three{
                  margin-left: 0;
                }
              }
            }
          }
          .tops{
            width: 100%;
            height: 100%;
            background: rgba(255,255,255,0.9);
            position: absolute;
            top: 0;
            left: 0;
            z-index: 1;
            overflow: hidden;
            opacity: 0;
            transition: all .3s ease;
            .btn{
              width: 100%;
              height: 33.3333%;
              text-align: center;
              line-height: 116px;
              transition: all .3s ease;
              &.one{
                margin-left: -100%;
              }
              &.two{
                margin-left: 100%;
              }
              &.three{
                margin-left: -100%;
              }
            }
          }
        }
      }
    }
    .showLoading{
      width: 100%;
      height: 400px;
      background: #fff;
    }
    .changeCategory{
      width: 340px;
      height: 30px;
      text-align: center;
      line-height: 30px;
      position: fixed;
      top: 15px;
      left: 320px;
      font-size: 14px;
      .name{
        font-size: 16px;
        font-weight: bold;
        color: #666;
      }
      .changeDrop{
        margin-left: 10px;
        cursor: pointer;
        color: #e75151;
        &:hover{
          opacity: 0.6;
        }
      }
    }
    img{
      width: 100%;
    }
    .cell{
      overflow: hidden;
      text-overflow: ellipsis;
      max-height: 98px;
    }
    .pageBox{
      padding: 20px 0;
      text-align: center;
      background: #fff;
    }
  }
  .el-message-box{
    width: 1200px;
    .el-message-box__content{
      max-height: 80vh;
      overflow: auto;
    }
  }
</style>
