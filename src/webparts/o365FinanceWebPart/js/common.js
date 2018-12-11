var common = {
  generateUUID: function () {
    var d = new Date().getTime();
    var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == "x" ? r : (r & 0x7) | 0x8).toString(16);
      }
    );
    return uuid;
  }, //生产GUID
  getRequestDigest: function () {
    var digest = ""
    if (document.getElementById("__REQUESTDIGEST") != null) {
      digest = document.getElementById("__REQUESTDIGEST").value
    } else {
      alert("Current Request Digest Is Empty, Please Try Again!")
    }
    return digest
  }, //获取post请需要的RequestDigest
  message: function (type, message) {
    var mes = {
      showClose: true,
      message: message,
      type: type
    }
    return mes
  }, //提示信息调用方法
  queryOpt: function (parm) {
    var baseUrl = parm.baseUrl + "/_api/web";
    var queryUrl = ""
    var opt = {}
    if (parm.type == "get") {
      switch (parm.action) {
        case 'ListItems':
          queryUrl = baseUrl + "/lists/getbytitle('" + parm.list + "')/items" + parm.condition;
          break
        case 'ListItem':
          queryUrl = baseUrl + "/lists/getbytitle('" + parm.list + "')/items(" + parm.itemID + ")";
          break
        case 'ListEntity':
          queryUrl = baseUrl + "/lists/getbytitle('" + parm.list + "')/ListItemEntityTypeFullName";
          break
        case 'CurrentUser':
          queryUrl = baseUrl + "/currentuser"
          break
        case 'UserByName':
          // var accountName="i:0#.f|membership|test@test.test.test.cn"
          // var accountName = "i: 0#.w|domain\user" //sharepoint 2013 
          queryUrl = baseUrl + "/siteusers(@v)?@v='" + encodeURIComponent(parm.accountName) + "'"
          break
        case 'UserGroup':
          queryUrl = baseUrl + "/GetUserById(" + parm.userID + ")/currentuser/groups"
          break
        case 'ListFields':
          queryUrl = baseUrl + "/lists/getbytitle('" + parm.list + "')/fields";
          break
      }
      opt = {
        url: queryUrl,
        type: 'Get',
        headers: {
          'accept': 'application/json;odata=verbose'
        },
        contentType: "application/json",
      }
    } else if (parm.type == "post") {
      var headers = {}
      switch (parm.action) {
        case 'AddInList':
          queryUrl = baseUrl + "/lists/getbytitle('" + parm.list + "')/items";
          headers = {
            "Content-Type": "application/json;odata=verbose",
            "X-RequestDigest": parm.digest
          }
          break
        case 'EditListItem':
          queryUrl = baseUrl + "/lists/getbytitle('" + parm.list + "')/items(" + parm.itemID + ")";
          headers = {
            "Accept": "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose",
            "X-RequestDigest": parm.digest,
            "IF-MATCH": "*",
            "X-HTTP-Method": "MERGE"
          }
          break
      }
      opt = {
        url: queryUrl,
        method: "post",
        headers: headers,
        data: JSON.stringify(parm.item)
      }
      /* var item = {
         '__metadata': {
           type: "SP.Data.ECCSubInfoListItem" --ListType
          },
       'Title': d.Title --ListData
      }
      }*/
    } else if (parm.type == "delete") {
      switch (parm.action) {
        case 'DeleteListItem':
          queryUrl = baseUrl + "/lists/getbytitle('" + parm.list + "')/items(" + parm.itemID + ")";
          break
      }
      opt = {
        url: queryUrl,
        type: "DELETE",
        headers: {
          "accept": "application/json;odata=verbose",
          "X-RequestDigest": parm.digest,
          "IF-MATCH": "*"
        },
      }
    }
    return opt
  }, //Rest API请求option
  
}
export default common
