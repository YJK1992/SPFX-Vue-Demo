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

export interface IO365FinanceWebPartWebPartProps {
  description: string;
}

export default class O365FinanceWebPartWebPart extends BaseClientSideWebPart<IO365FinanceWebPartWebPartProps> {
  protected onInit(): Promise<void> {
    SPComponentLoader.loadCss("https://unpkg.com/element-ui/lib/theme-chalk/index.css");
    return super.onInit();
  }
  public render(): void {
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
