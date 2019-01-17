<template>
  <div>
    <table class="detailyuangong" style="border-collapse: collapse;width:100%">
      <tr>
        <td colspan="8">
          <span style="font-size:30px;color:#409eff;">员工报销模板</span>
        </td>
      </tr>
      <tr>
        <td>报销单号：</td>
        <td colspan="7">
          <el-input v-model="StaffReimbursement.Title" disabled placeholder="报销单号"></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">员工：</td>
        <td>
          <el-input disabled v-model="StaffReimbursement.Applicant" placeholder="员工"></el-input>
        </td>
        <td align="right">账户号：</td>
        <td>
          <el-input v-model="StaffReimbursement.AccountNumber" disabled placeholder="账户号"></el-input>
        </td>
        <td align="right">成本中心：</td>
        <td>
          <el-input v-model="StaffReimbursement.CostCenter" disabled placeholder="成本中心"></el-input>
        </td>
        <td align="right">公司代码：</td>
        <td>
          <el-input v-model="StaffReimbursement.CompanyCode" disabled placeholder="公司代码"></el-input>
        </td>
      </tr>
      <tr>
        <td colspan="8" align="left">
          <el-upload
            class="upload-demo"
            :action="actionUrl"
            :on-success="uploadSuccess"
            :on-error="uploadErr"
            :beforeUpload="beforeUploadValidate"
            :on-remove="removeFile"
            :limit="1"
            :on-exceed="fileLimit"
            :file-list="fileList"
          >
            <el-button disabled size="medium" type="primary">上传附件</el-button>
          </el-upload>
        </td>
      </tr>
      <tr v-show="showEditor==false">
        <td>附件 ：</td>
        <td colspan="8" style="text-align:left;">
          <a :href="attrFileInfo.url" target="_blank">{{this.attrFileInfo.name}}</a>
        </td>
      </tr>
      <tr>
        <td align="right">备注：</td>
        <td colspan="7">
          <el-input disabled v-model="StaffReimbursement.Remark" placeholder="请输入内容"></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">特殊审批人</td>
        <td colspan="7">
          <el-input disabled v-model="StaffReimbursement.SpecialApprover" placeholder="特殊审批人"></el-input>
        </td>
      </tr>
    </table>
    <el-table border :data="SubItems" style="width: 100%" max-height="600">
      <el-table-column prop="ExpenseCategory" label="费用类型"></el-table-column>
      <el-table-column prop="CostAccount" label="费用科目"></el-table-column>
      <el-table-column prop="Count" label="数量"></el-table-column>
      <el-table-column prop="Price" label="单位金额"></el-table-column>
      <el-table-column prop="Total" label="总金额"></el-table-column>
      <el-table-column prop="Currency" label="币种"></el-table-column>
      <el-table-column prop="Rate" label="汇率"></el-table-column>
      <el-table-column prop="ConvertMoney" label="转换金额"></el-table-column>
      <el-table-column prop="ConvertCurrency" label="转换后的币种"></el-table-column>
      <el-table-column prop="IsTax" label="是否启用税"></el-table-column>
      <el-table-column prop="TaxCode" label="税码"></el-table-column>
      <el-table-column prop="TaxRate" label="税率"></el-table-column>
      <el-table-column prop="OriginalTaxMoney" label="原币税额"></el-table-column>
      <el-table-column prop="ExpenseDate" label="费用日期"></el-table-column>
      <el-table-column prop="StartDate" label="出发日期"></el-table-column>
      <el-table-column prop="ArriveDate" label="抵达日期"></el-table-column>
      <el-table-column prop="Destination" label="目的地"></el-table-column>
      <el-table-column prop="Days" label="天数"></el-table-column>
      <el-table-column prop="CheckInDate" label="入住日期"></el-table-column>
      <el-table-column prop="LeaveDate" label="离店日期"></el-table-column>
      <el-table-column prop="Name" label="酒店名称"></el-table-column>
      <el-table-column prop="Number" label="发票号"></el-table-column>
    </el-table>
    <table class="detailyuangong" style="border-collapse: collapse;width:100%"></table>
    <!-- 新增税票 -->
    <el-dialog title="新增票据信息" :visible.sync="dialogFormVisible">
      <el-form :model="SubItem">
        <el-form-item label="费用类别：" :label-width="formLabelWidth">
          <el-select
            filterable
            @change="SubItem.CostAccount=''"
            v-model="SubItem.ExpenseCategory"
            placeholder="请选择"
          >
            <el-option
              v-for="item in expenseCategoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
            <!-- <el-option></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label="费用科目：" :label-width="formLabelWidth">
          <el-select v-model="SubItem.CostAccount" placeholder="请选择">
            <template v-for="item in costAccountOptions">
              <el-option
                v-if="SubItem.ExpenseCategory==item.Type"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="数量：" :label-width="formLabelWidth">
          <el-input @change="ChangeTotalMoney" v-model="SubItem.Count" placeholder="数量"></el-input>
        </el-form-item>
        <el-form-item label="单位金额：" :label-width="formLabelWidth">
          <el-input @change="ChangeTotalMoney" v-model="SubItem.Price" placeholder="单位金额"></el-input>
        </el-form-item>
        <el-form-item label="总金额：" :label-width="formLabelWidth">
          <el-input @change="ChangeConvertMoney" v-model="SubItem.Total" placeholder="总金额" disabled></el-input>
        </el-form-item>
        <el-form-item label="币种：" :label-width="formLabelWidth">
          <el-select v-model="SubItem.Currency" filterable placeholder="请选择">
            <el-option
              v-for="item in Currency"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="汇率：" :label-width="formLabelWidth">
          <el-input @change="ChangeConvertMoney" v-model="SubItem.Rate" placeholder="汇率"></el-input>
        </el-form-item>
        <el-form-item label="转换金额：" :label-width="formLabelWidth">
          <el-input v-model="SubItem.ConvertMoney" placeholder="转换金额" disabled></el-input>
        </el-form-item>
        <el-form-item label="转换后币种：" :label-width="formLabelWidth">
          <el-input v-model="SubItem.ConvertCurrency" placeholder="转换后币种"></el-input>
        </el-form-item>
        <el-form-item label="是否启用税：" :label-width="formLabelWidth">
          <el-checkbox v-model="SubItem.IsTax"></el-checkbox>
        </el-form-item>
        <el-form-item label="税码：" :label-width="formLabelWidth">
          <el-select @change="ChangeTaxRate" v-model="SubItem.TaxCode" filterable placeholder="请选择">
            <el-option
              v-for="item in taxCodeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="税率：" :label-width="formLabelWidth">
          <el-input v-model="SubItem.TaxRate" placeholder="税率" disabled></el-input>
        </el-form-item>
        <el-form-item label="原币税额：" :label-width="formLabelWidth">
          <el-input v-model="SubItem.OriginalTaxMoney" placeholder="原币税额" disabled></el-input>
        </el-form-item>
        <el-form-item label="出发/抵达日期：" :label-width="formLabelWidth">
          <el-date-picker
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="到"
            v-model="StartArriveDate"
            start-placeholder="出发日期"
            end-placeholder="抵达日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="目的地：" :label-width="formLabelWidth">
          <el-input placeholder="目的地"></el-input>
        </el-form-item>
        <el-form-item label="入住/离店日期：" :label-width="formLabelWidth">
          <el-date-picker
            value-format="yyyy-MM-dd"
            type="daterange"
            v-model="CheckInLeaveData"
            range-separator="到"
            start-placeholder="出发日期"
            end-placeholder="抵达日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="酒店名称：" :label-width="formLabelWidth">
          <el-input v-model="SubItem.Name" placeholder="酒店名称"></el-input>
        </el-form-item>
        <el-form-item label="发票号：" :label-width="formLabelWidth">
          <el-input v-model="SubItem.Number" placeholder="发票号"></el-input>
        </el-form-item>
      </el-form>
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
      mainListName: "StaffReimbursement", //对公付款
      mainListType: "SP.Data.StaffReimbursementListItem", //税票清单列表类型，用于post请求
      userListName: "EmployeeList", //员工详细信息列表名称
      SpecApproId: 0, //特殊审批人ID
      LoginName: "", //登录名
      dialogFormVisible: false,
      formLabelWidth: "150px",
      StartArriveDate: "",
      CheckInLeaveData: "",
      expenseCategoryListName: "ExpenseCategory", //费用类别
      costAccountListName: "CostAccount", //费用科目
      currentUserTitle: "", //当前用户名
      currentUserITCode: "", //邮箱@前的code

      //主表数据
      StaffReimbursement: {
        Title: "", //申请单号
        Applicant: "", //申请人
        AccountNumber: "", //账户号
        CostCenter: "", //成本中心
        CompanyCode: "", //公司代码
        Remark: "", //备注
        SpecialApprover: "" //特殊审批人
      },
      FinanceITCode: "",
      //子表数据
      SubItems: [],
      SubItem: {
        ExpenseCategory: "", //费用类别
        CostAccount: "", //费用科目
        Count: "", //数量
        Price: "", //单位金额
        Total: "", //总金额
        Currency: "", //币种
        Rate: "", //汇率
        ConvertMoney: "", //转换金额
        ConvertCurrency: "", //转换后币种
        IsTax: false, //是否用税
        TaxCode: "", //税码
        TaxRate: "", //税率
        OriginalTaxMoney: "", //原币税额
        ExpenseDate: "", //费用日期
        StartDate: "", //出发日期
        ArriveDate: "", //到达日期
        Destination: "", //目的地
        Days: "", //天数
        CheckInDate: "", //入住日期
        LeaveDate: "", //离店日期
        Name: "", //酒店名称
        Number: "" //发票号
      },
      fileList: [], //附件列表数据
      fileToArr: [], //附件转换成文件流，然后保存文件属性至数组里
      attrFileInfo: {
        name: "",
        url: ""
      },
      actionUrl: "https://lenovonetapp.sharepoint.cn/", //绑定上传附件按钮的action
      currentStep: "",
      ApprovalHistory: "", //审批历史
    };
  },
  methods: {
    //加载主表数据
    loadMainListData: function(guid) {
      var parm = {
        type: "get",
        action: "ListItems",
        list: this.mainListName,
        baseUrl: this.hostUrl,
        condition: "?$filter=Title eq '" + guid + "'"
      };
      var opt = common.queryOpt(parm);
      return common.service(opt);
    }
  },
  mounted: function() {
    var applicantNumber = common.GetParameterValues("ApplicantNumber");
    var getMainListData = this.loadMainListData(applicantNumber);
    getMainListData
      .done(req => {
        var data = req.d.results;
        console.log(data);
        if (data.length > 0) {
          //加载主表
          this.ApprovalHistory = data[0].ApproverHistory;
          this.StaffReimbursement.Title = data[0].Title;
          this.StaffReimbursement.Applicant = data[0].Applicant;
          this.StaffReimbursement.AccountNumber = data[0].AccountNumber;
          this.StaffReimbursement.CostCenter = data[0].CostCenter;
          this.StaffReimbursement.CompanyCode = data[0].CompanyCode;
          this.StaffReimbursement.Remark = data[0].Remark;
          this.StaffReimbursement.SpecialApprover = data[0].SpecialApprover;
          this.currentItemId = data[0].Id;

          if (data[0].Attachments) {
            var attUrl = data[0].AttachmentFiles.__deferred.uri;
            var getAtt = this.loadAttachment(attUrl);
            getAtt
              .done(f => {
                var data = f.d.results;
                if (data.length > 0) {
                  this.attrFileInfo.url =
                    window.location.origin +
                    data[0].ServerRelativeUrl +
                    "?Web=1";
                  this.attrFileInfo.name = data[0].FileName;
                  this.fileList.push({
                    name: data[0].FileName,
                    url: data[0].ServerRelativeUrl
                  });
                  console.log("aaaaaaaaaaaa");
                  console.log(this.fileList);
                }
              })
              .catch(errf => {
                console.log("获取附件失败");
              });
          }
          //加载子表
          console.log("加载子表");
          var subItems =
            data[0].DetailInvoiceJSON == null
              ? null
              : JSON.parse(data[0].DetailInvoiceJSON);
          console.log(subItems);
          if (subItems != null) {
            subItems.forEach(element => {
              this.SubItems.push({
                ExpenseCategory: element.ExpenseCategory, //费用类别
                CostAccount: element.CostAccount, //费用科目
                Count: element.Count, //数量
                Price: element.Price, //单位金额
                Total: element.Total, //总金额
                Currency: element.Currency, //币种
                Rate: element.Rate, //汇率
                ConvertMoney: element.ConvertMoney, //转换金额
                ConvertCurrency: element.ConvertCurrency, //转换后币种
                IsTax: element.IsTax, //是否用税
                TaxCode: element.TaxCode, //税码
                TaxRate: element.TaxRate, //税率
                OriginalTaxMoney: element.OriginalTaxMoney, //原币税额
                ExpenseDate: element.ExpenseDate, //费用日期
                StartDate: element.StartDate, //出发日期
                ArriveDate: element.ArriveDate, //到达日期
                Destination: element.Destination, //目的地
                Days: element.Days, //天数
                CheckInDate: element.CheckInDate, //入住日期
                LeaveDate: element.LeaveDate, //离店日期
                Name: element.Name, //酒店名称
                Number: element.Number //发票号
              });
            });
          }
        } else {
          this.$message(
            common.message("error", "员工报销列表中不存在该申请单号")
          );
        }
      })
      .catch(err => {
        this.$message(common.message("error", "加载员工报销列表数据失败"));
      });
  }
};
</script>

<style>
.detailyuangong {
  min-height: 25px;
  line-height: 25px;
  text-align: center;
  border-collapse: collapse;
  color: gray;
  padding: 2px;
}
.detailyuangong tr td {
  border: 1px solid #cfcfcf;
  padding: 5px;
}
</style>