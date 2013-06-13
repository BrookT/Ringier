

var vSiteRequest = {
    getVerticalSiteList: function () {
        Rg.net.ajax.Post.Ajax(null, "GetVerticalSiteList", vSiteCallBack.getVerticalSiteList, vSiteCallBack.error);
    }
};

var vSiteCallBack = {
    getVerticalSiteList: function (result) {
        result = result.d;
        if (result.Flag) {
            $("#siteList").empty();
            var results = result.ReturnData.Data;
            var content = "";
            $.each(results, function (i, item) {
                content += "<option sort='" + i + "' verticalSite-id='" + item.VerticalSiteID + "' industry-id='" + item.IndustryID + "' language='" + item.VerticalSiteLanguage + "'>" + item.VerticalSiteName + "</option>";
                if (i == 0) {
                    verticalSiteId = item.VerticalSiteID;
                    language = item.VerticalSiteLanguage;
                }
            });
            $("#siteList").append(content);
        }
    },
    error: function (result)
    { }
};

var iframeRequest =
{
    getIFrame: function (postData) {
        Rg.net.ajax.Post.Ajax(postData, "getIFrame", iframeCallBack.getIFrame, iframeCallBack.error);
    },
    createIFrame: function (postData) {
        Rg.net.ajax.Post.Ajax(postData, "createIframe", iframeCallBack.createIFrame, iframeCallBack.error);
    },
    updateIFrame: function (postData) {
        Rg.net.ajax.Post.Ajax(postData, "updateIframe", iframeCallBack.updateIframe,iframeCallBack.error);
    },
    deleteIFrame: function (postData)
    {
        Rg.net.ajax.Post.Ajax(postData,"deleteIFrame",iframeCallBack.deleteIFrame,iframeCallBack.error);
    }
};

var iframeCallBack = {
    getIFrame: function (result)
    {
        result = result.d;
        if (result.Flag)
        {
            //返回数据
        }
    },
    createIFrame: function (result) {
        result = result.d;
        if (result.Flag)
        {
            //创建后提示操作成功
        }
    },
    updateIFrame: function (result) {
        result = result.d;
        if (result.Flag)
        {
           //更新成功逻辑
        }
    },
    deleteIFrame: function (result) {
        if (result.Flag)
        {
            //成功删除逻辑
        }
    },
    error: function (result)
    {

    }
};
