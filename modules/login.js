'use strict';

const md5 = require("md5");
const axios = require("axios").default;
const cheerio = require("cheerio");
const qs = require("query-string");
const axiosCookieJarSupport = require('axios-cookiejar-support').default;
const tough = require('tough-cookie');
const studentProfile = require("./studentProfile");
const showTimeTable = require("./showTimeTable");
const { generateAccessToken } = require("./jwt");

axiosCookieJarSupport(axios);
const cookieJar = new tough.CookieJar();

module.exports = async (username, password) => {
  const url = `${process.env.HOST_API}/CMCSoft.IU.Web.Info/Login.aspx`

  axios.defaults.jar = cookieJar;
  axios.defaults.withCredentials = true;
  axios.defaults.crossdomain = true;

  const formData = qs.stringify({
    txtUserName: username,
    txtPassword: md5(password),
    btnSubmit: 'Đăng nhập',
    __EVENTTARGET: ''
  });

  try {
    const response = await axios.post(url, formData, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) coc_coc_browser/76.0.114 Chrome/70.0.3538.114 Safari/537.36",
        "Content-Type": "application/x-www-form-urlencoded"
      },
    })

    const $ = cheerio.load(response.data)
    const userFullName = $('#PageHeader1_lblUserFullName').text().toLowerCase()
    const errorInfo = $('#lblErrorInfo').text()

    let res = {}

    if (errorInfo) {
      res = {
        status: 400
      }
    }
    else {
      if (userFullName != 'khách') {
        let dataStudentProfile = {},
          dataSchedule = [];
        await studentProfile(cookieJar)
          .then(response_studentProfile => {
            dataStudentProfile = response_studentProfile.data;
          })
        await showTimeTable(cookieJar)
          .then(response_showTimeTable => {
            dataSchedule = response_showTimeTable.data;
          })
        const token = generateAccessToken({
          studentProfile: dataStudentProfile,
          schedule: dataSchedule
        })
        const uid = generateAccessToken({ uid: username })
        res = {
          status: 200,
          token, uid
        }
      }
      else {
        res = {
          status: 400
        }
      }
    }

    return Promise.resolve(res)
  } catch (error) {
    return Promise.reject({
      status: 500,
      message: error
    })
  }

}