import axios from 'axios'
import qs from 'qs'

export default {
  send (opt, http) {
    let params = Object.assign({}, {
      url: '',
      method: 'get',
      baseURL: 'https://test.qiangfen.com:9101',
      responseType: 'json',
      headers: {
        'Authorization': http.accessToken,
        'Content-Type': 'application/json;charset=UTF-8'
      }
    }, opt)
    return axios(params)
  },
  getToken (http, callback, error) {
    var opts = {
      url: '/security/oauth/token?client_id=qf-client-webpage&grant_type=client_credentials',
      method: 'post',
      headers: {
        'Authorization': 'Basic cWYtY2xpZW50LXdlYnBhZ2U6cWYtY2xpZW50LXdlYnBhZ2Utc2VjcmV0',
        'Content-Type': 'application/json;charset=UTF-8'
      }
    }
    this.send(opts, http)
      .then(function (data) {
        callback && callback(data.data)
      })
      .catch(function (e) {
        error && error(e)
      })
  },
  getHomeData (http, callback, error) {
    let _this = this
    if (http.accessToken.substring(0, 6) !== 'Bearer') {
      setTimeout(function () {
        _this.getHomeData(http, callback, error)
      }, 10)
      return
    }
    var param = {account_type: 'student'}
    param = JSON.stringify(param)
    var opts = {
      url: '/asset/api/app/home',
      method: 'post',
      data: param
    }
    this.send(opts, http)
      .then(function (data) {
        callback && callback(data.data)
      })
      .catch(function (e) {
        console.log(e)
        error && error(e)
      })
  },
  createCourse (param, http, callback, error) {
    let _this = this
    if (http.accessToken.substring(0, 6) !== 'Bearer') {
      setTimeout(function () {
        _this.getCourseList(param, http, callback, error)
      }, 4)
      return
    }
    var opts = {
      url: '/asset/api/course/create',
      method: 'post',
      data: JSON.stringify(param)
    }
    this.send(opts, http)
      .then(function (data) {
        callback && callback(data.data)
      })
      .catch(function (e) {
        console.log(e)
        error && error(e)
      })
  },
  updateCourse (param, http, callback, error) {
    let _this = this
    if (http.accessToken.substring(0, 6) !== 'Bearer') {
      setTimeout(function () {
        _this.getCourseList(param, http, callback, error)
      }, 4)
      return
    }
    var opts = {
      url: '/asset/api/course/save',
      method: 'post',
      data: JSON.stringify(param)
    }
    this.send(opts, http)
      .then(function (data) {
        callback && callback(data.data)
      })
      .catch(function (e) {
        console.log(e)
        error && error(e)
      })
  },
  deleteCourse (param, http, callback, error) {
    let _this = this
    if (http.accessToken.substring(0, 6) !== 'Bearer') {
      setTimeout(function () {
        _this.getCourseList(param, http, callback, error)
      }, 4)
      return
    }
    var opts = {
      url: '/asset/api/course/delete',
      method: 'post',
      data: JSON.stringify(param)
    }
    console.log('ccccccccccccccccccc', opts)
    this.send(opts, http)
      .then(function (data) {
        callback && callback(data.data)
      })
      .catch(function (e) {
        console.log(e)
        error && error(e)
      })
  },
  addMaterials (param, http, callback, error) {
    let _this = this
    if (http.accessToken.substring(0, 6) !== 'Bearer') {
      setTimeout(function () {
        _this.getCourseList(param, http, callback, error)
      }, 4)
      return
    }
    var opts = {
      url: '/asset/api/course/video/add',
      method: 'post',
      data: JSON.stringify(param)
    }
    console.log('ccccccccccccccccccc', opts)
    this.send(opts, http)
      .then(function (data) {
        callback && callback(data.data)
      })
      .catch(function (e) {
        console.log(e)
        error && error(e)
      })
  },
  getCourses (param, http, callback, error) {
    let _this = this
    if (http.accessToken.substring(0, 6) !== 'Bearer') {
      setTimeout(function () {
        _this.getCourseList(param, http, callback, error)
      }, 4)
      return
    }
    var opts = {
      url: '/asset/api/course/query',
      method: 'post',
      data: JSON.stringify(param)
    }
    this.send(opts, http)
      .then(function (data) {
        callback && callback(data.data)
      })
      .catch(function (e) {
        console.log(e)
        error && error(e)
      })
  },
  getCourseList (param, http, callback, error) {
    let _this = this
    if (http.accessToken.substring(0, 6) !== 'Bearer') {
      setTimeout(function () {
        _this.getCourseList(param, http, callback, error)
      }, 4)
      return
    }
    var opts = {
      url: '/asset/api/course/category?id=&name=' + param,
      method: 'post'
    }
    this.send(opts, http)
      .then(function (data) {
        callback && callback(data.data)
      })
      .catch(function (e) {
        console.log(e)
        error && error(e)
      })
  },
  getCourseInfo (param, http, callback, error) {
    let _this = this
    if (http.accessToken.substring(0, 6) !== 'Bearer') {
      setTimeout(function () {
        _this.getCourseInfo(param, http, callback, error)
      }, 10)
      return
    }
    var opts = {
      url: '/asset/api/course/detail?id=&name=' + param,
      method: 'post'
    }
    this.send(opts, http)
      .then(function (data) {
        callback && callback(data.data)
      })
      .catch(function (e) {
        console.log(e)
        error && error(e)
      })
  },
  getVideoUrl (param, http, callback, error) {
    let _this = this
    if (http.accessToken.substring(0, 6) !== 'Bearer') {
      setTimeout(function () {
        _this.getVideoUrl(param, http, callback, error)
      }, 10)
      return
    }
    var opts = {
      url: '/asset/api/course/video/detail/info?id=' + param + '&name=',
      method: 'post'
    }
    this.send(opts, http)
      .then(function (data) {
        callback && callback(data.data)
      })
      .catch(function (e) {
        console.log(e)
        error && error(e)
      })
  },
  login (param, http, callback, error) {
    let _this = this
    if (http.accessToken.substring(0, 6) !== 'Bearer') {
      setTimeout(function () {
        _this.getVideoUrl(param, http, callback, error)
      }, 10)
      return
    }
    var opts = {
      url: '/account/api/student/login',
      method: 'post',
      data: JSON.stringify(param)
    }
    this.send(opts, http)
      .then(function (data) {
        callback && callback(data.data)
      })
      .catch(function (e) {
        console.log(e)
        error && error(e)
      })
  },
  getQfModel (path, param, callback, error) {
    axios({
      url: 'http://www.qiangfen.com/koa/' + path,
      method: 'get',
      responseType: 'json',
      params: param
    })
      .then(function (data) {
        callback && callback(data.data)
      })
      .catch(function (errors) {
        error && error(errors)
      })
  },
  postQfModel (path, param, callback, error) {
    console.log(param)
    axios({
      url: 'http://www.qiangfen.com/koa/' + path,
      method: 'post',
      responseType: 'json',
      data: qs.stringify(param)
    })
      .then(function (data) {
        callback && callback(data.data)
      })
      .catch(function (errors) {
        error && error(errors)
      })
  },
  SetCookie (name, value) {
    let exp = new Date()
    exp.setTime(exp.getTime() + (30 * 24 * 60 * 60 * 1000))
    window.document.cookie = name + '=' + escape(value) + '; expires=' + exp.toGMTString() + ';path='
  },
  GetCookie (name) {
    let arg = name + '='
    let alen = arg.length
    let clen = window.document.cookie.length
    let i = 0
    while (i < clen) {
      let j = i + alen
      if (window.document.cookie.substring(i, j) === arg) {
        return this.getCookieVal(j)
      }
      i = window.document.cookie.indexOf(' ', i) + 1
      if (i === 0) {
        break
      }
    }
    return null
  },
  getCookieVal (offset) {
    let endstr = window.document.cookie.indexOf(';', offset)
    if (endstr === -1) {
      endstr = window.document.cookie.length
    }
    return unescape(window.document.cookie.substring(offset, endstr))
  },
  delCookie (name) {
    let exp = new Date()
    exp.setTime(exp.getTime() - 1)
    let cval = this.GetCookie(name)
    if (cval !== null) {
      document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
    }
  }
}
