<template>
  <div>
    <table class="duigongEdit" style="  border-collapse: collapse;">
      <tr>
        <td colspan="8">
          <span style="font-size:30px;color:#409eff;">对公付款</span>
          <div style="float:right">
            <el-button type="primary" @click="print">打印</el-button>
          </div>
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
            :disabled="showApprover==true"
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
            @change="clearNumber"
            :disabled="showApprover==true"
            v-model="PublicPayment.ReimbursementType"
            placeholder="请选择"
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
          <el-select
            :disabled="showApprover==true"
            v-model="PublicPayment.SettlementType"
            placeholder="请选择"
          >
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
          <el-select
            :disabled="showApprover==true"
            v-model="PublicPayment.CostCenter"
            placeholder="请选择"
            size="medium"
          >
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
            :disabled="showApprover==true"
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
            :disabled="showApprover==true"
            v-model="PublicPayment.InvoiceValue"
            placeholder="发票金额"
          ></el-input>
        </td>
        <td align="right">币种：</td>
        <td align="left">
          <el-select
            @change="CalculateAmountInlowercase"
            :disabled="showApprover==true"
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
            :disabled="showApprover==true"
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
          <el-input
            :disabled="showApprover==true?true:PublicPayment.ReimbursementType!='费用借款'"
            v-model="PublicPayment.LoanNumber"
            placeholder="借款单号"
          ></el-input>
        </td>
      </tr>
      <tr>
        <td colspan="8" align="center" style="color:#409eff">结算方式为“汇款”或“支票”时填写</td>
      </tr>
      <tr>
        <td align="right">收款单位名称：</td>
        <td colspan="7">
          <el-input
            :disabled="showApprover==true"
            v-model="PublicPayment.CollectionUnit"
            placeholder="收款单位名称"
          ></el-input>
        </td>
      </tr>
      <tr>
        <td rowspan="3" style="writing-mode:lr-tb">汇款、汇票时填写</td>
        <td align="right">开户行：</td>
        <td colspan="3">
          <el-input
            :disabled="showApprover==true"
            v-model="PublicPayment.OpeningBank"
            placeholder="开户行"
          ></el-input>
        </td>
        <td align="right">账号：</td>
        <td colspan="2">
          <el-input :disabled="showApprover==true" v-model="PublicPayment.Account" placeholder="账号"></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">省/直辖市：</td>
        <td colspan="3">
          <el-input :disabled="showApprover==true" v-model="PublicPayment.City" placeholder="省/直辖市"></el-input>
        </td>
        <td align="right">市/县：</td>
        <td colspan="2">
          <el-input :disabled="showApprover==true" v-model="PublicPayment.County" placeholder="市/县"></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">汇款附言：</td>
        <td colspan="6">
          <el-input
            :disabled="showApprover==true"
            v-model="PublicPayment.DetailsOfPayment"
            placeholder="省/直辖市"
          ></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">是否有合同：</td>
        <td colspan="7" align="left">
          <el-checkbox
            :disabled="showApprover==true"
            @change="clearContract"
            v-model="PublicPayment.IsContract"
          ></el-checkbox>
        </td>
      </tr>
      <tr>
        <td align="right">合同号：</td>
        <td colspan="2" align="left">
          <el-select
            :disabled="showApprover==true?true:PublicPayment.IsContract==false"
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
        <td style="width:170px">总金额</td>
        <td style="width:170px">已付款</td>
        <td style="width:170px">未付款</td>
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
          <el-input
            :disabled="showApprover==true"
            v-model="PublicPayment.ProjectName"
            placeholder="合同号"
          ></el-input>
        </td>
        <td align="right">项目编号：</td>
        <td colspan="3">
          <el-input
            :disabled="showApprover==true"
            v-model="PublicPayment.ProjectNumber"
            placeholder="项目编号"
          ></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">增值税/运费专用发票</td>
        <td align="left">
          <el-checkbox :disabled="showApprover==true" v-model="PublicPayment.IsFreightInvoice"></el-checkbox>
        </td>
        <td colspan="5" align="left">
          <el-button
            :disabled="!PublicPayment.IsFreightInvoice"
            type="primary"
            @click="dialogTableVisible = true"
          >税票清单</el-button>
          <el-button
            :disabled="showApprover==true?true:!PublicPayment.IsFreightInvoice"
            type="primary"
            @click="addTaxReceipt"
          >添加税票</el-button>
        </td>
      </tr>
      <tr>
        <td align="right">费用分摊</td>
        <td align="left">
          <el-checkbox :disabled="showApprover==true" v-model="PublicPayment.IsExpenseAllocation"></el-checkbox>
        </td>
        <td colspan="5" align="left">
          <el-button
            :disabled="!PublicPayment.IsExpenseAllocation"
            type="primary"
            @click="dialogTableVisible2 = true"
          >费用分摊清单</el-button>
          <el-button
            :disabled="showApprover==true?true:!PublicPayment.IsExpenseAllocation"
            type="primary"
            @click="dialogFormVisible2=true"
          >添加费用分摊</el-button>
        </td>
      </tr>
      <tr>
        <td align="right">备注：</td>
        <td colspan="7">
          <el-input :disabled="showApprover==true" v-model="PublicPayment.Remark" placeholder="备注"></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">费用类别：</td>
        <td align="left">
          <el-select
            :disabled="showApprover==true"
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
          <el-select
            :disabled="showApprover==true"
            v-model="PublicPayment.CostAccount"
            placeholder="请选择"
          >
            <template v-for="item in costAccountOptions">
              <el-option
                v-if="PublicPayment.ExpenseCategory==item.Type"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </template>
          </el-select>
        </td>
      </tr>

      <tr>
        <td align="right">固定资产编码：</td>
        <td colspan="7">
          <el-input
            :disabled="showApprover==true"
            v-model="PublicPayment.CodeOfFixedAssets"
            placeholder="固定资产编码"
          ></el-input>
        </td>
      </tr>
      <tr>
        <td align="right">特殊审批人：</td>
        <td colspan="7">
          <el-input
            :disabled="showApprover==true"
            v-model="PublicPayment.SpecialApprover"
            placeholder="特殊审批人"
            @change="speApprChange"
          ></el-input>
        </td>
      </tr>

      <tr>
        <td align="right">结算：</td>
        <td colspan="7" align="left">
          <el-checkbox :disabled="showFA==true" v-model="PublicPayment.IsSettlement"></el-checkbox>
        </td>
      </tr>
      <tr>
        <td colspan="8" align="right">
          <!-- <el-button type="primary" @click="onSaveOrSubmmit(buttonType.Submit)">提交</el-button>
          <el-button @click="onSaveOrSubmmit(buttonType.Save)" type="primary" plain>保存</el-button>-->
          <el-button
            type="primary"
            @click="onSaveOrSubmmit(buttonType.Submit)"
            v-show="showEditor"
          >提交</el-button>
          <el-button
            @click="onSaveOrSubmmit(buttonType.Save)"
            v-show="showEditor"
            type="primary"
            plain
          >保存</el-button>
          <el-button type="primary" @click="onApproval(buttonType.Approve)" v-show="showApprover">批准</el-button>
          <el-button
            @click="onApproval(buttonType.Reject)"
            v-show="showApprover"
            type="danger"
            plain
          >拒绝</el-button>
          <el-button @click="onEnd()" v-show="requestIsReject" type="danger" plain>终止</el-button>
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
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" @click="onEditItem(scope.$index)">编辑</el-button>
            <el-button size="mini" type="danger" @click="del(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!-- 新增税票 -->
    <el-dialog title="新增税票" :visible.sync="dialogFormVisible">
      <el-form :model="TaxReceipt">
        <el-form-item label="公司代码:" :label-width="formLabelWidth" prop>
          <el-input v-model="TaxReceipt.CompanyCode"></el-input>
        </el-form-item>
        <el-form-item label="发票号:" :label-width="formLabelWidth" prop>
          <el-input v-model="TaxReceipt.InvoiceNumber"></el-input>
        </el-form-item>
        <el-form-item label="币种:" :label-width="formLabelWidth" prop>
          <el-input v-model="TaxReceipt.Currency"></el-input>
        </el-form-item>
        <el-form-item label="供应商名称:" :label-width="formLabelWidth" prop>
          <el-input v-model="TaxReceipt.Supplier"></el-input>
        </el-form-item>
        <el-form-item label="发票金额:" :label-width="formLabelWidth" prop>
          <el-input v-model="TaxReceipt.InvoiceValue"></el-input>
        </el-form-item>
        <el-form-item label="税率:" :label-width="formLabelWidth" prop>
          <el-input v-model="TaxReceipt.TaxRate"></el-input>
        </el-form-item>
        <el-form-item label="税码:" :label-width="formLabelWidth" prop>
          <el-input v-model="TaxReceipt.TaxCode"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onCancel('item')">取 消</el-button>
        <el-button type="primary" @click="onAddItem()">确 定</el-button>
      </div>
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
          <td>操作</td>
        </tr>
        <template>
          <tr v-for="(subItems,index) in  ExpenseAllocationList">
            <template v-if="!ExpenseAllocationList[index].IsIn">
              <template v-for="(subItem,cindex) in subItems">
                <td v-if="cindex!='IsIn'">{{subItem}}</td>
              </template>
              <td>
                <el-button @click="onEditItem2(index)" size="small">编辑</el-button>
                <el-button @click="del2(index)" type="danger" size="small">删除</el-button>
              </td>
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
          <td>操作</td>
        </tr>
        <template>
          <tr v-for="(subItems,index) in  ExpenseAllocationList">
            <template v-if="ExpenseAllocationList[index].IsIn">
              <template v-for="(subItem,cindex) in subItems">
                <td v-if="cindex!='IsIn'">{{subItem}}</td>
              </template>
              <td>
                <el-button @click="onEditItem2(index)" size="small">编辑</el-button>
                <el-button @click="del2(index)" type="danger" size="small">删除</el-button>
              </td>
            </template>
          </tr>
        </template>
      </table>
    </el-dialog>

    <!-- 费用清单 -->
    <el-dialog title="新增费用清单" :visible.sync="dialogFormVisible2">
      <el-form :model="ExpenseAllocation">
        <el-form-item label="费用科目号:" :label-width="formLabelWidth" prop>
          <el-input v-model="ExpenseAllocation.Title"></el-input>
        </el-form-item>
        <el-form-item label="费用名称:" :label-width="formLabelWidth" prop>
          <el-input v-model="ExpenseAllocation.Number"></el-input>
        </el-form-item>
        <el-form-item label="成本中心编号:" :label-width="formLabelWidth" prop>
          <el-input v-model="ExpenseAllocation.CostCenterNumber"></el-input>
        </el-form-item>
        <el-form-item label="摊出金额:" :label-width="formLabelWidth" prop>
          <el-input v-model="ExpenseAllocation.Money"></el-input>
        </el-form-item>
        <el-form-item label="项目名称:" :label-width="formLabelWidth" prop>
          <el-input v-model="ExpenseAllocation.ProjectName"></el-input>
        </el-form-item>
        <el-form-item label="项目编号:" :label-width="formLabelWidth" prop>
          <el-input v-model="ExpenseAllocation.ProjectNumber"></el-input>
        </el-form-item>
        <el-form-item label="成本中心签批人姓名:" :label-width="formLabelWidth" prop>
          <el-input v-model="ExpenseAllocation.CostCenterName"></el-input>
        </el-form-item>
        <el-form-item label="摘要:" :label-width="formLabelWidth" prop>
          <el-input v-model="ExpenseAllocation.Abstract"></el-input>
        </el-form-item>
        <el-form-item label="是否是摊入:" :label-width="formLabelWidth" prop>
          <el-checkbox v-model="ExpenseAllocation.IsIn"></el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onCancel2('item')">取 消</el-button>
        <el-button type="primary" @click="onAddItem2()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 打印模板 -->
    <div style="display:none" id="print">
      <div style="margin-top:20px;" id="myPrintArea">
        <!--startprint1-->
        <table
          style=" min-height:25px; line-height: 25px;text-align: left;  border-collapse: collapse;  color: gray;  padding: 2px;"
        >
          <tr>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px; font-weight: bold;font-size: 20px; color: #405ca1; text-align: center;"
              colspan="4"
            >联想（北京）有限公司（0 0 0 1）</td>
          </tr>
          <tr>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px;font-weight: bold;font-size: 20px; color: #405ca1; text-align: center;"
              colspan="4"
            >GP Payment form</td>
          </tr>
          <tr>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px;background-color: #b2e6fc; font-weight: bold;"
            >SheetId:</td>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px;background-color: #b2e6fc; font-weight: bold;"
            >Applicant:</td>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px;background-color: #b2e6fc; font-weight: bold;"
            >Contact Phone:</td>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px;background-color: #b2e6fc; font-weight: bold;"
            >Submit time:</td>
          </tr>
          <tr>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px;"
            >{{this.PublicPayment.ApplicationNumber}}</td>
            <td style=" border: 1px solid #cfcfcf; padding: 5px;">{{this.PublicPayment.Trustees}}</td>
            <td style=" border: 1px solid #cfcfcf; padding: 5px;">62193</td>
            <td style=" border: 1px solid #cfcfcf; padding: 5px;">2018-11-09</td>
          </tr>
          <tr>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px;"
              colspan="2"
            >Company Name:联想（北京）有限公司（0 0 0 1）</td>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px;"
              colspan="2"
            >Expense Category:{{this.PublicPayment.ExpenseCategory}}</td>
          </tr>
          <tr>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px;"
              colspan="2"
            >Cost Center Group:{{this.PublicPayment.CostCenter}}</td>
            <td style=" border: 1px solid #cfcfcf; padding: 5px;" colspan="2">Finance Counter:</td>
          </tr>
          <tr>
            <td style=" border: 1px solid #cfcfcf; padding: 5px;" colspan="2">Cost Center:</td>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px;"
              colspan="2"
            >Payment:{{this.PublicPayment.SettlementType}}</td>
          </tr>
          <tr>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px;"
              colspan="2"
            >Amount:{{this.PublicPayment.AmountInlowercase}}</td>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px;"
              colspan="2"
            >Amount（In Words）:{{this.PublicPayment. CapitalizationAmount}}</td>
          </tr>
          <tr>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px;"
              colspan="2"
            >Currency:{{this.PublicPayment.Currency}}</td>
            <td style=" border: 1px solid #cfcfcf; padding: 5px;" colspan="2">Borrowing Form No:</td>
          </tr>
          <tr>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px;"
              colspan="2"
            >Name Of Receiver:{{this.PublicPayment.Currency}}</td>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px;"
              colspan="2"
            >Bank：{{this.PublicPayment.Bank}}</td>
          </tr>
          <tr>
            <td style=" border: 1px solid #cfcfcf; padding: 5px;" colspan="2">Account No.：</td>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px;"
              colspan="2"
            >Province/Municipality：{{this.PublicPayment.City}}</td>
          </tr>
          <tr>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px;"
              colspan="2"
            >City/County：{{this.PublicPayment.County}}</td>
            <td style=" border: 1px solid #cfcfcf; padding: 5px;" colspan="2">Remit Postscript：</td>
          </tr>
          <tr>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px;"
              colspan="2"
            >Project Name:{{this.PublicPayment.ProjectName}}</td>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px;"
              colspan="2"
            >Project No:{{this.PublicPayment.ProjectNumber}}</td>
          </tr>
          <tr>
            <td style=" border: 1px solid #cfcfcf; padding: 5px;" colspan="2">
              Contract No:
              <span style="color: aqua">{{this.PublicPayment.ContractNumber}}</span>
            </td>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px;"
              colspan="2"
            >Currency:{{this.PublicPayment.Currency}}</td>
          </tr>
          <tr>
            <td style=" border: 1px solid #cfcfcf; padding: 5px;" colspan="2">Service:</td>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px;"
              colspan="2"
            >Percentage of Finished and Paid Accepted Portion:{{ ((Number(this.AccountPaid)/Number(this.PublicPayment.money))*100).toFixed(2)}}%</td>
          </tr>
          <tr>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px;"
              colspan="2"
            >Total amount:{{this.PublicPayment.Money}}</td>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px;"
              colspan="2"
            >Percentage of Finished and Paid Amount:{{this.AccountPaid==""?0:this.AccountPaid}}</td>
          </tr>

          <tr>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px; font-weight: bold;  font-size: 14px;background-color: #cfcfcf;"
              colspan="4"
            >Approver/Approved Time:</td>
          </tr>
          <tr>
            <td
              style=" border: 1px solid #cfcfcf; padding: 5px;font-weight: bold;  font-size: 14px;background-color: #cfcfcf;"
              colspan="4"
            >Notes(Usage/Others) Time:{{this.PublicPayment.Remark}}</td>
          </tr>
        </table>
        <div>
          <p>
            谢寰-xiehuan1 Manager-Senior Manager
            <span style="color:red">（Hand Input）</span>
          </p>
          <p>
            谢寰-xiehuan1 Manager-Senior Manager
            <span style="color:red">（Hand Input）</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import $ from "jquery";
import common from "../js/common.js";
export default {
  data() {
    return {
      hostUrl: this.GLOBAL.URL, //已在Web Part中注册了此变量
      currentUserId: 0, //当前用户Id
      currentUserTitle: "", //当前用户名
      currentUserITCode: "", //邮箱@前的code
      mainListName: "PublicPayment", //对公付款
      subListName: "TaxReceipt", //税票清单
      mainListType: "SP.Data.PublicPaymentListItem", //税票清单列表类型，用于post请求
      SubInfoListType: "SP.Data.TaxReceiptListItem", //税票清单列表类型，用于post请求
      subListName2: "ExpenseAllocation",
      SubInfoListType2: "SP.Data.ExpenseAllocationListItem", //费用分摊列表类型，用于post请求
      GPPPTaskListType: "SP.Data.PaymentApproval_x0020_任务ListItem", //SP.Data.PurchaseApproval_x0020_任务ListItem  SP.Data.WorkflowTasksItem
      GpPPTaskListName: "PaymentApproval 任务",
      userListName: "EmployeeList", //员工详细信息列表名称
      GpPRListName: "PurchaseRequest",
      ContractListName: "ContractList", //合同列表pushtable
      ApprovalHistory: "", //审批历史
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
        Save: "save",
        Approve: "approve",
        Reject: "reject"
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
        CodeOfFixedAssets: "", //固定资产编码
        ApplicationNumber: "", //申请单号
        ReceiptNumber: "", //单据编号
        IsSettlement: "", //结算
        SpecialApprover: "", //特殊审批人
        IsExpenseAllocation: false, //是否有费用分摊
        CompanyCode: "" //公司代码
      },
      IsChangeTaxReceipt: false,
      IsChangeExpenseAllocation: false,
      TaxReceiptList: [], //税票清单
      TaxReceipt: {
        CompanyCode: "", //公司代码
        InvoiceNumber: "", //发票号
        Currency: "", //币种
        Supplier: "", //供应商
        InvoiceValue: "", //发票金额
        TaxRate: "", //税率
        TaxCode: "" //税码
      },
      ExpenseAllocationList: [], //费用分摊列表
      ExpenseAllocation: {
        Title: "", //费用名称
        Number: "", //费用号码
        CostCenterNumber: "", //成本中心号码
        Money: "", //摊出/入金额
        ProjectName: "", //项目名称
        ProjectNumber: "", //项目号码
        CostCenterName: "", //摊出成本中心签批人姓名
        Abstract: "", //摘要
        IsIn: false //是否摊入
      }, //费用分摊
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
      Currency: [
        //币种
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
      dialogTableVisible: false, //税票清单列表
      dialogTableVisible2: false, //费用分摊列表
      dialogFormVisible: false, //添加税票清单
      dialogFormVisible2: false, //添加费用分摊
      editIndex: -1, //是否编辑
      editIndex2: -1, //是否编辑费用分摊
      formLabelWidth: "150px", //添加税票清单中的宽度
      expenseCategoryOptions: [], //费用类别
      costAccountOptions: [], //费用科目
      message: "", //消息文本
      showEditor: true,
      showApprover: false,
      showFA: false,
      requestIsReject: false,
      currentStep: "",
      currentItemId: 0,
      taskId: 0
    };
  },
  methods: {
    clearContract() {
      if (!this.PublicPayment.IsContract) {
        this.PublicPayment.ContractNumber = ""; //合同号
        this.PublicPayment.Money = ""; //金额
        this.ContractList = []; //还原
        this.AccountPaid = ""; //已付款
        this.UnPaid = ""; //未付款
      }
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
        if (this.PublicPayment.Currency == "人民币") {
          this.PublicPayment.AmountInlowercase = this.PublicPayment.InvoiceValue;
        } else {
          this.PublicPayment.AmountInlowercase =
            parseFloat(this.PublicPayment.InvoiceValue) *
            parseFloat(this.PublicPayment.ExchangeRate);
        }
        this.convertMoney();
      }
    },
    print() {
      common.print("#myPrintArea");
    },
    onEnd: function() {
      var itemInfo = {
        __metadata: {
          type: this.mainListType
        },
        Status: "Dumped"
      };
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
          this.$message(common.message("success", "终止流程成功!"));
          this.$router.push("/home");
        })
        .catch(err => {
          this.$message(common.message("error", "终止流程失败!"));
          this.$router.push("/home");
        });
    },
    getExpenseCategory() {
      //获取费用类别
      var that = this;
      var parm = {
        action: "ListItems",
        type: "get",
        list: this.expenseCategoryListName,
        baseUrl: this.hostUrl,
        condition: ""
      };
      var option = common.queryOpt(parm);
      $.when($.ajax(option))
        .done(function(req) {
          var data = req.d.results;
          if (data.length > 0) {
            data.forEach(item => {
              that.expenseCategoryOptions.push({
                label: item.Title,
                value: item.Title
              });
            });
          }
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
        condition: ""
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
              data.forEach(d => {
                this.companyCodeArr.push({
                  CompanyCode: d.CompanyCode
                });
              });
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
        this.PublicPayment.LoanNumber == "" &&
        this.PublicPayment.ReimbursementType == "费用借款"
      ) {
        this.message = "请输入借款单号;";
      } else if (
        (this.PublicPayment.SettlementType == "4-汇款" ||
          this.PublicPayment.SettlementType == "3-支票") &&
        this.PublicPayment.CollectionUnit == ""
      ) {
        this.message = "请填写收款单位全称;";
      } else if (
        (this.PublicPayment.SettlementType == "4-汇款" ||
          this.PublicPayment.SettlementType == "3-支票") &&
        this.PublicPayment.OpeningBank == ""
      ) {
        this.message = "请填开户行;";
      } else if (this.PublicPayment.OpeningBank.length > 100) {
        this.message = "开户行不能大于100字符;";
      } else if (
        (this.PublicPayment.SettlementType == "4-汇款" ||
          this.PublicPayment.SettlementType == "3-支票") &&
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
        (this.PublicPayment.SettlementType == "4-汇款" ||
          this.PublicPayment.SettlementType == "3-支票") &&
        this.PublicPayment.County == ""
      ) {
        this.message = "请填写市/县;";
      } else if (
        (this.PublicPayment.SettlementType == "4-汇款" ||
          this.PublicPayment.SettlementType == "3-支票") &&
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
    addTaxReceipt() {
      //新增税票的按钮校验
      if (this.TaxReceiptList.length == 30) {
        this.$message({
          message: "已有30项税票数据",
          type: "error"
        });
      } else {
        this.dialogFormVisible = true;
      }
    },
    del(index) {
      this.TaxReceiptList.splice(index, 1);
      this.IsChangeTaxReceipt = true;
    },
    del2(index) {
      this.ExpenseAllocationList.splice(index, 1);
      this.IsChangeExpenseAllocation = true;
    },
    onEditItem(index) {
      this.TaxReceipt = this.TaxReceiptList[index];
      this.editIndex = index;
      this.dialogFormVisible = true;
    },
    onEditItem2(index) {
      this.ExpenseAllocation = this.ExpenseAllocationList[index];
      this.editIndex2 = index;
      this.dialogFormVisible2 = true;
    },
    onCancel: function() {
      this.editIndex = -1;
      this.TaxReceipt = {
        CompanyCode: "",
        InvoiceNumber: "",
        Currency: "",
        Supplier: "",
        InvoiceValue: "",
        TaxRate: "",
        TaxCode: ""
      };
      this.dialogFormVisible = false;
    },
    onCancel2: function() {
      this.editIndex2 = -1;
      this.ExpenseAllocation = {
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
      this.dialogFormVisible2 = false;
    },
    onAddItem() {
      if (!this.itemVerification()) {
        //校验不通过
        this.$message({
          message: this.message,
          type: "error"
        });
      } else {
        this.IsChangeTaxReceipt = true;
        if (this.editIndex != -1) {
          //编辑
          this.TaxReceiptList[this.editIndex] = this.TaxReceipt;
        } else {
          //新增
          this.TaxReceiptList.push(this.TaxReceipt);
        }
        this.TaxReceipt = {
          CompanyCode: "",
          InvoiceNumber: "",
          Currency: "",
          Supplier: "",
          InvoiceValue: "",
          TaxRate: "",
          TaxCode: ""
        };
        this.dialogFormVisible = false;
      }
    },
    onAddItem2() {
      if (false) {
        //校验不通过
        this.$message({
          message: this.message,
          type: "error"
        });
      } else {
        this.IsChangeExpenseAllocation = true;
        if (this.editIndex2 != -1) {
          //编辑
          this.ExpenseAllocationList[this.editIndex2] = this.ExpenseAllocation;
        } else {
          //新增
          this.ExpenseAllocationList.push(this.ExpenseAllocation);
        }
        console.log(this.ExpenseAllocation);
        this.ExpenseAllocation = {
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
        this.dialogFormVisible2 = false;
        console.log(this.ExpenseAllocationList);
      }
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
        this.$message({
          message: this.message,
          type: "error"
        });
      } else {
        this.loading = true;
        this.createPublicPayment(type);
      }
    },
    createPublicPayment(type) {
      //创建主表数据
      var total = parseFloat(this.PublicPayment.InvoiceValue);
      var costcenter = this.PublicPayment.CostCenter;
      var parm = {
        action: "ListItems",
        type: "get",
        list: this.approverList,
        baseUrl: this.hostUrl,
        condition:
          "?$filter=CostCenter eq  '" + costcenter + "' and Type eq 'GP'"
      };
      var option = common.queryOpt(parm);
      $.when($.ajax(option)).done(r => {
        if (r.d.results.length > 0) {
          var data1 = r.d.results[0];
          var itemInfo = {
            __metadata: {
              type: this.mainListType
            },
            Title: this.ApplicationNumber,
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
            CodeOfFixedAssets: this.PublicPayment.CodeOfFixedAssets,
            ApplicationNumber: this.PublicPayment.ApplicationNumber,
            ReceiptNumber: this.PublicPayment.ReceiptNumber,
            IsSettlement: this.PublicPayment.IsSettlement.toString(),
            IsFreightInvoice: this.PublicPayment.IsFreightInvoice.toString(),
            Remark: this.PublicPayment.Remark,
            SpecialApproverTitle: this.SpecialApprover,
            CompanyCode: this.PublicPayment.CompanyCode,
            IsExpenseAllocation: this.PublicPayment.IsExpenseAllocation.toString()
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
          option = common.queryOpt(parm);
          $.when($.ajax(option))
            .done(req => {
              if (this.PublicPayment.IsFreightInvoice) {
                console.log("调用新增税票清单");
                this.createTaxReceipt();
              }
              if (this.PublicPayment.IsExpenseAllocation) {
                this.createExpenseAllocation();
              }
              if (type == "submit") {
                if (this.currentStep == "Application" && this.taskId != 0) {
                  this.onApproval("approve");
                }
              }
              this.$message(common.message("success", "对公付款添加成功!"));
              this.loading = false;
              this.$router.push("/home");
            })
            .catch(err => {
              this.$message(common.message("error", "对公付款添加失败!"));
            });
        }
      });
    },
    createTaxReceipt() {
      if (this.IsChangeTaxReceipt) {
        var getDeleteItems = this.loadTaxReceiptData(
          this.PublicPayment.ApplicationNumber
        );
        getDeleteItems
          .done(req2 => {
            console.log(req2);
            var data = req2.d.results;
            if (data.length > 0) {
              data.forEach(d => {
                var parm = {
                  type: "delete",
                  action: "DeleteListItem",
                  baseUrl: this.hostUrl,
                  list: this.subListName,
                  digest: this.requestDigest,
                  itemID: d.Id
                };
                var options = common.queryOpt(parm);
                $.when($.ajax(options))
                  .done(req => {
                    // this.$message(common.message("success", "税票更新中!"));
                  })
                  .catch(err => {
                    this.$message(common.message("error", "税票清空时失败!"));
                  });
              });
            } else {
              // this.$message(
              //   common.message("error", "税票清单列表中不存在该申请单号")
              // );
            }
          })
          .catch(error => {
            this.$message(common.message("error", "加载税票清单失败"));
          });
      }
      //添加附表数据
      console.log(this.TaxReceiptList);
      this.TaxReceiptList.forEach(item => {
        console.log(item);
        var itemInfo = {
          __metadata: {
            type: this.SubInfoListType
          },
          Title: this.PublicPayment.ApplicationNumber,
          PublicPaymentGUID: this.PublicPayment.ApplicationNumber,
          CompanyCode: item.CompanyCode, //公司代码
          InvoiceNumber: item.InvoiceNumber, //发票号
          Currency: item.Currency, //币种
          Supplier: item.Supplier, //供应商
          InvoiceValue: item.InvoiceValue, //发票金额
          TaxRate: item.TaxRate, //税率
          TaxCode: item.TaxCode //税码
        };
        var parm = {
          type: "post",
          action: "AddInList",
          baseUrl: this.hostUrl,
          list: this.subListName,
          item: itemInfo,
          digest: this.requestDigest
        };
        var options = common.queryOpt(parm);
        $.when($.ajax(options))
          .done(req => {
            this.$message(common.message("success", "税票清单已添加成功!"));
          })
          .catch(err => {
            this.$message(common.message("error", "税票清单添加失败!"));
          });
      });
    },
    createExpenseAllocation() {
      if (this.IsChangeExpenseAllocation) {
        var getDeleteItems = this.loadExpenseAllocationData(
          this.PublicPayment.ApplicationNumber
        );
        getDeleteItems
          .done(req2 => {
            console.log(req2);
            var data = req2.d.results;
            if (data.length > 0) {
              data.forEach(d => {
                var parm = {
                  type: "delete",
                  action: "DeleteListItem",
                  baseUrl: this.hostUrl,
                  list: this.subListName2,
                  digest: this.requestDigest,
                  itemID: d.Id
                };
                var options = common.queryOpt(parm);
                $.when($.ajax(options))
                  .done(req => {
                    // this.$message(common.message("success", "税票更新中!"));
                  })
                  .catch(err => {
                    this.$message(
                      common.message("error", "费用清单清空时失败!")
                    );
                  });
              });
            } else {
              // this.$message(
              //   common.message("error", "税票清单列表中不存在该申请单号")
              // );
            }
          })
          .catch(error => {
            this.$message(common.message("error", "加载费用清单失败"));
          });
      }
      //添加附表数
      console.log(this.ExpenseAllocationList);
      this.ExpenseAllocationList.forEach(item => {
        console.log(item);
        var itemInfo = {
          __metadata: {
            type: this.SubInfoListType2
          },
          PublicPaymentGUID: this.PublicPayment.ApplicationNumber,
          Title: item.Title,
          Number: item.Number,
          CostCenterNumber: item.CostCenterNumber,
          Money: item.Money,
          ProjectName: item.ProjectName,
          ProjectNumber: item.ProjectNumber,
          CostCenterName: item.CostCenterName,
          Abstract: item.Abstract,
          IsIn: item.IsIn.toString()
        };
        var parm = {
          type: "post",
          action: "AddInList",
          baseUrl: this.hostUrl,
          list: this.subListName2,
          item: itemInfo,
          digest: this.requestDigest
        };
        var options = common.queryOpt(parm);
        $.when($.ajax(options))
          .done(req => {
            this.$message(common.message("success", "费用分摊已添加成功!"));
          })
          .catch(err => {
            this.$message(common.message("error", "费用分摊添加失败!"));
          });
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
          this.currentUserITCode = loginName.split("@")[0];
          this.currentUserTitle = c.d.Title;
          this.currentUserId = c.d.Id;
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
                contractNumber: item.ContractNumber
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
            console.log(that.AccountPaid);
            console.log(that.UnPaid);
          } else {
            that.PublicPayment.ContractNumber = number;
            that.changeMoney();
          }
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
          var contractNumberList = [];

          if (data.length > 0) {
            data.forEach(item => {
              contractNumberList.push({
                number: item.Number,
                money: item.Money
              });
            });
            console.log(contractNumberList);
            var obj = {};
            contractNumberList = contractNumberList.reduce(function(
              item,
              next
            ) {
              obj[next.number]
                ? ""
                : (obj[next.number] = true && item.push(next));
              return item;
            },
            []);
            console.log(contractNumberList);
            contractNumberList.forEach(item => {
              that.ContractNumbers.push({
                label: item.number,
                value: item.number,
                money: item.money
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
          if (data.length > 0) {
            var accountPaid = 0;
            data.forEach(item => {
              //push 合同列表
              that.ContractList.push({
                Name: item.Name,
                Supplier: item.Suppler,
                Contents: item.Contents,
                LegalPerson: item.LegalPerson,
                Money: item.Money,
                AccountPaid: item.AccountPaid,
                UnPaid: item.UnPaid
              });
              //累加
              accountPaid += parseFloat(item.AccountPaid);
            });
            //合计
            that.AccountPaid = accountPaid;
            that.UnPaid = parseFloat(that.ContractList[0].Money) - accountPaid;
            that.PublicPayment.Money = that.ContractList[0].Money;
            that.PublicPayment.IsContract = true;
            //that.PublicPayment.ContractNumber = number;
          }
        })
        .catch(err => {
          this.$message(common.message("error", "获取申请单号失败!"));
        });
    },
    onApproval: function(type) {
      this.loading = true;
      var taskOutcome;
      var mainItemInfo = {
        __metadata: {
          type: this.mainListType
        }
      };
      if (type == "approve") {
        taskOutcome = "已批准"; //Approved 已批准
      } else {
        taskOutcome = "已拒绝"; //已拒绝 Rejected
      }

      if (this.currentStep == "Approver5") {
        var history = JSON.parse(this.ApprovalHistory);
        history.approver5 =
          this.currentUserTitle +
          "-" +
          this.currentUserITCode +
          "," +
          this.getCurrentDate();
        mainItemInfo.ApproverHistory = JSON.stringify(history);
        if (this.PublicPayment.IsSettlement) {
          mainItemInfo.AuthorizedPersonId = this.currentUserId;
        }
        this.updateMainInfo(mainItemInfo, taskOutcome);
      } else {
        if (this.ApprovalHistory == null || this.ApprovalHistory == "") {
          var history = {};
          history.approver1 =
            this.currentUserTitle +
            "-" +
            this.currentUserITCode +
            "," +
            this.getCurrentDate();
          this.ApprovalHistory = JSON.stringify(history);
        } else {
          var history = JSON.parse(this.ApprovalHistory);
          if (this.currentStep == "Approver1") {
            history.approver1 =
              this.currentUserTitle +
              "-" +
              this.currentUserITCode +
              "," +
              this.getCurrentDate();
          } else if (this.currentStep == "Approver2") {
            history.approver2 =
              this.currentUserTitle +
              "-" +
              this.currentUserITCode +
              "," +
              this.getCurrentDate();
          } else if (this.currentStep == "Approver3") {
            history.approver3 =
              this.currentUserTitle +
              "-" +
              this.currentUserITCode +
              "," +
              this.getCurrentDate();
          } else if (this.currentStep == "Approver4") {
            history.approver4 =
              this.currentUserTitle +
              "-" +
              this.currentUserITCode +
              "," +
              this.getCurrentDate();
          } else if (this.currentStep == "Approver6") {
            history.approver6 =
              this.currentUserTitle +
              "-" +
              this.currentUserITCode +
              "," +
              this.getCurrentDate();
          }
          this.ApprovalHistory = JSON.stringify(history);
        }
        if (this.currentStep == "Approver6") {
          mainItemInfo.SettlementOfPeopleId = this.currentUserId;
        }
        mainItemInfo.SettlingTime = this.getCurrentDate;
        mainItemInfo.ApproverHistory = this.ApprovalHistory;
        this.updateMainInfo(mainItemInfo, taskOutcome);
      }
    },
    getCurrentDate: function() {
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var currentTime = year + "-" + month + "-" + day;
      return currentTime;
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
          type: this.GPPPTaskListType
        },
        TaskOutcome: taskOutcome,
        PercentComplete: 1,
        Status: "已完成" //Completed 已完成
      };
      var parm = {
        type: "post",
        action: "EditListItem",
        baseUrl: this.hostUrl,
        list: this.GpPPTaskListName,
        itemID: this.taskId,
        item: taskItemInfo,
        digest: this.requestDigest
      };
      var opt = common.queryOpt(parm);
      $.when($.ajax(opt))
        .done(req => {
          console.log(req);
          this.loading = false;
          this.$message(common.message("success", "审批成功!"));
          this.$router.push("/home");
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
          this.$message(common.message("error", "审批失败!"));
          this.$router.push("/home");
        });
    },
    loadMainListData: function(guid) {
      var parm = {
        type: "get",
        action: "ListItems",
        list: this.mainListName,
        baseUrl: this.hostUrl,
        condition: "?$filter=ApplicationNumber eq '" + guid + "'"
      };
      var opt = common.queryOpt(parm);
      return common.service(opt);
    },
    loadTaxReceiptData: function(guid) {
      var parm = {
        type: "get",
        action: "ListItems",
        list: this.subListName,
        baseUrl: this.hostUrl,
        condition: "?$filter=PublicPaymentGUID  eq '" + guid + "'"
      };
      var opt = common.queryOpt(parm);
      return common.service(opt);
    },
    loadExpenseAllocationData: function(guid) {
      var parm = {
        type: "get",
        action: "ListItems",
        list: this.subListName2,
        baseUrl: this.hostUrl,
        condition: "?$filter=PublicPaymentGUID  eq '" + guid + "'"
      };
      var opt = common.queryOpt(parm);
      return common.service(opt);
    }
  },
  mounted: function() {
    this.loading = true;
    //this.PublicPayment.ApplicationNumber = common.generateUUID();
    this.requestDigest = common.getRequestDigest();
    this.getCostCenter();
    this.getExpenseCategory();
    this.getCostAccount();
    this.getCurrentUser();
    this.getContractNumber();
    this.getGPPRNumber();
    var applicantNumber = common.GetParameterValues("ApplicantNumber");
    var step = common.GetParameterValues("Step");
    this.currentStep = step;
    var tId = common.GetParameterValues("TaskId");
    if (typeof Number(tId) == "number") {
      this.taskId = tId;
      if (tId > 0 && step != "Application") {
        this.showEditor = false;
        this.showApprover = true;
        if (step == "Approver5") {
          this.showFA = false;
        }
      } else if (tId == 0) {
        console.log("用户点击的是保存");
      } else if (tId > 0 && step == "Application") {
        console.log("该请求已被拒绝");
        this.requestIsReject = true;
        this.showEditor = true;
        this.showApprover = false;
      }
      var getMainListData = this.loadMainListData(applicantNumber);
      var getTaxReceiptData = this.loadTaxReceiptData(applicantNumber);
      var getExpenseAllocationData = this.loadExpenseAllocationData(
        applicantNumber
      );

      getMainListData
        .done(req => {
          var data = req.d.results;
          console.log("!1111111111");
          console.log(data);
          if (data.length > 0) {
            //获取主表
            (this.ApprovalHistory = data[0].ApproverHistory), //审批历史
              (this.PublicPayment.ReimbursementType =
                data[0].ReimbursementType), //报销类型
              (this.PublicPayment.SettlementType = data[0].SettlementType), //结算方式
              (this.PublicPayment.Trustees = data[0].Trustees), //经办人
              (this.PublicPayment.CostCenter = data[0].CostCenter), //成本中心
              (this.PublicPayment.Currency = data[0].Currency), //币种
              (this.PublicPayment.InvoiceValue = data[0].InvoiceValue), //发票金额
              (this.PublicPayment.ExchangeRate = data[0].ExchangeRate), //汇率
              (this.PublicPayment.AmountInlowercase =
                data[0].AmountInlowercase), //金额小写
              (this.PublicPayment.CapitalizationAmount =
                data[0].CapitalizationAmount), //金额大写
              (this.PublicPayment.LoanNumber =
                data[0].LoanNumber == null ? "" : data[0].LoanNumber), //借款单号
              (this.PublicPayment.CollectionUnit =
                data[0].CollectionUnit == null ? "" : data[0].CollectionUnit), //收款单位名称
              (this.PublicPayment.OpeningBank =
                data[0].OpeningBank == null ? "" : data[0].OpeningBank), //开户行
              (this.PublicPayment.Account =
                data[0].Account == null ? "" : data[0].Account), //账号
              (this.PublicPayment.City =
                data[0].City == null ? "" : data[0].City), //省市
              (this.PublicPayment.County =
                data[0].County == null ? "" : data[0].County), //市县
              (this.PublicPayment.DetailsOfPayment =
                data[0].DetailsOfPayment == null
                  ? ""
                  : data[0].DetailsOfPayment), //汇款附言
              (this.PublicPayment.IsContract =
                data[0].IsContract == "true" ? true : false), //是否有合同
              (this.PublicPayment.ContractNumber =
                data[0].ContractNumber == null ? "" : data[0].ContractNumber), //合同号
              (this.PublicPayment.Money =
                data[0].Money == null ? "" : data[0].Money), //金额
              (this.PublicPayment.ProjectName =
                data[0].ProjectName == null ? "" : data[0].ProjectName), //项目名称
              (this.PublicPayment.ProjectNumber =
                data[0].ProjectNumber == null ? "" : data[0].ProjectNumber), //项目编号
              (this.PublicPayment.IsFreightInvoice =
                data[0].IsFreightInvoice == "true" ? true : false), //运费发票
              (this.PublicPayment.Remark =
                data[0].Remark == null ? "" : data[0].Remark), //备注
              (this.PublicPayment.ExpenseCategory =
                data[0].ExpenseCategory == null ? "" : data[0].ExpenseCategory), //费用类别
              (this.PublicPayment.CostAccount =
                data[0].CostAccount == null ? "" : data[0].CostAccount), //费用科目
              (this.PublicPayment.CodeOfFixedAssets =
                data[0].CodeOfFixedAssets), //固定资产编码
              (this.PublicPayment.ApplicationNumber =
                data[0].ApplicationNumber), //申请单号
              (this.PublicPayment.ReceiptNumber = data[0].ReceiptNumber), //单据编号
              (this.PublicPayment.IsSettlement =
                data[0].IsSettlement == "true" ? true : false), //结算
              (this.PublicPayment.SpecialApprover = data[0].SpecialApprover); //特殊审批人
            this.PublicPayment.IsExpenseAllocation =
              data[0].IsExpenseAllocation == "true" ? true : false; //是否有费用分摊
            this.PublicPayment.CompanyCode = data[0].CompanyCode; //是否有费用分摊
            this.currentItemId = data[0].Id;
            console.log("!22222222222222");
            console.log(this.PublicPayment);
            this.changeMoney();
          } else {
            this.$message(
              common.message("error", "对公付款列表中不存在该申请单号")
            );
          }
        })
        .catch(err => {
          this.$message(common.message("error", "加载对公付款列表数据失败"));
        });

      getTaxReceiptData
        .done(req2 => {
          console.log(req2);
          var data = req2.d.results;
          if (data.length > 0) {
            data.forEach(d => {
              this.TaxReceiptList.push({
                CompanyCode: d.CompanyCode,
                InvoiceNumber: d.InvoiceNumber, //发票号
                Currency: d.Currency, //币种
                Supplier: d.Supplier, //供应商
                InvoiceValue: d.InvoiceValue, //发票金额
                TaxRate: d.TaxRate, //税率
                TaxCode: d.TaxCode //税码
              });
            });
          } else {
            // this.$message(
            //   common.message("error", "税票清单列表中不存在该申请单号")
            // );
          }
        })
        .catch(error => {
          this.$message(common.message("error", "加载税票清单失败"));
        });

      getExpenseAllocationData
        .done(req2 => {
          console.log(req2);
          var data = req2.d.results;
          if (data.length > 0) {
            data.forEach(d => {
              this.ExpenseAllocationList.push({
                Title: d.Title, //费用名称
                Number: d.Number, //费用号码
                CostCenterNumber: d.CostCenterNumber, //成本中心号码
                Money: d.Money, //摊出/入金额
                ProjectName: d.ProjectName, //项目名称
                ProjectNumber: d.ProjectNumber, //项目号码
                CostCenterName: d.CostCenterName, //摊出成本中心签批人姓名
                Abstract: d.Abstract, //摘要
                IsIn: d.IsIn == "true" ? true : false //是否摊入
              });
            });
          } else {
            // this.$message(
            //   common.message("error", "费用分摊列表中不存在该申请单号")
            // );
          }
        })
        .catch(error => {
          this.$message(common.message("error", "加载费用分摊失败"));
        });

      this.loading = false;
      this.convertMoney();
    } else {
      this.loading = false;
      common.message(common.message("error", "当前链接错误"));
    }

    this.loading = false;
  },
  components: {}
};
</script>

<style>
.duigongEdit {
  min-height: 25px;
  line-height: 25px;
  text-align: center;

  color: gray;
  padding: 2px;
}
.duigongEdit tr td {
  border: 1px solid #cfcfcf;
  padding: 5px;
}
.duigongEdit tr:nth-child(15) {
  background-color: #409eff;
  font-weight: bold;
  color: white;
  border: 0px;
}
</style>