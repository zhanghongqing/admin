<template>
  <div id="student">
    <div class="showinfo" v-if="data">
      手机号: {{data.mobile}}
      <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="用户信息" name="first">
            <ul>
              <li>手机：{{data.mobile}}</li>
              <li>用户名：{{data.username}}</li>
              <li>邮箱：{{data.email}}</li>
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
                :formatter="formatTime">
              </el-table-column>
              <el-table-column
                prop="name"
                label="名称">
              </el-table-column>
              <el-table-column
                prop="current_price"
                label="价格">
              </el-table-column>
              <el-table-column
                prop="status"
                label="状态">
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="相关订单" name="third">
            相关订单
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
      activeName: 'second'
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
      let param = {id: this.$route.query.id}
      Http.postQfModel('mysql/getBought', param, function (data) {
        console.log(data)
        _this.bought = data.bought
      })
    },
    formatTime (row) {
      return new Date(row.buytime).toLocaleString()
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
    .showinfo{
      width: 100%;
    }
  }
</style>
