/*Brook 2013-3-29*/

var whitepaperMailRequest = {
    getIndustryList: function (postData) {
        Rg.net.ajax.Post.Ajax(postData, "AdminGetIndustryList", whitepaperMailCallback.getIndustryList, whitepaperMailCallback.error);
    },
    getMail: function (postData) {
        Rg.net.ajax.Post.Ajax(postData, "getWhitepaperMail", whitepaperMailCallback.getMail, whitepaperMailCallback.error);
    },
    add: function (postData) {
        Rg.net.ajax.Post.Ajax(postData,"addWhitepaperMail",whitepaperMailCallback.add,whitepaperMailCallback.error);
    },
    modify: function (postData) {
        Rg.net.ajax.Post.Ajax(postData,"updateWhitepaperMail",whitepaperMailCallback.modify,whitepaperMailCallback.error);
    },
    sendMail: function (postData) {
        //写一个遮罩
        $.blockUI({ message: 'sending...' });
        Rg.net.ajax.Post.Ajax(postData, "SendMail", whitepaperMailCallback.sendMail, whitepaperMailCallback.error);
    }
}
var whitepaperMailCallback = {
    getIndustryList: function (data) {
        data = data.d;
        if (data.Flag) {
            var results = data.ReturnData.Data;
            for (var i = 0; i < results.length; i++) {
                //生成列表
                var option = document.createElement("option");
                option.setAttribute("value", results[i].IndustryID);
                option.text = results[i].IndustryName;
                //document.getElementById("industryList").appendChild(option);
                //$("#industryList").val(industryId); //将获取的数值绑定到select控件
            }
        }
        else {
            Rg.message.growlUI(data.Message);
        }
    },
    getMail: function (data) {
        data = data.d;
        if (data.Flag) {
            fillData(data);
        }
        else {
            //Rg.message.growlUI(data.Message);
        }
    },
    add: function (data) {
        data = data.d;
        $("#mailId").attr("value",data.ReturnData);
        Rg.message.growlUI(data.Message);
    },
    modify: function (data) {
        data = data.d;
        Rg.message.growlUI(data.Message);
    },
    sendMail: function (data) {
        data = data.d;
        Rg.message.growlUI(data.Message);
    },
    error: function (data) {
        $.unblockUI();
    }
}
