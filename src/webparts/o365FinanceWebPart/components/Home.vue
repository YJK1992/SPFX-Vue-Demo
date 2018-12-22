<template>
  <div id="home">
    {{msg}}
  </div>
</template>
<script>
import $ from "jquery";
import common from "../js/common.js";
export default {
  data() {
    return {
      msg: "This is home page"
    };
  },
  methods: {
    uploadSuccess: function(response, file, fileList) {
      console.log(file, fileList);
      this.fileList = fileList;
      console.log(this.fileList);
    },
    uploadErr: function(err, file, fileList) {
      console.log(file, fileList);
    },
    beforeUploadValidate: function(file) {
      const extension = file.name.split(".")[1] === "xls";
      const extension2 = file.name.split(".")[1] === "xlsx";
      const extension3 = file.name.split(".")[1] === "doc";
      const extension4 = file.name.split(".")[1] === "docx";
      const extension5 = file.name.split(".")[1] === "txt";
      const size = file.size / 1024 / 1024 < 10;
      if (
        !extension &&
        !extension2 &&
        !extension3 &&
        !extension4 &&
        !extension5
      ) {
        console.log("上传模板只能是 xls、xlsx、doc、docx、txt 格式!");
      }
      if (!size) {
        console.log("上传模板大小不能超过 10MB!");
      }
      return (
        extension ||
        extension2 ||
        extension3 ||
        extension4 ||
        (extension5 && size)
      );
    },
    submit: function() {
      var proUrl =
        "https://m365x275952.sharepoint.com/sites/JackDemo/_api/web/lists/getbytitle('ECC')/items(17)";
      var option1 = {
        url: proUrl,
        type: "Get",
        headers: {
          accept: "application/json;odata=verbose"
        },
        contentType: "application/json"
      };
      $.when($.ajax(option1))
        .done(req1 => {
          var attUrl = req1.d.AttachmentFiles.__deferred.uri;
          this.fileList.forEach(f => {
            console.log(f);
            var file = f.raw;
            var fileName = f.name;
            var getFile = common.getFileBuffer(file);
            getFile
              .done(arrayBuffer => {
                var opt = {
                  url: attUrl + "/add(FileName='" + fileName + "')",
                  type: "POST",
                  data: arrayBuffer,
                  processData: false,
                  headers: {
                    "Accept": "application/json;odata=verbose",
                    "Content-Type": "application/json;odata=verbose",
                    "X-RequestDigest":
                      "0x8ECF2EE5FB9CE5322467132D39AD3B600EEC3FB3563E79232242567AD882C6E99CF5AFFAD00D0E199304853EAF6D6BC655612931AA3889F1B11FA9A63810B275,15 Dec 2018 11:53:46 -0000"
                  }
                };
                $.when($.ajax(opt))
                  .done(r => {
                    console.log("success");
                  })
                  .catch(err => {
                    console.log(err);
                  });
              })
              .catch(onError => {
                console.log(onError);
              });
          });
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    submit2: function() {
      var fileInput = $("#fileInput");
      var file = fileInput[0].files[0];
      var getFile = common.getFileBuffer(file);
      getFile
        .done(arrayBuffer => {
          console.log(arrayBuffer);
        })
        .catch(onError => {
          console.log(onError);
        });
    },
    fileLimit: function(files, fileList) {
      alert("最多上传一个文档");
    }
  },
  mounted: function() {}
};
</script>
