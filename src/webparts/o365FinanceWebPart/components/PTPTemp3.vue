<template>
  <div>
    <el-form :inline="true" :model="Condition" class="demo-form-inline">
      <el-form-item label="申请单号：">
        <el-input v-model="Condition.Title" placeholder="申请单号"></el-input>
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
      <el-form-item label="财务审批人：">
        <el-input v-model="Condition.Finance"  placeholder="财务审批人"></el-input>
      </el-form-item>

      <el-form-item label="员工">
        <el-input v-model="Condition.Applicant"  placeholder="员工"></el-input>
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
      <el-form-item>
        <el-button type="primary" @click="Condition={}">重置</el-button>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button @click="onExcel()" type="primary">导出Excel</el-button>
      </el-form-item>
    </el-form>

    <el-table border :data="TableData" style="width: 100%" max-height="400">
      <el-table-column width="300" prop="AccountNumber" label="账号"></el-table-column>
      <el-table-column width="200" prop="Applicant" label="户名"></el-table-column>
      <el-table-column width="200" prop="Money" label="金额"></el-table-column>
      <el-table-column width="250" prop="CostNumber" label="费用报告编号"></el-table-column>
      <el-table-column width="200" prop="LegalPerson" label="法人"></el-table-column>
      <el-table-column width="200" prop="Modified" label="审批日期"></el-table-column>
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
      userListName: "EmployeeList", //员工详细信息列表名称
      mainListName: "StaffReimbursement", //员工报销
      //筛选条件
      Condition: {
        Title: "", //申请单号
        Applicant: "", //员工
        Finance: "", //财务审批人
        ApplicantEmail: "", //ITcode
        CompanyCode: "", //公司代码
        ComplateDate: "" //完成日期
      },
      CompanyCodeArr: [], //公司代码
      TableData: [], //主表数据
      excelColumns: ["账号", "户名", "金额", "费用报告编号", "法人", "审批日期"] //excel字段名
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
        fileName: "付款表",
        fileType: "xls",
        sheetName: "付款表"
      };
      efn.toExcel(excelInfo);
    },
    clearCondition() {
      this.Condition = {};
      this.CostAccount = "";
    },
    onSubmit() {
      this.TableData = [];
      console.log("筛选条件");
      console.log(this.Condition);
      var condition = "?$Top=2000&$filter=Status eq 'Approved' ";

      for (var item in this.Condition) {
        if (this.Condition[item] != null && this.Condition[item] != "") {
          //存在条件
          if (item == "ComplateDate") {
            condition +=
              " and Modified gt datetime" +
              "'" +
              this.Condition[item][0] +
              "T00:00:00" +
              "'" +
              " and Modified lt datetime" +
              "'" +
              this.Condition[item][1] +
              "T23:59:59" +
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
              var convertArr = []; //中间需要转换数组
              var nameContainer = {}; // 针对键name进行归类的容器
              subItems.forEach(sub => {
                convertArr.push({
                  AccountNumber: d.AccountNumber,
                  Applicant: d.Applicant,
                  Money: Number(sub.ConvertMoney),
                  CostNumber: d.Title,
                  LegalPerson: d.CompanyCode,
                  Modified: d.Modified
                });
              });
              convertArr.forEach(item => {
                nameContainer[item.CostNumber] =
                  nameContainer[item.CostNumber] || [];
                nameContainer[item.CostNumber].push(item);
              });
              console.log(nameContainer);
              var CostNumberName = Object.keys(nameContainer);

              CostNumberName.forEach(nameItem => {
                var count = 0;
                nameContainer[nameItem].forEach(item => {
                  count += Number(item.Money); // 遍历金额
                });
                this.TableData.push({
                  AccountNumber: nameContainer[nameItem][0].AccountNumber,
                  Applicant: nameContainer[nameItem][0].Applicant,
                  Money: count.toFixed(2),
                  CostNumber: nameContainer[nameItem][0].CostNumber,
                  LegalPerson: nameContainer[nameItem][0].LegalPerson,
                  Modified: nameContainer[nameItem][0].Modified.split("T")[0]
                });
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
    }
  },
  mounted() {
    //获取公司代码和成本中心
    this.getCompanyCodeAndCostCenter();
  }
};
</script>
