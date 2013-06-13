//Brook 2013-6-8

var postData;
var currentID = 0;
var pageLanguage;
var siteID;
var positionInSite;
var status;

$(function () {
    initPage();
    bindEvents();
});

function initPage() {
    $("#pagePosList").val("VerticalSites");
    $("#pagePosList").attr("disabled", "disabled");
    if (IsVSite()) {
        GetVerticalSiteList();
    }
    GetPosInSite();
}

function bindEvents() {
    $("#pagePosList").change(function () {
        switch ($("#pagePosList>option:checked").attr("value")) {
            case "VerticalSites": GetVerticalSiteList(); break;
            default: break;
        }
    });

    $("#showEffect").live("click", function () {
        ShowEffect();
    });

    $("#findBtn").live("click", function () {
        postData = getPostData();
        findIFrame(postData);
    });

    $("#save").live("click", function () {
        if (status==="insert")
        {
            postData= getRunUIDPostData("insert");
            insertIFrame(postData);
        }
        else if (status==="update")
        {
            postData = getRunUIDPostData("update");
            updateIFrame(postData);
        }
    });
}
function GetVerticalSiteList() {
    vSiteRequest.getVerticalSiteList();
}

function findIFrame(postData) {
    iframeRequest.getIFrame(postData);
}

function insertIFrame()
{
    postData = getRunUIDPostData("insert");
    iframeRequest.createIFrame(postData);
}

function updateIFrame() {
    iframeRequest.updateIFrame(postData);
}

function GetPosInSite() {
    var result = "";
    var array = ["top left", "top middle", "top right", "middle left", "middle middle", "middle right", "bottom left", "bottom middle", "bottom right"];
    for (var i = 0; i < array.length; i++) {
        result += "<option value=" + (i + 1) + ">" + array[i] + "</option>";
    }
    $("#posInSite").html(result);
}

function ShowEffect() {
    var result = "";
    result += "<iframe scrolling='no' frameborder=0 src='" + $("#iframeLink").attr("value") + "' height='" + $("#iframeHeight").attr("value") + "' width='" + $("#iframeWidth").attr("value") + "'></iframe>";
    $("#testDiv").html(result);
}

function IsVSite() {
    if ($("#pagePosList>option:checked").attr('value') === "VerticalSites") {
        return true;
    }
    else { return false; }
}

function getPostData() {
    switch ($("#pagePosList>option:checked").attr("value")) {
        case "VerticalSites":
            postData = {
                id: null,
                pageLanguage: $("#pageLanguageList>option:checked").attr("value"),
                siteID: $("#siteList>option:checked").attr("verticalsite-id"),
                positionInSite: $("#posInSite>option:checked").attr("value"),
                pageName: $("#pagePosList").val()
            };
            break;
        default: break;
    }
    return postData;
}

//opName : operation name (update delete insert)
function getRunUIDPostData(opName) {
    switch ($("#pagePosList>option:checked").attr("value")) {
        case "VerticalSites":
            switch (opName) {
                case "update":
                    postData = {
                        id: currentID,
                        pageName:$("#pagePosList").val(),
                        pageLanguage: pageLanguage,
                        siteID: siteID,
                        positionInSite: positionInSite,
                        iFrameLink: $("#iframeLink").val(),
                        iFrameHeight: $("#iframeHeight").val(),
                        iFrameWidth: $("#iframeWidth").val(),
                        isDisplay: $("#iframeIsDisplay>option:checked").attr("value")
                    };
                    break;
                case "insert":
                    postData = {
                        pageName: $("#pagePosList").val(),
                        pageLanguage: pageLanguage,
                        siteID: siteID,
                        positionInSite: positionInSite,
                        iFrameLink: $("#iframeLink").val(),
                        iFrameHeight: $("#iframeHeight").val(),
                        iFrameWidth: $("#iframeWidth").val(),
                        isDisplay: $("#iframeIsDisplay>option:checked").attr("value")
                    };
                    break;
                case "delete": break;
                default: break;
            }
            break;
        default: break;
    }
    return postData;
}
