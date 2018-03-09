<template>
  <div id="users">
    <div class="countNum">
      <div class="item">总注册用户:<span v-if="data">{{data.count}}</span></div>
      <div class="item">今日新注册用户:<span v-if="data">{{data.today}}</span></div>
    </div>
  </div>
</template>

<script>
import Http from '@/utils/http.js'

export default {
  name: 'users',
  data () {
    return {
      data: null
    }
  },
  methods: {
    init () {
      let _this = this
      console.log(123)
      Http.getQfModel('mysql/students', '', function (data) {
        console.log(data)
        _this.data = data
      })
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
  #users{
    .countNum{
      width: 100%;
      overflow: hidden;
      margin-left: 20px;
      .item{
        float: left;
        font-size: 24px;
        margin-right: 20px;
        color: #888;
        padding: 20px 0;
        span{
          padding: 0 20px;
          color: #e75151;
          font-weight: bold;
          font-size: 40px;
        }
      }
    }
  }
</style>
