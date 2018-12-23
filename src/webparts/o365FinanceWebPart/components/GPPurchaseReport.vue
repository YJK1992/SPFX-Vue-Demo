<template>
  <div>
    <el-form :inline="true" :model="Condition" class="demo-form-inline">
      <el-form-item label="申请单号：">
        <el-input v-model="Condition.ApplicationNumber" placeholder="申请单号"></el-input>
      </el-form-item>

      <el-form-item label="日期时间段：">
        <el-date-picker
          value-format="yyyy-MM-dd"
          v-model="Condition.applicationDate"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="经办人：">
        <el-input v-model="Condition.Consignor" placeholder="经办人"></el-input>
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

      <!-- <el-form-item label="结算方式：" v-show="false">
        <el-select v-model="Condition.SettlementType" placeholder="请选择">
          <el-option
            v-for="item in SettlementType"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item> -->

      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>

    <table class="gpPurchaseReport">
      <tr id="report_gpPurchaseReport">
        <td style="width: 300px;">申请单号</td>
        <td>标题</td>
        <td>经办人</td>
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

    <el-dialog title="供应商信息" :visible.sync="dialogTableVisible">
      <el-table :data="gridData">
        <el-table-column property="Supplier" label="供应商" width="150"></el-table-column>
        <el-table-column property="SupplierParts" label="供应商部件" width="150"></el-table-column>
        <el-table-column property="Amount" label="总金额" width="150"></el-table-column>
        <el-table-column property="Taxation" label="税金" width="150"></el-table-column>
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
      mainListName: "PurchaseRequest", //ECC列表名
      subListName: "PurchaseRequestSubInfo", //ECC物料信息列表名称
      userListName: "EmployeeList", //员工详细信息列表名称
      //   appliantTypeListName: "ApplicantType", //申请类型列表名称
      //初始化筛选数据
      CostCenterArr: [], //成本中心
      ApplicationTypeArr: [], //申请类别
      CompanyCodeArr: [], //公司代码
      SettlementType: [
        //结算方式
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
      //筛选条件
      Condition: {
        ApplicationDate: "", //申请日期
        ApplicationNumber: "", //申请单号
        CompanyCode: "", //公司代码
        SettlementType: "", //结算类型
        Consignor: "" //经办人
      },
      //主表数据
      TableData: [],
      //子表数据
      SubTableData: [],
      //其他
      dialogTableVisible: false
    };
  },
  methods: {
    onSubmit() {
      this.TableData = [];
      console.log("筛选条件");
      console.log(this.Condition);
      var condition = "";
      var conditionCount = 0;

      for (var item in this.Condition) {
        if (this.Condition[item] != null && this.Condition[item] != "") {
          conditionCount++;
          if (conditionCount == 1) {
            if (item == "applicationDate") {
              condition +=
                "?$filter=Created gt datetime" +
                "'" +
                this.Condition[item][0]+"T00:00:00Z" +
                "'" +
                " and Created lt datetime" +
                "'" +
                this.Condition[item][1]+"T00:00:00Z" +
                "'";
            } else {
              condition +=
                "?$filter=" + item + " eq '" + this.Condition[item] + "'";
            }
          } else {
            if (item == "applicationDate") {
              condition +=
                " and Created gt datetime" +
                "'" +
                this.Condition[item][0] +"T00:00:00Z"+
                "'" +
                " and Created lt datetime" +
                "'" +
                this.Condition[item][1] +"T00:00:00Z"+
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
      console.log("ppp111");
      console.log(option);
      $.when($.ajax(option)).done(req => {
        var data = req.d.results;
        if (data.length > 0) {
          data.forEach(d => {
            this.TableData.push({
              ApplicationNumber: d.ApplicationNumber,
              Title: d.Title,
              Consignor: d.Consignor
            });
          });
        }
      });
    },
    getSubList(index) {
      this.dialogTableVisible = true;
      this.SubTableData = [];
      var applicationNumber = this.TableData[index].PurchaseRequestGUID;
      var parm = {
        type: "get",
        action: "ListItems",
        list: this.subListName,
        baseUrl: this.hostUrl,
        condition: "?$filter=PurchaseRequestGUID eq '" + applicationNumber + "'"
      };
      var opt = common.queryOpt(parm);
      $.when($.ajax(opt))
        .done(req => {
          var data = req.d.results;
          if (data.length > 0) {
            data.forEach(d => {
              this.SubTableData.push({
                Supplier: d.Supplier,
                SupplierParts: d.SupplierParts,
                Amount: d.Amount,
                Taxation: d.Taxation
              });
            });
          } else {
            this.$message(common.message("waring", "没有供应商数据信息!"));
          }
        })
        .catch(err => {
          this.$message(common.message("error", "获取物料数据失败!"));
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
    this.getCompanyCodeAndCostCenter();
  }
};
</script>

<style>
.gpPurchaseReport tr td {
  border: 1px solid #cfcfcf;
  padding: 5px;
  width: 140px;
}

.gpPurchaseReport {
  min-height: 25px;
  line-height: 25px;
  text-align: center;
  border-collapse: collapse;
  color: gray;
  padding: 2px;
}

.gpPurchaseReport tr:nth-child(1) {
  background-color: #409eff;
  font-weight: bold;
  color: white;
  border: 0px;
}
</style>