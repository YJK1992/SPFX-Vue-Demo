<template>
  <div id="home">
    <input type="file" value="Submit" id="fileInput">
    <el-upload
      class="upload-demo"
      :action="actionUrl"
      :on-success="success"
      :on-remove="handleRemove"
      multiple
      :file-list="fileList"
    >
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
    <el-button size="small" type="primary" @click="submit">提交</el-button>
    <el-button size="small" type="primary" @click="submit2">提交2</el-button>
  </div>
</template>
<script>
import * as $ from "jquery";
import common from "../js/common.js";
export default {
  data() {
    return {
      msg: "home",
      hostUrl: this.GLOBAL.URL, //已在Web Part中注册了此变量
      actionUrl:
        "https://m365x275952.sharepoint.com/sites/JackDemo/Shared%20Documents/",
      fileList: []
    };
  },
  methods: {
    success: function(response, file, fileList) {
      this.fileList = fileList;
    },
    err: function(err, file, fileList) {
      console.log("22222");
      console.log(file, fileList);
    },
    submit: function() {
      this.fileList.forEach(f => {
        var getFile = this.getFileBuffer(f);
        console.log(getFile);
      });
    },
    submit2: function() {
      var fileInput = $("#fileInput");
      var file = fileInput[0].files[0];
      var getFile = this.getFileBuffer(file);
    },
    handleRemove(file, fileList) {
      console.log("33333333333");
      console.log(file, fileList);
    },
    handleExceed(files, fileList) {
      this.$message(
        common.message(
          "error",
          `当前限制选择 3 个文件，本次选择了 ${
            files.length
          } 个文件，共选择了 ${files.length + fileList.length} 个文件`
        )
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    getFileBuffer: function(file) {
      var deferred = $.Deferred();
      var reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onloadend = function(e) {
        deferred.resolve(e.target.result);
      };
      reader.onerror = function(e) {
        deferred.reject(e.target.error);
      };
      //reader.readAsArrayBuffer(file);
      return deferred.promise();
    }
  }
};
</script>
