function clearCookie(c_name) {
  var expiredays = -1
  var exdate = new Date()
  exdate.setDate(exdate.getDate() + expiredays)
  document.cookie = c_name + "=" + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
}
localStorage.removeItem("csv")
clearCookie("step")
clearCookie("page")
clearCookie("file")