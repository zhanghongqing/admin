<template>
  <div id="student">
    <div class="showinfo" v-if="data">
      <div class="mobile">
        手机号：<span>{{data.mobile}}</span>
      </div>
      <div class="infoContainer">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="用户信息" name="first">
            <ul>
              <li>手机：{{data.mobile}}</li>
              <li>用户名：{{data.username}}</li>
              <li>邮箱：{{data.email}}</li>
              <li>注册时间：{{new Date(data.create_time).toLocaleString()}}</li>
            </ul>
          </el-tab-pane>
          <el-tab-pane label="已购课程" name="second">
            <el-table
              :data="bought"
              border
              style="width: 100%">
              <el-table-column
                prop="buytime"
                label="购买时间"
                width="200"
                :formatter="formatTime">
              </el-table-column>
              <el-table-column
                prop="name"
                label="名称">
              </el-table-column>
              <el-table-column
                prop="current_price"
                width="80"
                label="价格">
              </el-table-column>
              <el-table-column
                width="80"
                label="状态"
                :formatter="formatStatus">
              </el-table-column>
            </el-table>
            <div class="boughtPage">
              <el-pagination
                background
                layout="prev, pager, next"
                :total="boughtTotal"
                :current-page="currentPage"
                @current-change="changePage">
              </el-pagination>
            </div>
          </el-tab-pane>
          <el-tab-pane label="相关订单" name="third">
            <el-table
              :data="bought"
              border
              style="width: 100%">
              <el-table-column
                prop="buytime"
                label="购买时间"
                width="200"
                :formatter="formatTime">
              </el-table-column>
              <el-table-column
                prop="name"
                label="名称">
              </el-table-column>
              <el-table-column
                prop="current_price"
                width="80"
                label="价格">
              </el-table-column>
              <el-table-column
                width="80"
                label="状态"
                :formatter="formatStatus">
              </el-table-column>
            </el-table>
            <div class="boughtPage">
              <el-pagination
                background
                layout="prev, pager, next"
                :total="boughtTotal"
                :current-page="currentPage"
                @current-change="changePage">
              </el-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import Http from '@/utils/http.js'

export default {
  name: 'userinfo',
  data () {
    return {
      data: null,
      bought: null,
      activeName: 'second',
      boughtTotal: 0,
      currentPage: 1
    }
  },
  methods: {
    init () {
      let _this = this
      let param = {id: this.$route.query.id}
      Http.postQfModel('mysql/getInfo', param, function (data) {
        console.log(data)
        _this.data = data.data[0]
      })
      this.getBought()
    },
    getBought () {
      let _this = this
      let param = {
        id: this.$route.query.id,
        page: this.currentPage
      }
      Http.postQfModel('mysql/getBought', param, function (data) {
        console.log(data)
        _this.bought = data.bought
        _this.boughtTotal = data.count
      })
    },
    changePage (page) {
      this.currentPage = page
      this.getBought()
    },
    formatTime (row) {
      return new Date(row.buytime).toLocaleString()
    },
    formatStatus (row) {
      return row.status === 'CREATED' ? '销售中' : '已下线'
    },
    handleClick (tab, event) {
      console.log(1)
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  #student{
    .mobile{
      font-size: 22px;
      line-height: 60px;
      text-indent: 20px;
      color: #666;
      span{
        color: #1B5DC7;
        font-weight: bold;
      }
    }
    .infoContainer{
      padding: 20px;
      .boughtPage{
        padding: 20px 0;
        text-align: center;
      }
    }
    .showinfo{
      width: 100%;
    }
  }
</style>
