<template>
  <div>
    <el-form :inline="true" :model="Condition" class="demo-form-inline">
      <el-form-item label="申请日期段：">
        <el-date-picker
          value-format="yyyy-MM-dd"
          v-model="Condition.ApplicantDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
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
      <!-- <el-form-item label="结算人：">
        <el-input v-model="Condition.SettlementPerson" placeholder="结算人" v-show="false"></el-input>
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
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>

    <table class="GPPayTaxBillReport1">
      <tr id="report_GPPayTaxBillReport1">
        <td style="width: 300px;">单据编号</td>
        <td>币种</td>
        <td>业务范围</td>
        <td>科目</td>
        <td>成本中心</td>
        <td>项目编号</td>
        <td>分配</td>
        <td>PO号</td>
        <td>操作</td>
      </tr>
      <tr v-for="(subItems,index) in TableData">
        <template v-for="(subItem,cindex) in subItems">
          <td>{{subItem}}</td>
        </template>
        <td>
          <el-button @click="getSubList(index)" size="small">查看</el-button>
        </td>
      </tr>
    </table>
    <el-dialog title="税票信息" :visible.sync="dialogTableVisible">
      <el-table :data="SubTableData">
        <el-table-column property="CompanyCode" label="公司代码" width="150"></el-table-column>
        <el-table-column property="InvoiceNumber" label="发票号" width="150"></el-table-column>
        <el-table-column property="Supplier" label="供应商编号" width="150"></el-table-column>
        <el-table-column property="InvoiceValue" label="金额" width="150"></el-table-column>
        <el-table-column property="TaxCode" label="税码" width="150"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import $ from "jquery";
import common from "../js/common.js";
export default {
  data() {
    return {
      hostUrl: this.GLOBAL.URL, //已在Web Part中注册了此变量
      //列表名称
      mainListName: "PublicPayment", //对公付款列表名
      subListName: "TaxReceipt",
      userListName: "EmployeeList", //员工详细信息列表名称
      CurrencyArr: [
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
      CompanyCodeArr: [], //公司代码
      Condition: {
        SettlementType: "", //结算方式
        ApplicantDate: "", //申请日期
        Currency: "", //币种
        CompanyCode: "" //公司代码
      }, //筛选条件
      TableData: [], //主表数据
      SubTableData: [],
      dialogTableVisible: false
    };
  },
  methods: {
    onSubmit() {
      this.TableData = [];
      console.log("筛选条件");
      console.log(this.Condition);
      var condition =
        "?$filter=ReimbursementType ne '资产对公付款' and IsFreightInvoice eq 'true' ";

      for (var item in this.Condition) {
        if (this.Condition[item] != null && this.Condition[item] != "") {
          //存在条件
          if (item == "ApplicantDate") {
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
              applicantNumber: d.ApplicationNumber,
              currency: d.Currency,
              bussinessScope: "",
              Subject: "",
              costCenter: d.CostCenter,
              projectNumber: d.ProjectNumber,
              isWrittenOff: "",
              poNumber: ""
            });
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
    getSubList(index) {
      this.dialogTableVisible = true;
      this.SubTableData = [];
      var applicationNumber = this.TableData[index].applicantNumber;
      var parm = {
        type: "get",
        action: "ListItems",
        list: this.subListName,
        baseUrl: this.hostUrl,
        condition: "?$filter=Title eq '" + applicationNumber + "'"
      };
      var opt = common.queryOpt(parm);
      $.when($.ajax(opt))
        .done(req => {
          var data = req.d.results;
          if (data.length > 0) {
            data.forEach(d => {
              this.SubTableData.push({
                CompanyCode: d.CompanyCode,
                InvoiceNumber: d.InvoiceNumber,
                Supplier: d.Supplier,
                InvoiceValue: d.InvoiceValue,
                TaxCode: d.TaxCode
              });
            });
          } else {
            this.$message(common.message("waring", "没有无聊数据!"));
          }
        })
        .catch(err => {
          this.$message(common.message("error", "获取物料数据失败!"));
        });
    }
  },
  mounted() {
    this.getCompanyCodeAndCostCenter();
  }
};
</script>

<style>
.GPPayTaxBillReport1 tr td {
  border: 1px solid #cfcfcf;
  padding: 5px;
  width: 140px;
}

.GPPayTaxBillReport1 {
  min-height: 25px;
  line-height: 25px;
  text-align: center;
  border-collapse: collapse;
  color: gray;
  padding: 2px;
}

#report_GPPayTaxBillReport1 {
  background-color: #409eff;
  font-weight: bold;
  color: white;
  border: 0px;
}
</style>