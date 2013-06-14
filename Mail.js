/*Brook 2013-3-29*/

var editorMailContent = null;
var industryId = 0;
var lan='chs';
var ueditorConfig1 = {
    resizeType: 1,
    uploadJson: '/Scripts/Kindeditor/asp.net/imageUp.ashx',
    fileManagerJson: '/Scripts/Kindeditor/asp.net/imageManager.ashx',
    allowPreviewEmoticons: false,
    allowImageUpload: true,
    langType: lan,
    extraFileUploadParams: { param1: lan, param2: "whitepaperMail" },
    //工具栏浮动
    items: [
        'source', '|', 'undo', 'redo', '|',
        'preview', 'fontname', 'fontsize', '|',
        'forecolor', 'hilitecolor', 'bold', 'italic', 'underline', 'removeformat', '|',
        'justifyleft', 'justifycenter', 'justifyright', 'insertorderedlist', 'insertunorderedlist', '|',
        'image', 'link'
    ],
};

$(function () {
    initPage();
    bindEvents();
})
function initPage() {
    setTimeout(function () {
        createKindEditor(lan);
    }, 1);
    whitepaperMailRequest.getIndustryList(
       postData = {
           language: null
       });//初始化industryList
    var option = document.createElement("option");
    option.setAttribute("value", "none");
    option.text = "None";

    postData = {language:lan};
    whitepaperMailRequest.getMail(postData);//若有则获取
    //document.getElementById("industryList").appendChild(option);//新增全部行业的选项
}
function bindEvents() {
    $("#languageList").change(function () {
        initControls();
        lan = $("#languageList>option:checked").attr("value");
        createKindEditor(lan);
        postData = { language: lan };
        whitepaperMailRequest.getMail(postData);//若有则获取
    });
    $("#save").live("click", function () {
        if ($("#mailId").attr("value") == "0") {
            //add
            postData = {
                language:$("#languageList>option:checked").attr("value"),
                industryId:0,
                siteId:1,
                senderMail:$("#mailSender").val(),
                senderPwd:$("#senderPwd").val(),
                title:$("#mailTitle").val(),
                content: editorMailContent.html().replace("http://rms.industrysourcing.com/", "")
                
            };
            whitepaperMailRequest.add(postData);
        }
        else {
            //modify
            postData = {
                id: $("#mailId").attr("value"),
                language:$("#languageList>option:checked").attr("value"),
                industryId:0,
                siteId:1,
                senderMail:$("#mailSender").val(),
                senderPwd:$("#senderPwd").val(),
                title:$("#mailTitle").val(),
                content: editorMailContent.html().replace("http://rms.industrysourcing.com/", "")
                
            };
            whitepaperMailRequest.modify(postData);
        }
    });
    $("#testMailBtn").live("click", function () {
        postData = {
            senderMail: $("#mailSender").val(),
            senderPwd: $("#senderPwd").val(),
            title: $("#mailTitle").val(),
            content: editorMailContent.html(),
            recieverMail: $("#testMailAddr").val(),
            recieverName: $("#testMailName").val()
        };
        whitepaperMailRequest.sendMail(postData);
    });
}



function createKindEditor(lang) {
    if (editorMailContent) {
        editorMailContent.remove();
        editorMailContent = null;
    }
    ueditorConfig1.langType = (lang == "chs") ? "zh_CN" : "en";
    ueditorConfig1.extraFileUploadParams.param1 = ueditorConfig1.langType;
    editorMailContent = KindEditor.create('#editorMailContent', ueditorConfig1);
}

function initControls()
{
    $("#mailSender").val("");
    $("#senderPwd").val("");
    $("#mailTitle").val("");
    editorMailContent.html("");
    $("#mailId").attr("value","0");
}//初始化控件

function fillData(data) {
    lan = $("#languageList>option:checked").attr("value");
    $("#mailId").attr("value", data.ReturnData.Id);
    //$("#languageList").val(data.ReturnData.Language);
    $("#mailSender").val(data.ReturnData.SenderMail);
    $("#senderPwd").val(data.ReturnData.SenderPwd);
    $("#mailTitle").val(data.ReturnData.Title);
    if (data.ReturnData.Content != null) {
        editorMailContent.html(data.ReturnData.Content);
    }
    createKindEditor(lan);
}
