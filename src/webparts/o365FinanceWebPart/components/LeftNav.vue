<template>
  <div id="LeftNav">
    <ul class="hom-nav">
      <li v-for="(item,index) in list">
        <router-link :to="{path:item.Path}">{{item.Name}}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: this.GLOBAL.URL,
      list: [
        {
          Name: "Home",
          Path: "/home"
        },
        {
          Name: "Create ECC Task",
          Path: "/createecctask"
        },
        {
          Name: "Create GP Purchase Task",
          Path: "/creategppurchasetask"
        },
        {
          Name: "Create GP Pay Task",
          Path: "/creategppaytask"
        },
        {
          Name: "Create PTP Task",
          Path: "/createptptask"
        },
        {
          Name: "My Agent",
          Path: "/myagent"
        },
        {
          Name: "Create By Me",
          Path: "/createbyme"
        }
      ]
    };
  }
};
</script>

<style>
.hom-nav li a {
  display: block;
  padding: 15px 30px 15px 30px;
  color: #222;
  font-size: 16px;
  text-decoration: none;
}

.hom-nav li a:hover {
  text-decoration: none;
  background: #a7dcff;
  color: #fff;
}

ul.hom-nav {
  background: #fff;
  border: 1px solid #e9e9e9;
  list-style-type: none;
  margin-top: 0px;
}

* {
  padding: 0;
}

.hom-nav li {
  border-bottom: 1px solid #c5c5c5;
}

.hom-nav li a:focus {
  background: #409eff;
  color: #fff;
}
</style>
