<template>
  <div>
    {{Condition.applicationDate}}
    <el-form :inline="true" :model="Condition" class="demo-form-inline">
      <el-form-item label="成本中心：">
        <el-select v-model="Condition.costCenter" placeholder="请选择">
          <el-option
            v-for="item in CostCenterArr"
            :key="item.CostCenter"
            :label="item.CostCenter"
            :value="item.CostCenter"
          ></el-option>
        </el-select>
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
      <el-form-item label="申请类别：">
        <el-select allow-create="true" v-model="Condition.applicationType" placeholder="请选择">
          <el-option
            v-for="item in ApplicationTypeArr"
            :key="item.Title"
            :label="item.Title"
            :value="item.Title"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="状态：">
        <el-select v-model="Condition.state" placeholder="请选择">
          <el-option
            v-for="item in State"
            :key="item.value"
            :label="item.value"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="物控人员：">
        <el-input v-model="Condition.materialControl" placeholder="审批人"></el-input>
      </el-form-item>

      <el-form-item label="申请单号：">
        <el-input v-model="Condition.applicationNumber" placeholder="审批人"></el-input>
      </el-form-item>

      <el-form-item label="公司代码：">
        <el-select v-model="Condition.companyCode" placeholder="请选择">
          <el-option
            v-for="item in CompanyCodeArr"
            :key="item.CompanyCode"
            :label="item.CompanyCode"
            :value="item.CompanyCode"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop label="公司代码" width="180"></el-table-column>
      <el-table-column prop label="申请单号" width="180"></el-table-column>
      <el-table-column prop label="申请人"></el-table-column>
      <el-table-column prop label="成本中心"></el-table-column>
      <el-table-column prop label="收件人"></el-table-column>
      <el-table-column prop label="类别"></el-table-column>
      <el-table-column prop label="产品类别"></el-table-column>
      <el-table-column prop label="物料"></el-table-column>
      <el-table-column prop label="数量"></el-table-column>
      <el-table-column prop label="单价"></el-table-column>
      <el-table-column prop label="金额"></el-table-column>
      <el-table-column prop label="固定资产编号"></el-table-column>
      <el-table-column prop="address" label="费用类别"></el-table-column>
      <el-table-column prop label="状态"></el-table-column>
    </el-table>
  </div>
</template>

 
<script>
// import { Message } from 'element-ui';

export default {
  data() {
    return {
      //列表名称
      mainListName: "ECC", //ECC列表名
      userListName: "EmployeeList", //员工详细信息列表名称
      appliantTypeListName: "ApplicantType", //申请类型列表名称
      //初始化筛选数据
      CostCenterArr: [], //成本中心
      ApplicationTypeArr: [], //申请类别
      CompanyCodeArr: [], //公司代码
      State: [
        {
          value: "Draft"
        },
        {
          value: "Submitted"
        },
        {
          value: "Changed"
        },
        {
          value: "Dumped"
        },
        {
          value: "Approved"
        }
      ],
      //筛选条件
      Condition: {
        costCenter: "", //成本中心
        applicationDate: "", //申请日期
        applicationType: "", //申请类型
        state: "", //状态
        materialControl: "", //物控人员
        applicationNumber: "", //申请单号
        companyCode: ""
      },
      //数据集
      TableData: []
    };
  },
  methods: {
    onSubmit() {
      console.log("筛选条件");
      console.log(Condition);
    },
    getApplicationType() {
      //获取申请类别
      var parm = {
        action: "ListItems",
        type: "get",
        list: this.appliantTypeListName,
        baseUrl: this.hostUrl,
        condition: ""
      };

      var option = common.queryOpt(parm);
      $.when($.ajax(opt)).done(req => {
        if (data.length > 0) {
          data.forEach(d => {
            this.ApplicationTypeArr.push({
              Title: d.Title
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
        var costcenter = []; //未去重成本中心
        var companycode = []; //未去重公司代码
        if (data.length > 0) {
          //填充原始数据
          data.forEach(d => {
            costcenter.push(d.CostCenter);
            companycode.push(d.CompanyCode);
          });
          //去重操作
          var costCenterUnique = costCenter.filter(function(
            element,
            index,
            array
          ) {
            return array.indexOf(element) === index;
          });

          var comopanyCodeUnique = companycode.filter(function(
            element,
            index,
            array
          ) {
            return array.indexOf(element) === index;
          });

          costCenterUnique.forEach(element => {
            this.CostCenterArr.push({
              CostCenter: element
            });
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
</style>