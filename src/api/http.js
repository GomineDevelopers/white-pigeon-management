import axios from "axios";
import QS from "qs";
import store from "@/store";
import router from ".././router";
import { Message } from "element-ui";
// console.log(store.state);

// 环境的切换
// if (process.env.NODE_ENV == "development") {
//   axios.defaults.baseURL = "http://localhost:8080";
// } else if (process.env.NODE_ENV == "production") {
//   axios.defaults.baseURL = "http://swj.edgrng.com/admin";
// }
if (process.env.NODE_ENV == "production") {
  axios.defaults.baseURL = "http://back.zidata.cn/admin";
}

axios.defaults.timeout = 10000; //设置请求超时
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded;charset=UTF-8"; //设置post请求头

// 请求拦截
axios.interceptors.request.use(
  config => {
    const token = store.state.token;
    if (token) {
      config.headers.Authorization = "Bearer " + token;
    }
    return config;
  },
  error => {
    return Promise.error(error);
  }
);

// 响应拦截器
axios.interceptors.response.use(
  response => {
    // 如果 header 中存在 token，那么触发 refreshToken 方法，替换本地的 token
    // if (response.headers.authorization) {
    //   let newToken = response.headers.authorization;
    //   console.log("后端返回的newToken", newToken);
    //   store.dispatch("refreshToken", newToken.split(" ")[1]);
    // }

    // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
    // 否则的话抛出错误
    // console.log(response);
    if (response.status === 200) {
      return Promise.resolve(response);
    } else if (response.status === 400004) {
      Message.error("用户名不存在！请重新登录");
      setTimeout(() => {
        router.replace({
          path: "/login",
          query: {
            redirect: router.currentRoute.fullPath
          }
        });
      }, 1500);
    } else {
      return Promise.reject(response);
    }
  },
  // 根据返回的状态码进行相关操作，例如登录过期提示，错误提示等等
  error => {
    if (error.response.status) {
      switch (error.response.status) {
        case 400001:
          Message({
            message: "token账号过期，请重新登录!",
            type: "warning"
          });
          // 清除token
          setTimeout(() => {
            router.replace({
              path: "/login",
              query: {
                redirect: router.currentRoute.fullPath
              }
            });
          }, 2000);
          break;
        case 402:
          Message({
            message: "token有误，请重新登录",
            type: "warning"
          });
          setTimeout(() => {
            router.replace({
              path: "/loginpassword",
              query: {
                redirect: router.currentRoute.fullPath
              }
            });
          }, 2000);
          break;
        case 403:
          Message({
            message: "未授权，无法访问",
            type: "warning"
          });
          // 清除token
          // localStorage.removeItem("adminToken");
          // store.commit("setToken", null);

          // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
          setTimeout(() => {
            router.back();
          }, 2000);
          break;
        case 500:
          Message({
            message: "错误，请重试！",
            type: "warning"
          });
          break;
        // 404请求不存在
        case 404:
          Message({
            message: "请求资源不存在",
            type: "warning"
          });
          break;
        // 其他错误，直接抛出错误提示
        case 101:
          Message({
            message: "用户不存在",
            type: "warning"
          });
          break;
        case 9000:
          Message({
            message: "网络错误，请重试",
            type: "warning"
          });
          break;
        default:
          Message(error.response.data.message);
      }
      return Promise.reject(error.response);
    }
  }
);

/**
 * get方法，对应get请求
 * @param {String} url [请求地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params
      })
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

/**
 * post方法，对应post请求
 * @param {String} url [请求地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, QS.stringify(params))
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

/**
 * delete方法
 * @param {String} url [请求地址]
 * @param {Object} params [请求时携带的参数]
 */
export function del(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${url}/${params}`)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

/**
 * put方法
 * @param {String} url [请求地址]
 * @param {Object} params [请求时携带的参数]
 */
export function put(url, params) {
  return new Promise((resolve, reject) => {
    axios
      .put(url, QS.stringify(params))
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

/**
 * 表格下载downFile方法，对应get请求
 * @param {String} url [请求地址]
 * @param {Object} params [请求时携带的参数]
 */
export function downFile(url, params) {
  axios
    .get(url, {
      params: params,
      responseType: "blob"
    })
    .then(res => {
      const blob = res.data;
      // new Blob([res.data], {
      //   type: "application/vnd.ms-excel"
      // });
      let date = new Date();
      let time =
        date.getFullYear() +
        "-" +
        (date.getMonth() + 1) +
        "-" +
        date.getDate() +
        "-" +
        date.getTime();
      let src = window.URL.createObjectURL(blob);
      let aLink = document.createElement("a");
      aLink.style.display = "none";
      aLink.href = src;
      if (blob.type == "application/pdf") {
        aLink.setAttribute("download", "PDF下载" + time + ".pdf");
      } else {
        aLink.setAttribute("download", "数据下载" + time + ".xls");
      }
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink);
      window.URL.revokeObjectURL(src);
    });
}
