# 微信公众号会员信息导出

推荐使用谷歌浏览器[Chrome](https://www.google.cn/intl/zh-CN/chrome/)安装插件[Tampermonkey](https://www.tampermonkey.net/?ext=dhdg&locale=zh)使用，其他浏览器没测试过

**加载图片缓慢？访问国内站点查看教程：https://mcyo.pw/wechat-vip-how-to/**

## 功能

导出你能看到的会员的所有信息，看起来像这个样子

| 会员  | 地区            | 姓名 | 手机        | 生日       | 状态 | 是否关注 | 标签   | 会员号         | 积分 |
| ----- | --------------- | ---- | ----------- | ---------- | ---- | -------- | ------ | -------------- | ---- |
| lucky | 中国  江苏 苏州 | 张三 | 13700000000 | 1999-9-9   | 有效 | 否       | 无标签 | 9492-3564-9589 | 11   |
| 👧     | 毛里求斯        | 赵四 | 13800000000 | 2000-10-10 | 无效 | 已关注   | 无标签 | 2391-8300-1593 | 30   |

## 步骤

### 如果你是资深玩家

用过油猴插件，那么直接[点这里打开安装页面](https://github.com/xiaoxx970/wechat_vip_info_export/raw/master/Wechat_offical_account_VIP_info_export.user.js)。

在微信公众号的`卡劵功能->会员卡-> 会员管理`界面就可以使用。

### 如果你没听说过Tampermonkey

那么你需要：

1. 下载安装谷歌浏览器：https://www.google.cn/intl/zh-CN/chrome/

2. 下载Tampermonkey插件

   去这个网站：https://www.crx4chrome.com/crx/755/

   ![image-20191215145542390](https://xiaoxx.oss-cn-beijing.aliyuncs.com/md-img/image-20191215145542390.png)

   点其中一个链接（除了google cdn 和 Chrome web store），下载插件

3. 解压插件

   下载后你得到的是一个crx格式的文件，重命名文件修改后缀，把`.crx`改成`.zip`

   ![](https://xiaoxx.oss-cn-beijing.aliyuncs.com/md-img/image-20191215150212447.png)=>![image-20191215150325561](https://xiaoxx.oss-cn-beijing.aliyuncs.com/md-img/image-20191215150325561.png)

   解压zip文件：点解压到"extension_xxx\”

   ![image-20191215150624537](https://xiaoxx.oss-cn-beijing.aliyuncs.com/md-img/image-20191215150624537.png)

   记住这个文件夹的位置

4. 安装插件

   打开Chrome浏览器，在地址栏输入`chrome://extensions/`，或者点浏览器菜单按钮 > 更多工具 > 扩展程序

   ![image-20191215151002595](https://xiaoxx.oss-cn-beijing.aliyuncs.com/md-img/image-20191215151002595.png)

   进入扩展程序页面，打开右上角开发者模式开关，点左边的`加载已解压的扩展程序`

   ![image-20191215151145803](https://xiaoxx.oss-cn-beijing.aliyuncs.com/md-img/image-20191215151145803.png)

   选择刚才解压出来的文件夹（不需要点进去，选中文件夹后就点`选择文件夹`）

   然后就可以安装好插件

   ![image-20191215151317653](https://xiaoxx.oss-cn-beijing.aliyuncs.com/md-img/image-20191215151317653.png)

   看到这个就说明安装好了

5. 安装我的脚本

   打开脚本页面：[微信公众号会员信息导出](https://greasyfork.org/zh-CN/scripts/387221-微信公众号会员信息导出-wechat-offical-account-vip-info-export)

   点`安装此脚本`

   ![image-20191215151923867](https://xiaoxx.oss-cn-beijing.aliyuncs.com/md-img/image-20191215151923867.png)

   然后在这个页面点安装，点一下就可以安装好

6. 开始做事情

   打开微信公众号的`卡劵功能->会员卡-> 会员管理`界面

   ![image-20191215152613213](https://xiaoxx.oss-cn-beijing.aliyuncs.com/md-img/image-20191215152613213.png)只要一进入会员管理页面，浏览器就会开始自动跳转，收集信息。然后就等着吧。

   平均一个会员需要4秒导出，如果九百个会员的话需要一个小时。

7. 下载导出的csv文件

   如果脚本执行完最后一页的最后一个用户，就会出现提示说导出完成，可以开始下载

   > V1.1 更新: 代码指定了N=10，每10页会下载一次当前已导出的会员，以保证意外不会丢失数据

   ![image-20191215153051694](https://xiaoxx.oss-cn-beijing.aliyuncs.com/md-img/image-20191215153051694.png)

   下载下来的`vip.csv`文件可以通过Excel打开，完事。

## 注意事项

- 打开调试工具后可以在console看到当前正在导出本页的第几个会员信息。

- 你始终可以通过浏览器右上角tampermonkey按钮终止脚本运行
  
- 任何时候你都可以把当前已经导出的会员先下载下来

  停止脚本后在console输入

  ```javascript
  function getDownloadUrl(csvData) {
      var _utf = "\uFEFF"; // 为了使Excel以utf-8的编码模式，同时也是解决中文乱码的问题
      if (window.Blob && window.URL && window.URL.createObjectURL) {
          var csvData = new Blob([_utf + csvData], {
              type: 'text/csv'
          });
          return URL.createObjectURL(csvData);
      }
  }
  function SaveAs(fileName, csvData) {
      var Sys = {};
      var ua = navigator.userAgent.toLowerCase();
      var s;
      (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1]:0;	//这里直接指定了chrome
      var bw = Sys;
      var alink = document.createElement("a");
      alink.id = "linkDwnldLink";
      alink.href = getDownloadUrl(csvData);
      document.body.appendChild(alink);
      var linkDom = document.getElementById('linkDwnldLink');
      linkDom.setAttribute('download', fileName);
      linkDom.click();
      document.body.removeChild(linkDom);
  }
  var csv = localStorage.getItem("csv")
  csv = "会员,地区,姓名,手机,生日,状态,是否关注,标签,会员号,积分\n"+csv
  SaveAs("vip.csv", csv)
  ```
  
- 终止后要想从头开始导入（或者从某一页），需要先清除cookie和localstorage数据，在console输入：

    ```js
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
  ```

- 在会员页面打开插件后不会马上开始运行脚本，要刷新一下才可以

现在还有的问题：

- 有时候会停下来不继续点下一个页面，这时候看一下console里的提示信息

  - 如果写的`next page`，那只要手动点一下下一页就可以了

  - 如果写的`step:`后面跟一个数字，那数字是几就手动点一下当前页面的第几个会员信息

  - 如果停在某个会员信息页，那可以手动返回上一页试试
---

> Note:仅仅是为我自己做的脚本，如果没达到你的要求，欢迎找我有尝定制。（比如你还需要导出会员卡使用次数、激活时间、使用记录等）QQ：987896425

> 要是你有觉得可以改进的地方，欢迎来创建Pull request。
