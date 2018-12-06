<template>
  <div id="CreateECCTask" v-loading="loading">
    <div>
      <div :style="{display:display}">
        <el-progress :percentage="percentage"></el-progress>
      </div>
      <!--item -->
      <table class="top" style="  border-collapse: collapse;">
        <tr>
          <td colspan="10">
            <span style="font-size:30px;color:#409eff;">资产领用模板</span>
          </td>
        </tr>
        <tr>
          <td>申请人 ：</td>
          <td colspan="2">
            <el-input placeholder="请输入内容" v-model="ECCTaskForm.applicant" class="input-with-select">
              <el-button @click="search" slot="append" icon="el-icon-search"></el-button>
            </el-input>
          </td>
          <td>成本中心 ：</td>
          <td colspan="2">
            <el-select v-model="ECCTaskForm.costcenter" placeholder="请选择" size="medium">
              <el-option
                v-for="item in costCenterArr"
                :key="item.CostCenter"
                :label="item.CostCenter"
                :value="item.CostCenter"
              ></el-option>
            </el-select>
          </td>
          <td>公司代码 ：</td>
          <td colspan="3" align="left">
            <el-select v-model="ECCTaskForm.companycode" placeholder="请选择" size="medium">
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
          <td colspan="2">
            <el-input v-model="ECCTaskForm.applicantNumber" placeholder="申请单号" :disabled="true"></el-input>
          </td>
          <td>申请类别 ：</td>
          <td colspan="2">
            <el-select v-model="ECCTaskForm.applicantType" placeholder="请选择" size="medium">
              <el-option
                v-for="item in applicantTypeOpts"
                :key="item.Title"
                :label="item.Title"
                :value="item.Title"
              ></el-option>
            </el-select>
          </td>
          <td>产品类型 ：</td>
          <td colspan="3" align="left">
            <el-select v-model="ECCTaskForm.productType" placeholder="请选择" size="medium">
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
          <td colspan="9" style="text-align:left;">
            <el-input v-model="ECCTaskForm.consigneeDetail" placeholder="收件人及其地址"></el-input>
          </td>
        </tr>
        <tr>
          <td colspan="10" style="text-align:right;">
            <el-button type="primary" icon="el-icon-plus" @click="onAddRow">添加项目行</el-button>
          </td>
        </tr>
        <tr>
          <td>物料</td>
          <td width="200x">物料描述</td>
          <td>数量</td>
          <td>单价</td>
          <td>总金额</td>
          <td>是否选择</td>
          <td>申请类型</td>
          <td width="200px">固定资产编码</td>
          <td>费用条目</td>
          <td width="200px">操作</td>
        </tr>
        <tr v-for="(items,index) in subListData">
          <template v-for="(item,cindex) in items">
            <td v-if="cindex== 'sfxz'">
              <el-checkbox disabled v-model="subListData[index].sfxz"></el-checkbox>
            </td>
            <td v-else>{{item}}</td>
          </template>
          <td>
            <el-button @click="onEditItem(index)" size="small">编辑</el-button>
            <el-button @click="del(index)" type="danger" size="small">删除</el-button>
          </td>
        </tr>
        <tr>
          <td colspan="10" align="right">
            <el-button type="primary" @click="onSubmit()">保存</el-button>
          </td>
        </tr>
      </table>
      <!-- dialog -->
      <el-dialog title="新增物料" :visible.sync="dialogFormVisible" show-close="false">
        <el-form :model="item" :rules="rules" ref="item">
          <el-form-item label="物料：" :label-width="formLabelWidth" prop="wl">
            <el-input v-model="item.wl" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="物料描述：" :label-width="formLabelWidth" prop="ms">
            <el-input v-model="item.ms" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="数量：" :label-width="formLabelWidth" prop="sl">
            <el-input v-model="item.sl" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="单价：" :label-width="formLabelWidth" prop="dj">
            <el-input v-model="item.dj" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="总金额：" :label-width="formLabelWidth" prop="zje">
            <el-input v-model="item.zje" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="是否选择：" :label-width="formLabelWidth" prop="sfxz">
            <el-checkbox v-model="item.sfxz"></el-checkbox>
          </el-form-item>
          <el-form-item label="申请类型：" :label-width="formLabelWidth" prop="sqlx">
            <el-input v-model="item.sqlx" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="固定资产编码：" :label-width="formLabelWidth" prop="gdzc">
            <el-input v-model="item.gdzc" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="费用条目：" :label-width="formLabelWidth" prop="fytm">
            <el-input v-model="item.fytm" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="onCancel">取 消</el-button>
          <el-button type="primary" @click="onSubItemSave('item')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import * as $ from "jquery";
import common from "../js/common.js";
export default {
  data() {
    return {
      msg: "CreateECCTask",
      hostUrl: this.GLOBAL.URL, //已在Web Part中注册了此变量
      mainListName: "ECC", //ECC列表名
      mainListType: "SP.Data.ECCListItem", //ECC列表类型，用于post请求
      eccSubInfoListType: "SP.Data.ECCSubInfoListItem", //ECC物料列表类型，用于post请求
      subListName: "ECCSubInfo", //ECC物料信息列表名称
      userListName: "EmployeeList", //员工详细信息列表名称
      appliantTypeListName: "ApplicantType", //申请类型列表名称
      productTypeListName: "ProductType", //产品类型列表名
      userArr: [], //用户信息数据数组
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
        userId: ""
      }, //ECC主表
      subListData: [], // ECC物料副表
      rules: {
        wl: [{ required: true, message: "请输入物料名称", trigger: "blur" }],
        ms: [{ required: true, message: "请输入物料描述", trigger: "blur" }],
        sl: [{ required: true, message: "请输入数量", trigger: "blur" }],
        dj: [{ required: true, message: "请输入单价", trigger: "blur" }],
        zje: [{ required: true, message: "请输入总金额", trigger: "blur" }],
        sfxz: [{ required: true, message: "请输入是否选择", trigger: "blur" }],
        sqlx: [{ required: true, message: "请输入申请类型", trigger: "blur" }],
        fytm: [{ required: true, message: "请输入费用条目", trigger: "blur" }],
        gdzc: [
          { required: true, message: "请输入固定资产编码", trigger: "blur" }
        ]
      }, //添加列表时校验
      item: {
        wl: "", //物料
        ms: "", //描述
        sl: "", //数量
        dj: "", //单价
        zje: "", //总金额
        sfxz: false, //是否选择
        sqlx: "", //申请类型
        gdzc: "", //固定资产编码
        fytm: "" //费用条目
      }, //物料项目行数据
      itemFlag: {
        wl: "",
        ms: "",
        sl: "",
        dj: "",
        zje: "",
        sfxz: false,
        sqlx: "",
        gdzc: "",
        fytm: ""
      }, //初始化物料项目行数据
      applicantTypeOpts: [], //用来保存"AppliantType"列表的数据
      productTypeOpts: [], //用来保存"ProductType"列表的数据
      loading: true, //控制页面是否加载
      display: "none", //进度条
      percentage: 0, //进度条
      editIndex: -1, //是否编辑
      formLabelWidth: "150px" //dialog lable
    };
  },
  methods: {
    onSubmit: function() {
      this.loading = true;
      var baseUrl = this.hostUrl + "/_api/web";
      var queryUrl =
        baseUrl + "/lists/getbytitle('" + this.mainListName + "')/items";
      var item = {
        __metadata: {
          type: this.mainListType
        },
        Title: this.ECCTaskForm.applicantNumber,
        CostCenter: this.ECCTaskForm.costcenter,
        CompanyCode: this.ECCTaskForm.companycode,
        ConsigneeDetails: this.ECCTaskForm.consigneeDetail,
        ApplicationType: this.ECCTaskForm.applicantType,
        ProductType: this.ECCTaskForm.productType,
        Applicant: this.ECCTaskForm.applicant
      };
      var options = {
        url: queryUrl,
        method: "post",
        headers: {
          "Content-Type": "application/json;odata=verbose",
          "X-RequestDigest": this.requestDigest
        },
        data: JSON.stringify(item)
      };
      $.when($.ajax(options))
        .done(req => {
          this.createEccSubInfoItem(this.subListData);
          this.loading = false;
          this.$router.push("/home");
          alert("Submit Successfully!");
        })
        .catch(function(err) {
          alert(err);
        });
    }, //提交并在对应的列表创建对应的数据
    search: function() {
      this.loading = true;
      var userName = this.ECCTaskForm.applicant;
      if (userName != "" || userName != null) {
        var baseUrl =
          this.hostUrl +
          "/_api/web/lists/getbytitle('" +
          this.userListName +
          "')/items?";
        var queryUrl = baseUrl + "$filter=EmployeeName eq '" + userName + "'";
        var opt = {
          url: queryUrl,
          type: "Get",
          headers: {
            accept: "application/json;odata=verbose"
          },
          contentType: "application/json"
        };
        $.when($.ajax(opt))
          .done(req => {
            var data = req.d.results;
            if (data.length > 0) {
              data.forEach(d => {
                this.userArr.push({
                  EmployeeID: d.EmployeeID,
                  EmployeeName: d.EmployeeName
                });
                this.costCenterArr.push({
                  CostCenter: d.CostCenter,
                  CostCenterName: d.CostCenterName
                });
                this.companyCodeArr.push({
                  CompanyCode: d.CompanyCode
                });
              });
              if (this.costCenterArr.length > 0) {
                this.ECCTaskForm.costcenter = this.costCenterArr[0].CostCenter;
              }
              if (this.companyCodeArr.length > 0) {
                this.ECCTaskForm.companycode = this.companyCodeArr[0].CompanyCode;
              }
              this.loading = false;
              alert("Search Success!");
            } else {
              this.loading = false;
              alert(
                "This user is not exist in employee list, please contact the administrator."
              );
            }
          })
          .catch(err => {
            this.loading = false;
            alert(
              "This user is not exist in employee list, please contact the administrator."
            );
          });
      }
    }, //点击搜索用户按钮
    del(index) {
      this.subListData.splice(index, 1);
    }, //删除行
    onEditItem(index) {
      this.item = this.subListData[index];
      this.editIndex = index;
      this.dialogFormVisible = true;
    }, //编辑行
    onAddRow: function() {
      this.dialogFormVisible = true;
      this.item = this.itemFlag;
    },
    onSubItemSave(item) {
      this.$refs[item].validate(valid => {
        if (valid) {
          if (this.editIndex != -1) {
            //Edit item part
            this.subListData[this.editIndex] = this.item;
          } else {
            //Add item part
            this.subListData.push(this.item);
          }
          this.editIndex = -1;
          this.item = this.itemFlag;
          this.dialogFormVisible = false;
        } else {
          alert("Please check again you fill in data!");
          return false;
        }
      });
    }, //添加或编辑项目行
    onCancel: function() {
      this.editIndex = -1;
      this.item = this.itemFlag;
      this.dialogFormVisible = false;
    }, //点击取消按钮
    getAppTypeAndProType: function() {
      var that = this;
      var appUrl =
        this.hostUrl +
        "/_api/web/lists/getbytitle('" +
        this.appliantTypeListName +
        "')/items";
      var proUrl =
        this.hostUrl +
        "/_api/web/lists/getbytitle('" +
        this.productTypeListName +
        "')/items";
      var option1 = {
        url: appUrl,
        type: "Get",
        headers: {
          accept: "application/json;odata=verbose"
        },
        contentType: "application/json"
      };
      var option2 = {
        url: proUrl,
        type: "Get",
        headers: {
          accept: "application/json;odata=verbose"
        },
        contentType: "application/json"
      };
      $.when($.ajax(option1), $.ajax(option2))
        .done(function(req1, req2) {
          var data1 = req1[0].d.results;
          var data2 = req2[0].d.results;
          if (data1.length > 0) {
            data1.forEach(d1 => {
              that.applicantTypeOpts.push({
                Title: d1.Title
              });
            });
          }
          if (data2.length > 0) {
            data2.forEach(d2 => {
              that.productTypeOpts.push({
                Title: d2.Title
              });
            });
          }
        })
        .catch(err => {
          this.loading = false;
          alert(err);
        });
    }, //获取申请类型,获取产品类型
    createEccSubInfoItem: function(eccSubInfoArr) {
      var queryUrl =
        this.hostUrl +
        "/_api/web/lists/getbytitle('" +
        this.subListName +
        "')/items";
      eccSubInfoArr.forEach(d => {
        console.log(d);
        var item = {
          __metadata: {
            type: this.eccSubInfoListType
          },
          Title: this.ECCTaskForm.applicantNumber,
          Materiel: d.wl,
          MaterielDescription: d.ms,
          Amount: d.sl,
          Price: d.dj,
          Total: d.zje,
          IsSeleted: d.sfxz.toString(),
          RequestType: d.sqlx,
          FixedAssetsCode: d.gdzc,
          CostItems: d.fytm
        };
        var options = {
          url: queryUrl,
          method: "post",
          headers: {
            "Content-Type": "application/json;odata=verbose",
            "X-RequestDigest": this.requestDigest
          },
          data: JSON.stringify(item)
        };
        $.when($.ajax(options))
          .done(req => {
            console.log("Add Materiel successfully.");
          })
          .catch(err => {
            alert("Add Materiel Error, Please contact administractor check!");
          });
      });
    } //创建ECC物料数据至ECCSubInfo列表
  },
  mounted: function() {
    this.loading = true;
    this.requestDigest = common.getRequestDigest();
    this.ECCTaskForm.applicantNumber = common.generateUUID();
    this.getAppTypeAndProType();
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
}

.top tr:nth-child(6) {
  background-color: #409eff;
  font-weight: bold;
  color: white;
  border: 0px;
}
</style>

