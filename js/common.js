/**
 * Created by Skiychan on 02/11/2016.
 */
$(function () {

    var wbUrl = window.location.href;
    var newWbUrl;
    var allCount = 0;
    var errMid = [];
    //console.log(wbUrl);

    //去除 home
    var page_id = getQueryString('page_id');
    if ((page_id != undefined) && (page_id == 'true')) {
        //var pageIdObj = $('.lev_line');
        //console.log(pageIdObj[1].outerHTML);
        
        newWbUrl = wbUrl.replace(/\/home/, "");
        newWbUrl = newWbUrl.replace(/page_id=true/, "page=1&auto=true");

        //console.log(newWbUrl);
        location.href = newWbUrl;
    }

    //自动触发隐藏功能
    var auto = getQueryString('auto');
    if ((auto != undefined) && (auto == 'true')) {
        //console.log("auto");
        //do_hidden();
        doHidden();
    }

    //所有操作的总次数
    var count = getQueryString('count');
    if (count != undefined) {
        allCount = parseInt(count);
    }

    //添加按键内置到微博
    var hiddenHtml = "<div id='hidden-all'>一键隐藏</div>"
    var doHiddenHtml = "<div id='do-hidden-all'>手动隐藏</div>"
    $('body').append(hiddenHtml);
    $('body').append(doHiddenHtml);


    /**
     * 操作隐藏
     */
    function do_hidden() {
        //取得当前页码
        var page = getQueryString('page');
        if (page == undefined) {
            page = 1;
        }
        page = parseInt(page);
        //console.log('page: ' + page);

        //下一页的 URL
        var newPage = parseInt(page) + 1;
        newWbUrl = wbUrl.replace(/page=(\d*)/, "page=" + newPage);
        //console.log('newWbUrl', newWbUrl);

        var doCount = 0;
        var midArr = [];

        /*
        var feedList = $('.WB_feed').children('div');

        //console.log('feedList', feedList);
        $.each(feedList, function (i, o) {
            var oHtml = o.outerHTML;

            var reg = /mid\=\"(\d*)\"\s/;
            var d = reg.exec(oHtml);
            //console.log('d', d);
            if (d && d[1]) {
                midArr.push(d[1]);
            }
        });*/

        //微博列表，取 mid
        var feedList = $('.WB_cardwrap.WB_feed_type');
        $.each(feedList, function (i, o) {
            var myMid = $(o).attr('mid');
            if (myMid!= undefined) {
                midArr.push(myMid);
            }
        });

        //当前页取不到数据，刷新当前页
        if (midArr.length == 0) {
            window.location.reload();
        }
        //console.log(midArr);

        var hiddenUrl = "http://weibo.com/p/aj/v6/mblog/modifyvisible?ajwvr=6&domain=100505&__rnd=";
        var midLen = midArr.length;

        $.each(midArr, function (i, v) {
            //操作隐藏触发的 URL
            var timestamp = new Date().getTime();
            var url = hiddenUrl + timestamp;

            var data = {
                visible: 1,
                mid: v,
                _t: 0
            };

            $.ajax({
                url: url,
                type: "POST",
                data: data,
                dataType: "JSON",
                timeout: 5000,
                success: function (d) {
                    doCount ++;

                    if ((d.code == 100000) || (d.code == 100001)) {
                        allCount ++;
                        //console.log('success');
                    } else {
                        //添加错误id
                        errMid.push(v);
                        //console.log(d.code);
                    }

                    //展示结果
                    if (doCount == midLen) {
                        showResert();
                    }
                    //show_result();
                },
                error: function(d) {
                    //已执行次数
                    doCount ++;
                    //添加错误id
                    errMid.push(v);
                    if (doCount == midLen) {
                        showResert();
                    }
                }
            })
        });

    }


    //点击转跳到官网页，取个人微博列表地址
    $('#hidden-all').on('click', function() {
        var goUrl = 'http://weibo.com?page_id=true';
        var page = getQueryString('page');
        if (page) {
            goUrl += '&page=' + page;
        }
        location.href = goUrl;
        //do_hidden();
   });

    //手动隐藏
    $('#do-hidden-all').on('click', function() {
        //do_hidden();
        doHidden();
   });

    /**
     * 转跳到底部，且 15s 后开始设置隐藏
     * @return {[type]} [description]
     */
    function doHidden() {
        goBottom();
        setTimeout(do_hidden, 15000);
    }

    /**
     * 显示结果
     * @return {[type]} [description]
     */
    function showResert() {
        //统计成功数量
        newWbUrl = newWbUrl.replace(/count=(\d*)/, "count=" + allCount);
        //转跳至下一页
        window.location.href = newWbUrl;

        //console.log('allCount', allCount);
        //var msg = "成功处理: " + allCount + "条信息"; 
        //var msg = "成功处理: " + doCount + " 条\r\n" + "错误信息: " + errMid.length + "条\r\n将转跳至第" + newPage + "页";
        /*
        if (confirm(msg)) {
            window.location.href = newWbUrl;
        } else {
            console.log("取消转跳");
        }*/
    }

    /**
     * 划动至底部 (懒加载完所有数据)
     * @return {[type]} [description]
     */
    function goBottom() {
        //++i;
        if ($(window).scrollTop() < $(document).height() - $(window).height()){
            $('html, body').animate({scrollTop: $(document).height()}, 0, 'swing', function() {
                //console.log(i);
                setTimeout(goBottom, 5000);
                //goBottom();
                return;
            }); 
            return;
        }
    }

});

/**
 * 获取url
 * @param name
 * @returns {*}
 */
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return (r[2]);
    }
    return null;
}