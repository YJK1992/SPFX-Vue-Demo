<template>
  <div id="yuangong" v-loading="loading">
    <table class="yuangong" style="border-collapse: collapse;width:100%">
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
            filterable
            v-model="StaffReimbursement.CostCenter"
            @change="checkCostCenter"
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
            <el-button size="medium" type="primary">上传附件</el-button>
          </el-upload>
        </td>
      </tr>
      <tr>
        <td align="right">订单号：</td>
        <td colspan="7">
          <el-input v-model="StaffReimbursement.OrderNo" placeholder="请输入内容"></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">特殊审批人：</td>
        <td colspan="7">
          <el-input
            @change="speApprChange"
            v-model="StaffReimbursement.SpecialApprover"
            placeholder="特殊审批人"
          ></el-input>
        </td>
      </tr>
      <!-- <tr>
        <td align="right">审批意见：</td>
        <td colspan="7">
          <el-input placeholder="请输入内容"></el-input>
        </td>
      </tr>-->
      <tr>
        <td colspan="8" align="right">
          <el-button type="primary" @click="dialogFormVisible=true">添加项目行</el-button>
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
          >移除</el-button>
          <el-button
            type="text"
            @click.native.prevent="onEditItem(scope.$index, SubItems)"
            size="small"
          >编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <table class="yuangong" style="border-collapse: collapse;width:100%">
      <tr>
        <td colspan="8" align="right">
          <el-button id="btn_id" type="primary" @click="getApplicantNumber(buttonType.Submit)">提交</el-button>
          <el-button id="btn_id" type="primary" @click="getApplicantNumber(buttonType.Save)">保存</el-button>
        </td>
      </tr>
    </table>
    <!-- 新增税票 -->
    <el-dialog title="新增票据信息" :visible.sync="dialogFormVisible">
      <el-form :model="SubItem">
        <el-form-item label="费用类别：" :label-width="formLabelWidth">
          <el-select
            @change="ChangeCostAccount()"
            filterable
            v-model="SubItem.ExpenseCategory"
            placeholder="请选择"
          >
            <el-option
              v-for="item in expenseCategoryOptions"
              :key="item.label"
              :label="item.label"
              :value="item.label"
            ></el-option>
            <!-- <el-option></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label="费用科目：" :label-width="formLabelWidth">
          <el-select v-model="SubItem.CostAccount" placeholder="请选择">
            <template v-for="item in costAccountOptions">
              <el-option :key="item.value" :label="item.label" :value="item.value"></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item label="费用日期：" :label-width="formLabelWidth">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="SubItem.ExpenseDate"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="数量：" :label-width="formLabelWidth">
          <el-input
            type="number"
            @change="ChangeTotalMoney"
            v-model="SubItem.Count"
            placeholder="数量"
          ></el-input>
        </el-form-item>
        <el-form-item label="单位金额：" :label-width="formLabelWidth">
          <el-input
            type="number"
            @change="ChangeTotalMoney"
            v-model="SubItem.Price"
            placeholder="单位金额"
          ></el-input>
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
          <el-input
            type="number"
            @change="ChangeConvertMoney"
            v-model="SubItem.Rate"
            placeholder="汇率"
          ></el-input>
        </el-form-item>
        <el-form-item label="转换金额：" :label-width="formLabelWidth">
          <el-input v-model="SubItem.ConvertMoney" placeholder="转换金额" disabled></el-input>
        </el-form-item>
        <el-form-item label="转换后币种：" :label-width="formLabelWidth">
          <el-input v-model="SubItem.ConvertCurrency" placeholder="转换后币种"></el-input>
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
            :disabled="IsTravelExpense"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="到"
            v-model="StartArriveDate"
            start-placeholder="出发日期"
            end-placeholder="抵达日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="目的地：" :label-width="formLabelWidth">
          <el-input :disabled="IsTravelExpense" v-model="SubItem.Destination" placeholder="目的地"></el-input>
        </el-form-item>
        <el-form-item label="入住/离店日期：" :label-width="formLabelWidth">
          <el-date-picker
            :disabled="IsHotelExpense"
            value-format="yyyy-MM-dd"
            type="daterange"
            v-model="CheckInLeaveData"
            range-separator="到"
            start-placeholder="出发日期"
            end-placeholder="抵达日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="酒店名称：" :label-width="formLabelWidth">
          <el-input :disabled="IsHotelExpense" v-model="SubItem.Name" placeholder="酒店名称"></el-input>
        </el-form-item>
        <el-form-item label="天数：" :label-width="formLabelWidth">
          <el-input :disabled="IsHotelExpense" v-model="SubItem.Days" placeholder="天数"></el-input>
        </el-form-item>
        <el-form-item label="参考号：" :label-width="formLabelWidth">
          <el-input v-model="SubItem.Number" placeholder="发票号码（左上角）+ 发票号码（右上角）"></el-input>
        </el-form-item>
        <el-form-item label="备注：" :label-width="formLabelWidth">
          <el-input v-model="SubItem.Remark" placeholder="备注信息"></el-input>
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
      loading:true,
      hostUrl: this.GLOBAL.URL, //已在Web Part中注册了此变量
      mainListName: "StaffReimbursement", //对公付款
      mainListType: "SP.Data.StaffReimbursementListItem", //税票清单列表类型，用于post请求
      userListName: "EmployeeList", //员工详细信息列表名称
      taxCodeListName: "TaxCode", //税码
      applicantNumberListName: "ApplicantNumber", //申请单号流水码列表
      applicantNumberListType: "SP.Data.ApplicantNumberListItem", //申请单号流水码列表类型
      approverList: "ApproveNode", //审批节点列表名
      SpecApproId: 0, //特殊审批人ID
      LoginName: "", //登录名
      PTPBaseApplicantNumber: 0, //初始化流水码
      PTPBaseFormat: "EXP", //员工报销流程专用前缀
      PTPAppliantNumberItemId: 0, //员工报销流水码item的ID
      dialogFormVisible: false, //控制dialog显示与隐藏
      formLabelWidth: "150px", //控制dialog显示框宽度
      StartArriveDate: "", //开始时间
      CheckInLeaveData: "", //离开时间
      expenseCategoryListName: "PTPExpenseCategory", //费用类别
      costAccountListName: "CostAccount", //费用科目
      buttonType: {
        Submit: "submit",
        Save: "save"
      }, //标记点击的是保存按钮还是提交按钮
      StaffReimbursement: {
        Title: "", //申请单号
        Applicant: "", //申请人
        AccountNumber: "", //账户号
        CostCenter: "", //成本中心
        CompanyCode: "", //公司代码
        OrderNo: "", //备注
        SpecialApprover: "", //特殊审批人
        BussinessScope: "", //业务范围
        ProfitCenter: "", //利润中心
        EmployeeCode: "" //员工编号
      }, //主表数据
      SubItems: [], //初始化保存子表数据数组
      SubItem: {
        ExpenseCategory: "", //费用类别
        CostAccount: "", //费用科目
        Count: "", //数量
        Price: "", //单位金额
        Total: "", //总金额
        Currency: "", //币种
        Rate: "1", //汇率
        ConvertMoney: "", //转换金额
        ConvertCurrency: "RMB", //转换后币种
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
        Remark: "" //备注信息
      }, //子表数据
      Currency: [
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
      CostCenterArr: [], //成本中心数组
      CompanyCodeArr: [], //公司代码数组
      expenseCategoryOptions: [], //费用类别
      costAccountOptions: [], //费用科目
      taxCodeOptions: [], //税码
      editIndex: -1, //区分是编辑还是新增
      requestDigest: "", //POST Token
      fileList: [], //附件列表数据
      fileToArr: [], //附件转换成文件流，然后保存文件属性至数组里
      actionUrl: "https://lenovonetapp.sharepoint.cn/", //绑定上传附件按钮的action
      IsTravelExpense: true, //判断是否是旅费报销
      IsHotelExpense: true, //判断是否是酒店报销
      message: "" //提示框信息变量
    };
  },
  methods: {
    checkCostCenter: function() {
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
      var opt = common.queryOpt(parm);
      $.when($.ajax(opt))
        .done(req => {
          if (req.d.results.length > 0) {
            this.costCenterChange();
          } else {
            this.$message(
              common.message(
                "error",
                "未找到对应成本中心的审批节点,请联管理员yong.xu@lenovonetapp.com及时维护。"
              )
            );
          }
        })
        .catch(err => {
          this.$message(common.message("error", "校验成本中心出错!"));
        });
    }, //校验成本中心是否在审批节点表中
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
            //sums[index] += " 元";
            sums[index] = Number(sums[index]).toFixed(2) + " 元";
          }
        } else {
          //sums[index] = "N/A";
        }
      });

      return sums;
    }, //计算项目行合计金额
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
    }, //费用类别change事件
    costCenterChange: function() {
      this.companyCodeArr = [];
      var parm = {
        type: "get",
        action: "ListItems",
        list: this.userListName,
        condition:
          "?$filter=CostCenter eq '" + this.StaffReimbursement.CostCenter + "'",
        baseUrl: this.hostUrl
      };
      var opt = common.queryOpt(parm);
      $.when($.ajax(opt))
        .done(req => {
          var data = req.d.results;
          if (data.length > 0) {
            this.StaffReimbursement.CompanyCode = data[0].CompanyCode;
            var companyCode = [];
            data.forEach(d => {
              companyCode.push(d.CompanyCode);
            });
            console.log("未去重公司代码");
            console.log(companyCode);
            var companyCodeUnique = companyCode.filter(function(
              element,
              index,
              array
            ) {
              return array.indexOf(element) === index;
            });
            companyCodeUnique.forEach(element => {
              this.companyCodeArr.push({
                CompanyCode: element
              });
            });
          } else {
            this.$message(common.message("error", "未能找到对应的公司代码"));
          }
        })
        .catch(err => {
          this.$message(common.message("error", "获取公司代码失败"));
        });
    }, //成本中心change事件
    ChangeTaxRate() {
      this.taxCodeOptions.forEach(item => {
        if (item.label == this.SubItem.TaxCode) {
          this.SubItem.TaxRate = item.rate;
        }
      });
      this.ChangeConvertMoney();
    }, //税率change事件
    ChangeConvertMoney() {
      if (this.SubItem.Total != "" && this.SubItem.Rate != "") {
        this.SubItem.ConvertMoney = (
          Number(this.SubItem.Total) * Number(this.SubItem.Rate)
        ).toFixed(2);

        //计算原币税额
        this.SubItem.OriginalTaxMoney =
          (Number(this.SubItem.Total) /
            (1 + Number(this.SubItem.TaxRate.split("%")[0]) / 100)) *
          (Number(this.SubItem.TaxRate.split("%")[0]) / 100);
        this.SubItem.OriginalTaxMoney = Number(
          this.SubItem.OriginalTaxMoney
        ).toFixed(2);
      }
    }, //根据汇率和总金额 结算转换后的金额
    ChangeTotalMoney() {
      if (this.SubItem.Count != "" && this.SubItem.Price != "") {
        this.SubItem.Total = (
          Number(this.SubItem.Count) * Number(this.SubItem.Price)
        ).toFixed(2).toString();
        this.ChangeConvertMoney();
      }
    }, //改变数量和单位金额的时候变更总金额
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
    }, //将文件转化成arrayBuffer
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
    }, //设置上传文件数量
    onEditItem(index) {
      this.SubItem = this.SubItems[index];
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
      this.editIndex = index;
      this.dialogFormVisible = true;
    }, //编辑项目行
    deleteRow(index, rows) {
      rows.splice(index, 1);
    }, //删除项目行
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
        Rate: "1", //汇率
        ConvertMoney: "", //转换金额
        ConvertCurrency: "RMB", //转换后币种
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
        Remark: "" //备注信息
      };
      this.IsTravelExpense = true;
      this.IsHotelExpense = true;
      this.dialogFormVisible = false;
    }, //添加子项页面退出方法
    handleClick(row) {
      console.log(row);
    }, //测试的方法
    subVerification() {
      var isSuccess = false;
      if (this.SubItem.ExpenseDate == "") {
        this.message = "请填写费用日期;";
      } else if (this.SubItem.Count == "") {
        this.message = "请填写数量";
      } else if (this.SubItem.Price == "") {
        this.message = "请填写单位金额";
      } else if (this.SubItem.Rate == "") {
        this.message = "请填写汇率;";
      } else if (this.SubItem.TaxCode == "") {
        this.message = "请选择税码;";
      } else if (!this.IsTravelExpense && this.IsHotelExpense) {
        //校验出差日期
        if (this.SubItem.StartDate == "") {
          this.message = "请填写出发时间;";
        } else if (this.SubItem.ArriveDate == "") {
          this.message = "请填写到达时间;";
        } else if (this.SubItem.Destination == "") {
          this.message = "请填写目的地;";
        } else {
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
    }, //子项数据校验
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
        //校验不通过;
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
          Rate: "1", //汇率
          ConvertMoney: "", //转换金额
          ConvertCurrency: "RMB", //转换后币种
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
          Remark: "" //备注信息
        };
        this.dialogFormVisible = false;
      }
    }, //添加项目行
    formatAppNumber: function(AppNumber) {
      var formatAppNumber = "";
      var number = AppNumber;
      if (number.toString().length == 1) {
        formatAppNumber = "00000" + number.toString();
      } else if (number.toString().length == 2) {
        formatAppNumber = "0000" + number.toString();
      } else if (number.toString().length == 3) {
        formatAppNumber = "000" + number.toString();
      } else if (number.toString().length == 4) {
        formatAppNumber = "00" + number.toString();
      } else if (number.toString().length == 5) {
        formatAppNumber = "0" + number.toString();
      } else if (number.toString().length == 6) {
        formatAppNumber = number.toString();
      }
      return formatAppNumber;
    }, //格式化申请单号
    onSaveOrSubmmit(type) {
      
      if (this.StaffReimbursement.AccountNumber=="") {
        //校验不通过;
        $("#btn_id").attr("disabled",false)
        this.$message(common.message("error", "该用户没有维护银行账户"));
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
    }, //提交或保存
    CreateStaffReimbursement(type) {
      console.log(this.StaffReimbursement);
      var costcenter = this.StaffReimbursement.CostCenter;
      var applicantNumber = "";
      var currentTime = common.getCurrentDate_NoLine();
      var baseAppNumber = this.formatAppNumber(this.PTPBaseApplicantNumber);
      applicantNumber = this.PTPBaseFormat + currentTime + baseAppNumber;
      console.log("applicantNumber");
      console.log(applicantNumber);
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
              Title: applicantNumber,
              Applicant: this.StaffReimbursement.Applicant, //申请人
              AccountNumber: this.StaffReimbursement.AccountNumber, //账户号
              CostCenter: this.StaffReimbursement.CostCenter, //成本中心
              CompanyCode: this.StaffReimbursement.CompanyCode, //公司代码
              OrderNo: this.StaffReimbursement.OrderNo, //备注
              SpecialApproverTitle: this.StaffReimbursement.SpecialApprover, //特殊审批人
              DetailInvoiceJSON: JSON.stringify(this.SubItems),
              ApplicantEmail: this.LoginName.split("@")[0],
              BussinessScope: this.StaffReimbursement.BussinessScope,
              ProfitCenter: this.StaffReimbursement.ProfitCenter
            };
            //总计发票金额
            var total = 0;
            this.SubItems.forEach(item => {
              total += Number(item.ConvertMoney);
            });
            if (this.SpecApproId != 0 && this.checkIsSpecAppro) {
              itemInfo.SpecialApproverId = this.SpecApproId;
            }
            if (type == "submit") {
              itemInfo.Status = "Submitted";
              if (total >= 0 && total <= 5000) {
                itemInfo.Approver1Id = data1.Approver1Id;
              } else if (total > 5000 && total <= 20000) {
                itemInfo.Approver1Id = data1.Approver1Id;
                itemInfo.Approver2Id = data1.Approver2Id;
              } else {
                itemInfo.Approver1Id = data1.Approver1Id;
                itemInfo.Approver2Id = data1.Approver2Id;
                itemInfo.Approver3Id = data1.Approver3Id;
                //itemInfo.Approver4Id = data1.Approver4Id;
              }
            }
            parm = {
              type: "post",
              action: "AddInList",
              baseUrl: this.hostUrl,
              list: this.mainListName,
              item: itemInfo,
              digest: this.requestDigest
            };
            console.log(itemInfo);
            option = common.queryOpt(parm);
            $.when($.ajax(option))
              .done(req => {
                var attUrl = req.d.AttachmentFiles.__deferred.uri;
                this.uploadAttFileToItem(attUrl);
                this.$message({
                  showClose: true,
                  message: "员工报销添加成功!" + applicantNumber,
                  type: "success",
                  duration: 0
                });
                this.updateApplicantBaseNumber();
                this.loading = false;
                this.$router.push("/home");
              })
              .catch(err => {
                this.loading = false;
                this.$message(common.message("error", "员工报销添加失败!"));
              });
          } else {
            this.$message(
              common.message(
                "error",
                "未找到对应成本中心的审批节点,请联管理员yong.xu@lenovonetapp.com及时维护。"
              )
            );
          }
        })
        .catch(err => {
          this.loading = false;
          this.$message(common.message("error", "创建数据失败"));
        });
    }, //创建数据
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
    }, //填写特殊审批人change事件
    getApplicantNumber: function(type) {
      $("#btn_id").attr("disabled",true)
      //直接校验必须有子项
      if (this.SubItems.length == 0 ) {
        this.$message(common.message("error", "请录入项目行数据！"));
        $("#btn_id").attr("disabled",false)
        return;
      }
      var parm = {
        type: "get",
        action: "ListItems",
        list: this.applicantNumberListName,
        condition: "?$filter=Prefix eq 'EXP'",
        baseUrl: this.hostUrl
      };
      var opt = common.queryOpt(parm);
      var getBaseApplicantNumber = common.service(opt);
      getBaseApplicantNumber
        .done(req => {
          var data = req.d.results;
          console.log(data);
          this.PTPBaseApplicantNumber = data[0].Number;
          this.PTPAppliantNumberItemId = data[0].ID;
          this.onSaveOrSubmmit(type);
        })
        .catch(err => {
          this.$message(common.message("error", "获取单号流水号失败!"));
          $("#btn_id").attr("disabled",false)
        });
    }, //从申请单号列表中获取最新流水号
    updateApplicantBaseNumber: function() {
      var PTPbaseNumber = this.PTPBaseApplicantNumber;
      var itemInfo = {
        __metadata: {
          type: this.applicantNumberListType
        }
      };
      var parm = {
        type: "post",
        action: "EditListItem",
        baseUrl: this.hostUrl,
        list: this.applicantNumberListName,
        digest: this.requestDigest
      };
      itemInfo.Number = PTPbaseNumber + 1;
      parm.itemID = this.PTPAppliantNumberItemId;
      parm.item = itemInfo;
      var opt = common.queryOpt(parm);
      $.when($.ajax(opt))
        .done(req => {
          console.log("更新流水号成功");
        })
        .catch(err => {
          this.$message(common.message("error", "更新流水号失败"));
        });
    }, //更新申请单号表中的流水码
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
          this.LoginName = loginName;
          // this.StaffReimbursement.Applicant = c.d.Title;
          this.search(loginName);
        })
        .catch(err => {
          this.$message(common.message("error", "加载当前用户出错!"));
        });
    }, //获取当前用户
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
              //默认业务范围
              this.EmployeeCode = data[0].EmployeeCode;
              console.log("默认业务范围");
              console.log(data);
              console.log(this.StaffReimbursement);
              this.StaffReimbursement.CostCenter = data[0].CostCenter;
              this.costCenterChange();
              this.StaffReimbursement.BussinessScope = data[0].BusinessScope;
              this.StaffReimbursement.ProfitCenter = data[0].ProfitCenter;
              this.StaffReimbursement.EmployeeCode = data[0].EmployeeCode;
              //默认员工账号
              this.StaffReimbursement.AccountNumber =
                data[0].EmployeeBankAccount;
                this.StaffReimbursement.Applicant=data[0].EmployeeName;
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
    }, //查询用户信息
    getCostCenter() {
      var parm = {
        type: "get",
        action: "ListItems",
        list: this.userListName,
        condition: "?$top=2000",
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
    }, //获取成本中心
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
    }, //获取费用类别
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
    } //获取税码
  },
  mounted: function() {
    this.getExpenseCategory(); //获取费用类别
    this.getCurrentUser(); //获取当前信息
    this.getCostCenter(); //获取成本中心
    this.getTaxCode(); //获取税码
    this.loading = false;
    //this.getApplicantNumber();//获取流水号
  }
};
</script>
<style>
.yuangong {
  min-height: 25px;
  line-height: 25px;
  text-align: center;
  border-collapse: collapse;
  color: gray;
  padding: 2px;
}
.yuangong tr td {
  border: 1px solid #cfcfcf;
  padding: 5px;
}
</style>
