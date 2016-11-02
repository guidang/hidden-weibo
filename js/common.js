/**
 * Created by Skiychan on 02/11/2016.
 */
$(function () {

    var hiddenHtml = "<div id='hidden-all'>一键隐藏</div>"
    $('body').append(hiddenHtml);

    $('#hidden-all').on('click', function () {
        var feed_list = $('.WB_feed_v4').children('div');

        var midArr = [];

        $.each(feed_list, function (i, o) {
            var oHtml = o.outerHTML;

            var reg = /mid\=\"(\d*)\"\s/;
            var d = reg.exec(oHtml);

            if (d && d[1]) {
                midArr.push(d[1]);
            }
        });

        var hiddenUrl = "http://weibo.com/p/aj/v6/mblog/modifyvisible?ajwvr=6&domain=100505&__rnd=";
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
                    if (d.code == 100000) {
                        console.log('success');
                    } else {
                        console.log(d.code);
                    }
                }
            })
        })
    })
});