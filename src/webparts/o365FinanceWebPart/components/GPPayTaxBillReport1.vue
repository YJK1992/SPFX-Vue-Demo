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
            v-for="item in SettlementMethodArr"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="币种：">
        <el-select allow-create="true" v-model="Condition.Currency" placeholder="请选择">
          <el-option
            v-for="item in CurrencyArr"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="Condition={}">重置</el-button>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button @click="onExcel()" type="primary">导出Excel</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="TableData" style="width: 100%" max-height="500">
      <el-table-column fixed prop="ApplicationNumber" label="单据号" width="300"></el-table-column>
      <el-table-column prop="CompanyCode" label="公司代码"></el-table-column>
      <el-table-column prop="InvoiceNumber" label="发票号"></el-table-column>
      <el-table-column prop="Currency" label="币种"></el-table-column>
      <el-table-column prop="SupplierCode" label="供应商编号"></el-table-column>
      <el-table-column prop="Money" label="金额"></el-table-column>
      <el-table-column prop="TaxCode" label="税码"></el-table-column>
      <el-table-column prop="BussinessScope" label="业务范围"></el-table-column>
      <el-table-column prop="Tex" label="文本"></el-table-column>
      <el-table-column prop="CostAccount" label="科目号"></el-table-column>
      <el-table-column prop="CostCenter" label="成本中心"></el-table-column>
      <el-table-column prop="SettlementPerson" label="内部订单"></el-table-column>
      <el-table-column prop="Distribution" label="分配"></el-table-column>
      <el-table-column fixed="right" prop="PONumber" label="PO号"></el-table-column>
      <!-- <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="viewItem(scope.$index)" size="small">查看</el-button>
        </template>
      </el-table-column>-->
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
      mainListName: "PublicPayment", //对公付款列表名
      subListName: "TaxReceipt",
      userListName: "EmployeeList", //员工详细信息列表名称
      CurrencyArr: [
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
      SettlementMethodArr: [
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
      excelColumns: [
        "单据号",
        "公司代码",
        "发票号",
        "币种",
        "供应商编号",
        "金额",
        "税码",
        "业务范围",
        "文本",
        "科目号",
        "成本中心",
        "内部订单",
        "分配",
        "PO号"
      ],
      CompanyCodeArr: [], //公司代码
      Condition: {
        SettlementPeopleITCode: "", //经办人ID
        SettlementType: "", //结算方式
        SettlingTime: "", //申请日期
        Currency: "", //币种
        CompanyCode: "" //公司代码
      }, //筛选条件
      TableData: [] //主表数据
    };
  },
  methods: {
    onSubmit() {
      this.TableData = [];
      console.log("筛选条件");
      console.log(this.Condition);
      var condition =
        "?$filter=ReimbursementType ne '资产对公付款' and IsFreightInvoice eq 'true' and Status eq 'Approved' ";

      for (var item in this.Condition) {
        if (this.Condition[item] != null && this.Condition[item] != "") {
          //存在条件
          if (item == "ApplicantDate") {
            condition +=
              " and SettlingTime gt datetime" +
              "'" +
              this.Condition[item][0] +
              "T00:00:00Z" +
              "'" +
              " and SettlingTime lt datetime" +
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
    getMainList: function(condition) {
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
                ? {d:[]}
                : JSON.parse(d.TaxFileJsonString);
            console.log(subItems);
            if (subItems.d.length > 0) {
              subItems.d.forEach(sub => {
                this.TableData.push({
                  ApplicationNumber: d.ApplicationNumber,
                  CompanyCode: sub.CompanyCode,
                  InvoiceNumber: sub.InvoiceNumber,
                  Currency: d.Currency,
                  SupplierCode: "",
                  Money: d.Money,
                  TaxCode: sub.TaxCode,
                  BussinessScope: d.BussinessScope,
                  Tex:
                    d.Trustees +
                    "-" +
                    d.TrusteesEmail +
                    "报" +
                    d.ExpenseCategory,
                  CostAccount: d.CostAccount,
                  CostCenter: d.CostCenter,
                  InternalOrder: "",
                  Distribution: "",
                  PONumber: ""
                });
              });
            } else {
              this.TableData.push({
                ApplicationNumber: d.ApplicationNumber,
                CompanyCode: "",
                InvoiceNumber: "",
                Currency: d.Currency,
                SupplierCode: "",
                Money: d.Money,
                TaxCode: "",
                BussinessScope: d.BussinessScope,
                Tex:
                  d.Trustees +
                  "-" +
                  d.TrusteesEmail +
                  d.ReimbursementType +
                  d.ExpenseCategory,
                CostAccount: d.CostAccount,
                CostCenter: d.CostCenter,
                InternalOrder: "",
                Distribution: "",
                PONumber: ""
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
    },
    onExcel: function() {
      var temp = [];
      var tempColumn = [];
      for (var item in this.TableData[0]) {
        tempColumn.push(item);
      }
      temp=this.TableData
      var data = temp.map(v => tempColumn.map(k => v[k]));
      var excelInfo = {
        excelColumns: this.excelColumns,
        excelData: data,
        fileName: "税票清单数据导出F43",
        fileType: "xls",
        sheetName: "税票清单数据导出F43"
      };
      efn.toExcel(excelInfo);
    }
  },
  mounted() {
    this.getCompanyCodeAndCostCenter();
  }
};
</script>