<template>
  <div>
    <el-form :inline="true" :model="Condition" class="demo-form-inline">
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

      <el-form-item label="结算日期段：">
        <el-date-picker
          value-format="yyyy-MM-dd"
          v-model="Condition.SettlingTime"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="结算人ID：">
        <el-input v-model="Condition.SettlementPeopleITCode" placeholder="结算人ID"></el-input>
      </el-form-item>

      <el-form-item label="结算方式：">
        <el-select allow-create="true" v-model="Condition.SettlementType" placeholder="请选择">
          <el-option
            v-for="item in SettlementType"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="币种：">
        <el-select allow-create="true" v-model="Condition.Currency" placeholder="请选择">
          <el-option
            v-for="item in Currency"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="Condition={}">重置</el-button>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button type="primary" @click="onExcel">导出Excel</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="JoinTableData" style="width: 100%" height="600">
      <el-table-column prop="ApplicationNumber" label="单据号" width="150"></el-table-column>
      <el-table-column prop="SettlementType" label="结算方式" width="150"></el-table-column>
      <el-table-column prop="Trustees" label="经办人" width="150"></el-table-column>
      <el-table-column prop="EmployeeCode" label="人员编号" width="150"></el-table-column>
      <el-table-column prop="TheHighestPersonNumber" label="最高级审批人编号" width="150"></el-table-column>
      <el-table-column prop="Money" label="金额" width="150"></el-table-column>
      <el-table-column prop="ProjectNumber" label="项目编号" width="150"></el-table-column>
      <el-table-column prop="ProjectName" label="项目名称" width="150"></el-table-column>
      <el-table-column prop="CostCenterNumber" label="成本中心编号" width="150"></el-table-column>
      <el-table-column prop="BusinessDivision" label="所属事业部" width="150"></el-table-column>
      <el-table-column prop="Number" label="费用编号" width="150"></el-table-column>
      <el-table-column prop="Title" label="费用名称" width="150"></el-table-column>
      <el-table-column prop="OnBusiness" label="出差目的地" width="150"></el-table-column>
      <el-table-column prop="LoanNumber" label="借款单号" width="150"></el-table-column>
      <el-table-column prop="LoanMoney" label="借款金额" width="150"></el-table-column>
      <el-table-column prop="LoanPersonNumber" label="借款人员编号" width="150"></el-table-column>
      <el-table-column prop="Balance" label="差额" width="150"></el-table-column>
      <el-table-column prop="DeductTheTax" label="代扣税" width="150"></el-table-column>
      <el-table-column prop="SpecialGeneralLedger" label="特别总账标记" width="150"></el-table-column>
      <el-table-column prop="Allocation" label="分配" width="150"></el-table-column>
      <el-table-column prop="Quota" label="定/限额" width="150"></el-table-column>
      <el-table-column prop="Remarke" label="备注" width="150"></el-table-column>
      <el-table-column prop="PONumber" label="PO号" width="150"></el-table-column>
    </el-table>
  </div>
</template>

 
<script>
import $ from "jquery";
import common from "../js/common.js";
import efn from "../js/json2excel.js";

export default {
  data() {
    return {
      hostUrl: this.GLOBAL.URL, //已在Web Part中注册了此变量
      //列表名称
      mainListName: "PublicPayment", //ECC列表名
      subListName: "ExpenseAllocation", //ECC物料信息列表名称
      userListName: "EmployeeList", //员工表
      //初始化筛选数据
      CompanyCodeArr: [], //公司代码
      //筛选条件
      Condition: {
        SettlementType: "", //结算方式
        SettlingTime: "", //结算时间
        Title: "", //申请单号
        CompanyCode: "", //公司代码
        Currency: "", //币种
        SettlementPeopleITCode: "", //结算人
        Trustees: "" //经办人
      },
      //结算方式
      SettlementType: [
        {
          value: "清帐",
          label: "清帐"
        },
        {
          value: "支票",
          label: "支票"
        },
        {
          value: "汇款",
          label: "汇款"
        },
        {
          value: "信用证",
          label: "信用证"
        },
        {
          value: "汇票",
          label: "汇票"
        }
      ],
      //币种
      Currency: [
        {
          value: "RMB",
          label: "RMB"
        },
        {
          value: "USD",
          label: "USD"
        },
        {
          value: "HKD",
          label: "HKD"
        },
        {
          value: "EUR",
          label: "EUR"
        },
        {
          value: "JPY",
          label: "JPY"
        },
        {
          value: "GBP",
          label: "GBP"
        },
        {
          value: "UAH",
          label: "UAH"
        },
        {
          value: "Other",
          label: "Other"
        }
      ],
      //其他
      dialogTableVisible: false,
      //导出属性列
      filterVal: [],
      //Excdltitle
      excelColumns: [
        "单据号",
        "结算方式",
        "经办人",
        "人员编号",
        "最高级审批人编号",
        "金额",
        "项目编号",
        "项目名称",
        "成本中心编号",
        "所属事业部",
        "费用编号",
        "费用名称",
        "出差目的地",
        "借款单号",
        "借款金额",
        "借款人员编号",
        "差额",
        "代扣税",
        "特别总账标记",
        "分配",
        "定/限额",
        "备注",
        "PO号"
      ],
      //合并数据行
      JoinTableData: []
    };
  },
  methods: {
    //导出Excel
    onExcel: function() {
      for (var item in this.JoinTableData[0]) {
        this.filterVal.push(item);
      }
      var data = this.JoinTableData.map(v => this.filterVal.map(k => v[k]));
      var excelInfo = {
        excelColumns: this.excelColumns,
        excelData: data,
        fileName: "PayBill",
        fileType: "xls",
        sheetName: "PayBill"
      };
      efn.toExcel(excelInfo);
    },
    //获取公司代码
    getCompanyCode: function() {
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
    },
    //查询主表
    onSubmit() {
      this.JoinTableData = [];
      console.log("筛选条件");
      console.log(this.Condition);
      var conditionCount = 0;
      var condition = "";

      for (var item in this.Condition) {
        if (this.Condition[item] != null && this.Condition[item] != "") {
          conditionCount++;
          if (conditionCount == 1) {
            if (item == "ApplicationDate") {
              condition +=
                "?$filter=Created gt datetime" +
                "'" +
                this.Condition[item][0] +
                "T00:00:00Z" +
                "'" +
                " and Created lt datetime" +
                "'" +
                this.Condition[item][1] +
                "T00:00:00Z" +
                "'";
            } else {
              condition +=
                "?$filter=" + item + " eq '" + this.Condition[item] + "'";
            }
          } else {
            if (item == "ApplicationDate") {
              condition +=
                " and Created gt datetime" +
                "'" +
                this.Condition[item][0] +
                "T00:00:00Z" +
                "'" +
                " and Created lt datetime" +
                "'" +
                this.Condition[item][1] +
                "T00:00:00Z" +
                "'";
            } else {
              condition +=
                " and " + item + " eq '" + this.Condition[item] + "'";
            }
          }
        }
      }
      console.log(condition);
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
            var money = 0.0;
            var subItems =
              d.ExpenseFileJsonString == "{}"
                ? {
                      d2: []
                  }
                : JSON.parse(d.ExpenseFileJsonString);
            if (subItems.d2.length > 0) {
              subItems.d2.forEach(element => {
                money += Number(element.Money);
              });
              if (Number(d.InvoiceValue) - money > 0) {
                console.log("有余额");
                this.JoinTableData.push({
                  ApplicationNumber: d.ApplicationNumber, //申请单号
                  SettlementType: d.SettlementType, //结算方式
                  Trustees: d.Trustees + "-" + d.TrusteesEmail, //经办人
                  EmployeeCode: d.EmployeeCode, //人员编号
                  TheHighestPersonNumber: "", //最高审批人编号
                  Money: Number(d.InvoiceValue) - money, //剩余的余额
                  ProjectNumber: subItems.d2[0].ProjectNumber, //项目编号
                  ProjectName: subItems.d2[0].ProjectName, //项目名称
                  CostCenterNumber: d.CostCenter, //成本中心编号
                  BusinessDivision: "", //所属事业部编号
                  Number: subItems.d2[0].Number, //费用号码
                  Title: subItems.d2[0].Title, //费用名称
                  OnBusiness: "", //出差目的地
                  LoanNumber: d.LoanNumber, //借款单号
                  LoanMoney: "", //借款金额,
                  LoanPersonNumber: "", //借款人编号,
                  Balance: "", //差额
                  DeductTheTax: "", //代扣税
                  SpecialGeneralLedger: "", //特别总账
                  Allocation: "", //分配
                  Quota: "", //定/限额
                  Remarke: d.Remark, //备注
                  PONumber: "" //PO号
                });
              }
            }
          });
        }
      });
    }
  },
  mounted() {
    this.getCompanyCode();
  }
};
</script>

<style>
.GPPayBillReport tr td {
  border: 1px solid #cfcfcf;
  padding: 5px;
  width: 140px;
}

.GPPayBillReport {
  min-height: 25px;
  line-height: 25px;
  text-align: center;
  border-collapse: collapse;
  color: gray;
  padding: 2px;
}

.GPPayBillReport tr:nth-child(1) {
  background-color: #409eff;
  font-weight: bold;
  color: white;
  border: 0px;
}
</style>