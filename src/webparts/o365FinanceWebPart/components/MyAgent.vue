<template>
  <div id="MyAgent">
    {{msg}}
    <el-button type="primary" @click="downExcel">导出</el-button>
  </div>
</template>
<script>
import efn from "../js/json2excel.js";
export default {
  data() {
    return {
      msg: "MyAgent",
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
      ]
    };
  },
  methods: {
    downExcel: function() {
      var th = ["姓名", "生日", "性别", "年龄"];
      var filterVal = ["name", "birthday", "sex", "age"];
      var data = this.excelData.map(v => filterVal.map(k => v[k]));
      var [fileName, fileType, sheetName] = ["测试下载", "xlsx", "测试页"];
      efn.test();
      efn.toExcel({ th, data, fileName, fileType, sheetName });
    }
  }
};
</script>
