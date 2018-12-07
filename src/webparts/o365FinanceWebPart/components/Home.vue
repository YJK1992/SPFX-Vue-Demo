<template>
  <div id="home">
    {{msg}}
    <el-button @click="test" size="small">测试按钮</el-button>
  </div>
</template>
<script>
import common from "../js/common.js";
export default {
  data() {
    return {
      msg: "home"
    };
  },
  methods: {
    test: function() {
      this.$message(common.message("success", "This is test!"));
    }
  }
};
</script>
