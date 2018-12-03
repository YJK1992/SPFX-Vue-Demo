import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import * as strings from 'O365FinanceWebPartWebPartStrings';

import Vue from "vue";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueRouter from 'vue-router';
Vue.use(VueRouter);
Vue.use(ElementUI);

import App from "./components/App.vue";
import CreateByMe from "./components/CreateByMe.vue";
import CreateECCTask from "./components/CreateECCTask.vue";
import CreateGPTask from "./components/CreateGPTask.vue";
import CreatePTPTask from "./components/CreatePTPTask.vue";
import Home from "./components/Home.vue";

export interface IO365FinanceWebPartWebPartProps {
  description: string;
}

export default class O365FinanceWebPartWebPart extends BaseClientSideWebPart<IO365FinanceWebPartWebPartProps> {

  public render(): void {
    const routes = [
      { path: '/home', component: Home },
      { path: '/createbyme', component: CreateByMe },
      { path: '/createecctask', component: CreateECCTask },
      { path: '/creategptask', component: CreateGPTask },
      { path: '/createptptask', component: CreatePTPTask },
      { path: '*', redirect: '/home' }   /*默认跳转路由*/
    ]

    const router = new VueRouter({
      routes // （缩写）相当于 routes: routes
    })
    Vue.prototype.GLOBAL = {
      "URL": this.context.pageContext.site.absoluteUrl
    }
    this.domElement.innerHTML = `
    <div id='app'></div>`;
    new Vue({
      el: '#app',
      router,
      render: h => h(App)
    }).$mount('#app');
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
