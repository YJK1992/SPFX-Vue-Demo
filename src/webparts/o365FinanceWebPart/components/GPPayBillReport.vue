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
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>

    <table class="GPPayBillReport">
      <tr id="report_GPPayBillReport">
        <td style="width: 300px;">申请单号</td>
        <td>结算方式</td>
        <td>经办人</td>
        <td>人员编号</td>
        <td>最高级审批人编号</td>
        <td>金额</td>
        <td>所属事业部(成本中心描述)</td>
        <td>出差目的地</td>
        <td>借款单号</td>
        <td>借款金额</td>
        <td>借款人编号</td>
        <td>差额</td>
        <td>代扣税</td>
        <td>特别总帐标志</td>
        <td>分配</td>
        <td>定/限额</td>
        <td>备注</td>
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

    <el-dialog title="费用分摊" :visible.sync="dialogTableVisible">
      <el-table style="width:100%" :data="SubTableData">
        <el-table-column property="Number" label="费用编号" width="150"></el-table-column>
        <el-table-column property="Title" label="费用名称" width="150"></el-table-column>
        <el-table-column property="CostCenterNumber" label="成本中心编号" width="150"></el-table-column>
        <el-table-column property="ProjectName" label="项目名称" width="150"></el-table-column>
        <el-table-column property="ProjectNumber" label="项目编号" width="150"></el-table-column>
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
      mainListName: "PublicPayment", //ECC列表名
      subListName: "ExpenseAllocation", //ECC物料信息列表名称
      userListName: "EmployeeList", //员工表
      //初始化筛选数据
      CompanyCodeArr: [], //公司代码
      //筛选条件
      Condition: {
        SettlementType: "", //结算方式
        ApplicationDate: "", //申请日期
        Title: "", //申请单号
        CompanyCode: "", //公司代码
        Currency: "" //币种
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
      dialogTableVisible: false
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
    //查询主表
    onSubmit() {
      this.TableData = [];
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
            this.TableData.push({
              ApplicationNumber: d.ApplicationNumber, //申请单号
              SettlementType: d.SettlementType, //结算方式
              Trustees: d.Trustees, //经办人
              PersonCode: "", //人员编号
              TheHighestPersonNumber: "", //最高审批人编号,
              InvoiceValue: d.InvoiceValue, //列为金额 实际发票金额,
              BusinessDivision: "", //所属事业部编号
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
          });
        }
      });
    },
    //查询自报表
    getSubList(index) {
      //查询费用分摊
      this.dialogTableVisible = true;
      this.SubTableData = [];
      var applicationNumber = this.TableData[index].ApplicationNumber;
      var parm = {
        type: "get",
        action: "ListItems",
        list: this.subListName,
        baseUrl: this.hostUrl,
        condition: "?$filter=PublicPaymentGUID eq '" + applicationNumber + "'"
      };
      var opt = common.queryOpt(parm);
      $.when($.ajax(opt))
        .done(req => {
          var data = req.d.results;
          if (data.length > 0) {
            data.forEach(d => {
              this.SubTableData1.push({
                Title: d.Title, //费用名称
                Number: d.Number, //费用号码
                CostCenterNumber: d.CostCenterNumber, //成本中心编号
                ProjectName: d.ProjectName, //项目名称
                ProjectNumber: d.ProjectNumber //项目编号
              });
            });
          } else {
            this.$message(common.message("warning", "没有费用分摊数据!"));
          }
        })
        .catch(err => {
          this.$message(common.message("error", "没有费用分摊数据!"));
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