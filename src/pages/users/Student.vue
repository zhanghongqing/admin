<template>
  <div id="student">
    <div class="showinfo" v-if="data">
      <div class="mobile">
        手机号：<span>{{data.mobile}}</span>
      </div>
      <div class="infoContainer">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="用户信息" name="first">
            <ul class="infoList">
              <li>手机：<span>{{data.mobile}}</span></li>
              <li>用户名：<span>{{data.username}}</span></li>
              <li>邮箱：<span>{{data.email}}</span></li>
              <li>注册时间：<span>{{new Date(data.create_time).toLocaleString()}}</span></li>
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
              :data="order"
              border
              style="width: 100%">
              <el-table-column
                prop="create_time"
                label="创建时间"
                width="200"
                :formatter="formatTime1">
              </el-table-column>
              <el-table-column
                prop="product_name"
                label="名称">
              </el-table-column>
              <el-table-column
                prop="current_product_price"
                width="80"
                label="价格">
              </el-table-column>
              <el-table-column
                width="80"
                label="状态"
                :formatter="formatStatus1">
              </el-table-column>
            </el-table>
            <div class="boughtPage">
              <el-pagination
                background
                layout="prev, pager, next"
                :total="orderTotal"
                :current-page="orderPage"
                @current-change="changeOrderPage">
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
      order: null,
      activeName: 'third',
      boughtTotal: 0,
      orderTotal: 0,
      currentPage: 1,
      orderPage: 1
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
      this.getOrder()
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
    getOrder () {
      let _this = this
      let param = {
        id: this.$route.query.id,
        page: this.orderPage
      }
      Http.postQfModel('mysql/getUserOrder', param, function (data) {
        console.log(data)
        _this.order = data.order
        _this.orderTotal = data.count
      })
    },
    changePage (page) {
      this.currentPage = page
      this.getBought()
    },
    changeOrderPage (page) {
      this.orderPage = page
      this.getOrder()
    },
    formatTime (row) {
      return new Date(row.buytime).toLocaleString()
    },
    formatTime1 (row) {
      return new Date(row.create_time).toLocaleString()
    },
    formatStatus (row) {
      return row.status === 'CREATED' ? '销售中' : '已下线'
    },
    formatStatus1 (row) {
      return row.status === 'TO_PAY' ? '未完成' : '已完成'
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
    .infoList{
      li{
        line-height: 40px;
        font-size: 16px;
        font-weight: bold;
        color: #999;
        span{
          color: #eab151;
          font-size: 18px;
        }
      }
    }
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
