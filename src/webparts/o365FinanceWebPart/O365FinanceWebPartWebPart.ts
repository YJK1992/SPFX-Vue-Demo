import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import * as strings from 'O365FinanceWebPartWebPartStrings';
import { SPComponentLoader } from '@microsoft/sp-loader';
import Vue from "vue";
import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
import VueRouter from 'vue-router';

Vue.use(VueRouter);
Vue.use(ElementUI);

import App from "./components/App.vue";
import CreateByMe from "./components/CreateByMe.vue";
import CreateECCTask from "./components/CreateECCTask.vue";
import CreateGPPayTask from "./components/CreateGPPayTask.vue";
import CreateGPPurchaseTask from "./components/CreateGPPurchaseTask.vue";
import CreatePTPTask from "./components/CreatePTPTask.vue";
import MyAgent from "./components/MyAgent.vue";
import Home from "./components/Home.vue";
import EditECCDTask from "./components/EditECCTask.vue";
import ViewECCTask from "./components/ViewECCTask.vue";
import MyECCDraft from "./components/MyECCDraft.vue";
import MyGPPurchaseDraft from "./components/MyGPPurchaseDraft.vue";
import ViewGPPurchaseTasks from "./components/ViewGPPurchaseTasks.vue";
import EidtGPPurchaseTask from "./components/EidtGPPurchaseTask.vue";
import ViewGPPay from "./components/ViewGPPay.vue";
import EditGPPay from "./components/EditGPPay.vue";
import MyGPPayDraft from "./components/MyGPPayDraft.vue";
import ECCReport from "./components/ECCReport.vue";
import GPPayReport from "./components/GPPayReport.vue";
import GPPurchaseReport from "./components/GPPurchaseReport.vue";
import GPPayRemittanceReport from "./components/GPPayRemittanceReport.vue";
import GPPayTaxBillReport1 from "./components/GPPayTaxBillReport1.vue";
import GPPayTaxBillReport2 from "./components/GPPayTaxBillReport2.vue";
import GPPayBillReport from "./components/GPPayBillReport.vue";
import GPPayAssetReport from "./components/GPPayAssetReport.vue";
import DetailGPPay from "./components/DetailGPPay.vue";
import MyApplication from "./components/MyApplication.vue";
import EditPTP from "./components/EditPTP.vue";
import MyPTPDraft from "./components/MyPTPDraft.vue";
import ViewPTPTasks from "./components/ViewPTPTasks.vue";
import PTPTemp1 from "./components/PTPTemp1.vue";
import PTPTemp2 from "./components/PTPTemp2.vue";
import PTPTemp3 from "./components/PTPTemp3.vue";
import detailPTP from "./components/detailPTP.vue";

export interface IO365FinanceWebPartWebPartProps {
  description: string;
}

export default class O365FinanceWebPartWebPart extends BaseClientSideWebPart<IO365FinanceWebPartWebPartProps> {
  protected onInit(): Promise<void> {
    SPComponentLoader.loadCss("https://unpkg.com/element-ui/lib/theme-chalk/index.css");
    return super.onInit();
  }
  public render(): void {
    var s1 = document.createElement("script");
    s1.type = "text/javascript";
    s1.src = this.context.pageContext.site.absoluteUrl + "/SiteAssets/shim.min.js";
    document.getElementsByTagName("head")[0].appendChild(s1)
    var a = document.getElementById("s4-titlerow")
    var b = document.getElementById("sideNavBox")
    var c = document.getElementById("contentBox")
    if (a != null) {
      a.parentNode.removeChild(a)
    }
    if (a != null) {
      b.parentNode.removeChild(b)
    }
    if (c != null) {
      c.setAttribute('style', 'margin-left:0px')
    }
    const routes = [
      { path: '/home', component: Home },
      { path: '/createbyme', component: CreateByMe },
      { path: '/createecctask', component: CreateECCTask },
      { path: '/creategppaytask', component: CreateGPPayTask },
      { path: '/creategppurchasetask', component: CreateGPPurchaseTask },
      { path: '/createptptask', component: CreatePTPTask },
      { path: '/myagent', component: MyAgent },
      { path: '/editecctask', component: EditECCDTask },
      { path: '/viewecctask', component: ViewECCTask },
      { path: '/myeccdraft', component: MyECCDraft },
      { path: '/viewgppurdraft', component: MyGPPurchaseDraft },
      { path: '/viewgppurtasks', component: ViewGPPurchaseTasks },
      { path: '/editgppurchase', component: EidtGPPurchaseTask },
      { path: '/viewgppay', component: ViewGPPay },
      { path: '/editgppay', component: EditGPPay },
      { path: '/mygppaydraft', component: MyGPPayDraft },
      { path: '/eccreport', component: ECCReport },
      { path: '/gppayreport', component: GPPayReport },
      { path: '/gppurchasereport', component: GPPurchaseReport },
      { path: '/gppayremittancereport', component: GPPayRemittanceReport },
      { path: '/gppaytaxbillreport1', component: GPPayTaxBillReport1 },
      { path: '/gppaytaxbillreport2', component: GPPayTaxBillReport2 },
      { path: '/gppaybillreport', component: GPPayBillReport },
      { path: '/gppayassetreport', component: GPPayAssetReport },
      { path: '/detailgppay', component: DetailGPPay },
      { path: '/myapplication', component: MyApplication },
      { path: '/editptp', component: EditPTP },
      { path: '/myptpdraft', component: MyPTPDraft },
      { path: '/viewptptasks', component: ViewPTPTasks },
      { path: '/ptptemp1', component: PTPTemp1 },
      { path: '/ptptemp2', component: PTPTemp2 },
      { path: '/ptptemp3', component: PTPTemp3 },
      { path: '/detailptp', component: detailPTP },

      { path: '*', redirect: '/home' }   /*默认跳转路由*/
    ]

    const router = new VueRouter({
      routes // （缩写）相当于 routes: routes
    })
    Vue.prototype.GLOBAL = {
      "URL": this.context.pageContext.site.absoluteUrl,
    }
    this.domElement.innerHTML = `
    <div id='app'></div>`;
    new Vue({
      el: '#app',
      router,
      render: h => h(App)
    });
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
