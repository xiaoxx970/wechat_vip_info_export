# 微信公众号会员信息导出
[点这里安装](https://github.com/xiaoxx970/wechat_vip_info_export/raw/master/Wechat_offical_account_VIP_info_export.user.js)（需要浏览器已经安装Tampermonkey）

脚本功能：导出微信公众号后台的所有会员卡信息，格式为csv，可以直接复制进Excel里面，方便其他平台导入。

在微信公众号的`卡劵功能->会员卡-> 会员管理`界面使用，脚本会自动从第一个会员详情点开，把会员信息保存到浏览器的localstorage后返回，继续点开下一个。

最好在前台运行，打开调试工具后可以在console看到当前正在导出本页的第几个会员信息。

到最后一页的时候就把localstorage里的信息作为文件让浏览器下载。

你始终可以通过浏览器右上角tampermonkey按钮终止脚本运行
终止后要想从头开始导入，需要先清除cookie和localstorage数据，在console输入：

```js
function clearCookie(c_name) {
    var expiredays = -1
    var exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    document.cookie = c_name + "=" + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
}
localStorage.removeItem("csv")
clearCookie("step")
```

现在还有的问题：
- 导出的会员有没写生日的，会出现错位的情况
    解决方法：在Excel里面排序后把没有生日的往又拖一格就可以了
- 导出结束后可能会停在最后一页，不下载csv文件
    解决方法：打开console手动运行这三行：
    ```js
    var csv = localStorage.getItem("csv")
    csv = "会员,地区,姓名,手机,生日,浏览器状态,是否关注,标签,会员号,积分\n"+csv
    window.open("data:text/csv;charset=utf-8,"+csv)
    ```
---

> Note:仅仅是为我自己做的脚本，如果没达到你的要求，欢迎找我有尝定制。QQ：987896425

> 要是你有觉得可以改进的地方，欢迎来创建Pull request。
