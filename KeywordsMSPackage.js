//Brook 2013-6-17

var vSiteRequest = {
    getVerticalSiteList: function () {
        Rg.net.ajax.Post.Ajax(null, "GetVerticalSiteList", vSiteCallBack.getVerticalSiteList, vSiteCallBack.error);
    }
};

var vSiteCallBack = {
    getVerticalSiteList: function (result) {
        result = result.d;
        if (result.Flag) {
            siteList = '';
            var results = result.ReturnData.Data;
            var content = "";
            $.each(results, function (i, item) {
                content += "<option sort='" + i + "' site-id='" + item.VerticalSiteID + "' industry-id='" + item.IndustryID + "' language='" + item.VerticalSiteLanguage + "'>" + item.VerticalSiteName + "</option>";
                if (i == 0) {
                    verticalSiteId = item.VerticalSiteID;
                    language = item.VerticalSiteLanguage;
                }
            });
            siteList = content;
            $("#siteSel").html(siteList);
            if (global_site != undefined) {
                $("#siteSel").find("option[site-id="+global_site+"]").attr("selected",true);
            }
            $.unblockUI();
        }
    },
    error: function (result)
    { }
};

var keywordsRequest = {
    list: function (postData) {
        Rg.net.ajax.Post.Ajax(postData, "GetKeywordsList", keywordsCallback.list, keywordsCallback.error);
    },
    count: function (postData) {
        Rg.net.ajax.Post.Ajax(postData, "GetKeywordsList", keywordsCallback.count, keywordsCallback.error);
    },
    getKeywordsList: function (postData) {
        Rg.net.ajax.Post.Ajax(postData, "GetKeywordsList", keywordsCallback.getKeywordsList, keywordsCallback.error);
    },
    getKeywordsByID: function (postData) {
        Rg.net.ajax.Post.Ajax(postData, "GetKeywordsByID", keywordsCallback.getKeywordsByID, keywordsCallback.error);
    },
    updateHitCounts: function (postData) {
        Rg.net.ajax.Post.Ajax(postData, "UpdateHitCounts", keywordsCallback.updateHitCounts, keywordsCallback.error);
    },
    updateKeywordsByID: function (postData) {
        Rg.net.ajax.Post.Ajax(postData, "UpdateKeywordsByID", keywordsCallback.updateKeywordsByID, keywordsCallback.error);
    },
    deleteKeywordsByID: function (postData) {
        Rg.net.ajax.Post.Ajax(postData, "DeleteKeywordsByID", keywordsCallback.deleteKeywordsByID, keywordsCallback.error);
    },
    createKeywords: function (postData) {
        Rg.net.ajax.Post.Ajax(postData, "CreateKeywords", keywordsCallback.createKeywords, keywordsCallback.error);
    }
};

var keywordsCallback = {
    list: function (result) {
        result = result.d;
        getList(result);
    },
    count: function (result) {
        result = result.d;
        var itemCount = result.ReturnData.ItemCount;
        
        $("#resultPagination").pagination(itemCount, {
            callback: pageselectCallback_keywords,
            items_per_page: global_perpageCount,
            num_display_entries: 3,
            current_page: (global_pageIndex-1),
            num_edge_entries: 2
        });
        
    },
    getKeywordsList: function (result) {
        result = result.d;
        if (result.Flag)
        {
            getList(result);
        }
        else { Rg.message.growlUI(result.Message); }
    },
    getKeywordsByID: function (result) {
        result = result.d;
        if (result.Flag) {
            fillKeywordsWhenUpdate(result);
        }
        else { Rg.message.growlUI(result.Message); }
    },
    updateHitCounts: function (result) {
        result = result.d;
        if (result.Flag) {
            PostData = { id: global_detailid };
            keywordsRequest.getKeywordsByID(postData);
            Rg.message.growlUI(result.Message);
        }
        else { Rg.message.growlUI(result.Message); }
    },
    updateKeywordsByID: function (result) {
        result = result.d;
        if (result.Flag) {
            Rg.message.growlUI(result.Message);
        }
        else { Rg.message.growlUI(result.Message); }
    },
    deleteKeywordsByID: function (result) {
        result = result.d;
        if (result.Flag) {
            Rg.message.growlUI(result.Message);
        }
        else { Rg.message.growlUI(result.Message); }
    },
    createKeywords: function (result) {
        result = result.d;
        if (result.Flag) {
            Rg.message.growlUI(result.Message);
        }
        else { Rg.message.growlUI(result.Message); }
    },
    error: function (result) {
        //$.unBlockUI();
    }
};

function fillKeywordsWhenUpdate(result) {
    $("#textInp").val(result.ReturnData.Data.Text);
    $("#pageSel").val(result.ReturnData.Data.PageName);
    $("#pageSel").attr("disabled", "disabled");
    global_site = result.ReturnData.Data.SiteID;
    $("#pageSel").trigger("change");
    $("#siteSel").val(result.ReturnData.Data.SiteID);
    $("#typeSel").val(result.ReturnData.Data.Type);
    $("#languageSel").val(result.ReturnData.Data.Language);
    $("#Text").val(result.ReturnData.Data.Text);
    $("#linkInp").val(result.ReturnData.Data.Link);
    $("#isDisplaySel").val(result.ReturnData.Data.IsDisplay == true ? '1' : '0');
    $("#hitCountsInp").val(result.ReturnData.Data.HitCounts);
    $("#sortSel").val(result.ReturnData.Data.Sort);
    $("#keywordsId").val(result.ReturnData.Data.ID);
}//更新页面赋值

function getList(result)
{
    $("#resultDiv").empty();
    var content = "";
    content += "<li><ul class='gridRow'><li>keywords</li><li>Link</li><li class='op'>operation</li></ul></li>";
    for (var i = 0; i < result.ReturnData.Data.length; i++) {
        content += "<li><ul class='gridRow'><li>" + result.ReturnData.Data[i].Text + "</li><li><a target='_blank' href='" + result.ReturnData.Data[i].Link + "'>" + result.ReturnData.Data[i].Link + "</a></li><li class='op'><a href='" + "/Keywords/KeywordsMSDetail.aspx?option=modify&id=" + result.ReturnData.Data[i].ID + "'>Edit</a></li><div class='clear'></div></ul></li>";//<a>Delete</a>
    }
    $("#resultDiv").html("<ul>" + content + "</ul>");
    initList();
}

function pageselectCallback_keywords(pageIndex, jq) {
    global_pageIndex = pageIndex + 1;
    global_postData.pageIndex = global_pageIndex;
    getResultList(global_pageIndex);
}
