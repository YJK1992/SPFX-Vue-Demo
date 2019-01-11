<template>
  <div v-loading="loading">
    <table class="duigong" style="  border-collapse: collapse;">
      <tr>
        <td colspan="8">
          <span style="font-size:30px;color:#409eff;">对公付款</span>
        </td>
      </tr>
      <tr>
        <td align="right">申请单号：</td>
        <td colspan="7">
          <el-input disabled v-model="PublicPayment.ApplicationNumber" placeholder="申请单号"></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">单据编号：</td>
        <td align="left">
          <el-select
            @change="isHaveContract"
            v-model="PublicPayment.ReceiptNumber"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in ReceiptNumbers"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </td>
        <td align="right">报销类型：</td>
        <td align="left">
          <el-select
            v-model="PublicPayment.ReimbursementType"
            placeholder="请选择"
            @change="clearNumber"
          >
            <el-option
              v-for="item in ReimbursementType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </td>
        <td align="right">结算方式：</td>
        <td align="left" colspan="5">
          <el-select v-model="PublicPayment.SettlementType" placeholder="请选择">
            <el-option
              v-for="item in SettlementType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </td>
      </tr>
      <tr>
        <td align="right">经办人：</td>
        <td>
          <el-input disabled v-model="PublicPayment.Trustees" placeholder="经办人"></el-input>
        </td>
        <td align="right">成本中心：</td>
        <td align="left">
          <el-select v-model="PublicPayment.CostCenter" placeholder="请选择" size="medium" @change="costCenterChange">
            <el-option
              v-for="item in costCenterArr"
              :key="item.CostCenter"
              :label="item.CostCenter"
              :value="item.CostCenter"
            ></el-option>
          </el-select>
        </td>
        <td align="right">公司代码 ：</td>
        <td align="left" colspan="2">
          <el-select
            v-model="PublicPayment.CompanyCode"
            placeholder="请选择"
            size="medium"
          >
            <el-option
              v-for="item in companyCodeArr"
              :key="item.CompanyCode"
              :label="item.CompanyCode"
              :value="item.CompanyCode"
            ></el-option>
          </el-select>
        </td>
      </tr>
      <tr>
        <td align="right">发票金额：</td>
        <td>
          <el-input
            @change="CalculateAmountInlowercase"
            v-model="PublicPayment.InvoiceValue"
            placeholder="发票金额"
          ></el-input>
        </td>
        <td align="right">币种：</td>
        <td align="left">
          <el-select
            @change="CalculateAmountInlowercase"
            v-model="PublicPayment.Currency"
            placeholder="请选择"
          >
            <el-option
              v-for="item in Currency"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </td>
        <td align="right">汇率：</td>
        <td colspan="2">
          <el-input
            @change="CalculateAmountInlowercase"
            v-model="PublicPayment.ExchangeRate"
            placeholder="汇率"
          ></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">金额(小写)：</td>
        <td>
          <el-input
            disabled
            v-model="PublicPayment.AmountInlowercase"
            @change="convertMoney"
            placeholder="小写金额"
          ></el-input>
        </td>
        <td align="right">金额(大写)：</td>
        <td colspan="6">
          <el-input v-model="PublicPayment.CapitalizationAmount" disabled placeholder="大写金额"></el-input>
        </td>
      </tr>
      <tr>
        <td colspan="3" style="color:#409eff">此项报销有借款时必须要填写借款单号</td>
        <td align="right">借款单号：</td>
        <td colspan="4">
          <el-input v-model="PublicPayment.LoanNumber" placeholder="借款单号"></el-input>
        </td>
      </tr>
      <tr>
        <td colspan="8" align="center" style="color:#409eff">结算方式为“汇款”或“支票”时填写</td>
      </tr>
      <tr>
        <td align="right">收款单位名称：</td>
        <td colspan="7">
          <el-input v-model="PublicPayment.CollectionUnit" placeholder="收款单位名称"></el-input>
        </td>
      </tr>
      <tr>
        <td rowspan="3" style="writing-mode:lr-tb">汇款、汇票时填写</td>
        <td align="right">开户行：</td>
        <td colspan="2">
          <el-input v-model="PublicPayment.OpeningBank" placeholder="开户行"></el-input>
        </td>
        <td align="right">账号：</td>
        <td colspan="2">
          <el-input v-model="PublicPayment.Account" placeholder="账号"></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">省/直辖市：</td>
        <td colspan="2">
          <el-input v-model="PublicPayment.City" placeholder="省/直辖市"></el-input>
        </td>
        <td align="right">市/县：</td>
        <td colspan="2">
          <el-input v-model="PublicPayment.County" placeholder="市/县"></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">汇款附言：</td>
        <td colspan="6">
          <el-input v-model="PublicPayment.DetailsOfPayment" placeholder="省/直辖市"></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">是否有合同：</td>
        <td colspan="7" align="left">
          <el-checkbox @change="clearContract" v-model="PublicPayment.IsContract"></el-checkbox>
        </td>
      </tr>
      <tr>
        <td align="right">合同号：</td>
        <td colspan="2" align="left">
          <el-select
            :disabled="PublicPayment.IsContract==false"
            @change="changeMoney()"
            v-model="PublicPayment.ContractNumber"
            filterable
            placeholder="请选择"
          >
            <el-option
              v-for="item in ContractNumbers"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </td>
        <td align="right">金额：</td>
        <td colspan="4">
          <el-input disabled v-model="PublicPayment.Money" placeholder="金额"></el-input>
        </td>
      </tr>
      <tr>
        <td style="width:200px">合同名称</td>
        <td style="width:270px">供应商</td>
        <td style="width:200px">内容</td>
        <td>法人代表</td>
        <td>币种</td>
        <td style="width:170px">总金额</td>
        <td style="width:170px">已付款</td>
      </tr>
      <tr v-for="(subItems,index) in  ContractList">
        <template v-for="(subItem,cindex) in subItems">
          <td>{{subItem}}</td>
        </template>
      </tr>
      <tr>
        <td align="right">已付款：</td>
        <td align="left" colspan="2">{{AccountPaid}}</td>
        <td align="right">未付款：</td>
        <td align="left" colspan="3">{{UnPaid}}</td>
      </tr>
      <tr>
        <td align="right">项目名称：</td>
        <td colspan="2">
          <el-input v-model="PublicPayment.ProjectName" placeholder="合同号"></el-input>
        </td>
        <td align="right">项目编号：</td>
        <td colspan="3">
          <el-input v-model="PublicPayment.ProjectNumber" placeholder="项目编号"></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">增值税/运费专用发票</td>
        <td align="left" colspan="2">
          <el-checkbox v-model="PublicPayment.IsFreightInvoice"></el-checkbox>
          <el-button
            :disabled="!PublicPayment.IsFreightInvoice"
            type="primary"
            @click="dialogTableVisible = true"
            style="margin-left: 20px;"
          >税票清单</el-button>
          <el-button
            :disabled="!PublicPayment.IsFreightInvoice"
            type="primary"
            @click="downloadTaxExcel"
          >下载税票清单Excel模板</el-button>
        </td>
        <td colspan="5" align="left">
          <el-upload
            class="upload-demo"
            :action="actionUrl"
            :on-error="uploadErr"
            :on-success="uploadSuccess"
            :limit="1"
            :on-exceed="fileLimit"
            :beforeUpload="beforeUploadValidate"
            :show-file-list="TaxFlg"
            :disabled="!PublicPayment.IsFreightInvoice"
          >
            <el-button type="primary" :disabled="!PublicPayment.IsFreightInvoice">导入税票清单</el-button>
          </el-upload>
        </td>
      </tr>
      <tr>
        <td align="right">费用分摊</td>
        <td align="left" colspan="2">
          <el-checkbox v-model="PublicPayment.IsExpenseAllocation"></el-checkbox>
          <el-button
            :disabled="!PublicPayment.IsExpenseAllocation"
            type="primary"
            @click="dialogTableVisible2 = true"
            style="margin-left: 20px;"
          >费用分摊清单</el-button>
          <el-button
            :disabled="!PublicPayment.IsExpenseAllocation"
            type="primary"
            @click="downloadExpenseExcel"
          >下载费用分摊Excel模板</el-button>
        </td>
        <td colspan="5" align="left">
          <el-upload
            class="upload-demo"
            :action="actionUrl"
            :on-error="uploadErr"
            :on-success="uploadExpenseSuccess"
            :limit="1"
            :on-exceed="fileLimit"
            :beforeUpload="beforeUploadValidate"
            :show-file-list="TaxFlg"
            :disabled="!PublicPayment.IsExpenseAllocation"
          >
            <el-button type="primary" :disabled="!PublicPayment.IsExpenseAllocation">导入费用分摊</el-button>
          </el-upload>
        </td>
      </tr>
      <tr>
        <td align="right">备注：</td>
        <td colspan="7">
          <el-input v-model="PublicPayment.Remark" placeholder="备注"></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">费用类别：</td>
        <td align="left">
          <el-select
            filterable
            @change="PublicPayment.CostAccount=''"
            v-model="PublicPayment.ExpenseCategory"
            placeholder="请选择"
          >
            <el-option
              v-for="item in expenseCategoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </td>
        <td align="right">费用科目:</td>
        <td colspan="5" align="left">
          <el-select v-model="PublicPayment.CostAccount" placeholder="请选择">
            <template v-for="item in costAccountOptions">
              <el-option
                v-if="PublicPayment.ExpenseCategory===item.Type"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </template>
          </el-select>
        </td>
      </tr>
      <tr>
        <td align="right">特殊审批人：</td>
        <td colspan="7">
          <el-input
            v-model="PublicPayment.SpecialApprover"
            placeholder="特殊审批人"
            @change="speApprChange"
          ></el-input>
        </td>
      </tr>
      <tr>
        <td colspan="8" align="right">
          <el-button type="primary" @click="onSaveOrSubmmit(buttonType.Submit)">提交</el-button>
          <el-button @click="onSaveOrSubmmit(buttonType.Save)" type="primary" plain>保存</el-button>
        </td>
      </tr>
    </table>
    <!-- 税票清单列表 -->
    <el-dialog show-summary title="税票清单" stripe :visible.sync="dialogTableVisible">
      <el-table :data="TaxReceiptList">
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column property="CompanyCode" label="公司代码" width="100"></el-table-column>
        <el-table-column property="InvoiceNumber" label="发票号" width="150"></el-table-column>
        <el-table-column property="Currency" label="币种"></el-table-column>
        <el-table-column property="Supplier" label="供应商"></el-table-column>
        <el-table-column property="InvoiceValue" label="发票金额"></el-table-column>
        <el-table-column property="TaxRate" label="税率"></el-table-column>
        <el-table-column property="TaxCode" label="税码"></el-table-column>
        <el-table-column property="CodeOfFixedAssets" label="固定资产编码"></el-table-column>
        <el-table-column property="Amount" label="数量"></el-table-column>
      </el-table>
    </el-dialog>

    <!-- 费用清单列表 -->
    <el-dialog show-summary title="费用分摊清单" stripe :visible.sync="dialogTableVisible2">
      <table width="100%" class="duigong" style="  border-collapse: collapse;">
        <tr>
          <td>费用科目号</td>
          <td>费用名称</td>
          <td>摊出成本中心编号</td>
          <td>摊出金额</td>
          <td>项目名称</td>
          <td>项目编号</td>
          <td>摊出成本中心签批人姓名</td>
          <td>摘要</td>
        </tr>
        <template>
          <tr v-for="(subItems,index) in  ExpenseAllocationList">
            <template v-if="!ExpenseAllocationList[index].IsIn">
              <template v-for="(subItem,cindex) in subItems">
                <td v-if="cindex!='IsIn'">{{subItem}}</td>
              </template>
            </template>
          </tr>
        </template>
        <tr>
          <td>费用科目号</td>
          <td>费用名称</td>
          <td>摊入成本中心编号</td>
          <td>摊入金额</td>
          <td>项目名称</td>
          <td>项目编号</td>
          <td>摊入成本中心签批人姓名</td>
          <td>摘要</td>
        </tr>
        <template>
          <tr v-for="(subItems,index) in  ExpenseAllocationList">
            <template v-if="ExpenseAllocationList[index].IsIn">
              <template v-for="(subItem,cindex) in subItems">
                <td v-if="cindex!='IsIn'">{{subItem}}</td>
              </template>
            </template>
          </tr>
        </template>
      </table>
    </el-dialog>
  </div>
</template>
<script>
import $ from "jquery";
import common from "../js/common.js";
import efn from "../js/json2excel.js";
import sprestlib from "sprestlib/dist/sprestlib";
export default {
  data() {
    return {
      actionUrl: "https://lenovonetapp.sharepoint.cn/", //绑定上传附件按钮的action
      hostUrl: this.GLOBAL.URL, //已在Web Part中注册了此变量
      requestDigest: "",
      mainListName: "PublicPayment", //对公付款
      mainListType: "SP.Data.PublicPaymentListItem", //税票清单列表类型，用于post请求
      userListName: "EmployeeList", //员工详细信息列表名称
      GpPRListName: "PurchaseRequest",
      applicantNumberListName: "ApplicantNumber",
      applicantNumberListType: "SP.Data.ApplicantNumberListItem",
      ContractListName: "ContractList", //合同列表pushtable
      approverList: "ApproveNode", //审批节点列表名
      userArr: [], //用户信息数据数组
      costCenterArr: [], //成本中心数组
      companyCodeArr: [], //公司代码数组
      ContractList: [], //合同列表
      ContractNumbers: [], //所有合同号
      AccountPaid: "", //合同列表已支付金额
      UnPaid: "", //合同列表未支付金额
      expenseCategoryListName: "ExpenseCategory", //费用类别
      costAccountListName: "CostAccount", //费用科目
      SpecApproId: 0, //特殊审批人ID
      ReceiptNumbers: [], //已完成的采购申请单
      buttonType: {
        Submit: "submit",
        Save: "save"
      },
      PublicPayment: {
        ReimbursementType: "", //报销类型
        SettlementType: "", //结算方式
        Trustees: "", //经办人
        CostCenter: "", //成本中心
        Currency: "", //币种
        InvoiceValue: "", //发票金额
        ExchangeRate: "", //汇率
        AmountInlowercase: "", //金额小写
        CapitalizationAmount: "", //金额大写
        LoanNumber: "", //借款单号
        CollectionUnit: "", //收款单位名称
        OpeningBank: "", //开户行
        Account: "", //账号
        City: "", //省市
        County: "", //市县
        DetailsOfPayment: "", //汇款附言
        IsContract: false, //是否有合同
        ContractNumber: "", //合同号
        Money: "", //金额
        ProjectName: "", //项目名称
        ProjectNumber: "", //项目编号
        IsFreightInvoice: false, //运费发票
        Remark: "", //备注
        ExpenseCategory: "", //费用类别
        CostAccount: "", //费用科目
        // CodeOfFixedAssets: "", //固定资产编码
        ApplicationNumber: "", //申请单号
        ReceiptNumber: "", //单据编号
        IsSettlement: false, //结算
        SpecialApprover: "", //特殊审批人
        IsExpenseAllocation: false, //是否有费用分摊
        CompanyCode: "", //公司代码
        EmployeeCode: "", //人员编号
        BussinessScope: "" //业务范围
      },
      TaxReceiptList: [], //税票清单
      TaxFileId: "",
      ExpenseFileId: "",
      TaxFlg: false,
      TaxLibrary: "TaxLibrary",
      ExpenseLibrary: "ExpenseLibrary",
      ExpenseFileJson: {},
      TaxFileJson: {},
      FileGUID: "",
      IsTaxExcelTemplate: false,
      IsExpenseTemplate: false,
      ExpenseAllocationList: [], //费用分摊列表
      ReimbursementType: [
        //报销类型
        {
          value: "费用借款",
          label: "费用借款"
        },
        {
          value: "对公付款",
          label: "对公付款"
        },
        {
          value: "资产对公付款",
          label: "资产对公付款"
        },
        {
          value: "其他",
          label: "其他"
        }
      ],
      SettlementType: [
        //结算方式
        {
          value: "清账",
          label: "清账"
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
      dialogTableVisible: false, //税票清单列表
      dialogTableVisible2: false, //费用分摊列表
      editIndex: -1, //是否编辑
      editIndex2: -1, //是否编辑费用分摊
      formLabelWidth: "150px", //添加税票清单中的宽度
      expenseCategoryOptions: [], //费用类别
      costAccountOptions: [], //费用科目
      LoginName: "", //登录名
      message: "", //消息文本
      loading: false,
      GPDocumentLibrary: "GPDocument",
      TaxExcelUrl: "",
      ExpenseExcelUrl: "",
      GPJBaseApplicantNumber: 0,
      GPBBaseApplicantNumber: 0,
      GPJBaseFormat: "GPJ",
      GPBBaseFormat: "GPB",
      GPJAppliantNumberItemId: 0,
      GPBAppliantNumberItemId: 0
    };
  },
  methods: {
    costCenterChange: function() {
      this.companyCodeArr=[]
      var parm = {
        type: "get",
        action: "ListItems",
        list: this.userListName,
        condition:
          "?$filter=CostCenter eq '" + this.PublicPayment.CostCenter + "'",
        baseUrl: this.hostUrl
      };
      var opt = common.queryOpt(parm);
      $.when($.ajax(opt))
        .done(req => {
          var data = req.d.results;
          if(data.length>0){
            this.PublicPayment.CompanyCode=data[0].CompanyCode
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
          }else{
            this.$message(common.message("error", "未能找到对应的公司代码"));
          }
        })
        .catch(err => {
          this.$message(common.message("error", "获取公司代码失败"));
        });
    },
    getApplicantNumber: function() {
      var parm = {
        type: "get",
        action: "ListItems",
        list: this.applicantNumberListName,
        condition: "",
        baseUrl: this.hostUrl
      };
      var opt = common.queryOpt(parm);
      var getBaseApplicantNumber = common.service(opt);
      getBaseApplicantNumber
        .done(req => {
          var data = req.d.results;
          data.forEach(i => {
            if (i.Prefix == "GPB") {
              this.GPBBaseApplicantNumber = i.Number;
              this.GPBAppliantNumberItemId = i.ID;
            } else if (i.Prefix == "GPJ") {
              this.GPJBaseApplicantNumber = i.Number;
              this.GPJAppliantNumberItemId = i.ID;
            }
          });
        })
        .catch(err => {
          this.$message(common.message("error", "获取单号流水号失败!"));
        });
    },
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
    },
    updateApplicantBaseNumber: function() {
      var GPJbaseNumber = this.GPJBaseApplicantNumber;
      var GPBbaseNumber = this.GPBBaseApplicantNumber;
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
      if (this.PublicPayment.ReimbursementType == "费用借款") {
        itemInfo.Number = GPJbaseNumber + 1;
        parm.itemID = this.GPJAppliantNumberItemId;
        parm.item = itemInfo;
      } else {
        itemInfo.Number = GPBbaseNumber + 1;
        parm.itemID = this.GPBAppliantNumberItemId;
        parm.item = itemInfo;
      }
      var opt = common.queryOpt(parm);
      $.when($.ajax(opt))
        .done(req => {
          console.log("更新流水号成功");
        })
        .catch(err => {
          this.$message(common.message("error", "更新流水号失败"));
        });
    },
    loadExcelFileUrl: function() {
      var parm = {
        action: "ListItems",
        type: "get",
        list: this.GPDocumentLibrary,
        baseUrl: this.hostUrl,
        condition: ""
      };
      var baseFileUri = this.hostUrl + "/" + this.GPDocumentLibrary;
      var option = common.queryOpt(parm);
      var getFileItems = common.service(option);
      getFileItems
        .done(req => {
          var data = req.d.results;
          console.log("ffffffffff11111111");
          console.log(data);
          data.forEach(i => {
            console.log("ffffffffff22222");
            console.log(i);
            var fileUri = i.File.__deferred.uri;
            var type = i.Type;
            var getFileUrl = this.getFileItem(i.File.__deferred.uri);
            getFileUrl
              .done(f => {
                console.log("ffffffffff333");
                console.log(f);
                if (i.Type == "GPTax") {
                  this.TaxExcelUrl = baseFileUri + "/" + f.d.Name;
                } else if (i.Type == "GPExpense") {
                  this.ExpenseExcelUrl = baseFileUri + "/" + f.d.Name;
                }
              })
              .catch(err => {
                this.$message(common.message("error", "获取Excel模板Url失败"));
              });
          });
        })
        .catch(err => {
          this.$message(common.message("error", "获取Excel模板失败"));
        });
    },
    downloadTaxExcel: function() {
      window.open(this.TaxExcelUrl);
    },
    downloadExpenseExcel: function() {
      window.open(this.ExpenseExcelUrl);
    },
    beforeUploadValidate: function(file) {
      var fileInfo = file.raw;
      const extension = file.name.toLowerCase().endsWith(".xls");
      if (!extension) {
        this.$message(common.message("error", "上传的文件只能是xls"));
      }
      return extension;
    }, //文件上传前对文件格式进行验证
    uploadSuccess: function(response, file, fileList) {
      this.loading = true;
      var fileInfo = file.raw;
      var fileName = file.name;
      var getDigst = common.getRequestDigest(this.hostUrl);
      getDigst
        .done(data => {
          this.requestDigest = data.d.GetContextWebInformation.FormDigestValue;
          this.getfile(fileInfo, fileName, "Tax");
        })
        .catch(error => {
          this.loading = false;
          this.$message(common.message("error", "获取Digest失败"));
        });
    }, //上传成功后回调函数
    uploadExpenseSuccess: function(response, file, fileList) {
      this.loading = true;
      var fileInfo = file.raw;
      var fileName = file.name;
      var getDigst = common.getRequestDigest(this.hostUrl);
      getDigst
        .done(data => {
          this.requestDigest = data.d.GetContextWebInformation.FormDigestValue;
          this.getfile(fileInfo, fileName, "Expense");
        })
        .catch(error => {
          this.loading = false;
          this.$message(common.message("error", "获取Digest失败"));
        });
    },
    getfile: function(fileInfo, fileName, type) {
      var fileToArr = common.getFileBuffer(fileInfo);
      fileToArr
        .done(f => {
          console.log(f);
          if (f != null) {
            var excelJson = efn.excelToJson(f);
            if (excelJson != null && excelJson != undefined) {
              if (type == "Tax") {
                console.log("Tax part");
                if (excelJson.Sheet1[2][0].indexOf("GPTAXVER") == 0) {
                  this.IsTaxExcelTemplate = true;
                  var excelTemp = { d: [] };
                  for (var i = 4; i <= 33; i++) {
                    var TaxColumns = {
                      CompanyCode: "",
                      InvoiceNumber: "",
                      Currency: "",
                      Supplier: "",
                      InvoiceValue: "",
                      TaxRate: "",
                      TaxCode: "",
                      CodeOfFixedAssets: "",
                      Amount: ""
                    };
                    if (excelJson.Sheet1[i][2] == undefined) {
                      continue;
                    }
                    TaxColumns.InvoiceValue = excelJson.Sheet1[i][5].toString();
                    TaxColumns.Currency = excelJson.Sheet1[i][3].toString();
                    TaxColumns.TaxCode = excelJson.Sheet1[i][7].toString();
                    TaxColumns.InvoiceNumber = excelJson.Sheet1[
                      i
                    ][2].toString();

                    if (excelJson.Sheet1[i][1] != undefined) {
                      TaxColumns.CompanyCode = excelJson.Sheet1[
                        i
                      ][1].toString();
                    }
                    if (excelJson.Sheet1[i][4] != undefined) {
                      TaxColumns.Supplier = excelJson.Sheet1[i][4].toString();
                    }
                    if (excelJson.Sheet1[i][6] != undefined) {
                      TaxColumns.TaxRate = excelJson.Sheet1[i][6].toString();
                    }
                    if (excelJson.Sheet1[i][8] != undefined) {
                      TaxColumns.CodeOfFixedAssets = excelJson.Sheet1[
                        i
                      ][8].toString();
                    }
                    if (excelJson.Sheet1[i][9] != undefined) {
                      TaxColumns.Amount = excelJson.Sheet1[i][9].toString();
                    }
                    this.TaxReceiptList.push(TaxColumns);
                    excelTemp.d.push(TaxColumns);
                  }
                  this.TaxFileJson = excelTemp;
                  var addFile = this.addFileToFolder(
                    f,
                    fileName,
                    this.TaxLibrary
                  );
                  addFile
                    .done(fd => {
                      console.log(
                        "加载税票清单成功，请点击税票清单按钮进行再次校验!"
                      );
                      console.log(fd);
                      var getFile = this.getFileItem(
                        fd.d.ListItemAllFields.__deferred.uri
                      );
                      getFile
                        .done(fi => {
                          this.loading = false;
                          console.log(fi);
                          this.TaxFileId = fi.d.ID;
                          this.$message(
                            common.message(
                              "success",
                              "加载税票清单成功，请点击税票清单按钮进行再次校验!"
                            )
                          );
                        })
                        .catch(err => {
                          this.loading = false;
                          this.$message(
                            common.message("error", "获取文档库文档失败!")
                          );
                        });
                    })
                    .catch(err => {
                      this.loading = false;
                      this.$message(
                        common.message("error", "添加文档至文档库失败!")
                      );
                    });
                } else {
                  this.loading = false;
                  this.$message(
                    common.message(
                      "error",
                      "请使用对应正确的Excel模板,并刷新页面"
                    )
                  );
                }
              } else {
                console.log("Expense part");
                var excelTemp = { d1: [], d2: [] };
                if (
                  excelJson.Sheet1[1][0].indexOf("GPFTOUTVER") == 0 &&
                  excelJson.Sheet2[1][0].indexOf("GPFTINVER") == 0
                ) {
                  this.IsExpenseTemplate = true;
                  for (var i = 3; i <= 102; i++) {
                    var expense1 = {
                      Title: "", //费用名称
                      Number: "", //费用号码
                      CostCenterNumber: "", //成本中心号码
                      Money: "", //摊出/入金额
                      ProjectName: "", //项目名称
                      ProjectNumber: "", //项目号码
                      CostCenterName: "", //摊出成本中心签批人姓名
                      Abstract: "", //摘要
                      IsIn: false //是否摊入
                    };
                    var expense2 = {
                      Title: "", //费用名称
                      Number: "", //费用号码
                      CostCenterNumber: "", //成本中心号码
                      Money: "", //摊出/入金额
                      ProjectName: "", //项目名称
                      ProjectNumber: "", //项目号码
                      CostCenterName: "", //摊出成本中心签批人姓名
                      Abstract: "", //摘要
                      IsIn: true //是否摊入
                    };
                    //摊出部分
                    excelJson.Sheet1[i][0] == undefined
                      ? ""
                      : (expense1.Title = excelJson.Sheet1[i][1].toString());
                    excelJson.Sheet1[i][1] == undefined
                      ? ""
                      : (expense1.Number = excelJson.Sheet1[i][0].toString());
                    excelJson.Sheet1[i][2] == undefined
                      ? ""
                      : (expense1.CostCenterNumber = excelJson.Sheet1[
                          i
                        ][2].toString());
                    excelJson.Sheet1[i][3] == undefined
                      ? ""
                      : (expense1.Money = excelJson.Sheet1[i][3].toString());
                    excelJson.Sheet1[i][4] == undefined
                      ? ""
                      : (expense1.ProjectName = excelJson.Sheet1[
                          i
                        ][4].toString());
                    excelJson.Sheet1[i][5] == undefined
                      ? ""
                      : (expense1.ProjectNumber = excelJson.Sheet1[
                          i
                        ][5].toString());
                    excelJson.Sheet1[i][6] == undefined
                      ? ""
                      : (expense1.CostCenterName = excelJson.Sheet1[
                          i
                        ][6].toString());
                    excelJson.Sheet1[i][7] == undefined
                      ? ""
                      : (expense1.Abstract = excelJson.Sheet1[i][7].toString());
                    //摊入部分
                    excelJson.Sheet2[i][0] == undefined
                      ? ""
                      : (expense2.Title = excelJson.Sheet2[i][1].toString());
                    excelJson.Sheet2[i][1] == undefined
                      ? ""
                      : (expense2.Number = excelJson.Sheet2[i][0].toString());
                    excelJson.Sheet2[i][2] == undefined
                      ? ""
                      : (expense2.CostCenterNumber = excelJson.Sheet2[
                          i
                        ][2].toString());
                    excelJson.Sheet2[i][3] == undefined
                      ? ""
                      : (expense2.Money = excelJson.Sheet2[i][3].toString());
                    excelJson.Sheet2[i][4] == undefined
                      ? ""
                      : (expense2.ProjectName = excelJson.Sheet2[
                          i
                        ][4].toString());
                    excelJson.Sheet2[i][5] == undefined
                      ? ""
                      : (expense2.ProjectNumber = excelJson.Sheet2[
                          i
                        ][5].toString());
                    excelJson.Sheet2[i][6] == undefined
                      ? ""
                      : (expense2.CostCenterName = excelJson.Sheet2[
                          i
                        ][6].toString());
                    excelJson.Sheet2[i][7] == undefined
                      ? ""
                      : (expense2.Abstract = excelJson.Sheet2[i][7].toString());
                    if (expense1.Title != "") {
                      this.ExpenseAllocationList.push(expense1);
                      excelTemp.d1.push(expense1);
                    }
                    if (expense2.Title != "") {
                      this.ExpenseAllocationList.push(expense2);
                      excelTemp.d2.push(expense2);
                    }
                  }
                  this.ExpenseFileJson = excelTemp;
                  console.log("eeeeeeeeeeee");
                  console.log(this.ExpenseFileJson);
                  var addFile = this.addFileToFolder(
                    f,
                    fileName,
                    this.ExpenseLibrary
                  );
                  addFile
                    .done(fd => {
                      console.log(
                        "加载费用分摊清单成功，请点击费用分摊清单按钮进行再次校验!"
                      );
                      var getFile = this.getFileItem(
                        fd.d.ListItemAllFields.__deferred.uri
                      );
                      getFile
                        .done(fi => {
                          this.loading = false;
                          console.log(fi);
                          this.ExpenseFileId = fi.d.ID;
                          this.$message(
                            common.message(
                              "success",
                              "加载费用分摊清单成功，请点击费用分摊清单按钮进行再次校验!"
                            )
                          );
                        })
                        .catch(err => {
                          this.loading = false;
                          this.$message(
                            common.message("error", "获取文档库文档失败!")
                          );
                        });
                    })
                    .catch(err => {
                      this.loading = false;
                      this.$message(
                        common.message("error", "添加文档至文档库失败!")
                      );
                    });
                } else {
                  this.loading = false;
                  this.$message(
                    common.message(
                      "error",
                      "请使用对应正确的Excel模板,并刷新页面"
                    )
                  );
                }
              }
            } else {
              this.loading = false;
            }
          }
        })
        .catch(err => {
          this.loading = false;
          this.$message(common.message("error", "获取文件失败!"));
        });
    },
    getFileItem: function(fileURI) {
      return $.ajax({
        url: fileURI,
        type: "GET",
        headers: { accept: "application/json;odata=verbose" }
      });
    },
    addFileToFolder: function(arrayBuffer, fileName, listName) {
      var parm = {
        type: "post",
        action: "AddFile",
        baseUrl: this.hostUrl,
        list: listName,
        fileName: this.FileGUID + "_" + fileName,
        digest: this.requestDigest
      };
      var opt = common.queryOpt(parm);
      return common.service(opt);
    },
    fileLimit: function(files, fileList) {
      this.$message(
        common.message(
          "error",
          "最多只能加载一个文件，如若要更新加载文档，请刷新页面!"
        )
      );
    }, //超出文件数量回调函数
    uploadErr: function(err, file, fileList) {
      this.$message(common.message("error", "上传文档出错!"));
    }, //附件上传失败后回调函数
    clearContract() {
      if (!this.PublicPayment.IsContract) {
        this.PublicPayment.ContractNumber = ""; //合同号
        this.PublicPayment.Money = ""; //金额
        this.ContractList = []; //还原
        this.AccountPaid = ""; //已付款
        this.UnPaid = ""; //未付款
      }
    },
    clearNumber() {
      if (this.PublicPayment.ReimbursementType != "费用借款") {
        //改变时候如果不是费用借款的时候清空掉单据编号
        this.PublicPayment.LoanNumber = "";
      }
    },
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
            this.costCenterArr.push({
              CostCenter: element
            });
          });
          console.log("去重后");
          console.log(this.costCenterArr);
        }
      });
    },
    CalculateAmountInlowercase() {
      if (this.PublicPayment.InvoiceValue == "") {
        this.$message(common.message("error", "请填写发票金额!"));
      } else if (isNaN(this.PublicPayment.InvoiceValue)) {
        this.$message(common.message("error", "发票金额不合法!"));
      } else if (this.PublicPayment.Currency == "") {
        this.$message(common.message("error", "请选择币种!"));
      } else if (this.PublicPayment.ExchangeRate == "") {
        this.$message(common.message("error", "请输入汇率!"));
      } else if (isNaN(this.PublicPayment.ExchangeRate)) {
        this.$message(common.message("error", "汇率不合法!"));
      } else {
        //计算
        if (this.PublicPayment.Currency == "RMB") {
          this.PublicPayment.AmountInlowercase = this.PublicPayment.InvoiceValue;
        } else {
          this.PublicPayment.AmountInlowercase =
            parseFloat(this.PublicPayment.InvoiceValue) *
            parseFloat(this.PublicPayment.ExchangeRate);
        }
        this.convertMoney();
      }
    },
    getExpenseCategory() {
      //获取费用类别
      var parm = {
        action: "ListItems",
        type: "get",
        //list: this.expenseCategoryListName,
        list: this.costAccountListName,
        baseUrl: this.hostUrl,
        condition: "?$top=2000"
      };
      var option = common.queryOpt(parm);
      $.when($.ajax(option))
        .done(req => {
          var data = req.d.results;
          console.log("费用类别");
          console.log(data);
          // if (data.length > 0) {
          //   data.forEach(item => {
          //     that.expenseCategoryOptions.push({
          //       label: item.Title,
          //       value: item.Title
          //     });
          //   });
          // }
          var expCategory = [];
          if (data.length > 0) {
            data.forEach(item => {
              expCategory.push(item.ExpenseCategoryTitle);
            });
          }
          console.log("2222s");
          console.log(expCategory);
          var expCategoryUnique = expCategory.filter(function(
            element,
            index,
            array
          ) {
            return array.indexOf(element) === index;
          });
          console.log("2222aa");
          console.log(expCategoryUnique);
          expCategoryUnique.forEach(item => {
            this.expenseCategoryOptions.push({
              label: item,
              value: item
            });
          });
          console.log("去重费用类别");
          console.log(this.expenseCategoryOptions);
        })
        .catch(err => {
          this.loading = false;
          this.$message(common.message("error", "加载费用类别时候出错!"));
        });
    },
    getCostAccount() {
      var that = this;
      var parm = {
        action: "ListItems",
        type: "get",
        list: this.costAccountListName,
        baseUrl: this.hostUrl,
        condition: "?$top=2000"
      };
      var option = common.queryOpt(parm);
      $.when($.ajax(option))
        .done(function(req) {
          var data = req.d.results;
          if (data.length > 0) {
            data.forEach(item => {
              that.costAccountOptions.push({
                Type: item.ExpenseCategoryTitle,
                label: item.Title,
                value: item.Title
              });
            });
          }
        })
        .catch(err => {
          this.loading = false;
          this.$message(common.message("error", "加载费用科目时候出错!"));
        });
    },
    search(userLoginName) {
      var trustees = this.PublicPayment.Trustees;
      if (trustees != "" || trustees != null) {
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
                this.PublicPayment.CostCenter=data[0].CostCenter;
                this.costCenterChange()
                this.PublicPayment.BussinessScope = data[0].BusinessScope;
                this.PublicPayment.EmployeeCode = data[0].EmployeeCode;
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
    formVerification() {
      //主表校验
      var isSuccess = false;
      if (this.PublicPayment.ReimbursementType == "") {
        this.message = "请选择报销类型;";
      } else if (this.PublicPayment.SettlementType == "") {
        this.message = "请选择结算方式;";
      } else if (this.PublicPayment.CompanyCode == "") {
        this.message = "请选择公司代码";
      } else if (this.PublicPayment.InvoiceValue == "") {
        this.message = "请填写发票金额;";
      } else if (isNaN(this.PublicPayment.InvoiceValue)) {
        this.message = "发票金额不合法;";
      } else if (this.PublicPayment.Currency == "") {
        this.message = "请选择币种;";
      } else if (this.PublicPayment.ExchangeRate == "") {
        this.message = "请输入汇率;";
      } else if (isNaN(this.PublicPayment.ExchangeRate)) {
        this.message = "汇率不合法;";
      } else if (this.PublicPayment.AmountInlowercase == "") {
        this.message = "请输入小写金额;";
      } else if (isNaN(this.PublicPayment.AmountInlowercase)) {
        this.message = "小写金额不合法;";
      } else if (
        (this.PublicPayment.SettlementType == "汇款" ||
          this.PublicPayment.SettlementType == "支票") &&
        this.PublicPayment.CollectionUnit == ""
      ) {
        this.message = "请填写收款单位全称;";
      } else if (
        (this.PublicPayment.SettlementType == "汇款" ||
          this.PublicPayment.SettlementType == "支票") &&
        this.PublicPayment.OpeningBank == ""
      ) {
        this.message = "请填开户行;";
      } else if (this.PublicPayment.OpeningBank.length > 100) {
        this.message = "开户行不能大于100字符;";
      } else if (
        (this.PublicPayment.SettlementType == "汇款" ||
          this.PublicPayment.SettlementType == "支票") &&
        this.PublicPayment.City == ""
      ) {
        this.message = "请填写省市;";
      } else if (
        this.PublicPayment.City != "" &&
        this.PublicPayment.City.substr(-1) != "省" &&
        this.PublicPayment.City.substr(-1) != "市"
      ) {
        this.message = "省/直辖市必须已省或市结尾;";
      } else if (
        (this.PublicPayment.SettlementType == "汇款" ||
          this.PublicPayment.SettlementType == "支票") &&
        this.PublicPayment.County == ""
      ) {
        this.message = "请填写市/县;";
      } else if (
        (this.PublicPayment.SettlementType == "汇款" ||
          this.PublicPayment.SettlementType == "支票") &&
        this.PublicPayment.DetailsOfPayment == ""
      ) {
        this.message = "请填写汇款附言;";
      } else if (this.PublicPayment.DetailsOfPayment.length >= 300) {
        this.message = "汇款附言不得超过300字符";
      } else if (
        this.PublicPayment.IsContract &&
        this.PublicPayment.ContractNumber == ""
      ) {
        this.message = "请输入合同号;";
      } else if (
        this.PublicPayment.IsContract &&
        this.PublicPayment.Money == ""
      ) {
        this.message = "请输入金额;";
      } else if (
        this.PublicPayment.IsFreightInvoice &&
        !this.calculateMoney()
      ) {
        this.message = "税票清单和表单金额总和不一致;";
      } else if (
        this.ExpenseAllocationList.length > 0 &&
        !this.IsMoneyConsistent()
      ) {
        this.message = "摊入摊出金额不一致;";
      } else if (
        this.PublicPayment.CostAccount == "" ||
        this.PublicPayment.CostAccount == null
      ) {
        this.message = "费用科目不可为空;";
      } else {
        isSuccess = true;
      }
      return isSuccess;
    },
    itemVerification() {
      //附表校验
      var isSuccess = false;
      if (this.TaxReceipt.InvoiceNumber == "") {
        this.message = "请输入发票号码;";
      } else if (this.TaxReceipt.Currency == "") {
        this.message = "请输入币种";
      } else if (this.TaxReceipt.InvoiceValue == "") {
        this.message = "请输入发票金额;";
      } else if (isNaN(this.TaxReceipt.InvoiceValue)) {
        this.message = "发票金额不合法;";
      } else if (this.TaxReceipt.TaxRate == "") {
        this.message = "请输入税率;";
      } else if (isNaN(this.TaxReceipt.TaxRate)) {
        this.message = "税率不合法;";
      } else if (this.TaxReceipt.TaxCode == "") {
        this.message = "请输入税码;";
      } else {
        isSuccess = true;
      }
      return isSuccess;
    },
    item2Verification() {
      //校验费用分摊
      var isSuccess = false;
      if (this.ExpenseAllocation.CostCenterNumber == "") {
        this.message = "请填写成本中心号码";
      } else if (this.ExpenseAllocation.ProjectName == "") {
        this.message = "请填写项目名称";
      } else if (this.ExpenseAllocation.ProjectNumber == "") {
        this.message = "请填写项目号码";
      } else {
        isSuccess = true;
      }
      return isSuccess;
    },
    IsMoneyConsistent() {
      var _in = 0.0;
      var _out = 0.0;
      this.ExpenseAllocationList.forEach(element => {
        if (element.IsIn) {
          _in += Number(element.Money);
        } else {
          _out += Number(element.Money);
        }
      });
      return _in == _out;
    },
    convertMoney() {
      //转换金额change事件
      if (
        this.PublicPayment.AmountInlowercase != "" &&
        !isNaN(this.PublicPayment.AmountInlowercase)
      ) {
        var result = this.getAmountInWords(
          parseFloat(this.PublicPayment.AmountInlowercase)
        );
        this.PublicPayment.CapitalizationAmount = result;
      } else {
        this.PublicPayment.CapitalizationAmount = "";
      }
    },
    getAmountInWords(n) {
      //转换金额逻辑
      var fraction = ["角", "分"];
      var digit = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
      var unit = [["元", "万", "亿"], ["", "拾", "佰", "仟"]];
      var head = n < 0 ? "欠" : "";
      n = Math.abs(n);

      var s = "";

      for (var i = 0; i < fraction.length; i++) {
        s += (
          digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]
        ).replace(/零./, "");
      }
      s = s || "整";
      n = Math.floor(n);

      for (var i = 0; i < unit[0].length && n > 0; i++) {
        var p = "";
        for (var j = 0; j < unit[1].length && n > 0; j++) {
          p = digit[n % 10] + unit[1][j] + p;
          n = Math.floor(n / 10);
        }
        s = p.replace(/(零.)*零$/, "").replace(/^$/, "零") + unit[0][i] + s;
      }
      return (
        head +
        s
          .replace(/(零.)*零元/, "元")
          .replace(/(零.)+/g, "零")
          .replace(/^整$/, "零元整")
      );
    },
    calculateMoney() {
      //计算金额
      var itemAmount = 0.0;
      for (let index = 0; index < this.TaxReceiptList.length; index++) {
        itemAmount += parseFloat(this.TaxReceiptList[index].InvoiceValue);
      }
      var InvoiceValue = parseFloat(this.PublicPayment.InvoiceValue);
      return itemAmount == InvoiceValue;
    },
    onSaveOrSubmmit(type) {
      if (!this.formVerification()) {
        //校验不通过;
        this.$message(common.message("error", this.message));
      } else {
        this.loading = true;
        var getDigst = common.getRequestDigest(this.hostUrl);
        getDigst
          .done(data => {
            this.requestDigest =
              data.d.GetContextWebInformation.FormDigestValue;
            this.createPublicPayment(type);
          })
          .catch(error => {
            this.loading = false;
            this.$message(common.message("error", "获取Digest失败"));
          });
      }
    },
    createPublicPayment(type) {
      //创建主表数据
      var total = parseFloat(this.PublicPayment.InvoiceValue);
      var costcenter = this.PublicPayment.CostCenter;
      var applicantNumber = "";
      var currentTime = common.getCurrentDate_NoLine();
      if (this.PublicPayment.ReimbursementType == "费用借款") {
        var baseAppNumber = this.formatAppNumber(this.GPJBaseApplicantNumber);
        applicantNumber = this.GPJBaseFormat + currentTime + baseAppNumber;
      } else {
        var baseAppNumber = this.formatAppNumber(this.GPBBaseApplicantNumber);
        applicantNumber = this.GPBBaseFormat + currentTime + baseAppNumber;
      }
      var parm = {
        action: "ListItems",
        type: "get",
        list: this.approverList,
        baseUrl: this.hostUrl,
        condition:
          "?$filter=CostCenter eq  '" + costcenter + "' and Type eq 'GP'"
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
              ReimbursementType: this.PublicPayment.ReimbursementType,
              SettlementType: this.PublicPayment.SettlementType,
              CostCenter: this.PublicPayment.CostCenter,
              Currency: this.PublicPayment.Currency,
              InvoiceValue: this.PublicPayment.InvoiceValue,
              ExchangeRate: this.PublicPayment.ExchangeRate,
              CapitalizationAmount: this.PublicPayment.CapitalizationAmount,
              AmountInlowercase: this.PublicPayment.AmountInlowercase,
              LoanNumber: this.PublicPayment.LoanNumber,
              CollectionUnit: this.PublicPayment.CollectionUnit,
              OpeningBank: this.PublicPayment.OpeningBank,
              Account: this.PublicPayment.Account,
              City: this.PublicPayment.City,
              County: this.PublicPayment.County,
              DetailsOfPayment: this.PublicPayment.DetailsOfPayment,
              IsContract: this.PublicPayment.IsContract.toString(),
              ContractNumber: this.PublicPayment.ContractNumber,
              Money: this.PublicPayment.Money,
              ProjectName: this.PublicPayment.ProjectName,
              ProjectNumber: this.PublicPayment.ProjectNumber,
              ExpenseCategory: this.PublicPayment.ExpenseCategory,
              CostAccount: this.PublicPayment.CostAccount,
              // CodeOfFixedAssets: this.PublicPayment.CodeOfFixedAssets,
              ApplicationNumber: applicantNumber,
              ReceiptNumber: this.PublicPayment.ReceiptNumber,
              IsSettlement: this.PublicPayment.IsSettlement.toString(),
              IsFreightInvoice: this.PublicPayment.IsFreightInvoice.toString(),
              Remark: this.PublicPayment.Remark,
              SpecialApproverTitle: this.PublicPayment.SpecialApprover,
              Trustees: this.PublicPayment.Trustees,
              CompanyCode: this.PublicPayment.CompanyCode,
              IsExpenseAllocation: this.PublicPayment.IsExpenseAllocation.toString(),
              TrusteesEmail: this.LoginName.split("@")[0],
              EmployeeCode: this.PublicPayment.EmployeeCode,
              BussinessScope: this.PublicPayment.BussinessScope,
              TaxFileItemId: Number(this.TaxFileId),
              ExpenseFileId: Number(this.ExpenseFileId),
              TaxFileJsonString: JSON.stringify(this.TaxFileJson),
              ExpenseFileJsonString: JSON.stringify(this.ExpenseFileJson)
            };
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
              itemInfo.Status = "Submitted";
            }
            parm = {
              type: "post",
              action: "AddInList",
              baseUrl: this.hostUrl,
              list: this.mainListName,
              item: itemInfo,
              digest: this.requestDigest
            };
            option = common.queryOpt(parm);
            $.when($.ajax(option))
              .done(req => {
                this.$message(common.message("success", "对公付款添加成功!"));
                this.updateApplicantBaseNumber();
                this.loading = false;
                this.$router.push("/home");
              })
              .catch(err => {
                this.loading = false;
                this.$message(common.message("error", "对公付款添加失败!"));
              });
          }
        })
        .catch(err => {
          this.loading = false;
          this.$message(common.message("error", "创建数据失败"));
        });
    },
    indexMethod(index) {
      return index + 1;
    },
    speApprChange: function() {
      this.loading = true;
      this.SpecApproId = 0;
      this.checkIsSpecAppro = false;
      var speApproverName = this.PublicPayment.SpecialApprover;
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
              // data.forEach(d => {
              //   loginName = d.EmployeeID;
              // });
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
                  // alert(this.SpecApproId);
                  this.checkIsSpecAppro = true;
                  // alert(this.checkIsSpecAppro);
                  this.loading = false;
                })
                .catch(err => {
                  this.loading = false;
                  this.PublicPayment.SpecialApprover = "";
                  this.$message(
                    common.message(
                      "error",
                      "通过员工列表EmployeeID加载特殊审批用户出错!"
                    )
                  );
                });
            } else {
              this.loading = false;
              this.PublicPayment.SpecialApprover = "";
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
            this.purchaseRequestData.SpecialApprover = "";
            this.$message(common.message("error", "加载特殊审批用户出错!"));
          });
      } else {
        this.loading = false;
      }
    },
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
          this.PublicPayment.Trustees = c.d.Title;
          this.search(loginName);
        })
        .catch(err => {
          this.$message(common.message("error", "加载当前用户出错!"));
        });
    },
    getGPPRNumber() {
      var that = this;
      //获取申请单号
      var parm = {
        action: "ListItems",
        type: "get",
        list: this.GpPRListName,
        baseUrl: this.hostUrl,
        condition: "?$filter= Status eq 'Approved'"
      }; //Completed 已完成
      var option = common.queryOpt(parm);
      $.when($.ajax(option))
        .done(req => {
          var data = req.d.results;
          if (data.length > 0) {
            data.forEach(item => {
              that.ReceiptNumbers.push({
                label: item.ApplicationNumber,
                value: item.ApplicationNumber,
                contractNumber: item.ContractNumber,
                //最新修改逻辑统一大写
                ExpenseCategory: item.ExpenseCategory,
                CostAccount: item.CostAccount
                // CodeOfFixedAssets: item.CodeOfFixedAssets
              });
            });
          } else {
            this.$message(common.message("error", "没有可选的单据！"));
          }
        })
        .catch(err => {
          this.$message(common.message("error", "获取单号编号失败!"));
        });
    },
    isHaveContract() {
      //获取合同
      var that = this;
      that.ContractList = []; //还原
      this.ReceiptNumbers.forEach(item => {
        if (item.value == that.PublicPayment.ReceiptNumber) {
          var number = item.contractNumber;
          console.log(number);
          //没有合同号
          if (number == null || number == "") {
            that.PublicPayment.IsContract = false;
            that.PublicPayment.ContractNumber = "";
            that.PublicPayment.Money = "";
            that.AccountPaid = "";
            that.UnPaid = "";
          } else {
            that.PublicPayment.ContractNumber = number;
            that.PublicPayment.IsContract = true;
            that.changeMoney();
          }
          //有没有 合同号都要填充费用类别、科目、固定资产编码
          that.PublicPayment.ExpenseCategory = item.ExpenseCategory;
          that.PublicPayment.CostAccount = item.CostAccount;
          // that.PublicPayment.CodeOfFixedAssets = item.CodeOfFixedAssets;
        }
      });
    },
    //获取合同号
    getContractNumber() {
      var that = this;
      var parm = {
        action: "ListItems",
        type: "get",
        list: this.ContractListName,
        baseUrl: this.hostUrl,
        condition: ""
      };
      var option = common.queryOpt(parm);
      $.when($.ajax(option))
        .done(function(req) {
          var data = req.d.results;
          if (data.length > 0) {
            data.forEach(item => {
              that.ContractNumbers.push({
                label: item.Number,
                value: item.Number,
                money: item.Money
              });
            });
          }
        })
        .catch(err => {
          this.loading = false;
          this.$message(common.message("error", "加载合同列表时出错!"));
        });
    },
    changeMoney() {
      var that = this;
      that.ContractList = []; //还原
      that.AccountPaid = ""; //还原
      that.UnPaid = ""; //还原
      //获取合同列表
      var parm = {
        action: "ListItems",
        type: "get",
        list: this.ContractListName,
        baseUrl: this.hostUrl,
        condition:
          "?$filter=Number eq '" + this.PublicPayment.ContractNumber + "' "
      }; //Completed 已完成
      var option = common.queryOpt(parm);
      $.when($.ajax(option))
        .done(req => {
          var data = req.d.results;
          console.log("changeMoney");
          console.log(data);
          if (data.length > 0) {
            //这里肯定会找到合同的
            this.GetPublicPaymentHistory(data);
          }
        })
        .catch(err => {
          this.$message(common.message("error", "获取申请单号失败!"));
        });
    },
    GetPublicPaymentHistory(mainItem) {
      console.log("GetPublicPaymentHistory");
      console.log(mainItem);
      var that = this;
      that.PublicPayment.Money = mainItem[0].Money;
      var parm = {
        action: "ListItems",
        type: "get",
        list: this.mainListName,
        baseUrl: this.hostUrl,
        condition:
          "?$filter=ContractNumber eq '" +
          this.PublicPayment.ContractNumber +
          "' and Status eq 'Approved' "
      };
      var option = common.queryOpt(parm);
      console.log(option);
      $.when($.ajax(option))
        .done(req => {
          var data = req.d.results;
          if (data.length > 0) {
            var accountPaid = 0;
            data.forEach(item => {
              //push 合同列表
              that.ContractList.push({
                Name: mainItem[0].Name,
                Supplier: mainItem[0].Supplier,
                Contents: mainItem[0].Contents,
                LegalPerson: mainItem[0].LegalPerson,
                Currency: mainItem[0].Currency,
                Money: mainItem[0].Money,
                AccountPaid: item.InvoiceValue
              });
              //累加
              accountPaid += parseFloat(item.InvoiceValue);
            });
            //合计
            that.AccountPaid = accountPaid;
            that.UnPaid =
              parseFloat(mainItem[0].Money == "" ? 0 : mainItem[0].Money) -
              accountPaid;

            that.PublicPayment.IsContract = true;
          }
        })
        .catch(err => {
          this.$message(common.message("error", "获取申请单号失败!"));
        });
    }
  },
  mounted: function() {
    //onload
    this.loading = true;
    this.getApplicantNumber();
    //this.PublicPayment.ApplicationNumber = common.generateUUID();
    this.FileGUID = common.generateUUID();
    //this.requestDigest = common.getRequestDigest();
    this.loadExcelFileUrl();
    this.getCostCenter();
    this.getExpenseCategory();
    this.getCostAccount();
    this.getCurrentUser();
    this.getContractNumber();
    this.getGPPRNumber();
    this.loading = false;
  },
  components: {}
};
</script>

<style>
.duigong {
  min-height: 25px;
  line-height: 25px;
  text-align: center;

  color: gray;
  padding: 2px;
}
.duigong tr td {
  border: 1px solid #cfcfcf;
  padding: 5px;
}
.duigong tr:nth-child(15) {
  background-color: #409eff;
  font-weight: bold;
  color: white;
  border: 0px;
}
</style>
