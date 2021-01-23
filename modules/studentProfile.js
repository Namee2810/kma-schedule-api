'use strict';

const axios = require("axios").default;
const cheerio = require("cheerio");

module.exports = async (cookieJar) => {
  const url = `${process.env.HOST_API}/CMCSoft.IU.Web.Info/StudentProfileNew/HoSoSinhVien.aspx`

  axios.defaults.jar = cookieJar;
  axios.defaults.withCredentials = true;
  axios.defaults.crossdomain = true;

  try {
    let response = await axios.get(url)

    const $ = cheerio.load(response.data)
    const displayName = ($('input[name="txtHoDem"]').val() || '') + " " + ($('input[name="txtTen"]').val() || '');
    const studentCode = $('input[name="txtMaSV"]').val() || '';
    const gender = $('select[name="drpGioiTinh"] > option[selected]').text();
    const birthday = $('input[name="txtNgaySinh"]').val() || '';
    const information = {
      displayName,
      studentCode,
      gender,
      birthday,
    }

    let res = {
      status: 200,
      data: information
    }

    return Promise.resolve(res)
  }
  catch (err) {
    let res = {
      status: 400
    }

    return Promise.reject(res)
  }
}