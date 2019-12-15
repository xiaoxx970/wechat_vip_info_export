// ==UserScript==
// @name         微信公众号会员信息导出[Wechat_offical_account_VIP_info_export]
// @namespace    https://github.com/xiaoxx970/wechat_vip_info_export
// @version      0.9
// @description  导出微信公众号的所有会员卡信息，保存为csv格式
// @author       Xiaoxx
// @match        https://mp.weixin.qq.com/merchant/membercardmgr?*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    function getCookie(c_name) {
        if (document.cookie.length > 0) {
            var c_start = document.cookie.indexOf(c_name + "=")
            if (c_start != -1) {
                c_start = c_start + c_name.length + 1
                var c_end = document.cookie.indexOf(";", c_start)
                if (c_end == -1) c_end = document.cookie.length
                return unescape(document.cookie.substring(c_start, c_end))
            }
        }
        return ""
    }
    function setCookie(c_name, value) {
        var expiredays = 365
        var exdate = new Date()
        exdate.setDate(exdate.getDate() + expiredays)
        document.cookie = c_name + "=" + escape(value) +
            ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())
    }
    function read_info() {
        var info = document.getElementsByClassName("msg_pre_view")[0].innerText
        var info_array = info.split("\n") // 转换信息为数组
        info_array[1] = info_array[1].replace(" ", "") // 删掉会员名后面小笔的图标
        info_array[info_array.length - 3] = info_array[info_array.length - 3].replace("发消息", "") // 删除按钮标签里的文字
        var info_es = []
        var info_head = []
        var info_no = info_array["length"] / 2
        for (var i = 0; i < info_no; i++) {
            info_head[i] = info_array.splice(0, 1)[0]; // 偶数行为head
            info_es[i] = info_array.splice(0, 1)[0]; // 奇数行为内容
        }
        if (info_head[4] != "生日") // 解决没填生日导致错位的问题
            info_es.splice(4, 0, "无")
        var card_no = document.getElementsByClassName("msg_pre_view")[1].getElementsByTagName("span")[1].innerText
        var card_point = parseInt(document.getElementsByClassName("msg_pre_view")[1].getElementsByTagName("span")[2].innerText)
        info_head.push("会员号", "积分")
        info_es.push(card_no, card_point)
        var csv = info_es.join(",")
        return csv
    }
    function getDownloadUrl(csvData) {
        var _utf = "\uFEFF"; // 为了使Excel以utf-8的编码模式，同时也是解决中文乱码的问题
        if (window.Blob && window.URL && window.URL.createObjectURL) {
            var csvData = new Blob([_utf + csvData], {
                type: 'text/csv'
            });
            return URL.createObjectURL(csvData);
        }
    }
    function SaveAs(fileName, csvData) { // 保存scv文件用
        var Sys = {};
        var ua = navigator.userAgent.toLowerCase();
        var s;
        (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] : 0; // 这里直接指定了chrome
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
    window.addEventListener('load', function () {
        var step = parseInt(getCookie("step"))
        if (window.location.search.has("action=user_list")) { // 分支1：在会员列表页
            if (getCookie("step") == "") {
                step = 1;
                setCookie("step", step);
            }
            if (step > 10) { // 去往下一页
                step = 1;
                setCookie("step", step);
                try {
                    document.getElementById("js_next_page").click()
                }
                catch (err) {
                    alert("导出完成，下载csv文件")
                    var csv = localStorage.getItem("csv")
                    csv = "会员,地区,姓名,手机,生日,状态,是否关注,标签,会员号,积分\n" + csv
                    SaveAs("vip.csv", csv)
                }
                console.log("next page")
                return // 这个return必须要否则下一页的点击速度赶不上去详情页的速度
            }
            console.log("step:" + step)
            setCookie("back_url", window.location.href)
            try {
                window.location.href = document.getElementsByClassName("tbody")[0].getElementsByTagName("a")[step * 2 - 1].href//去往详情页
            }
            catch (err) {
                alert("导出完成，下载csv文件")
                var csv = localStorage.getItem("csv")
                csv = "会员,地区,姓名,手机,生日,状态,是否关注,标签,会员号,积分\n" + csv
                SaveAs("vip.csv", csv)
            }
            return
        }
        if (window.location.search.has("action=user_detail")) { // 分支2：在会员详情页
            step++;
            setCookie("step", step)
            /*在这里做事情*/
            var csv = localStorage.getItem("csv")
            if (csv == null) {
                csv = ""
                localStorage.setItem("csv", csv)
            }
            csv = csv + "\n" + read_info()
            localStorage.setItem("csv", csv) // 用localstorage存储csv
            console.log("back")
            window.location.href = getCookie("back_url")
            //window.history.back();//后退
            //return
        }
    }, false);
}
)();
