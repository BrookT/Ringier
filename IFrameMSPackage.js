
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
        Rg.net.ajax.Post.Ajax(postData, "updateIframe", iframeCallBack.updateIFrame, iframeCallBack.error);
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
            if (result.ReturnData.Data.ID != '0') {
                status = 'update';
            }
            else { status = 'insert'; }
            $("#iframeLink").val(result.ReturnData.Data.IFrameLink);
            $("#iframeHeight").val(result.ReturnData.Data.IFrameHeight);
            $("#iframeWidth").val(result.ReturnData.Data.IFrameWidth);
            $("#iframeIsDisplay").val(result.ReturnData.Data.IsDisplay == true ? 1 : 0);
            currentID = result.ReturnData.Data.ID;
            pageLanguage = result.ReturnData.Data.PageLanguage;
            siteID = result.ReturnData.Data.SiteID;
            positionInSite = result.ReturnData.Data.PositionInSite;
            //返回数据
        }
    },
    createIFrame: function (result) {
        result = result.d;
        if (result.Flag) {
            currentID = result.ReturnData.Data;
            if (currentID != '0')
            { status = 'update'; }
            else
            {
                status = 'insert';
            }
            Rg.message.growlUI(result.Message);
            //创建后提示操作成功
        }
        else { Rg.message.growlUI('failed'); }
    },
    updateIFrame: function (result) {
        result = result.d;
        if (result.Flag) {
            Rg.message.growlUI(result.Message);
            //更新成功逻辑
        }
        else { Rg.message.growlUI('failed); }
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
