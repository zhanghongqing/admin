<template>
  <div id="index">
    <div class="iitem" v-for="(item, index) in data" :key="index">
      <div class="header">{{item.title}}</div>
      <div class="container">
        <div class="item" v-for="(iitem, iindex) in item.sub" :key="iindex" @click="toPath(iitem.router)">{{iitem.name}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
// import Http from '@/utils/http.js'
import navData from '@/utils/navData.js'

export default {
  name: 'index',
  data () {
    return {
      data: navData.data
    }
  },
  computed: {
    ...mapState({
      httpState: 'Http'
    })
  },
  methods: {
    ...mapActions('Http', ['changeIndexData']),
    init () {
    },
    toPath (path) {
      this.$router.push({
        path: path
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
  #index{
    .iitem{
      width: 100%;
      .header{
        width: 100%;
        height: 60px;
        line-height: 60px;
        padding-left: 30px;
        font-size: 18px;
        font-weight: bold;
        background: #FBF5F5;
        position: relative;
        &:before{
          content: '';
          display: block;
          width: 6px;
          height: 100%;
          position: absolute;
          background: #e75151;
          top: 0;
          left: 0;
        }
      }
      .container{
        overflow: hidden;
        width: 100%;
        padding: 10px;
        box-sizing: border-box;
        .item{
          width: 200px;
          height: 100px;
          background: #fafafa;
          float: left;
          margin: 10px;
          cursor: pointer;
          font-size: 20px;
          line-height: 100px;
          text-align: center;
          font-weight: bold;
          color: #999;
          &:hover{
            box-shadow: 0 0 8px rgba(0,0,0,0.1);
          }
        }
      }
    }
  }
</style>
