<template>
  <div>
    <el-form :inline="true" :model="Condition" class="demo-form-inline">
      <el-form-item label="申请单号：">
        <el-input placeholder="申请单号"></el-input>
      </el-form-item>
      <el-form-item label="申请时间段：">
        <el-date-picker
          value-format="yyyy-MM-dd"
          v-model="Condition.Date"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="经办人ID：">
        <el-input placeholder="经办人ID"></el-input>
      </el-form-item>

      <el-form-item label="费用条目：">
        <el-select placeholder="请选择"></el-select>
      </el-form-item>

      <el-form-item label="状态：">
        <el-select placeholder="请选择">
          <el-option
            v-for="item in Status"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
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
      <el-form-item label="成本中心">
        <el-select placeholder="请选择"></el-select>
      </el-form-item>

      <el-form-item label="员工">
        <el-input placeholder="员工"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="Condition={}">重置</el-button>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button @click="onExcel()" type="primary">导出Excel</el-button>
      </el-form-item>
    </el-form>

    <el-table border :data="TableData" style="width: 100%" max-height="600">
      <el-table-column width="200" prop label="报销单号"></el-table-column>
      <el-table-column width="200" prop="ExpenseCategory" label="费用类型"></el-table-column>
      <el-table-column width="200" prop="CostAccount" label="费用科目"></el-table-column>
      <el-table-column width="200" prop label="成本中心"></el-table-column>
      <el-table-column width="200" prop="Count" label="数量"></el-table-column>
      <el-table-column width="200" prop="Price" label="单位金额"></el-table-column>
      <el-table-column width="200" prop="Total" label="总金额"></el-table-column>
      <el-table-column width="200" prop="Currency" label="币种"></el-table-column>
      <el-table-column width="200" prop="Rate" label="汇率"></el-table-column>
      <el-table-column width="200" prop="ConvertMoney" label="转换金额"></el-table-column>
      <el-table-column width="200" prop label="附件"></el-table-column>
      <el-table-column width="200" prop label="最后签批人"></el-table-column>
      <el-table-column width="200" prop label="最后签批时间"></el-table-column>
      <el-table-column width="200" prop label="状态"></el-table-column>
      <el-table-column width="200" prop label="公司代码"></el-table-column>
      <el-table-column width="200" prop label="员工名"></el-table-column>
      <el-table-column width="200" prop label="员工ITCode"></el-table-column>
      <el-table-column width="200" prop="StartDate" label="出发日期"></el-table-column>
      <el-table-column width="200" prop="ArriveDate" label="抵达日期"></el-table-column>
      <el-table-column width="200" prop="Destination" label="目的地"></el-table-column>
      <el-table-column width="200" prop="CheckInDate" label="入住日期"></el-table-column>
      <el-table-column width="200" prop="LeaveDate" label="离店日期"></el-table-column>
      <el-table-column width="200" prop label="出差天数"></el-table-column>
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
      //列表名称
      Status: [
        {
          value: "Draft",
          label: "草稿"
        },
        {
          value: "Submitted",
          label: "审批中"
        },
        {
          value: "Changed",
          label: "被驳回并提交"
        },
        {
          value: "Dumped",
          label: "终止"
        },
        {
          value: "Rejected",
          label: "已拒绝"
        },
        {
          value: "Approved",
          label: "审批完成"
        }
      ],
      //筛选条件
      Condition: {
  
      }, 
      CompanyCodeArr: [], //公司代码
      TableData: [], //主表数据
    };
  },
  methods: {},
  mounted() {}
};
</script>

