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

    <el-table :data="TableData" style="width: 100%" height="600">
      <el-table-column prop="ApplicationNumber" label="单据号" width="200"></el-table-column>
      <el-table-column prop="CopmanyCode" label="公司代码" width="150"></el-table-column>
      <el-table-column prop="Currency" label="币种" width="100"></el-table-column>
      <el-table-column prop="BankSubject" label="银行科目" width="150"></el-table-column>
      <el-table-column prop="TXT" label="文本" width="300"></el-table-column>
      <el-table-column prop="ScopeOfService" label="业务范围" width="150"></el-table-column>
      <el-table-column prop="InvoiceValue" label="金额" width="150"></el-table-column>
      <el-table-column prop="TXT1" label="文本" width="300"></el-table-column>
      <el-table-column prop="BankSubjectAllocation" label="银行科目分配" width="150"></el-table-column>
      <el-table-column prop="SupplierNumber" label="供应商编码" width="270"></el-table-column>
      <el-table-column prop="SpecialGeneralLedger" label="特别总账" width="150"></el-table-column>
      <el-table-column prop="Allocation" label="分配" width="150"></el-table-column>
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
      mainListName: "PublicPayment", //ECC列表名
      subListName: "ExpenseAllocation", //ECC物料信息列表名称
      userListName: "EmployeeList", //员工表
      CompanyCodeArr: [], //公司代码
      excelColumns: [
        "单据编号",
        "公司代码",
        "币种",
        "银行科目",
        "文本",
        "业务范围",
        "金额",
        "文本",
        "银行科目分配",
        "供应商编号",
        "特别总账",
        "分配",
        "PO号"
      ], //Excel导出列
      Condition: {
        SettlementType: "", //结算方式
        SettlingTime: "", //申请日期
        Title: "", //申请单号
        CompanyCode: "", //公司代码
        Currency: "", //币种
        SettlementPeopleITCode: "" //结算人
      }, //筛选条件
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
      ], //结算方式
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
      ], //币种
      TableData: [], //主表数据
      SubTableData: [], //子表数据
      dialogTableVisible: false
    };
  },
  methods: {
    onExcel: function() {
      var temp = [];
      var tempColumn = [];
      for (var item in this.TableData[0]) {
        tempColumn.push(item);
      }
      temp = this.TableData;
      var data = temp.map(v => tempColumn.map(k => v[k]));
      var excelInfo = {
        excelColumns: this.excelColumns,
        excelData: data,
        fileName: "税票清单数据导出F53",
        fileType: "xls",
        sheetName: "税票清单数据导出F53"
      };
      efn.toExcel(excelInfo);
    }, //导出Excel
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
    }, //获取公司代码
    onSubmit() {
      this.TableData = [];
      console.log("筛选条件");
      console.log(this.Condition);
      //默认对公付款
      var condition =
        "?$filter=ReimbursementType ne '资产对公付款' and IsFreightInvoice eq 'true' and Status eq 'Approved'";

      for (var item in this.Condition) {
        if (this.Condition[item] != null && this.Condition[item] != "") {
          //存在条件
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
            condition += " and " + item + " eq '" + this.Condition[item] + "'";
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
            //修改读取子表逻辑
            var subItems =
              d.TaxFileJsonString == "{}"
                ? { d: [] }
                : JSON.parse(d.TaxFileJsonString);
            console.log(subItems);
            var total = 0;
            if (subItems.d.length > 0) {
              subItems.d.forEach(sub => {
                total += Number(sub.InvoiceValue);
              });
            }
            this.TableData.push({
              ApplicationNumber: d.ApplicationNumber, //申请单号
              CopmanyCode: d.CopmanyCode, //公司代码
              // Trustees: d.Trustees, //经办人
              Currency: d.Currency, //币种
              BankSubject: "", //银行科目,
              TXT:
                d.Trustees + "-" + d.TrusteesEmail + "报" + d.ExpenseCategory, //文本
              ScopeOfService: "", //业务范围
              InvoiceValue: Number(total), //金额
              TXT1:
                d.Trustees + "-" + d.TrusteesEmail + "报" + d.ExpenseCategory, //文本
              BankSubjectAllocation: "", //银行科目分配,
              SupplierNumber: "8002178", //供应商编号,
              SpecialGeneralLedger: "", //特别总账
              Allocation: "", //分配
              PONumber: "" //PO号
            });
          });
        }
      });
    } //查询主表
  },
  mounted() {
    this.getCompanyCode();
  }
};
</script>