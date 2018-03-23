<template>
  <div id="teacher">
    <el-table
      :data="data"
      v-loading="loading"
      border
      style="width: 100%">
      <el-table-column
        fixed
        label="图片"
        width="100">
        <template slot-scope="scope">
          <img :src="scope.row.image_url">
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="名字"
        width="100">
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="创建时间"
        :formatter="formatTime"
        width="180">
      </el-table-column>
      <el-table-column
        prop="description"
        label="介绍">
      </el-table-column>
    </el-table>
    <div class="pageBox">
      <el-pagination
        background
        :page-size="10"
        layout="prev, pager, next"
        :total="total"
        :current-page="currentPage"
        @current-change="changePage">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import Http from '@/utils/http.js'

export default {
  name: 'index',
  data () {
    return {
      data: null,
      loading: true,
      total: 0,
      currentPage: 1
    }
  },
  watch: {
    $route () {
      this.init()
    }
  },
  methods: {
    init () {
      let _this = this
      Http.postQfModel('mysql/teacher', {page: this.$route.query.page || 1}, function (data) {
        console.log(data)
        _this.data = data.data
        _this.total = data.count
        _this.loading = false
      })
    },
    changePage (page) {
      this.$router.push({
        path: '/course/teacher',
        query: {
          page: page
        }
      })
      this.loading = true
    },
    formatTime (row) {
      return new Date(row.create_time).toLocaleString()
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
  #teacher{
    .pageBox{
      padding: 20px 0;
      text-align: center;
    }
    img{
      width: 100%;
    }
  }
</style>
