/**
 * Created by Skiychan on 02/11/2016.
 */
$(function () {

    var allCount = 0;
    var errMid = [];

    var hiddenHtml = "<div id='hidden-all'>一键隐藏</div>"
    $('body').append(hiddenHtml);

    /**
     * 操作隐藏
     */
    function do_hidden() {
        var page = getQueryString('page');
        page = parseInt(page);
        console.log('page: ' + page);

        var newPage = parseInt(page) + 1;
        var wbUrl = window.location.href;
        var newWbUrl = wbUrl.replace(/page=(\d*)/, "page=" + newPage);
        console.log(newWbUrl);

        var feedList = $('.WB_feed').children('div');

        var doCount = 0;

        var midArr = [];

        $.each(feedList, function (i, o) {
            var oHtml = o.outerHTML;

            var reg = /mid\=\"(\d*)\"\s/;
            var d = reg.exec(oHtml);

            if (d && d[1]) {
                midArr.push(d[1]);
            }
        });

        var hiddenUrl = "http://weibo.com/p/aj/v6/mblog/modifyvisible?ajwvr=6&domain=100505&__rnd=";
        var midLen = midArr.length;

        $.each(midArr, function (i, v) {
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
                success: function (d) {
                    doCount ++;

                    if ((d.code == 100000) || (d.code == 100001)) {
                        allCount ++;
                        //console.log('success');
                    } else {
                        errMid.push(v);
                        //console.log(d.code);
                    }


                    if (doCount == midLen) {
                        console.log('errMid', errMid);
                        console.log('doCount', doCount);
                        console.log('allCount', allCount);

                        var msg = "成功处理: " + doCount + " 条\r\n" + "错误信息: " + errMid.length + "条\r\n将转跳至第" + newPage + "页";
                        if (confirm(msg)) {
                            window.location.href = newWbUrl;
                        } else {
                            console.log("取消转跳");
                        }
                    }
                    //show_result();
                }
            })
        });

    }


    $('#hidden-all').on('click', function() {
        do_hidden();
   });

    function go_bottom() {
        if ($(window).scrollTop() < $(document).height() - $(window).height()){
            $('html, body').animate({scrollTop: $(document).height()}, 0, 'swing', function() {
                console.log(123);
            }); 
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