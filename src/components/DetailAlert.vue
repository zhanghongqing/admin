<template>
  <div id="detailAlert" :class="{ show: httpState.isShowDetailAlert }">
    <div class="container">
      <div class="content">

        <div class="contentItem" v-for="(item, key) in httpState.detailData" :key="key">
          <div class="key">{{key}}</div>
          <div class="value">{{item}}</div>
        </div>
      </div>
      <div class="detailFooter">
        <el-button type="danger" @click="changeDetailAlert">关闭</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import http from '@/utils/http.js'

export default {
  name: 'detailAlert',
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      httpState: 'Http'
    })
  },
  methods: {
    ...mapActions('Http', ['changeDetailAlert']),
    init () {
      console.log('init....', http)
      console.log(this)
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
  #detailAlert{
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2001;
    background: rgba(0,0,0,0.6);
    display: none;
    transition: all .3s ease;
    &.show{
      display: block;
    }
    .container{
      width: 1200px;
      height: 80%;
      background: #fff;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      margin: auto;
      .content{
        width: 100%;
        height: calc(100% - 60px);
        overflow: auto;
        .contentItem{
          width: 100%;
          border-bottom: 1px solid #eee;
          overflow: hidden;
          line-height: 30px;
          .key{
            float: left;
            width: 200px;
          }
          .value{
            float: left;
          }
        }
      }
      .detailFooter{
        width: 100%;
        height: 60px;
        background: #fff;
        position: absolute;
        bottom: 0;
        left: 0;
        text-align: right;
        line-height: 60px;
        padding-right: 20px;
        box-sizing: border-box;
      }
    }
  }
</style>
