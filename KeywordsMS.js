//Brook 2013-6-17
//Brook 2013-6-17
var option = "add";
var global_pathName;
var global_detailid = 0;
var siteList;
var global_pageName;
var global_sort;
var global_max_sort = 6;
var postData;
var global_pageIndex=1;//默认显示第一页
var global_perpageCount = 10;//默认一页十条数据
var global_site;
var global_postData;

$(function () {
    global_pathName = window.location.pathname;
    initPage();
});

function initPage() {
    //for init public 
    $("#pageSel").html(getPageSel());
    $("#languageSel").html(getLanguageSel());
    $("#isDisplaySel").html(getIsDisplaySel());
    global_pageName = $("#pageSel>option:checked").attr("value");
    $("#pageSel").html();
    $("#typeSel").html(getTypeSel(global_pageName));
    $("#siteSel").html(getSiteSel(global_pageName));
    //for init special
    if (judgePage(global_pathName) === "ListPage") {
        initListPage();
        listBindEvents();
    }
    else if (judgePage(global_pathName) === "DetailPage") {
        initDetailPage();
    }

    //bind events
    $("#pageSel").change(function () {
        global_pageName = $(this).val();
        $("#siteSel").html(getSiteSel(global_pageName));
    });
}

function initListPage() {
    global_postData = {
        pageName: null,
        siteId: null,
        language: null,
        isDisplay: '1',
        type: null,
        hitCounts: null,
        perpageCount: global_perpageCount,
        pageIndex: 1
    };
    getResultCount(global_postData);
}

function listBindEvents() {
    $("#searchBtn").click(function () {
        global_pageIndex = 1;
        global_postData = {
            pageName: $("#pageSel").val(),
            siteId: $("#siteSel>option:checked").attr("site-id"),
            language: $("#languageSel").val(),
            isDisplay: $("#isDisplaySel").val(),
            type: $("#typeSel").val(),
            hitCounts: null,
            perpageCount: global_perpageCount,
            pageIndex: global_pageIndex
        };
        getResultCount(global_postData);
    });
    $("#defaultBtn").click(function () {
        global_pageIndex = 1;
        global_postData = {
            pageName: null,
            siteId: null,
            language: null,
            isDisplay: '1',
            type: null,
            hitCounts: null,
            perpageCount: global_perpageCount,
            pageIndex: global_pageIndex
        };
        getResultCount(global_postData);
    });
}

function initDetailPage() {
    option = $.query.get("option")
    global_detailid = $.query.get("id");

    $("#sortSel").html(getSortSel());
    $("#linkUseSel").html(getLinkUseSel());
    $("#hitCountsInp").val(0);
    $("#hitCountsInp").attr("disabled", "disabled");
    judgeAndInitDetailPage(option, global_detailid);

    //bind events
    $("#saveBtn").live('click', function () {
        save();
    });
}// init detail page

function initAddForDetailPage() {

}//init add page in detail

function addBindEvents() { }

function initModifyForDetailPage(id) {
    postData = {
        id:id
    };
    keywordsRequest.getKeywordsByID(postData);
    $("#siteSel").attr("disabled","disabled");
    $("#btnLi").html($("#btnLi").html() + "<input style='margin-left:20px;' type='button' id='deleteBtn' value='delete' />" + "<input style='margin-left:20px;' type='button' id='hitBtn' value='hit' />");
}//init modify page in detail

function detailBindEvents() {

}

function modifyBindEvents() {
    $("#deleteBtn").live("click", function () {
        postData = {
            id:global_detailid
        };
        keywordsRequest.deleteKeywordsByID(postData);
    });
    $("#hitBtn").live("click", function () {
        hit();
    });
}

function judgePage(pathname) {
    if (pathname === '/Keywords/KeywordsMS.aspx') {
        return "ListPage";
    }
    else if (pathname === '/Keywords/KeywordsMSDetail.aspx') {
        return "DetailPage";
    }
}

function judgeAndInitDetailPage(option, id) {
    if (option === "add") {
        //insert data page
        initAddForDetailPage();
        addBindEvents();
    }
    else if (option === "modify" || id != 0) {
        //update data page
        initModifyForDetailPage(id);
        modifyBindEvents();
    }
    else { }//for extend
}

function getTypeSel(pageName) {
    switch (pageName) {
        case 'home':
        case 'verticalsite': return "<option value=\"product\">Hot Product</option><option value=\"article\">Hot Article</option>"; break;
        default: break;
    }
}

function getSortSel() {
    var sortResult = "";
    for (var i = 0; i < global_max_sort; i++) {
        sortResult += "<option value='" + (i + 1) + "'>" + (i + 1) + "</option>";
    }
    return sortResult;
}

function getLinkUseSel() {
    var result = "";
    result += "<option value=\"automatic\">Automatic generation of link</option>"
    result += "<option value=\"handwritten\">Hand written link</option>";
    return result;
}

function getSiteSel(pageName) {
    var result = "";
    switch (pageName) {
        case 'home': result = "<option value='home' site-id='0'>HomePage</option>"; break;
        case 'verticalsite':
            $.blockUI('getting site data...');
            vSiteRequest.getVerticalSiteList();
            break;
        default: break;
    }
    return result;
}

function getLanguageSel() {
    var result = "";
    result += "<option value=\"chs\">中文</option>";
    result += "<option value=\"eng\">Eng</option>";
    return result;
}

function getIsDisplaySel() {
    var result = "";
    result += "<option value=\"1\">show</option>";
    result += "<option value=\"0\">hide</option>";
    return result;
}

function getPageSel() {
    var result = "";
    result += "<option value=\"home\">Home Page</option>";
    result += "<option value=\"verticalsite\">Vertical Site</option>";
    return result;
}

function save() {
    if (option === 'add') {
        postData = {
            text: $("#textInp").val(),
            link: $("#linkInp").val(),
            pageName: $("#pageSel").val(),
            siteId: $("#siteSel>option:checked").attr("site-id"),
            language: $("#languageSel").val(),
            sort: $("#sortSel").val(),
            isDisplay: $("#isDisplaySel").val(),
            type: $("#typeSel").val()
        };
        keywordsRequest.createKeywords(postData);

    }
    else if (option === 'modify') {
        postData = {
            id: global_detailid,
            text: $("#textInp").val(),
            link: $("#linkInp").val(),
            pageName: $("#pageSel").val(),
            siteId: $("#siteSel>option:checked").attr("site-id"),
            language: $("#languageSel").val(),
            sort: $("#sortSel").val(),
            isDisplay: $("#isDisplaySel").val(),
            type: $("#typeSel").val()
        };
        keywordsRequest.updateKeywordsByID(postData);
    }
}

function hit() {
    postData = { id: global_detailid };
    keywordsRequest.updateHitCounts(postData);
}

function getResultList(pageIndex) {
   keywordsRequest.list(global_postData);
}

function getResultCount(postData) {
    keywordsRequest.count(postData);
}


function initList() {
    //alert($("#resultDiv>ul>li").eq(1).html());
    $("#resultDiv>ul>li>ul").each(function () {
        var obj = $(this).children("li");
        obj.eq(0).css("width", "300px");
        obj.eq(1).css("width", "500px");
        obj.eq(2).css("width","100px");
    })
    $("#resultDiv>ul>li:even>ul>li").css("background-color", "#E0E0E0");
    $("#resultDiv>ul>li:odd>ul>li").css("background-color", "#FFFACD");
    $("#resultDiv>ul>li:even>ul>li").mouseover(function () { $(this).parent().children("li").css("background-color", "#FFE4C4") }).mouseout(function () { $(this).parent().children("li").css("background-color", "#E0E0E0") });
    $("#resultDiv>ul>li:odd>ul>li").mouseover(function () { $(this).parent().children("li").css("background-color", "#FFE4C4") }).mouseout(function () { $(this).parent().children("li").css("background-color", "#FFFACD") });
}//控制列表样式
