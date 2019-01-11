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
      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" @click="Condition={}">重置</el-button>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button type="primary" @click="onExcel">导出Excel</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="TableData" style="width: 100%" max-height="500">
      <el-table-column fixed prop="ApplicationNumber" label="申请单号" width="300"></el-table-column>
      <el-table-column prop="Title" label="标题"></el-table-column>
      <el-table-column prop="Consignor" label="经办人"></el-table-column>
      <el-table-column prop="Supplier" label="供应商"></el-table-column>
      <el-table-column prop="SupplierParts" label="供应商部件"></el-table-column>
      <el-table-column prop="Amount" label="总金额"></el-table-column>
      <el-table-column prop="Taxation" label="税金"></el-table-column>
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
      mainListName: "PurchaseRequest", //ECC列表名
      subListName: "PurchaseRequestSubInfo", //ECC物料信息列表名称
      userListName: "EmployeeList", //员工详细信息列表名称
      CostCenterArr: [], //成本中心
      ApplicationTypeArr: [], //申请类别
      CompanyCodeArr: [], //公司代码
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
      ],//结算方式
      Condition: {
        ApplicationDate: "", //申请日期
        ApplicationNumber: "", //申请单号
        CompanyCode: "", //公司代码
        SettlementType: "", //结算类型
        Consignor: "" //经办人
      },//筛选条件
      TableData: [],//主表数据
      excelColumns: [
        "申请单号",
        "标题",
        "经办人",
        "供应商",
        "供应商部件",
        "总金额",
        "税金"
      ],//excle字段名
    };
  },
  methods: {
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
        fileName: "对公申请报表",
        fileType: "xls",
        sheetName: "对公申请报表"
      };
      efn.toExcel(excelInfo);
    },
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
            if (item == "applicationDate") {
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
            this.getSubList(d);
          });
        }
      });
    },
    getSubList(mainItem) {
      var applicationNumber = mainItem.ApplicationNumber;
      console.log(applicationNumber);
      var parm = {
        type: "get",
        action: "ListItems",
        list: this.subListName,
        baseUrl: this.hostUrl,
        condition: "?$filter=PurchaseRequestGUID eq '" + applicationNumber + "'"
      };
      var opt = common.queryOpt(parm);
      console.log("222222222");
      console.log(opt);
      $.when($.ajax(opt))
        .done(req => {
          var data = req.d.results;
          console.log(data);
          if (data.length > 0) {
            data.forEach(d => {
              this.TableData.push({
                ApplicationNumber: mainItem.ApplicationNumber,
                Title: mainItem.Title,
                Consignor: mainItem.Consignor,
                Supplier: d.Supplier,
                SupplierParts: d.SupplierParts,
                Amount:Number(d.Amount),
                Taxation: d.Taxation
              });
            });
          } else {
            this.TableData.push({
              ApplicationNumber: mainItem.ApplicationNumber,
              Title: mainItem.Title,
              Consignor: mainItem.Consignor,
              Supplier: "",
              SupplierParts: "",
              Amount: "",
              Taxation: ""
            });
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
