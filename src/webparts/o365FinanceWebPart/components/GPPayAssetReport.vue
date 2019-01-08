<template>
  <div>
    <el-form :inline="true" :model="Condition" class="demo-form-inline">
      <el-form-item label="日期时间段：">
        <el-date-picker
          value-format="yyyy-MM-dd"
          v-model="Condition.ApplicationDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="结算方式">
        <el-select v-model="Condition.SettlementType" placeholder="请选择">
          <el-option
            v-for="item in SettlementType"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="结算人：">
        <el-input v-model="Condition.Title" placeholder="结算人"></el-input>
      </el-form-item>-->
      <!-- <el-form-item label="公司代码：">
        <el-select v-model="Condition.CompanyCode" placeholder="请选择">
          <el-option
            v-for="item in CompanyCodeArr"
            :key="item.CompanyCode"
            :label="item.CompanyCode"
            :value="item.CompanyCode"
          ></el-option>
        </el-select>
      </el-form-item>-->
      <el-form-item label="币种">
        <el-select v-model="Condition.Currency" placeholder="请选择">
          <el-option
            v-for="item in Currency"
            :key="item.value"
            :label="item.value"
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
    <el-table :data="TableData" style="width: 100%" max-height="400">
      <el-table-column fixed prop="ApplicationNumber" label="申请单号" width="300"></el-table-column>
      <el-table-column prop="SettlementType" label="结算方式"></el-table-column>
      <el-table-column prop="Trustees" label="经办人"></el-table-column>
      <el-table-column prop="PersonCode" label="人员编号"></el-table-column>
      <el-table-column prop="TheHighestPersonNumber" label="最高级审批人编号"></el-table-column>
      <el-table-column prop="InvoiceValue" label="金额"></el-table-column>
      <el-table-column prop="BusinessDivision" label="所属事业部"></el-table-column>
      <el-table-column prop="CodeOfFixedAssets" label="资产号"></el-table-column>
      <el-table-column prop="LoanNumber" label="借款单号"></el-table-column>
      <el-table-column prop="LoanMoney" label="借款金额"></el-table-column>
      <el-table-column prop="LoanPersonNumber" label="借款人编号"></el-table-column>
      <el-table-column prop="Balance" label="差额"></el-table-column>
      <el-table-column prop="SpecialGeneralLedger" label="特别总账标志"></el-table-column>
      <el-table-column prop="Allocation" label="分配"></el-table-column>
      <el-table-column prop="Quota" label="定/限额"></el-table-column>
      <el-table-column prop="Remarke" label="备注"></el-table-column>
      <el-table-column fixed="right" prop="PONumber" label="PO号"></el-table-column>
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
      mainListName: "PublicPayment", //对公付款主表
      subListName1: "TaxReceipt", //税票清单主表
      subListName2: "ExpenseAllocation", //费用分摊数据主表
      userListName: "EmployeeList", //员工表
      CompanyCodeArr: [], //公司代码
      Condition: {
        SettlementType: "", //结算方式
        ApplicationDate: "", //申请日期
        Title: "", //申请单号
        CompanyCode: "", //公司代码
        Currency: "" //币种
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
          value: "人民币",
          label: "人民币"
        },
        {
          value: "美元",
          label: "美元"
        },
        {
          value: "港币",
          label: "港币"
        },
        {
          value: "欧元",
          label: "欧元"
        },
        {
          value: "日元",
          label: "日元"
        },
        {
          value: "英镑",
          label: "英镑"
        },
        {
          value: "格里夫那",
          label: "格里夫那"
        },
        {
          value: "其他",
          label: "其他"
        }
      ], //币种
      TableData: [], //主表数据
      excelColumns: [
        "申请单号",
        "结算方式",
        "经办人",
        "人员编号",
        "最高级审批人编号",
        "金额",
        "所属事业部",
        "资产号",
        "借款单号",
        "借款金额",
        "借款人编号",
        "差额",
        "特别总账标志",
        "分配",
        "定/限额",
        "备注",
        "PO号"
      ] //excel字段名
    };
  },
  methods: {
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
    //查询子列表
    getSubList(index, type) {
      // if (type == 1) {
      //   //查询税票清单
      //   this.dialogTableVisible1 = true;
      //   this.SubTableData1 = [];
      //   var applicationNumber = this.TableData[index].ApplicationNumber;
      //   var parm = {
      //     type: "get",
      //     action: "ListItems",
      //     list: this.subListName1,
      //     baseUrl: this.hostUrl,
      //     condition: "?$filter=PublicPaymentGUID eq '" + applicationNumber + "'"
      //   };
      //   var opt = common.queryOpt(parm);
      //   $.when($.ajax(opt))
      //     .done(req => {
      //       var data = req.d.results;
      //       if (data.length > 0) {
      //         data.forEach(d => {
      //           this.SubTableData1.push({
      //             InvoiceNumber: d.InvoiceNumber, //发票号码
      //             TaxCode: d.TaxCode //税码
      //           });
      //         });
      //       } else {
      //         this.$message(common.message("warning", "没有税票清单数据!"));
      //       }
      //     })
      //     .catch(err => {
      //       this.$message(common.message("error", "没有税票清单数据!"));
      //     });
      // } else {
      //   //查询费用分摊
      //   this.dialogTableVisible2 = true;
      //   this.SubTableData2 = [];
      //   var applicationNumber = this.TableData[index].ApplicationNumber;
      //   var parm = {
      //     type: "get",
      //     action: "ListItems",
      //     list: this.subListName2,
      //     baseUrl: this.hostUrl,
      //     condition: "?$filter=PublicPaymentGUID eq '" + applicationNumber + "'"
      //   };
      //   var opt = common.queryOpt(parm);
      //   $.when($.ajax(opt))
      //     .done(req => {
      //       var data = req.d.results;
      //       if (data.length > 0) {
      //         data.forEach(d => {
      //           this.SubTableData1.push({
      //             Title: d.Title, //费用名称
      //             Number: d.Number //费用号码
      //           });
      //         });
      //       } else {
      //         this.$message(common.message("warning", "没有税票清单数据!"));
      //       }
      //     })
      //     .catch(err => {
      //       this.$message(common.message("error", "没有税票清单数据!"));
      //     });
      // }
    },
    //查询主表
    onSubmit() {
      this.TableData = [];
      console.log("筛选条件");
      console.log(this.Condition);
      //默认对公付款
      var condition = "?$filter=ReimbursementType eq '对公付款'";
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
            this.TableData.push({
              ApplicationNumber: d.ApplicationNumber, //申请单号
              SettlementType: d.SettlementType, //结算方式
              Trustees: d.Trustees, //经办人
              PersonCode: "", //人员编号
              TheHighestPersonNumber: "", //最高审批人编号,
              InvoiceValue: d.InvoiceValue, //列为金额 实际发票金额,
              BusinessDivision: "", //所属事业部编号
              CodeOfFixedAssets: d.CodeOfFixedAssets, //固定资产编码
              LoanNumber: d.LoanNumber, //借款单号
              LoanMoney: "", //借款金额,
              LoanPersonNumber: "", //借款人编号,
              Balance: "", //差额
              SpecialGeneralLedger: "", //特别总账
              Allocation: "", //分配
              Quota: "", //定/限额
              Remarke: d.Remark, //备注
              PONumber: "" //PO号
            });
          });
        }
      });
    },
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
        fileName: "资产对公付款报表",
        fileType: "xls",
        sheetName: "资产对公付款报表"
      };
      efn.toExcel(excelInfo);
    }
  },
  mounted() {
    this.getCompanyCode();
  }
};
</script>