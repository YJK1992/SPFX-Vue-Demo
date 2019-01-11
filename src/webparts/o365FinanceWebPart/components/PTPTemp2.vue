<template>
  <div>
    <el-form :inline="true" :model="Condition" class="demo-form-inline">
      <el-form-item label="申请单号：">
        <el-input v-model="Condition.ApplicationNumber" placeholder="申请单号"></el-input>
      </el-form-item>
      <el-form-item label="完成日期：">
        <el-date-picker
          value-format="yyyy-MM-dd"
          v-model="Condition.ComplateDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="员工">
        <el-input v-model="Condition.Applicant" placeholder="员工"></el-input>
      </el-form-item>

      <el-form-item label="员工ITcode">
        <el-input v-model="Condition.ApplicantEmail" placeholder="员工ITcode"></el-input>
      </el-form-item>

      <el-form-item label="公司代码：">
        <el-select v-model="Condition.CompanyCode" placeholder="请选择">
          <el-option
            v-for="item in CompanyCodeArr"
            :key="item.CompanyCode"
            :label="item.CompanyCode"
            :value="item.CompanyCode"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="费用条目">
        <el-input v-model="CostAccount" placeholder="费用条目"></el-input>
      </el-form-item>

      <el-form-item label="成本中心">
        <el-select v-model="Condition.CostCenter" placeholder="请选择">
          <el-option
            v-for="item in CostCenterArr"
            :key="item.CostCenter"
            :label="item.CostCenter"
            :value="item.CostCenter"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="clearCondition">重置</el-button>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button @click="onExcel()" type="primary">导出Excel</el-button>
      </el-form-item>
    </el-form>

    <el-table border :data="TableData" style="width: 100%" max-height="600">
      <el-table-column width="200" prop label="公司代码"></el-table-column>
      <el-table-column width="200" prop label="科目号"></el-table-column>
      <el-table-column width="200" prop label="金额"></el-table-column>
      <el-table-column width="200" prop label="成本中心"></el-table-column>
      <el-table-column width="200" prop label="利润中心"></el-table-column>
      <el-table-column width="200" prop label="业务范围"></el-table-column>
      <el-table-column width="200" prop label="文本"></el-table-column>
      <el-table-column width="200" prop label="报销单号"></el-table-column>
      <el-table-column width="200" prop label="订单号"></el-table-column>
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
        ApplicantEmail: "", //ITcode
        CompanyCode: "", //公司代码
        CostCenter: "", //成本中心
        ComplateDate: "" //完成日期
      },
      CostAccount: "", //费用条目
      CompanyCodeArr: [], //公司代码
      CostCenterArr: [], //成本中心
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
                if (this.CostAccount == "") {
                  this.TableData.push({
                    CompanyCode: sub.CompanyCode,
                    CostAccount: sub.CostAccount,
                    Money: sub.Money,
                    CostCenter: sub.CostCenter,
                    lirun: "",
                    yewu: "",
                    TXT:
                      d.Applicant +
                      "报销" +
                      d.Created.substring(0, d.Created.indexOf("T")) +
                      sub.ExpenseCategory,
                    Title: d.Title,
                    orderNo: ""
                  });
                } else {
                  if (sub.CostAccount == this.CostAccount) {
                    this.TableData.push({
                      CompanyCode: sub.CompanyCode,
                      CostAccount: sub.CostAccount,
                      Money: sub.Money,
                      CostCenter: sub.CostCenter,
                      lirun: "",
                      yewu: "",
                      TXT:
                        d.Applicant +
                        "报销" +
                        d.Created.substring(0, d.Created.indexOf("T")) +
                        sub.ExpenseCategory,
                      Title: d.Title,
                      orderNo: ""
                    });
                  }
                }
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
          var costCenter = []; //未去重成本追踪新
          //填充原始数据
          data.forEach(d => {
            companycode.push(d.CompanyCode);
            costCenter.push(d.CostCenter);
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

          //去重操作
          var costCenterUnique = costCenter.filter(function(
            element,
            index,
            array
          ) {
            return array.indexOf(element) === index;
          });

          costCenterUnique.forEach(element => {
            this.CostCenterArr.push({
              CostCenter: element
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