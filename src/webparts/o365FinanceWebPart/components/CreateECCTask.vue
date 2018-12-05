<template>
  <div id="CreateECCTask" v-loading="loading">
    <el-container>
      <el-header>
        <!--进度条 -->
        <div :style="{display:display}">
          <el-progress :percentage="percentage"></el-progress>
        </div>
        <span style="font-size:20px;">资产领用模板</span>
      </el-header>
      <el-main>
        <!--Main List item -->
        <table class="top" style=" border-collapse: separate;">
          <tr>
            <td>申请人 ：</td>
            <td>
              <el-input
                placeholder="请输入内容"
                v-model="ECCTaskForm.applicant"
                class="input-with-select"
              >
                <el-button @click="search" slot="append" icon="el-icon-search"></el-button>
              </el-input>
            </td>
            <td>成本中心 ：</td>
            <td>
              <el-select v-model="ECCTaskForm.costcenter" placeholder="请选择">
                <el-option
                  v-for="item in costCenterArr"
                  :key="item.CostCenter"
                  :label="item.CostCenter"
                  :value="item.CostCenter"
                ></el-option>
              </el-select>
            </td>
            <td>公司代码 ：</td>
            <td>
              <el-select v-model="ECCTaskForm.companycode" placeholder="请选择">
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
            <td>
              <el-input v-model="ECCTaskForm.applicantNumber" placeholder="申请单号" :disabled="true"></el-input>
            </td>
            <td>申请类别 ：</td>
            <td>
              <el-select v-model="ECCTaskForm.applicantType" placeholder="请选择">
                <el-option
                  v-for="item in applicantTypeOpts"
                  :key="item.Title"
                  :label="item.Title"
                  :value="item.Title"
                ></el-option>
              </el-select>
            </td>
            <td>产品类型 ：</td>
            <td>
              <el-select v-model="ECCTaskForm.productType" placeholder="请选择">
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
            <td colspan="5" style="text-align:left;">
              <el-input v-model="ECCTaskForm.consigneeDetail" placeholder="收件人及其地址"></el-input>
            </td>
          </tr>
          <tr>
            <td colspan="6" style="text-align:right;">
              <el-button type="primary" icon="el-icon-plus" @click="dialogFormVisible = true">添加项目行</el-button>
            </td>
          </tr>
        </table>
        <!-- Sub List Items-->
        <el-table :data="subListData" stripe>
          <el-table-column prop="wl" label="物料" width="180"></el-table-column>
          <el-table-column prop="ms" label="物料描述" width="300"></el-table-column>
          <el-table-column prop="sl" label="数量" width="180"></el-table-column>
          <el-table-column prop="dj" label="单价" width="180"></el-table-column>
          <el-table-column prop="zje" label="总金额" width="180"></el-table-column>
          <el-table-column prop="sfxz" label="是否选择" width="180"></el-table-column>
          <el-table-column prop="sqlx" label="申请类型" width="180"></el-table-column>
          <el-table-column prop="gdzc" label="固定资产编码" width="300"></el-table-column>
          <el-table-column prop="fytm" label="费用条目" width="180"></el-table-column>
          <el-table-column fixed="right" label="操作" width="200">
            <template slot-scope="scope">
              <el-button @click="edit(scope.$index)" size="small">编辑</el-button>
              <el-button @click="del(scope.$index)" type="danger" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- bottom-->
        <div class="bottom">
          <el-button type="primary" @click="onSubmit">保存</el-button>
        </div>
      </el-main>
    </el-container>
    <!-- dialog -->
    <el-dialog title="新增物料" :visible.sync="dialogFormVisible">
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
          <el-input v-model="item.sfxz" autocomplete="off"></el-input>
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
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="onAddItem('item')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as $ from "jquery";
export default {
  data() {
    return {
      msg: "CreateECCTask",
      hostUrl: this.GLOBAL.URL,
      mainListName: "ECC",
      mainListType: "SP.Data.ECCListItem",
      subListName: "ECCSubInfo",
      userListName: "EmployeeList",
      appliantTypeListName: "ApplicantType",
      productTypeListName: "ProductType",
      userArr: [],
      costCenterArr: [],
      companyCodeArr: [],
      dialogFormVisible: false, //dialog
      requestDigest: "",
      ECCTaskForm: {
        applicant: "",
        costcenter: "",
        companycode: "",
        applicantNumber: "",
        applicantType: "",
        productType: "",
        consigneeDetail: "",
        userId: ""
      },
      subListData: [
        //物料列表数据
        {
          wl: "4587HC3",
          ms: "empty",
          sl: 1,
          dj: "10.99",
          zje: "10.99",
          sfxz: "x",
          sqlx: "固定资产",
          gdzc: "FA00001,FA00002,",
          fytm: "4040101"
        }
      ],
      rules: {
        //添加列表时校验
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
      },
      item: {
        //项目行数据
        wl: "",
        ms: "",
        sl: "",
        dj: "",
        zje: "",
        sfxz: "",
        sqlx: "",
        gdzc: "",
        fytm: ""
      },
      applicantTypeOpts: [],
      productTypeOpts: [],
      ECCFormData: [],
      loading: true,
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
          this.loading = false;
          alert("Save Successfully!");
        })
        .catch(function(err) {
          console.log(err);
        });
    }, //保存主表数据
    generateUUID: function() {
      var d = new Date().getTime();
      var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function(c) {
          var r = (d + Math.random() * 16) % 16 | 0;
          d = Math.floor(d / 16);
          return (c == "x" ? r : (r & 0x7) | 0x8).toString(16);
        }
      );
      return uuid;
    }, //生产GUID
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
    edit(index) {
      this.item = this.subListData[index];
      this.dialogFormVisible = true;
      this.editIndex = index;
    }, //删除行
    onAddItem(item) {
      this.$refs[item].validate(valid => {
        if (valid) {
          if (this.editIndex != -1) {
            //edit
            this.subListData[this.editIndex] = this.item;
            this.dialogFormVisible = false;
          } else {
            //add
            this.subListData.push(this.item);
            this.dialogFormVisible = false;
          }
          this.editIndex = -1;
          this.item = {};
        } else {
          alert("error submit!!");
          return false;
        }
      });
    }, //添加或编辑项目行
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
    } //获取申请类型,获取产品类型
  },
  mounted: function() {
    this.loading = true;
    if (document.getElementById("__REQUESTDIGEST") != null) {
      this.requestDigest = document.getElementById("__REQUESTDIGEST").value;
    }
    this.ECCTaskForm.applicantNumber = this.generateUUID();
    this.getAppTypeAndProType();
    this.loading = false;
  }
};
</script>

<style>
#CreateECCTask {
  width: 90%;
  margin: 0px auto;
}

.top {
  width: 100%;
  min-height: 25px;
  line-height: 25px;
  border-spacing: 10px;
  color: #909399;
  margin: 10px 0px;
}
.top td:nth-child(even) {
  text-align: left;
}
.top td:nth-child(odd) {
  text-align: right;
}
.bottom {
  text-align: right;
  margin-top: 10px;
}
h1 {
  text-align: center;
  color: #909399;
}
</style>

