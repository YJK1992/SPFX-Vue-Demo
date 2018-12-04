<template>
  <div id="CreateECCTask">
    <!-- <el-form :inline="true" :model="ECCTaskForm" class="demo-form-inline" v-loading="loading">
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="申请人">
            <el-input v-model="ECCTaskForm.applicant" placeholder="审批人"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="成本中心">
            <el-input v-model="ECCTaskForm.costcenter" placeholder="成本中心"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="公司代码">
            <el-input v-model="ECCTaskForm.companycode" placeholder="公司代码"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="申请单号">
            <el-input v-model="ECCTaskForm.applicantNumber" placeholder="申请单号"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="申请类别">
            <el-input v-model="ECCTaskForm.applicantType" placeholder="申请类别"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="产品类型">
            <el-input v-model="ECCTaskForm.productType" placeholder="产品类型"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <el-form-item label="收件人及其地址">
            <el-input
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4}"
              placeholder="请输入内容"
              v-model="ECCTaskForm.consigneeDetail"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-button type="primary" @click="onSubmit" round>提交</el-button>-->
    <div id="head">
      <!--进度条 -->
      <div :style="{display:display}">
        <el-progress :percentage="percentage"></el-progress>
      </div>
      <h1>资产领用模板</h1>
    </div>

    <div id="main">
      <!--Main List item -->
      <table class="top">
        <tr>
          <td>申请人 ：</td>
          <td>
            <el-input v-model="ECCTaskForm.applicant" placeholder="申请人"></el-input>
          </td>
          <td>成本中心 ：</td>
          <td>
            <el-input v-model="ECCTaskForm.costcenter" placeholder="成本中心"></el-input>
          </td>
          <td>公司代码 ：</td>
          <td>
            <el-input v-model="ECCTaskForm.companycode" placeholder="公司代码"></el-input>
          </td>
        </tr>
        <tr>
          <td>申请单号 ：</td>
          <td>
            <el-input v-model="ECCTaskForm.applicantNumber" placeholder="申请单号"></el-input>
          </td>
          <td>申请类别 ：</td>
          <td>
            <el-select v-model="ECCTaskForm.applicantType" placeholder="请选择">
              <el-option
                v-for="item in lbOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </td>
          <td>产品类型 ：</td>
          <td>
            <el-select v-model="ECCTaskForm.productType" placeholder="请选择">
              <el-option
                v-for="item in lxOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
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
      <el-table :data="subListData" stripe style="width: 100%">
        <el-table-column prop="date" label="物料清单">
          <el-table-column prop="wl" label="物料" width="180"></el-table-column>
          <el-table-column prop="ms" label="物料描述" width="300"></el-table-column>
          <el-table-column prop="sl" label="数量" width="180"></el-table-column>
          <el-table-column prop="dj" label="单价" width="180"></el-table-column>
          <el-table-column prop="zje" label="总金额" width="180"></el-table-column>
          <el-table-column prop="sfxz" label="是否选择" width="180"></el-table-column>
          <el-table-column prop="sqlx" label="申请类型" width="180"></el-table-column>
          <el-table-column prop="gdzc" label="固定资产编码" width="300"></el-table-column>
          <el-table-column prop="fytm" label="费用条目" width="180"></el-table-column>
          <el-table-column fixed label="操作" width="100">
            <template slot-scope="scope">
              <el-button @click="edit(scope.$index)" type="text" size="small">编辑</el-button>
              <el-button @click="del(scope.$index)" type="text" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>

      <div class="bottom">
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </div>
    </div>

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
      dialogFormVisible: false, //dialog
      requestDigest: "",
      ECCTaskForm: {
        applicant: "",
        costcenter: "",
        companycode: "",
        applicantNumber: "",
        applicantType: "",
        productType: "",
        consigneeDetail: ""
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
      ECCFormData: [],
      loading: false,
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
        ApplicationType: this.ApplicationType,
        ProductType: this.ECCTaskForm.productType
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
      $.when($.ajax(options)).done(function(req) {
        alert("Success");
        this.loading = false;
      });
    },
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
    },
    //删除行
    del(index) {
      this.subListData.splice(index, 1);
    },
    //编辑行
    edit(index) {
      this.item = this.subListData[index];
      this.dialogFormVisible = true;
      this.editIndex = index;
    },
    //添加或编辑项目行
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
    }
  },
  mounted: function() {
    this.ECCTaskForm.applicantNumber = this.generateUUID();
    this.requestDigest = document.getElementById("__REQUESTDIGEST").value;
    console.log(this.requestDigest);
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
  border-collapse: separate;
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

