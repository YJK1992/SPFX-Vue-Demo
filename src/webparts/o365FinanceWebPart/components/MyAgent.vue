<template>
  <div id="MyAgent">
    {{msg}}
    <el-button type="primary" @click="downExcel">导出</el-button>
    <tr>
      <td colspan="10" align="left">
        <el-upload
          class="upload-demo"
          :action="actionUrl"
          :on-success="uploadSuccess"
          :on-error="uploadErr"
          :on-remove="removeFile"
          :limit="1"
          :on-exceed="fileLimit"
          :file-list="fileList"
          :show-file-list="flg"
        >
          <el-button type="primary">导入</el-button>
        </el-upload>
      </td>
    </tr>
  </div>
</template>
<script>
import $ from "jquery";
import efn from "../js/json2excel.js";
import common from "../js/common.js";
import sprestlib from "sprestlib/dist/sprestlib.js"
export default {
  data() {
    return {
      msg: "MyAgent",
      actionUrl: "https://lenovonetapp.sharepoint.cn/",
      excelData: [
        {
          name: "张三",
          birthday: "2222",
          sex: "男",
          age: 28
        },
        {
          name: "李四",
          birthday: "1111",
          sex: "女",
          age: 27
        }
      ],
      fileList: [],
      flg: false
    };
  },
  methods: {
    removeFile: function(file, fileList, index) {
      console.log("Remove file");
    }, //移除上传文件列表文件钩子函数
    downExcel: function() {
      console.log("111111111111")
      console.log(sprestlib)
      //alert("Success333333444")
      // var th = ["姓名", "生日", "性别", "年龄"];
      // var filterVal = ["name", "birthday", "sex", "age"];
      // var data = this.excelData.map(v => filterVal.map(k => v[k]));
      // var [fileName, fileType, sheetName] = ["测试下载", "xlsx", "测试页"];
      // var parm = {
      //   excelColumns: th,
      //   excelData: data,
      //   fileName: "test报表",
      //   fileType: "xls",
      //   sheetName: "test"
      // };
      // efn.toExcel(parm);
    },
    uploadSuccess: function(response, file, fileList) {
      var fileInfo = file.raw;
      var fileName = file.name;
      var getFile = common.getFileBuffer(fileInfo);
      getFile
        .done(f => {
          efn.excelToJson(f);
          var addFile = this.addFileToFolder(f, fileName);
          addFile
            .done(fd => {
              console.log("add success");
              console.log(fd);
              var getFile = this.getFileItem(
                fd.d.ListItemAllFields.__deferred.uri
              );
              getFile
                .done(fi => {
                  console.log(fi);
                })
                .catch(err => {
                  console.log(err);
                });
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(err => {
          console.log(err);
        });
    },
    addFileToFolder: function(arrayBuffer, fileName) {
      // Get the file name from the file input control on the page.
      var appWebUrl = "https://lenovonetapp.sharepoint.cn/sites/SPFX";
      var serverRelativeUrlToFolder =
        "https://lenovonetapp.sharepoint.cn/sites/SPFX/TaxLibrary";
      // Construct the endpoint.
      // var fileCollectionEndpoint = String.format(
      //   "{0}/_api/web/getfolderbyserverrelativeurl('{1}')/files" +
      //     "/add(overwrite=true, url='{2}')",
      //   appWebUrl,
      //   serverRelativeUrlToFolder,
      //   fileName
      // );
      var fileCollectionEndpoint =
        appWebUrl +
        "/_api/web/lists/getbytitle('TaxLibrary')/rootfolder/files/add(overwrite=true,url='" +
        fileName +
        "')";
      // Send the request and return the response.
      // This call returns the SharePoint file.
      return $.ajax({
        url: encodeURI(fileCollectionEndpoint),
        type: "POST",
        data: arrayBuffer,
        processData: false,
        headers: {
          Accept: "application/json;odata=verbose",
          "Content-Type": "application/json;odata=verbose",
          "X-RequestDigest":
            "0xEA711C20F34DBF9BE511D27053F4B88DDA7A685A131954FC2A57E40701DBE26FC78EF27DE5C925126598F460CFF0E784B746C4F367402C9BDA9669580C2AFEBD,04 Jan 2019 09:18:36 -0000"
        }
      });
    },
    getFileItem: function(fileURI) {
      return $.ajax({
        url: fileURI,
        type: "GET",
        headers: { accept: "application/json;odata=verbose" }
      });
    },
    fileLimit: function(files, fileList) {
      console.log("error最多只能上传一个文件!");
    }, //超出文件数量回调函数
    uploadErr: function(err, file, fileList) {
      console.log("error上传附件出错!");
    } //附件上传失败后回调函数
  }
};
</script>
