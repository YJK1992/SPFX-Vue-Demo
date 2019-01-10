<template>
  <div>
    <el-form :inline="true" :model="Condition" class="demo-form-inline">
      <el-form-item label="申请单号：">
        <el-input placeholder="申请单号"></el-input>
      </el-form-item>
      <el-form-item label="完成日期：">
        <el-date-picker
          value-format="yyyy-MM-dd"
          v-model="Condition.Date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="财务审批人：">
        <el-input placeholder="财务审批人"></el-input>
      </el-form-item>

      <el-form-item label="员工">
        <el-input placeholder="员工"></el-input>
      </el-form-item>

      <el-form-item label="员工ITcode">
        <el-input placeholder="员工ITcode"></el-input>
      </el-form-item>

      <el-form-item label="公司代码：">
        <el-select placeholder="请选择">
          <el-option
            v-for="item in CompanyCodeArr"
            :key="item.CompanyCode"
            :label="item.CompanyCode"
            :value="item.CompanyCode"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="Condition={}">重置</el-button>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button @click="onExcel()" type="primary">导出Excel</el-button>
      </el-form-item>
    </el-form>

    <el-table border :data="TableData" style="width: 100%" max-height="600">
      <el-table-column width="200" prop label="账号"></el-table-column>
      <el-table-column width="200" prop label="户名"></el-table-column>
      <el-table-column width="200" prop label="金额"></el-table-column>
      <el-table-column width="200" prop label="费用报告编号"></el-table-column>
      <el-table-column width="200" prop label="法人"></el-table-column>
      <el-table-column width="200" prop label="审批日期"></el-table-column>
    </el-table>
  </div>
</template>

<script>
// import $ from "jquery";
// import common from "../js/common.js";
export default {
  data() {
    return {
      // hostUrl: this.GLOBAL.URL, //已在Web Part中注册了此变量
      //筛选条件
      Condition: {},
      CompanyCodeArr: [], //公司代码
      TableData: [] //主表数据
    };
  },
  methods: {},
  mounted() {}
};
</script>
