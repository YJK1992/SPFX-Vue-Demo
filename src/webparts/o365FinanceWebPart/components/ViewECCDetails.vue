<template>
  <div id="viewEccDetail" v-loading="loading">
    <div>
      <!--item -->
      <table class="top" style="  border-collapse: collapse;">
        <tr>
          <td colspan="10">
            <span style="font-size:30px;color:#409eff;">资产领用</span>
          </td>
        </tr>
        <tr>
          <td>申请人 ：</td>
          <td colspan="3">
            <el-input v-model="ECCTaskForm.applicant" placeholder="申请人" :disabled="true"></el-input>
          </td>
          <td>成本中心 ：</td>
          <td colspan="2">
            <el-select
              v-model="ECCTaskForm.costcenter"
              placeholder="请选择"
              size="medium"
              :disabled="true"
            >
              <el-option
                v-for="item in costCenterArr"
                :key="item.CostCenter"
                :label="item.CostCenter"
                :value="item.CostCenter"
              ></el-option>
            </el-select>
          </td>
          <td>公司代码 ：</td>
          <td colspan="2">
            <el-select
              v-model="ECCTaskForm.companycode"
              placeholder="请选择"
              size="medium"
              :disabled="true"
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
          <td>申请单号 ：</td>
          <td colspan="3">
            <el-input v-model="ECCTaskForm.applicantNumber" placeholder="申请单号" :disabled="true"></el-input>
          </td>
          <td>申请类别 ：</td>
          <td colspan="2">
            <el-select
              v-model="ECCTaskForm.applicantType"
              placeholder="请选择"
              size="medium"
              :disabled="true"
            >
              <el-option
                v-for="item in applicantTypeOpts"
                :key="item.Title"
                :label="item.Title"
                :value="item.Title"
              ></el-option>
            </el-select>
          </td>
          <td>产品类型 ：</td>
          <td colspan="2">
            <el-select
              v-model="ECCTaskForm.productType"
              placeholder="请选择"
              size="medium"
              :disabled="true"
            >
              <el-option
                v-for="item in productTypeOpts"
                :key="item.Title"
                :label="item.Title"
                :value="item.Title"
              ></el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td>收件人及地址 ：</td>
          <td colspan="6" style="text-align:left;">
            <el-input v-model="ECCTaskForm.consigneeDetail" placeholder="收件人及其地址" :disabled="true"></el-input>
          </td>
          <td>特殊审批人 ：</td>
          <td colspan="3">
            <el-input v-model="ECCTaskForm.specialApprover" placeholder="请输入内容" :disabled="true"></el-input>
          </td>
        </tr>
        <tr>
          <td>附件 ：</td>
          <td colspan="8" style="text-align:left;">
            <a :href="attrFileInfo.url" target="_blank">{{this.attrFileInfo.name}}</a>
          </td>
        </tr>
        <tr>
          <td>附件描述 ：</td>
          <td colspan="9" style="text-align:left;">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="当选择MD model时，请输入Quote1 Number"
              v-model="ECCTaskForm.AttDescription"
              :disabled="true"
            ></el-input>
          </td>
        </tr>
        <tr id="viewEcc_table_heard">
          <td>物料</td>
          <td>物料描述</td>
          <td>数量</td>
          <td>单价</td>
          <td>总金额</td>
          <td>申请类型</td>
          <td>固定资产编码</td>
          <td>费用条目</td>
        </tr>
        <tr v-for="(subItems,index) in subListData">
          <template v-for="(subItem,cindex) in subItems">
            <td>{{subItem}}</td>
          </template>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import common from "../js/common.js";
export default {
  data() {
    return {
      msg: "CreateECCTask",
      buttonType: {
        Submit: "submit",
        Save: "save"
      }, //按钮操作类型
      hostUrl: this.GLOBAL.URL, //已在Web Part中注册了此变量
      mainListName: "ECC", //ECC列表名
      mainListType: "SP.Data.ECCListItem", //ECC列表类型，用于post请求
      applicantNumberListName: "ApplicantNumber", //申请单号管理列表
      applicantNumberListType: "SP.Data.ApplicantNumberListItem", //申请单号管理列表类型，用于post请求
      eccSubInfoListType: "SP.Data.ECCSubInfoListItem", //ECC物料列表类型，用于post请求
      subListName: "ECCSubInfo", //ECC物料信息列表名称
      userListName: "EmployeeList", //员工详细信息列表名称
      appliantTypeListName: "ApplicantType", //申请类型列表名称
      productTypeListName: "ProductType", //产品类型列表名
      fixedAssetsInfoListName: "FixedAssetsInfo", //固定资产物料列表名
      approverList: "ApproveNode", //审批节点列表名
      costCenterArr: [], //成本中心数组
      companyCodeArr: [], //公司代码数组
      dialogFormVisible: false, //控制是否出现dialog
      requestDigest: "", //post请求需要此参数
      ECCTaskForm: {
        applicant: "",
        costcenter: "",
        companycode: "",
        applicantNumber: "",
        applicantType: "",
        productType: "",
        consigneeDetail: "",
        specialApprover: "",
        total: 0,
        userId: "",
        AttDescription: ""
      }, //ECC主表
      subListData: [], // ECC物料副表
      fileList: [], //附件列表数据
      fileToArr: [], //附件转换成文件流，然后保存文件属性至数组里
      actionUrl: "https://lenovonetapp.sharepoint.cn/", //绑定上传附件按钮的action
      item: {
        wl: "", //物料
        ms: "", //描述
        sl: "", //数量
        dj: "", //单价
        zje: "", //总金额
        sqlx: "", //申请类型
        gdzc: "", //固定资产
        fytm: "" //费用条目
      }, //物料项目行数据
      choiceOptions: [
        {
          value: "是",
          label: "是"
        },
        {
          value: "否",
          label: "否"
        }
      ], //ECC物料列表是否选择字段
      subApplicationTypeOpt: [
        {
          value: "固定资产",
          label: "固定资产"
        },
        {
          value: "费用",
          label: "费用"
        }
      ], //申请类型选项
      applicantTypeOpts: [], //用来保存"AppliantType"列表的数据
      productTypeOpts: [], //用来保存"ProductType"列表的数据
      materielOpt: [], //用来保存"FixedAssetsInfo"列表materiel字段的数据
      loading: true, //控制页面是否加载
      display: "none", //进度条
      percentage: 0, //进度条
      editIndex: -1, //是否编辑
      checkIsSpecAppro: false, //判断是否是特殊审批人
      SpecApproId: 0, //特殊审批人ID
      formLabelWidth: "150px", //dialog lable
      baseApplicantNumber: 0, //ECC流水号，由申请单号列表获取
      ECCBaseFormat: "FAA", //ECC申请号前缀规则
      appliantNumberItemId: 0, //ECC申请单号在申请单号列表中item的ID
      attrFileInfo: {
        name: "",
        url: ""
      }
    };
  },
  methods: {
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
    loadSubListData: function(guid) {
      var parm = {
        type: "get",
        action: "ListItems",
        list: this.subListName,
        baseUrl: this.hostUrl,
        condition: "?$filter=Title eq '" + guid + "'"
      };
      var opt = common.queryOpt(parm);
      return common.service(opt);
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
    this.loading = true;
    var applicantNumber = common.GetParameterValues("ApplicantNumber");
    var getMainListData = this.loadMainListData(applicantNumber);
    var getSubListData = this.loadSubListData(applicantNumber);
    getMainListData
      .done(req => {
        var data = req.d.results;
        console.log(data);
        if (data.length > 0) {
          this.ECCTaskForm.applicant = data[0].Applicant;
          this.ECCTaskForm.costcenter = data[0].CostCenter;
          this.ECCTaskForm.companycode = data[0].CompanyCode;
          this.ECCTaskForm.applicantNumber = applicantNumber;
          this.ECCTaskForm.applicantType = data[0].ApplicationType;
          this.ECCTaskForm.productType = data[0].ProductType;
          this.ECCTaskForm.consigneeDetail = data[0].ConsigneeDetails;
          this.ECCTaskForm.specialApprover = data[0].SpecialApproverTitle;
          this.ECCTaskForm.AttDescription = data[0].AttDescription;
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
                }
              })
              .catch(errf => {
                console.log("获取附件失败");
              });
          }
        }
      })
      .catch(err => {
        this.$message(common.message("error", "加载ECC主表数据失败"));
      });
    getSubListData
      .done(req2 => {
        console.log(req2);
        var data = req2.d.results;
        if (data.length > 0) {
          data.forEach(d => {
            this.subListData.push({
              wl: d.Materiel,
              ms: d.MaterielDescription,
              sl: d.Amount,
              dj: d.Price,
              zje: d.Total,
              sqlx: d.RequestType,
              gdzc: d.FixedAssetsCode,
              fytm: d.CostItems
            });
          });
        }
      })
      .catch(error => {
        this.$message(common.message("error", "加载ECC物料失败"));
      });
    this.loading = false;
  }
};
</script>

<style>
.top {
  min-height: 25px;
  line-height: 25px;
  text-align: center;
  border-collapse: collapse;
  color: gray;
  padding: 2px;
}
.top tr td {
  border: 1px solid #cfcfcf;
  padding: 5px;
  width: 145px;
}
#viewEcc_table_heard td {
  background-color: #409eff;
  font-weight: bold;
  color: white;
  border: 0px;
}
</style>

