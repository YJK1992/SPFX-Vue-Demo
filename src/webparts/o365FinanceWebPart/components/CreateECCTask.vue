<template>
  <div id="CreateECCTask">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="申请人">
        <el-input v-model="ECCTaskForm.proposter" placeholder="审批人"></el-input>
      </el-form-item>
      <el-form-item label="成本中心">
        <el-input v-model="ECCTaskForm.costcenter" placeholder="成本中心"></el-input>
      </el-form-item>
      <el-form-item label="公司代码">
        <el-input v-model="ECCTaskForm.companycode" placeholder="公司代码"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      msg: "CreateECCTask",
      ECCTaskForm: {
        proposter: "",
        costcenter: "",
        companycode: ""
      }
    };
  }
};
</script>
