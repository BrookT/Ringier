//Brook 2013-6-8

var postData;

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
        switch ($("#pagePosList>option:checked").attr("value")) {
            case "VerticalSites":
                postData = {
                    id: null,
                    pageLanguage: $("#pageLanguageList>option:checked").attr("value"),
                    siteID: $("#siteList>option:checked").attr("verticalsite-id"),
                    positionInSite: $("#posInSite>option:checked").attr("value")
                };
                break;
            default: break;
        }
        findIFrame(postData);
    });
}
function GetVerticalSiteList() {
    vSiteRequest.getVerticalSiteList();
}

function findIFrame(postData) {
    iframeRequest.getIFrame(postData);
}

function GetPosInSite() {
    var result = "";
    var array = ["top left", "top middle", "top right", "middle left", "middle middle", "middle right", "bottom left", "bottom middle", "bottom right"];
    for (var i = 0; i < array.length; i++) {
        result += "<option value=" + (i+1) + ">" + array[i] + "</option>";
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
