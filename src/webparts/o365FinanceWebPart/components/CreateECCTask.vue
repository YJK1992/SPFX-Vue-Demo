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
              @change="costCenterChange"
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
          <td colspan="3">
            <el-input v-model="ECCTaskForm.applicantNumber" placeholder="申请单号" :disabled="true"></el-input>
          </td>
          <td>申请类别 ：</td>
          <td colspan="2">
            <el-select
              v-model="ECCTaskForm.applicantType"
              placeholder="请选择"
              size="medium"
              @change="applicantTypeChange"
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
          <td colspan="6" style="text-align:left;">
            <el-input v-model="ECCTaskForm.consigneeDetail" placeholder="收件人及其地址"></el-input>
          </td>
          <td>特殊审批人 ：</td>
          <td colspan="3">
            <el-input
              v-model="ECCTaskForm.specialApprover"
              placeholder="请输入内容"
              @change="speApprChange"
            ></el-input>
          </td>
        </tr>
        <tr>
          <td colspan="10" align="left">
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
          <td>附件描述 ：</td>
          <td colspan="9" style="text-align:left;">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
              v-model="ECCTaskForm.AttDescription"
            ></el-input>
          </td>
        </tr>
        <tr>
          <td colspan="10" style="text-align:right;">
            <el-button type="primary" icon="el-icon-plus" @click="onAddRow">添加项目行</el-button>
          </td>
        </tr>
        <tr id="table_heard">
          <td>物料</td>
          <td>物料描述</td>
          <td>数量</td>
          <td>单价</td>
          <td>总金额</td>
          <td>申请类型</td>
          <td>固定资产编码</td>
          <td>费用条目</td>
          <td>操作</td>
        </tr>
        <tr v-for="(subItems,index) in subListData">
          <template v-for="(subItem,cindex) in subItems">
            <td>{{subItem}}</td>
          </template>
          <td style="width: 220px;">
            <el-button @click="onEditItem(index)" size="small">编辑</el-button>
            <el-button @click="del(index)" type="danger" size="small">删除</el-button>
          </td>
        </tr>
        <tr>
          <td colspan="10" align="right">
            <el-button type="primary" @click="onSaveOrSubmmit(buttonType.Submit)">提交</el-button>
            <el-button @click="onSaveOrSubmmit(buttonType.Save)" type="primary" plain>保存</el-button>
          </td>
        </tr>
      </table>
      <!-- dialog -->
      <el-dialog title="新增物料" :visible.sync="dialogFormVisible">
        <el-form :model="item">
          <el-form-item label="物料：" :label-width="formLabelWidth" prop="wl">
            <el-select v-model="item.wl" placeholder="请选择" @change="wlChange">
              <el-option
                v-for="i in materielOpt"
                :key="i.Materiel"
                :label="i.Materiel"
                :value="i.Materiel"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="物料描述：" :label-width="formLabelWidth" prop="ms">
            <el-input v-model="item.ms" autocomplete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="数量：" :label-width="formLabelWidth" prop="sl">
            <el-input-number v-model="item.sl" @change="slChange" size="medium" :min="1" label="数量"></el-input-number>
          </el-form-item>
          <el-form-item label="单价：" :label-width="formLabelWidth" prop="dj">
            <el-input v-model="item.dj" autocomplete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="总金额：" :label-width="formLabelWidth" prop="zje">
            <el-input v-model="item.zje" autocomplete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="申请类型：" :label-width="formLabelWidth" prop="sqlx">
            <el-select v-model="item.sqlx" placeholder="请选择">
              <el-option
                v-for="item in subApplicationTypeOpt"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="费用条目："
            :label-width="formLabelWidth"
            prop="fytm"
            v-show="item.sqlx=='费用'"
          >
            <el-input v-model="item.fytm" placeholder="请输入费用条目"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="onCancel('item')">取 消</el-button>
          <el-button type="primary" @click="onSubItemSave('item')">确 定</el-button>
        </div>
      </el-dialog>
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
      },
      hostUrl: this.GLOBAL.URL, //已在Web Part中注册了此变量
      mainListName: "ECC", //ECC列表名
      mainListType: "SP.Data.ECCListItem", //ECC列表类型，用于post请求
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
      formLabelWidth: "150px" //dialog lable
    };
  },
  methods: {
    applicantTypeChange: function() {
      this.productTypeOpts = [];
      this.ECCTaskForm.productType=""
      this.loading = true;
      var applicantType = this.ECCTaskForm.applicantType;
      var parm = {
        action: "ListItems",
        type: "get",
        list: this.productTypeListName,
        baseUrl: this.hostUrl,
        condition: "?$filter=ApplicantType eq '" + applicantType + "'"
      };
      var opt = common.queryOpt(parm);
      $.when($.ajax(opt))
        .done(req => {
          var data = req.d.results;
          if (data.length > 0) {
            data.forEach(d2 => {
              this.productTypeOpts.push({
                Title: d2.Title
              });
            });
            this.loading = false;
          } else {
            this.loading = false;
            this.$message(common.message("error", "未能找到对应的产品类型!"));
          }
        })
        .catch(err => {
          this.loading = false;
          this.$message(common.message("error", "获取产品类型失败!"));
        });
    },
    costCenterChange: function() {
      this.loading = true;
      var costCenter = this.ECCTaskForm.costcenter;
      var parm = {
        action: "ListItems",
        type: "get",
        list: this.approverList,
        baseUrl: this.hostUrl,
        condition:
          "?$filter=CostCenter eq  '" + costCenter + "' and Type eq 'FA'"
      };
      var opt = common.queryOpt(parm);
      $.when($.ajax(opt))
        .done(req => {
          this.loading = false;
          if (req.d.results.length == 0) {
            this.$message(
              common.message("error", "未找到对应成本中心的审批节点!")
            );
          }
        })
        .catch(err => {
          this.loading = false;
          this.$message(common.message("error", "校验成本中心出错!"));
        });
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
    onSaveOrSubmmit: function(type) {
      var validate = this.mainFormVerification();
      if (validate) {
        this.loading = true;
        this.subListData.forEach(e => {
          this.ECCTaskForm.total = this.ECCTaskForm.total + Number(e.zje);
        }); //循环子表数据获取总金额
        var total = this.ECCTaskForm.total;
        var costcenter = this.ECCTaskForm.costcenter;
        var parm = {
          action: "ListItems",
          type: "get",
          list: this.approverList,
          baseUrl: this.hostUrl,
          condition:
            "?$filter=CostCenter eq  '" + costcenter + "' and Type eq 'FA'"
        };
        var option = common.queryOpt(parm); //获取审批节点请求
        $.when($.ajax(option))
          .done(r => {
            if (r.d.results.length > 0) {
              var data1 = r.d.results[0];
              var itemInfo = {
                __metadata: {
                  type: this.mainListType
                },
                Title: this.ECCTaskForm.applicantNumber,
                CostCenter: this.ECCTaskForm.costcenter,
                CompanyCode: this.ECCTaskForm.companycode,
                ConsigneeDetails: this.ECCTaskForm.consigneeDetail,
                ApplicationType: this.ECCTaskForm.applicantType,
                ProductType: this.ECCTaskForm.productType,
                Applicant: this.ECCTaskForm.applicant,
                Total: this.ECCTaskForm.total,
                AttDescription: this.ECCTaskForm.AttDescription,
                SpecialApproverTitle: this.ECCTaskForm.specialApprover
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
              var parm = {
                type: "post",
                action: "AddInList",
                baseUrl: this.hostUrl,
                list: this.mainListName,
                item: itemInfo,
                digest: this.requestDigest
              };
              var options = common.queryOpt(parm); //在ECC列表中创建item
              $.when($.ajax(options))
                .done(req => {
                  var attUrl = req.d.AttachmentFiles.__deferred.uri;
                  this.uploadAttFileToItem(attUrl);
                  this.$message({
                    showClose: true,
                    message:
                      "固定资产申请提交成功!" +
                      this.ECCTaskForm.applicantNumber,
                    type: "success",
                    duration: 0
                  });
                  this.createEccSubInfoItem(this.subListData); //创建子表数据
                  this.loading = false;
                  this.$router.push("/home");
                })
                .catch(err => {
                  this.loading = false;
                  this.$message(
                    common.message("error", "提交固资数据时出现了错误!")
                  );
                });
            } else {
              this.loading = false;
              this.$message(
                common.message("error", "未找到对应成本中心的审批节点!")
              );
            }
          })
          .catch(err => {
            this.loading = false;
            this.$message(common.message("error", "获取审批人出错!"));
          });
      }
    }, //提交并在对应的列表创建对应的数据
    search: function(userLoginName) {
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
            var selectedCostCenter = "";
            data.forEach(d => {
              selectedCostCenter = d.CostCenter;
              this.companyCodeArr.push({
                CompanyCode: d.CompanyCode
              });
            });
            this.ECCTaskForm.costcenter = selectedCostCenter;
          } else {
            this.$message(
              common.message(
                "error",
                "当前用户不在员工信息列表中,请及时与管理员联系!"
              )
            );
          }
        })
        .catch(err => {
          this.loading = false;
          this.$message(common.message("error", "检查当前用户出现错误!"));
        });
    }, //验证用户是否存在于员工表中
    del(index) {
      this.subListData.splice(index, 1);
    }, //删除项目行
    onEditItem(index) {
      this.item = this.subListData[index];
      this.editIndex = index;
      this.dialogFormVisible = true;
    }, //编辑项目行
    onAddRow: function() {
      this.loading = true;
      this.item = {
        wl: "",
        ms: "",
        sl: "",
        dj: "",
        zje: "",
        sqlx: "",
        gdzc: "",
        fytm: ""
      };
      this.materielOpt = [];
      var appType = this.ECCTaskForm.applicantType;
      var proType = this.ECCTaskForm.productType;
      var parm = {
        type: "get",
        action: "ListItems",
        list: this.fixedAssetsInfoListName,
        condition:
          "?$filter=ApplicationType eq  '" +
          appType +
          "'" +
          " and ProductType eq '" +
          proType +
          "'",
        baseUrl: this.hostUrl
      };
      var opt = common.queryOpt(parm);
      $.when($.ajax(opt))
        .done(req => {
          var data = req.d.results;
          if (data.length > 0) {
            data.forEach(d => {
              this.materielOpt.push({
                Materiel: d.MaterielCode,
                MaterielDescription: d.MaterielDescription,
                Price: d.Price
              });
            });
            this.loading = false;
            this.dialogFormVisible = true;
          } else {
            this.$message(
              common.message(
                "error",
                "固定资产列表未找到当前申请产品，请及时与管理员联系!"
              )
            );
            this.loading = false;
            this.dialogFormVisible = false;
          }
        })
        .catch(err => {
          this.$message(common.message("error", "获取固定资产列表错误!"));
          this.loading = false;
          this.dialogFormVisible = false;
        });
    }, //新增项目行
    onSubItemSave(formName) {
      var valid = this.subItemVerification();
      if (valid) {
        if (this.editIndex != -1) {
          //Edit item part
          this.subListData[this.editIndex] = this.item;
        } else {
          //Add item part
          this.subListData.push(this.item);
        }
        this.editIndex = -1;
        this.item = {
          wl: "",
          ms: "",
          sl: "",
          dj: "",
          zje: "",
          sqlx: "",
          gdzc: "",
          fytm: ""
        };
        this.dialogFormVisible = false;
      }
    }, //添加或编辑项目行数据
    onCancel: function() {
      this.editIndex = -1;
      this.item = {
        wl: "",
        ms: "",
        sl: "",
        dj: "",
        zje: "",
        sqlx: "",
        gdzc: "",
        fytm: ""
      };
      this.dialogFormVisible = false;
    }, //点击取消按钮
    getAppTypeAndProType: function() {
      var parm1 = {
        action: "ListItems",
        type: "get",
        list: this.appliantTypeListName,
        baseUrl: this.hostUrl,
        condition: ""
      };
      // var parm2 = {
      //   action: "ListItems",
      //   type: "get",
      //   list: this.productTypeListName,
      //   baseUrl: this.hostUrl,
      //   condition: ""
      // };
      var option1 = common.queryOpt(parm1);
      // var option2 = common.queryOpt(parm2);
      $.when($.ajax(option1))
        .done(req1 => {
          var data1 = req1.d.results;
          // var data2 = req2[0].d.results;
          if (data1.length > 0) {
            data1.forEach(d1 => {
              this.applicantTypeOpts.push({
                Title: d1.Title
              });
            });
          }
          // if (data2.length > 0) {
          //   data2.forEach(d2 => {
          //     that.productTypeOpts.push({
          //       Title: d2.Title
          //     });
          //   });
          // }
        })
        .catch(err => {
          this.loading = false;
          this.$message(common.message("error", "申请类型或产品类别加载出错!"));
        });
    }, //获取申请类型,获取产品类型
    createEccSubInfoItem: function(eccSubInfoArr) {
      eccSubInfoArr.forEach(d => {
        var itemInfo = {
          __metadata: {
            type: this.eccSubInfoListType
          },
          Title: this.ECCTaskForm.applicantNumber,
          Materiel: d.wl,
          MaterielDescription: d.ms,
          Amount: d.sl.toString(),
          Price: d.dj.toString(),
          Total: d.zje.toString(),
          RequestType: d.sqlx,
          CostItems:d.fytm
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
            // this.$message(common.message("success", "物料清单已添加成功!"));
          })
          .catch(err => {
            this.$message(common.message("error", "物料清单添加失败!"));
          });
      });
    }, //创建ECC物料数据至ECCSubInfo列表
    mainFormVerification: function() {
      var isSuccess = false;
      if (this.ECCTaskForm.applicant == "") {
        this.$message(common.message("error", "请输入申请人"));
      } else if (this.ECCTaskForm.costcenter == "") {
        this.$message(common.message("error", "请输入成本中心"));
      } else if (this.ECCTaskForm.companycode == "") {
        this.$message(common.message("error", "请输入公司代码"));
      } else if (this.ECCTaskForm.applicantType == "") {
        this.$message(common.message("error", "请选择申请类别"));
      } else if (this.ECCTaskForm.productType == "") {
        this.$message(common.message("error", "请选择产品类型"));
      } else if (this.ECCTaskForm.consigneeDetail == "") {
        this.$message(common.message("error", "请输入收件人及地址"));
      } else {
        isSuccess = true;
      }
      return isSuccess;
    }, //ECC验证
    subItemVerification() {
      var isSuccess = false;
      if (this.item.wl == "") {
        this.$message(common.message("error", "请输入物料"));
      } else if (this.item.ms == "") {
        this.$message(common.message("error", "请输入物料描述"));
      } else if (this.item.sl == "") {
        this.$message(common.message("error", "请输入数量"));
      } else if (this.item.dj == "") {
        this.$message(common.message("error", "请输入单价"));
      } else if (this.item.sqlx == "") {
        this.$message(common.message("error", "请输入申请类型"));
      } else if (this.item.sqlx == "费用" && this.item.fytm == "") {
        this.$message(common.message("error", "请输入费用条目"));
      } else {
        isSuccess = true;
      }
      return isSuccess;
    }, //ECC物料验证
    wlChange: function() {
      this.materielOpt.forEach(d => {
        if (d.Materiel == this.item.wl) {
          this.item.ms = d.MaterielDescription;
          this.item.dj = d.Price;
        }
      });
      var sl = this.item.sl;
      this.item.zje = Number(sl) * Number(this.item.dj);
    }, //物料编码change事件
    slChange: function() {
      var sl = this.item.sl;
      this.item.zje = Number(sl) * Number(this.item.dj);
    }, //物料数量change事件
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
    }, //将文件转化为文件流
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
      const extension = file.name.toLowerCase().split(".")[1] === "xls";
      const extension2 = file.name.toLowerCase().split(".")[1] === "xlsx";
      const extension3 = file.name.toLowerCase().split(".")[1] === "doc";
      const extension4 = file.name.toLowerCase().split(".")[1] === "docx";
      const extension5 = file.name.toLowerCase().split(".")[1] === "txt";
      const size = file.size / 1024 / 1024 < 10;
      if (
        !extension &&
        !extension2 &&
        !extension3 &&
        !extension4 &&
        !extension5
      ) {
        this.$message(
          common.message(
            "error",
            "上传的文件只能是 xls、xlsx、doc、docx、txt 格式!"
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
        (extension5 && size)
      );
    }, //附件上传前对文件格式和大小进行验证
    fileLimit: function(files, fileList) {
      this.$message(common.message("error", "最多只能上传一个文件!"));
    }, //超出文件数量回调函数
    getCurrentUser: function() {
      var parm = {
        action: "CurrentUser",
        type: "get",
        baseUrl: this.hostUrl
      };
      var option = common.queryOpt(parm);
      $.when($.ajax(option))
        .done(c => {
          var loginName = c.d.LoginName.split("|membership|")[1];
          this.ECCTaskForm.applicant = c.d.Title;
          this.search(loginName);
        })
        .catch(err => {
          this.$message(common.message("error", "加载当前用户出错!"));
        });
    }, //获取当前用户并验证员工表是否存在当前用户
    speApprChange: function() {
      this.loading = true;
      this.SpecApproId = 0;
      this.checkIsSpecAppro = false;
      var speApproverName = this.ECCTaskForm.specialApprover;
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
                  this.ECCTaskForm.specialApprover = "";
                  this.$message(
                    common.message(
                      "error",
                      "通过员工列表EmployeeID加载特殊审批用户出错!"
                    )
                  );
                });
            } else {
              this.loading = false;
              this.ECCTaskForm.specialApprover = "";
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
            this.ECCTaskForm.specialApprover = "";
            this.$message(common.message("error", "加载特殊审批用户出错!"));
          });
      } else {
        this.loading = false;
      }
    } //绑定特殊审批人输入框change事件
  },
  mounted: function() {
    this.loading = true;
    this.requestDigest = common.getRequestDigest();
    this.ECCTaskForm.applicantNumber = common.generateUUID();
    this.getCurrentUser();
    this.getAppTypeAndProType();
    this.getCostCenter();
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
  width: 140px;
}

/* .top tr:nth-child(6) {
  background-color: #409eff;
  font-weight: bold;
  color: white;
  border: 0px;
} */
#table_heard td {
  background-color: #409eff;
  font-weight: bold;
  color: white;
  border: 0px;
}
</style>

