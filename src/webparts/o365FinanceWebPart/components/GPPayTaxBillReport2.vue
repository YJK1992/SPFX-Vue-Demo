<template>
  <div>
    <el-form :inline="true" :model="Condition" class="demo-form-inline">
      <el-form-item label="日期时间段：">
        <el-date-picker
          value-format="yyyy-MM-dd"
          v-model="Condition.SettlingTime"
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

      <el-form-item label="经办人ID">
        <el-input v-model="Condition.TrusteesEmail" placeholder="经办人ID"></el-input>
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

    <el-table :data="TableData" style="width: 100%" height="600">
      <el-table-column prop="ApplicationNumber" label="单据号" width="150"></el-table-column>
      <el-table-column prop="CopmanyCode" label="公司代码" width="150"></el-table-column>
      <el-table-column prop="Currency" label="币种" width="100"></el-table-column>
      <el-table-column prop="BankSubject" label="银行科目" width="150"></el-table-column>
      <el-table-column prop="TXT" label="文本" width="300"></el-table-column>
      <el-table-column prop="ScopeOfService" label="业务范围" width="150"></el-table-column>
      <el-table-column prop="InvoiceValue" label="金额" width="150"></el-table-column>
      <el-table-column prop="TXT1" label="文本" width="300"></el-table-column>
      <el-table-column prop="BankSubjectAllocation" label="银行科目分配" width="150"></el-table-column>
      <el-table-column prop="SupplierNumbe" label="供应商编码" width="270"></el-table-column>
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
      //列表名称
      mainListName: "PublicPayment", //ECC列表名
      subListName: "ExpenseAllocation", //ECC物料信息列表名称
      userListName: "EmployeeList", //员工表
      //初始化筛选数据
      CompanyCodeArr: [], //公司代码
      //Excel导出列
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
      ],
      //筛选条件
      Condition: {
        SettlementType: "", //结算方式
        SettlingTime: "", //申请日期
        Title: "", //申请单号
        CompanyCode: "", //公司代码
        Currency: "", //币种
         TrusteesEmail: "" //经办人
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
      ],
      //主表数据
      TableData: [],
      //子表数据
      SubTableData: [],
      //其他
      dialogTableVisible: false,
      //导出属性列
      filterVal: []
    };
  },
  methods: {
    //导出Excel
    onExcel: function() {
      for (var item in this.TableData[0]) {
        this.filterVal.push(item);
      }
      var data = this.TableData.map(v => this.filterVal.map(k => v[k]));
      var excelInfo = {
        excelColumns: this.excelColumns,
        excelData: data,
        fileName: "税票清单数据导出F53",
        fileType: "xls",
        sheetName: "税票清单数据导出F53"
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
      this.TableData = [];
      console.log("筛选条件");
      console.log(this.Condition);
      //默认对公付款
      var condition =
        "?$filter=ReimbursementType eq '对公付款' and IsFreightInvoice eq 'true' ";

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
              CopmanyCode: d.CopmanyCode, //公司代码
              // Trustees: d.Trustees, //经办人
              Currency: d.Currency, //币种
              BankSubject: "", //银行科目,
              TXT: d.Trustees + "-" + d.TrusteesEmail+'报'+d.ExpenseCategory, //文本
              ScopeOfService: "", //业务范围
              InvoiceValue: d.InvoiceValue, //金额
              TXT1: d.Trustees + "-" + d.TrusteesEmail+'报'+d.ExpenseCategory, //文本
              BankSubjectAllocation: "", //银行科目分配,
              SupplierNumber: "", //供应商编号,
              SpecialGeneralLedger: "", //特别总账
              Allocation: "", //分配
              PONumber: "" //PO号
            });
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
.GPPayTaxBillReport2 tr td {
  border: 1px solid #cfcfcf;
  padding: 5px;
  width: 140px;
}

.GPPayTaxBillReport2 {
  min-height: 25px;
  line-height: 25px;
  text-align: center;
  border-collapse: collapse;
  color: gray;
  padding: 2px;
}

.GPPayTaxBillReport2 tr:nth-child(1) {
  background-color: #409eff;
  font-weight: bold;
  color: white;
  border: 0px;
}
</style>