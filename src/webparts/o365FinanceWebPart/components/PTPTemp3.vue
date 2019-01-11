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

    <el-table border :data="TableData" style="width: 100%" max-height="400">
      <el-table-column width="300" prop="AccountNumber" label="账号"></el-table-column>
      <el-table-column width="200" prop="Applicant" label="户名"></el-table-column>
      <el-table-column width="200" prop="Money" label="金额"></el-table-column>
      <el-table-column width="250" prop="CostNumber" label="费用报告编号"></el-table-column>
      <el-table-column width="200" prop="LegalPerson" label="法人"></el-table-column>
      <el-table-column width="200" prop="Modified" label="审批日期"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import $ from "jquery";
import common from "../js/common.js";
export default {
  data() {
    return {
      hostUrl: this.GLOBAL.URL, //已在Web Part中注册了此变量
      userListName: "EmployeeList", //员工详细信息列表名称
      mainListName: "StaffReimbursement", //员工报销
      //筛选条件
      Condition: {
        ApplicationNumber: "", //申请单号
        Applicant: "", //员工
        Finance: "", //财务审批人
        ApplicantEmail: "", //ITcode
        CompanyCode: "", //公司代码
        ComplateDate: "" //完成日期
      },
      CompanyCodeArr: [], //公司代码
      TableData: [] //主表数据
    };
  },
  methods: {
    clearCondition() {
      this.Condition = {};
      this.CostAccount = "";
    },
    onSubmit() {
      this.TableData = [];
      console.log("筛选条件");
      console.log(this.Condition);
      var condition = "?$filter=Status eq 'Approved' ";

      for (var item in this.Condition) {
        if (this.Condition[item] != null && this.Condition[item] != "") {
          //存在条件
          if (item == "ComplateDate") {
            condition +=
              " and Modified gt datetime" +
              "'" +
              this.Condition[item][0] +
              "T00:00:00Z" +
              "'" +
              " and Modified lt datetime" +
              "'" +
              this.Condition[item][1] +
              "T00:00:00Z" +
              "'";
          } else {
            condition += " and " + item + " eq '" + this.Condition[item] + "'";
          }
        }
      }
      this.getMainList(condition);
    },
    getMainList(condition) {
      var parm = {
        type: "get",
        action: "ListItems",
        list: this.mainListName,
        baseUrl: this.hostUrl,
        condition: condition
      };
      var option = common.queryOpt(parm);

      $.when($.ajax(option)).done(req => {
        var data = req.d.results;
        if (data.length > 0) {
          data.forEach(d => {
            //修改读取子表逻辑
            var subItems =
              d.DetailInvoiceJSON == null
                ? null
                : JSON.parse(d.DetailInvoiceJSON);
            console.log(subItems);
            if (subItems != null) {
              subItems.forEach(sub => {
                this.TableData.push({
                  AccountNumber: d.AccountNumber,
                  Applicant: d.Applicant,
                  Money: sub.Money,
                  CostNumber: "",
                  LegalPerson: "",
                  Modified: d.Modified
                });
              });
            }
          });
        }
      });
    },
    getCompanyCodeAndCostCenter() {
      //获取公司代码和成本中心
      var parm = {
        type: "get",
        action: "ListItems",
        list: this.userListName,
        condition: "",
        baseUrl: this.hostUrl
      };
      var opt = common.queryOpt(parm);
      $.when($.ajax(opt)).done(req => {
        var data = req.d.results;
        if (data.length > 0) {
          var companycode = []; //未去重公司代码
          //填充原始数据
          data.forEach(d => {
            companycode.push(d.CompanyCode);
          });
          //去重操作
          var comopanyCodeUnique = companycode.filter(function(
            element,
            index,
            array
          ) {
            return array.indexOf(element) === index;
          });
          comopanyCodeUnique.forEach(element => {
            this.CompanyCodeArr.push({
              CompanyCode: element
            });
          });
        }
      });
    }
  },
  mounted() {
    //获取公司代码和成本中心
    this.getCompanyCodeAndCostCenter();
  }
};
</script>
