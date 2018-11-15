import axios from 'axios';
import Vue from 'vue';

// axios 配置
axios.defaults.timeout = 90000;

// 跳转到登录页
function toLogin() {
  let league = ''; // 记录联盟ID
  const url = window.location.href; // 当前地址
  const leagues = url.split('#', 2); // 以#分割当前URL，获取#后面的联盟ID值
  if (leagues && leagues[1] && leagues[1] !== '') {
    league = `#${leagues[1]}`;
  }
  // 跳转前将当前地址存储到web存储中
  const currentUrl = `${location.pathname}${location.search}${league}`;
  try {
    if (window.sessionStorage) { // 首先判断浏览器是否支持
      sessionStorage.setItem('currentUrl', currentUrl);
    }
    // location.href = APIURL.getToken;
  } catch (error) { // 解决无痕模式下，因sessionStorage被禁用而不能跳转的问题
    // 先告知用户，然后跳转到首页
    Vue.prototype.$confirm({
      content: '亲，您已开启无痕模式，会影响聚鲨环球精选的使用。<br />',
      submitText: '确认',
      showCancel: false,
    })
      .then(() => {
      });
  }
}
// response 拦截
axios.interceptors.response.use((response) => {
  if (response.status === 200) {
    if (response.data && response.data.rsp && response.data.rsp === 'succ') { // 接口服务级错误识别
      if (response.data.status && response.data.status === 'succ') { // 接口token级错误识别
        const responseData = response.data.data;
        return Promise.resolve(responseData);// 返回
      } else if (response.data.status && response.data.status === 'token-error') { // token错误
        // 解决Safari无痕浏览下location.href不能跳转的问题
        // 先告知用户，然后跳转到登录页面
        Vue.prototype.$confirm({
          content: '您当前的身份信息已失效<br />是否需要重新登录？',
          submitText: '确认',
        })
          .then(() => {
            toLogin();
          });
      } else if (response.data.status && response.data.status === 'paras-error') { // 参数错误
        Vue.prototype.$confirm({
          content: '数据服务异常[参数异常]<br />请联系客户人员',
          showCancel: false,
        });
      }
    } else {
      Vue.prototype.$confirm({
        content: '数据服务异常<br />请联系客户人员',
        showCancel: false,
      });
    }
  } else if (response.status === 500) {
    Vue.prototype.$confirm({
      content: '数据服务异常[500]<br />请联系客户人员',
      showCancel: false,
    });
  } else if (response.status === 404) {
    Vue.prototype.$confirm({
      content: '数据服务异常[404]<br />请联系客户人员',
      showCancel: false,
    })
      .then(() => {
        // location.href = APIURL.index;
      });
  } else if (response.status === 204 || response.status === 422) {
    // 数据埋点时，200和204表示成功，422（无法处理的请求实体）表示没进入数据埋点接口
    return Promise.resolve(response);// 返回
  } else {
    Vue.prototype.$confirm({
      content: '数据服务异常[error]<br />请联系客户人员',
      showCancel: false,
    });
  }
  const returnData = {
    returndata: {
      status: 'error',
    },
  };
  return Promise.resolve(returnData);
}, () => {
  // 暂时注释
  // Vue.prototype.$confirm({
  //   content: '网络异常，请检查您的网络链接状态',
  //   showCancel: false,
  // });
  const returnData = {
    returndata: {
      status: 'error',
    },
  };
  return Promise.resolve(returnData);
});

export default axios;
