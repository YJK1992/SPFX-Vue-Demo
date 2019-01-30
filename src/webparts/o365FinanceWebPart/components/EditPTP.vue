<template>
  <div>
    <table class="edityuangong" style="border-collapse: collapse;width:100%">
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
          <el-select
            :disabled="showApprover==true"
            filterable
            v-model="StaffReimbursement.CostCenter"
            placeholder="请选择"
            size="medium"
          >
            <el-option
              v-for="item in CostCenterArr"
              :key="item.CostCenter"
              :label="item.CostCenter"
              :value="item.CostCenter"
            ></el-option>
          </el-select>
        </td>
        <td align="right">公司代码：</td>
        <td>
          <el-select
            :disabled="showApprover==true"
            filterable
            v-model="StaffReimbursement.CompanyCode"
            placeholder="请选择"
            size="medium"
          >
            <el-option
              v-for="item in CompanyCodeArr"
              :key="item.CompanyCode"
              :label="item.CompanyCode"
              :value="item.CompanyCode"
            ></el-option>
          </el-select>
        </td>
      </tr>
      <tr  v-show="showEditor">
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
            <el-button  v-show="showEditor" size="medium" type="primary">上传附件</el-button>
          </el-upload>
        </td>
      </tr>
      <tr v-show="showEditor==false">
        <td align='right'>附件 ：</td>
        <td colspan="8" style="text-align:left;">
          <a :href="attrFileInfo.url" target="_blank">{{this.attrFileInfo.name}}</a>
        </td>
      </tr>
      <tr>
        <td align="right">订单号：</td>
        <td colspan="7">
          <el-input
            :disabled="showApprover==true"
            v-model="StaffReimbursement.OrderNo"
            placeholder="请输入内容"
          ></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">特殊审批人</td>
        <td colspan="7">
          <el-input
            :disabled="showApprover==true"
            v-model="StaffReimbursement.SpecialApprover"
            @change="speApprChange"
            placeholder="特殊审批人"
          ></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">审批意见：</td>
        <td colspan="7">
          <el-input v-model="Body" placeholder="请输入内容"></el-input>
        </td>
      </tr>
      <tr>
        <td colspan="8" align="right">
          <el-button
            :disabled="showApprover==true"
            type="primary"
            @click="dialogFormVisible=true"
          >添加项目行</el-button>
        </td>
      </tr>
    </table>
    <el-table
      :summary-method="getSummaries"
      show-summary
      border
      :data="SubItems"
      style="width: 100%"
      max-height="600"
    >
      <el-table-column prop="ExpenseCategory" label="费用类型"></el-table-column>
      <el-table-column prop="CostAccount" label="费用科目"></el-table-column>
      <el-table-column prop="ExpenseDate" label="费用日期"></el-table-column>
      <el-table-column prop="Count" label="数量"></el-table-column>
      <el-table-column prop="Price" label="单位金额"></el-table-column>
      <el-table-column prop="Total" label="总金额"></el-table-column>
      <el-table-column prop="Currency" label="币种"></el-table-column>
      <el-table-column prop="Rate" label="汇率"></el-table-column>
      <el-table-column prop="ConvertMoney" label="转换金额"></el-table-column>
      <el-table-column prop="ConvertCurrency" label="转换后的币种"></el-table-column>
      <el-table-column prop="TaxCode" label="税码"></el-table-column>
      <el-table-column prop="TaxRate" label="税率"></el-table-column>
      <el-table-column prop="OriginalTaxMoney" label="原币税额"></el-table-column>
      <el-table-column prop="StartDate" label="出发日期"></el-table-column>
      <el-table-column prop="ArriveDate" label="抵达日期"></el-table-column>
      <el-table-column prop="Destination" label="目的地"></el-table-column>
      <el-table-column prop="Days" label="天数"></el-table-column>
      <el-table-column prop="CheckInDate" label="入住日期"></el-table-column>
      <el-table-column prop="LeaveDate" label="离店日期"></el-table-column>
      <el-table-column prop="Name" label="酒店名称"></el-table-column>
      <el-table-column prop="Number" label="参考号"></el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="deleteRow(scope.$index, SubItems)"
            type="text"
            size="small"
           :disabled="showApprover==true"
          >移除</el-button>
          <el-button
            type="text"
            @click.native.prevent="onEditItem(scope.$index, SubItems)"
            size="small"
            :disabled="showFA==true?false:showApprover==true"
          >编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <table class="edityuangong" style="border-collapse: collapse;width:100%">
      <tr>
        <td colspan="8" align="right">
          <!-- <el-button type="primary" @click="onSaveOrSubmmit(buttonType.Submit)">提交</el-button>
          <el-button @click="onSaveOrSubmmit(buttonType.Save)" type="primary" plain>保存</el-button>-->
          <el-button
            type="primary"
            @click="onSaveOrSubmmit(buttonType.Submit)"
            v-show="requestIsReject==true?true:showEditor"
          >提交</el-button>
          <el-button
            @click="onSaveOrSubmmit(buttonType.Save)"
            v-show="requestIsReject==true?true:showEditor"
            type="primary"
            plain
          >保存</el-button>
          <el-button
            type="primary"
            @click="onApproval(buttonType.Approved)"
            v-show="showApprover"
          >批准</el-button>
          <el-button type="danger" @click="onEnd(buttonType.Rejected)" v-show="showApprover">拒绝</el-button>
          <el-button
            @click="onEnd(buttonType.Return)"
            v-show="showApprover"
            type="danger"
            plain
          >退回</el-button>
          <el-button
            @click="onEnd(buttonType.Return)"
            v-show="requestIsReject"
            type="danger"
            plain
          >终止</el-button>
        </td>
      </tr>
    </table>
    <!-- 新增税票 -->
    <el-dialog title="新增票据信息" :visible.sync="dialogFormVisible">
      <el-form :model="SubItem">
        <el-form-item label="费用类别：" :label-width="formLabelWidth">
          <el-select
            filterable
            @change="ChangeCostAccount()"
            v-model="SubItem.ExpenseCategory"
            placeholder="请选择"
            :disabled="showFA==true"
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
          <el-select :disabled="showFA==true" v-model="SubItem.CostAccount" placeholder="请选择">
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
        <el-form-item label="费用日期：" :label-width="formLabelWidth">
          <el-date-picker
          :disabled="showFA==true"
            value-format="yyyy-MM-dd"
            v-model="SubItem.ExpenseDate"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="数量：" :label-width="formLabelWidth">
          <el-input :disabled="showFA==true"  @change="ChangeTotalMoney" v-model="SubItem.Count" placeholder="数量"></el-input>
        </el-form-item>
        <el-form-item  label="单位金额：" :label-width="formLabelWidth">
          <el-input :disabled="showFA==true" @change="ChangeTotalMoney" v-model="SubItem.Price" placeholder="单位金额"></el-input>
        </el-form-item>
        <el-form-item label="总金额：" :label-width="formLabelWidth">
          <el-input :disabled="showFA==true" @change="ChangeConvertMoney" v-model="SubItem.Total" placeholder="总金额"></el-input>
        </el-form-item>
        <el-form-item label="币种：" :label-width="formLabelWidth">
          <el-select :disabled="showFA==true" v-model="SubItem.Currency" filterable placeholder="请选择">
            <el-option
              v-for="item in Currency"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="汇率：" :label-width="formLabelWidth">
          <el-input :disabled="showFA==true" @change="ChangeConvertMoney" v-model="SubItem.Rate" placeholder="汇率"></el-input>
        </el-form-item>
        <el-form-item label="转换金额：" :label-width="formLabelWidth">
          <el-input :disabled="showFA==true" v-model="SubItem.ConvertMoney" placeholder="转换金额"></el-input>
        </el-form-item>
        <el-form-item label="转换后币种：" :label-width="formLabelWidth">
          <el-input :disabled="showFA==true"  v-model="SubItem.ConvertCurrency" placeholder="转换后币种"></el-input>
        </el-form-item>
        <el-form-item label="税码：" :label-width="formLabelWidth">
          <el-select :disabled="showFA==true?false:showApprover==true" @change="ChangeTaxRate" v-model="SubItem.TaxCode" filterable placeholder="请选择">
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
            :disabled="showApprover==true?true:IsTravelExpense"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="到"
            v-model="StartArriveDate"
            start-placeholder="出发日期"
            end-placeholder="抵达日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="目的地：" :label-width="formLabelWidth">
          <el-input :disabled="showApprover==true?true:IsTravelExpense" v-model="SubItem.Destination" placeholder="目的地"></el-input>
        </el-form-item>
        <el-form-item label="入住/离店日期：" :label-width="formLabelWidth">
          <el-date-picker
            :disabled="showApprover==true?true:IsHotelExpense"
            value-format="yyyy-MM-dd"
            type="daterange"
            v-model="CheckInLeaveData"
            range-separator="到"
            start-placeholder="出发日期"
            end-placeholder="抵达日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="酒店名称：" :label-width="formLabelWidth">
          <el-input :disabled="showApprover==true?true:IsHotelExpense" v-model="SubItem.Name" placeholder="酒店名称"></el-input>
        </el-form-item>
        <el-form-item label="天数：" :label-width="formLabelWidth">
          <el-input :disabled="showApprover==true?true:IsHotelExpense" v-model="SubItem.Days" placeholder="天数"></el-input>
        </el-form-item>
        <el-form-item label="参考号：" :label-width="formLabelWidth">
          <el-input :disabled="showFA==true?false:showApprover==true" v-model="SubItem.Number" placeholder="发票号码（左上角）+ 发票号码（右上角）"></el-input>
        </el-form-item>
        <el-form-item label="备注：" :label-width="formLabelWidth">
          <el-input :disabled="showFA==true"  v-model="SubItem.Remark" placeholder="备注信息"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onCancel('item')">取 消</el-button>
        <el-button type="primary" @click="onAddItem()">确 定</el-button>
      </div>
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
      taxCodeListName: "TaxCode", //税码
      PTPTaskListType: "SP.Data.StaffReimbursementApproval_x0020_TasksListItem",
      PTPTaskListName: "StaffReimbursementApproval Tasks",
      approverList: "ApproveNode", //审批节点列表名
      SpecApproId: 0, //特殊审批人ID
      LoginName: "", //登录名
      dialogFormVisible: false,
      formLabelWidth: "150px",
      StartArriveDate: "",
      CheckInLeaveData: "",
      expenseCategoryListName: "PTPExpenseCategory", //费用类别
      costAccountListName: "CostAccount", //费用科目
      currentUserTitle: "", //当前用户名
      currentUserITCode: "", //邮箱@前的code
      currentItemId: 0,
      taskId: 0,
      Body: "", //审批意见
      buttonType: {
        Submit: "submit",
        Save: "save",
        Approved: "Approved",
        Return: "reject",
        Rejected: "Rejected"
      },
      //主表数据
      StaffReimbursement: {
        Title: "", //申请单号
        Applicant: "", //申请人
        AccountNumber: "", //账户号
        CostCenter: "", //成本中心
        CompanyCode: "", //公司代码
        OrderNo: "", //订单号
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
        Number: "", //发票号
        Remark: ""
      },
      Currency: [
        //币种
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
      ],

      CostCenterArr: [], //成本中心数组
      CompanyCodeArr: [], //公司代码数组
      expenseCategoryOptions: [], //费用类别
      costAccountOptions: [], //费用科目
      taxCodeOptions: [], //税码
      editIndex: -1,
      requestDigest: "", //POST Token
      fileList: [], //附件列表数据
      fileToArr: [], //附件转换成文件流，然后保存文件属性至数组里
      attrFileInfo: {
        name: "",
        url: ""
      },
      actionUrl: "https://lenovonetapp.sharepoint.cn/", //绑定上传附件按钮的action
      currentStep: "",
      showApprover: false,
      requestIsReject: false,
      showEditor: true,
      ApprovalHistory: "", //审批历史
      startNoAttr: true,
      deleteAttName: "",
      IsTravelExpense: true,
      IsHotelExpense: true,
      EmployeeCode: "",
      showFA: false,
      message: ""
    };
  },
  methods: {
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          if (index == 8) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] += " 元";
          }
        } else {
          //sums[index] = "N/A";
        }
      });

      return sums;
    },
    subVerification() {
      var isSuccess = false;
      if (this.SubItem.ExpenseDate == "") {
        this.message = "请填写费用日期;";
      } else if (!this.IsTravelExpense && this.IsHotelExpense) {
        //校验出差日期
        if (this.SubItem.StartDate == "") {
          this.message = "请填写出发时间;";
        } else if (this.SubItem.ArriveDate == "") {
          this.message = "请填写到达时间;";
        } else if (this.SubItem.Destination == "") {
          this.message = "请填写目的地;";
        }  else {
          isSuccess = true;
        }
      } else if (!this.IsHotelExpense && this.IsTravelExpense) {
        //校验酒店信息
        if (this.SubItem.CheckInDate == "") {
          this.message = "请填写入住时间;";
        } else if (this.SubItem.LeaveDate == "") {
          this.message = "请填写离店时间;";
        } else if (this.SubItem.Name == "") {
          this.message = "请填写酒店名称;";
        } else {
          isSuccess = true;
        }
      } else if (!this.IsHotelExpense && !this.IsTravelExpense) {
        if (this.SubItem.StartDate == "") {
          this.message = "请填写出发时间;";
        } else if (this.SubItem.ArriveDate == "") {
          this.message = "请填写到达时间;";
        } else if (this.SubItem.Destination == "") {
          this.message = "请填写目的地;";
        } else if (this.SubItem.CheckInDate == "") {
          this.message = "请填写入住时间;";
        } else if (this.SubItem.LeaveDate == "") {
          this.message = "请填写离店时间;";
        } else if (this.SubItem.Name == "") {
          this.message = "请填写酒店名称;";
        } else {
          isSuccess = true;
        }
      } else {
        isSuccess = true;
      }
      return isSuccess;
    },
    ChangeCostAccount() {
      this.costAccountOptions = []; //费用科目

      this.expenseCategoryOptions.forEach(item => {
        if (item.label == this.SubItem.ExpenseCategory) {
          this.SubItem.CostAccount = item.Codes;
          this.IsTravelExpense = item.IsTravelExpense;
          this.IsHotelExpense = item.IsHotelExpense;
          this.costAccountOptions.push({
            label: item.Codes,
            value: item.Codes
          });
        }
      });
    },
    removeFile: function(file, fileList, index) {
      this.fileList = fileList;
      var i = 0;
      // this.fileToArr.forEach(function(d, index) {
      //   if (d.fileName === file.name) {
      //     i = index;
      //   }
      // });
      this.fileToArr.splice(i, 1);
      this.deleteAttName = file.name;
    },
    onEnd: function(type) {
      var getDigst = common.getRequestDigest(this.hostUrl);
      getDigst
        .done(data => {
          this.requestDigest = data.d.GetContextWebInformation.FormDigestValue;
          var itemInfo = {
            __metadata: {
              type: this.mainListType
            }
          };
          if (type == "Rejected") {
            itemInfo.Status = type;
          } else {
            itemInfo.Status = "Dumped";
          }
          var parm = {
            type: "post",
            action: "EditListItem",
            baseUrl: this.hostUrl,
            list: this.mainListName,
            itemID: this.currentItemId,
            item: itemInfo,
            digest: this.requestDigest
          };
          var opt = common.queryOpt(parm);
          $.when($.ajax(opt))
            .done(req => {
              
                this.onApproval(type);
           
            })
            .catch(err => {
              this.$message(common.message("error", "终止流程失败!"));
              this.$router.push("/home");
            });
        })
        .catch(error => {
          this.loading = false;
          this.$message(common.message("error", "获取Digest失败"));
        });
    },
    onApproval: function(type) {
      this.loading = true;
      var taskOutcome;
      var getDigst = common.getRequestDigest(this.hostUrl);
      getDigst
        .done(data => {
          this.requestDigest = data.d.GetContextWebInformation.FormDigestValue;
          var mainItemInfo = {
            __metadata: {
              type: this.mainListType
            }
          };
          if (type == "Approved") {
            taskOutcome = "已批准"; //Approved 已批准
          } else {
            taskOutcome = "已拒绝"; //已拒绝 Rejected
          }

          if (this.ApprovalHistory == null || this.ApprovalHistory == "") {
            var history = {};
            history.approver1 =
              this.currentUserTitle +
              "-" +
              this.currentUserITCode +
              "," +
              common.getCurrentDate();
            this.ApprovalHistory = JSON.stringify(history);
          } else {
            var history = JSON.parse(this.ApprovalHistory);
            if (this.currentStep == "Approver1") {
              history.approver1 =
                this.currentUserTitle +
                "-" +
                this.currentUserITCode +
                "," +
                common.getCurrentDate();
            } else if (this.currentStep == "Approver2") {
              history.approver2 =
                this.currentUserTitle +
                "-" +
                this.currentUserITCode +
                "," +
                common.getCurrentDate();
            } else if (this.currentStep == "Approver3") {
              history.approver3 =
                this.currentUserTitle +
                "-" +
                this.currentUserITCode +
                "," +
                common.getCurrentDate();
            } else if (this.currentStep == "Approver4") {
              history.approver4 =
                this.currentUserTitle +
                "-" +
                this.currentUserITCode +
                "," +
                common.getCurrentDate();
            } else if (this.currentStep == "Approver5") {
              if (type == "Approved") {
                mainItemInfo.FinanceITCode = this.FinanceITCode;
                mainItemInfo.SettlingTime = common.getCurrentDate();
                mainItemInfo.DetailInvoiceJSON=JSON.stringify(this.SubItems);
              }
              history.approver5 =
                this.currentUserTitle +
                "-" +
                this.currentUserITCode +
                "," +
                common.getCurrentDate();
            }
            this.ApprovalHistory = JSON.stringify(history);
          }

          mainItemInfo.ApproverHistory = this.ApprovalHistory;
          this.updateMainInfo(mainItemInfo, taskOutcome);
        })
        .catch(error => {
          this.loading = false;
          this.$message(common.message("error", "获取Digest失败"));
        });
    },
    updateMainInfo: function(mainItemInfo, taskOutcome) {
      var mainParm = {
        type: "post",
        action: "EditListItem",
        baseUrl: this.hostUrl,
        list: this.mainListName,
        itemID: this.currentItemId,
        item: mainItemInfo,
        digest: this.requestDigest
      };
      var mainOpt = common.queryOpt(mainParm);
      var updateMainList = common.service(mainOpt);
      updateMainList
        .done(re => {
          this.updateTaskInfo(taskOutcome);
        })
        .catch(err => {
          this.$message(common.message("error", "更新主表数据失败"));
        });
    },
    updateTaskInfo: function(taskOutcome) {
      var taskItemInfo = {
        __metadata: {
          type: this.PTPTaskListType
        },
        Body: this.Body,
        TaskOutcome: taskOutcome,
        PercentComplete: 1,
        Status: "已完成" //Completed 已完成
      };
      var parm = {
        type: "post",
        action: "EditListItem",
        baseUrl: this.hostUrl,
        list: this.PTPTaskListName,
        itemID: this.taskId,
        item: taskItemInfo,
        digest: this.requestDigest
      };
      var opt = common.queryOpt(parm);
      $.when($.ajax(opt))
        .done(req => {
          console.log(req);
          this.loading = false;
          this.$message(common.message("success", "操作成功!"));
          this.$router.push("/home");
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
          this.$message(common.message("error", "操作失败!"));
          this.$router.push("/home");
        });
    },
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
    },
    ChangeTaxRate() {
      console.log("税码Change");
      console.log(this.taxCodeOptions);
      console.log(this.SubItem.TaxCode);
      this.taxCodeOptions.forEach(item => {
        console.log(item.label);
        if (item.label == this.SubItem.TaxCode) {
          this.SubItem.TaxRate = item.rate;
        }
      });
      this.ChangeConvertMoney();
    },
    //根据汇率和总金额 结算转换后的金额
    ChangeConvertMoney() {
      if (this.SubItem.Total != "" && this.SubItem.Rate != "") {
        this.SubItem.ConvertMoney =
          Number(this.SubItem.Total) * Number(this.SubItem.Rate);

        //计算原币税额
        this.SubItem.OriginalTaxMoney =
          (Number(this.SubItem.Total) /
            (1 + Number(this.SubItem.TaxRate.split("%")[0]) / 100)) *
          (Number(this.SubItem.TaxRate.split("%")[0]) / 100);
        this.SubItem.OriginalTaxMoney = Number(
          this.SubItem.OriginalTaxMoney
        ).toFixed(2);
      }
    },
    //改变数量和单位金额的时候变更总金额
    ChangeTotalMoney() {
      if (this.SubItem.Count != "" && this.SubItem.Price != "") {
        this.SubItem.Total = (
          Number(this.SubItem.Count) * Number(this.SubItem.Price)
        ).toString();
      }
      this.ChangeConvertMoney();
    },
    uploadAttFileToItem: function(attUrl) {
      var parms = [];
      this.fileToArr.forEach(f => {
        parms.push({
          type: "post",
          action: "Attachements",
          baseUrl: this.hostUrl,
          fileName: f.fileName,
          attUrl: attUrl,
          fileArr: f.arrayBuffer,
          digest: this.requestDigest
        });
      });
      console.log("1111");
      console.log(parms);
      this.uploadingAttachement(parms, 0, parms.length);
    }, //上传文件入口函数
    uploadingAttachement: function(parms, current, total) {
      if (current < total) {
        var opt = common.queryOpt(parms[current]);
        console.log(current);
        console.log(opt);
        $.when($.ajax(opt))
          .done(r => {
            current++;
            this.uploadingAttachement(parms, current, parms.length);
          })
          .catch(err => {
            this.$message(common.message("error", "上传附件失败!"));
          });
      }
    }, //上传文件主要函数，递归回调是为了防止资源冲突导致文件上传失败
    AttToArrInfo: function(f) {
      var file = f.raw;
      var fileName = f.name;
      var getFile = common.getFileBuffer(file);
      getFile
        .done(arrayBuffer => {
          this.fileToArr.push({
            fileName: fileName,
            arrayBuffer: arrayBuffer
          });
        })
        .catch(onError => {
          this.$message(common.message("error", "获取附件失败!"));
        });
    },
    removeFile: function(file, fileList, index) {
      console.log(file, fileList, index);
      this.fileList = fileList;
      var i;
      this.fileToArr.forEach(function(d, index) {
        if (d.fileName === file.name) {
          i = index;
          console.log(i);
        }
      });
      this.fileToArr.splice(i, 1);
      console.log(this.fileList);
    }, //移除上传文件列表文件钩子函数
    uploadSuccess: function(response, file, fileList) {
      console.log(file, fileList);
      this.fileList = fileList;
      this.AttToArrInfo(file);
      console.log(this.fileList);
    }, //附件上传成功后回调函数
    uploadErr: function(err, file, fileList) {
      this.$message(common.message("error", "上传附件出错!"));
    }, //附件上传失败后回调函数
    beforeUploadValidate: function(file) {
      const extension = file.name.toLowerCase().endsWith("xls");
      const extension2 = file.name.toLowerCase().endsWith("xlsx");
      const extension3 = file.name.toLowerCase().endsWith("doc");
      const extension4 = file.name.toLowerCase().endsWith("docx");
      const extension5 = file.name.toLowerCase().endsWith("txt");
      const extension6 = file.name.toLowerCase().endsWith("pdf");
      const extension7 = file.name.toLowerCase().endsWith("xml");
      const extension8 = file.name.toLowerCase().endsWith("msg");
      const size = file.size / 1024 / 1024 < 10;
      if (
        !extension &&
        !extension2 &&
        !extension3 &&
        !extension4 &&
        !extension5 &&
        !extension6 &&
        !extension7 &&
        !extension8
      ) {
        this.$message(
          common.message(
            "error",
            "上传的文件只能是 xls、xlsx、doc、docx、txt、pdf、xml、msg 格式!"
          )
        );
      }
      if (!size) {
        this.$message(common.message("error", "上传模板大小不能超过 10MB!"));
      }
      return (
        extension ||
        extension2 ||
        extension3 ||
        extension4 ||
        extension8 ||
        extension6 ||
        extension7 ||
        (extension5 && size)
      );
    }, //附件上传前对文件格式和大小进行验证
    fileLimit: function(files, fileList) {
      this.$message(common.message("error", "最多只能上传一个文件!"));
    },
    onEditItem(index) {
      if (this.SubItem.CheckInDate != "" && this.SubItem.LeaveDate != "") {
        this.CheckInLeaveData = [
          this.SubItem.CheckInDate,
          this.SubItem.LeaveDate
        ];
      }
      if (this.SubItem.StartDate != "" && this.SubItem.ArriveDate != "") {
        this.StartArriveDate = [
          this.SubItem.StartDate,
          this.SubItem.ArriveDate
        ];
      }
      this.SubItem = this.SubItems[index];
      this.editIndex = index;
      this.dialogFormVisible = true;
    },
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
    onCancel: function() {
      this.editIndex = -1;
      this.StartArriveDate = "";
      this.CheckInLeaveData = "";
      this.SubItem = {
        ExpenseCategory: "", //费用类别
        CostAccount: "", //费用科目
        Count: "", //数量
        Price: "", //单位金额
        Total: "", //总金额
        Currency: "", //币种
        Rate: "", //汇率
        ConvertMoney: "", //转换金额
        ConvertCurrency: "", //转换后币种
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
        Number: "", //发票号
        Remark: ""
      };
      this.dialogFormVisible = false;
    },
    handleClick(row) {
      console.log(row);
    },
    onAddItem() {
      console.log(this.StartArriveDate);
      console.log(this.CheckInLeaveData);
      if (this.StartArriveDate != "") {
        this.SubItem.StartDate = this.StartArriveDate[0];
        this.SubItem.ArriveDate = this.StartArriveDate[1];
      }
      if (this.CheckInLeaveData != "") {
        this.SubItem.CheckInDate = this.CheckInLeaveData[0];
        this.SubItem.LeaveDate = this.CheckInLeaveData[1];
      }
      if (this.subVerification() == false) {
        //校验不通过
        this.$message({
          message: this.message,
          type: "error"
        });
      } else {
        if (this.editIndex != -1) {
          //编辑
          this.SubItems[this.editIndex] = this.SubItem;
        } else {
          //新增
          this.SubItems.push(this.SubItem);
        }
        this.IsTravelExpense = true;
        this.IsHotelExpense = true;
        this.StartArriveDate = "";
        this.CheckInLeaveData = "";
        this.SubItem = {
          ExpenseCategory: "", //费用类别
          CostAccount: "", //费用科目
          Count: "", //数量
          Price: "", //单位金额
          Total: "", //总金额
          Currency: "", //币种
          Rate: "", //汇率
          ConvertMoney: "", //转换金额
          ConvertCurrency: "", //转换后币种
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
          Number: "", //发票号
          Remark: ""
        };
        this.dialogFormVisible = false;
      }
    },
    //提交或保存
    onSaveOrSubmmit(type) {
      if (false) {
        //校验不通过;
        this.$message(common.message("error", this.message));
      } else {
        this.loading = true;
        var getDigst = common.getRequestDigest(this.hostUrl);
        getDigst
          .done(data => {
            this.requestDigest =
              data.d.GetContextWebInformation.FormDigestValue;
            this.CreateStaffReimbursement(type);
          })
          .catch(error => {
            this.loading = false;
            this.$message(common.message("error", "获取Digest失败"));
          });
      }
    },
    //创建数据
    CreateStaffReimbursement(type) {
      console.log(this.StaffReimbursement);
      var costcenter = this.StaffReimbursement.CostCenter;
      var parm = {
        action: "ListItems",
        type: "get",
        list: this.approverList,
        baseUrl: this.hostUrl,
        condition:
          "?$filter=CostCenter eq  '" +
          costcenter +
          "' and EmployeeId eq '" +
          this.LoginName.split("@")[0] +
          "'"
      };
      var option = common.queryOpt(parm);
      $.when($.ajax(option))
        .done(r => {
          if (r.d.results.length > 0) {
            var data1 = r.d.results[0];
            var itemInfo = {
              __metadata: {
                type: this.mainListType
              },
              Applicant: this.StaffReimbursement.Applicant, //申请人
              AccountNumber: this.StaffReimbursement.AccountNumber, //账户号
              CostCenter: this.StaffReimbursement.CostCenter, //成本中心
              CompanyCode: this.StaffReimbursement.CompanyCode, //公司代码
              OrderNo: this.StaffReimbursement.OrderNo, //订单号
              SpecialApproverTitle: this.StaffReimbursement.SpecialApprover, //特殊审批人
              DetailInvoiceJSON: JSON.stringify(this.SubItems)
            };
            //总计发票金额
            var total = 0;
            this.SubItems.forEach(item => {
              total += Number(item.ConvertMoney);
            });
            if (total > 0 && total < 1000) {
              itemInfo.Approver1Id = data1.Approver1Id;
            } else if (total >= 1000 && total < 20000) {
              itemInfo.Approver1Id = data1.Approver1Id;
              itemInfo.Approver2Id = data1.Approver2Id;
            } else if (total >= 20000 && total < 50000) {
              itemInfo.Approver1Id = data1.Approver1Id;
              itemInfo.Approver2Id = data1.Approver2Id;
              itemInfo.Approver3Id = data1.Approver3Id;
            } else {
              itemInfo.Approver1Id = data1.Approver1Id;
              itemInfo.Approver2Id = data1.Approver2Id;
              itemInfo.Approver3Id = data1.Approver3Id;
              itemInfo.Approver4Id = data1.Approver4Id;
            }
            if (this.SpecApproId != 0 && this.checkIsSpecAppro) {
              itemInfo.SpecialApproverId = this.SpecApproId;
            }
            if (type == "submit") {
              if (this.currentStep == "Application" && this.taskId != 0) {
                itemInfo.Status = "Changed";
              } else {
                itemInfo.Status = "Submitted";
              }
            } else {
              itemInfo.Status = "Draft";
            }
            parm = {
              type: "post",
              action: "EditListItem",
              baseUrl: this.hostUrl,
              list: this.mainListName,
              itemID: this.currentItemId,
              item: itemInfo,
              digest: this.requestDigest
            };
            console.log(itemInfo);
            option = common.queryOpt(parm);
            $.when($.ajax(option))
              .done(req => {
                if (type == "submit") {
                  console.log("Is submit");
                  if (this.currentStep == "Application" && this.taskId != 0) {
                    this.onApproval("Approved");
                  }
                }
                if (this.startNoAttr) {
                  console.log("Start No attachment");
                  if (this.fileList.length > 0) {
                    var attUrl =
                      this.hostUrl +
                      "/_api/web/lists/getbytitle('" +
                      this.mainListName +
                      "')/items(" +
                      this.currentItemId +
                      ")/AttachmentFiles";
                    this.uploadAttFileToItem(attUrl);
                  }
                } else {
                  console.log("Start have attachment");
                  if (this.deleteAttName != "") {
                    console.log("have change attachment");
                    var parm = {
                      type: "delete",
                      action: "DeleteAttachment",
                      baseUrl: this.hostUrl,
                      digest: this.requestDigest,
                      list: this.mainListName,
                      itemID: this.currentItemId,
                      fileName: this.deleteAttName
                    };
                    var opt = common.queryOpt(parm);
                    var deleteFile = common.service(opt);
                    deleteFile
                      .done(reqf => {
                        if (this.fileList.length > 0) {
                          var attUrl =
                            this.hostUrl +
                            "/_api/web/lists/getbytitle('" +
                            this.mainListName +
                            "')/items(" +
                            this.currentItemId +
                            ")/AttachmentFiles";
                          this.uploadAttFileToItem(attUrl);
                        }
                      })
                      .catch(errf => {
                        this.$message(common.message("error", "删除附件错误"));
                      });
                  }
                }
                this.$message(common.message("success", "员工报销添加成功!"));
                this.loading = false;
                this.$router.push("/home");
              })
              .catch(err => {
                this.loading = false;
                this.$message(common.message("error", "员工报销添加失败!"));
              });
          }else{
                   this.$message(
                    common.message("error", "未找到对应的审批节点!")
                  );
          }
        })
        .catch(err => {
          this.loading = false;
          this.$message(common.message("error", "创建数据失败"));
        });
    },
    speApprChange: function() {
      this.loading = true;
      this.SpecApproId = 0;
      this.checkIsSpecAppro = false;
      var speApproverName = this.StaffReimbursement.SpecialApprover;
      var loginName;
      if (speApproverName != "") {
        var parm = {
          type: "get",
          action: "ListItems",
          list: this.userListName,
          condition:
            "?$filter=EmployeeID eq  '" +
            speApproverName.toLowerCase() +
            "' and IsSpecial eq '1'",
          baseUrl: this.hostUrl
        };
        var opt = common.queryOpt(parm);
        $.when($.ajax(opt))
          .done(req => {
            var data = req.d.results;
            console.log(data);
            if (data.length > 0) {
              loginName = "i:0#.f|membership|" + speApproverName;
              var parm2 = {
                type: "get",
                action: "UserByName",
                accountName: loginName,
                baseUrl: this.hostUrl
              };
              console.log(parm2);
              var opt2 = common.queryOpt(parm2);
              $.when($.ajax(opt2))
                .done(re => {
                  console.log(re);
                  this.SpecApproId = re.d.Id;
                  this.checkIsSpecAppro = true;
                  this.loading = false;
                })
                .catch(err => {
                  this.loading = false;
                  this.StaffReimbursement.SpecialApprover = "";
                  this.$message(
                    common.message(
                      "error",
                      "通过员工列表EmployeeID加载特殊审批用户出错!"
                    )
                  );
                });
            } else {
              this.loading = false;
              this.StaffReimbursement.SpecialApprover = "";
              this.$message(
                common.message(
                  "error",
                  "特殊审批人不在员工表中，请及时与管理员联系!"
                )
              );
            }
          })
          .catch(err => {
            this.loading = false;
            this.StaffReimbursement.SpecialApprover = "";
            this.$message(common.message("error", "加载特殊审批用户出错!"));
          });
      } else {
        this.loading = false;
      }
    },

    //获取当前用户
    getCurrentUser() {
      var parm = {
        action: "CurrentUser",
        type: "get",
        baseUrl: this.hostUrl
      };
      var option = common.queryOpt(parm);
      $.when($.ajax(option))
        .done(c => {
          var loginName = c.d.LoginName.split("|membership|")[1];
          this.currentUserITCode = loginName.split("@")[0];
          this.currentUserTitle = c.d.Title;
          this.LoginName = loginName;
          this.StaffReimbursement.Applicant = c.d.Title;
          this.search(loginName);
        })
        .catch(err => {
          this.$message(common.message("error", "加载当前用户出错!"));
        });
    },
    //查询用户信息
    search(userLoginName) {
      var applicant = this.StaffReimbursement.Applicant;
      if (applicant != "" || applicant != null) {
        var parm = {
          type: "get",
          action: "ListItems",
          list: this.userListName,
          condition: "?$filter=EmployeeID eq  '" + userLoginName + "'",
          baseUrl: this.hostUrl
        };
        var opt = common.queryOpt(parm);
        $.when($.ajax(opt))
          .done(req => {
            var data = req.d.results;
            if (data.length > 0) {
              this.EmployeeCode = data[0].EmployeeCode;
              var selectedCostCenter = "";
              data.forEach(d => {
                selectedCostCenter = d.CostCenter;
                this.CompanyCodeArr.push({
                  CompanyCode: d.CompanyCode
                });
              });
              //默认成本中心
              this.StaffReimbursement.CostCenter = selectedCostCenter;
              this.FinanceITCode = this.LoginName.split("@")[0];
              //默认员工账号
              this.StaffReimbursement.AccountNumber =
                data[0].EmployeeBankAccount;
            } else {
              this.$message(
                common.message(
                  "error",
                  "搜索的用户不在员工信息列表中,请及时与管理员联系!"
                )
              );
            }
          })
          .catch(err => {
            this.loading = false;
            this.$message(
              common.message(
                "error",
                "搜索的用户不在员工信息列表中,请及时与管理员联系!"
              )
            );
          });
      }
    },
    //获取成本中心
    getCostCenter() {
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
          //去重成本中心
          var costCenter = [];
          data.forEach(d => {
            costCenter.push(d.CostCenter);
          });
          console.log("未去重");
          console.log(costCenter);
          var costCenterUnique = costCenter.filter(function(
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
          console.log("去重后");
          console.log(this.costCenterArr);
        }
      });
    },
    //获取费用类别
    getExpenseCategory() {
      //获取费用类别
      var that = this;
      var parm = {
        action: "ListItems",
        type: "get",
        list: this.expenseCategoryListName,
        baseUrl: this.hostUrl,
        condition: "?$top=2000"
      };
      var option = common.queryOpt(parm);
      $.when($.ajax(option))
        .done(function(req) {
          var data = req.d.results;
          console.log("费用类别");
          console.log(data);
          if (data.length > 0) {
            data.forEach(item => {
              that.expenseCategoryOptions.push({
                label: item.Category,
                value: item.Category,
                Codes: item.Codes,
                IsTravelExpense: item.IsTravelExpense == "Y" ? false : true,
                IsHotelExpense: item.IsHotelExpense == "Y" ? false : true
              });
            });
          }
        })
        .catch(err => {
          this.loading = false;
          this.$message(common.message("error", "加载费用类别时候出错!"));
        });
    },

    //获取费用科目
    getTaxCode() {
      var that = this;
      var parm = {
        action: "ListItems",
        type: "get",
        list: this.taxCodeListName,
        baseUrl: this.hostUrl,
        condition: ""
      };
      var option = common.queryOpt(parm);
      $.when($.ajax(option))
        .done(function(req) {
          var data = req.d.results;
          if (data.length > 0) {
            data.forEach(item => {
              that.taxCodeOptions.push({
                rate: item.Rate,
                label: item.Title,
                value: item.Title
              });
            });
          }
        })
        .catch(err => {
          this.loading = false;
          this.$message(common.message("error", "加载税码失败!"));
        });
    },
    loadAttachment: function(attUrl) {
      var parm = {
        type: "get",
        action: "Attachments",
        attUrl: attUrl
      };
      var opt = common.queryOpt(parm);
      return common.service(opt);
    }
  },
  mounted: function() {
    //获取费用类别
    this.getExpenseCategory();

    //获取当前信息
    this.getCurrentUser();
    //获取成本中心
    this.getCostCenter();
    //获取税码
    this.getTaxCode();

    var applicantNumber = common.GetParameterValues("ApplicantNumber");
    var step = common.GetParameterValues("Step");
    this.currentStep = step;
    var tId = common.GetParameterValues("TaskId");
    if (this.fileList.length == 0) {
      this.startNoAttr = false;
    }
    if (typeof Number(tId) == "number") {
      this.taskId = tId;
      if (tId > 0 && step != "Application") {
        this.showEditor = false;
        this.showApprover = true;
        if (step == "Approver5") {
          this.showFA = true;
        }
      } else if (tId == 0) {
        console.log("用户点击的是保存");
      } else if (tId > 0 && step == "Application") {
        console.log("该请求已被拒绝");
        this.requestIsReject = true;
        this.showEditor = false;
        this.showApprover = false;
      }
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
            this.StaffReimbursement.OrderNo = data[0].OrderNo;
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

      this.loading = false;
    } else {
      this.loading = false;
      common.message(common.message("error", "当前链接错误"));
    }
  }
};
</script>

<style>
.edityuangong {
  min-height: 25px;
  line-height: 25px;
  text-align: center;
  border-collapse: collapse;
  color: gray;
  padding: 2px;
}
.edityuangong tr td {
  border: 1px solid #cfcfcf;
  padding: 5px;
}
</style>
