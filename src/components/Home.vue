<template>
  <el-container class="home-container">
    <!-- 头部开始 -->
    <el-header>
      <div class="logo">
        <img src="../assets/slogo1.png" class="slogo" />
        <span>夏洛的电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 头部结束 -->

    <el-container>
      <!-- 侧边栏 开始 -->
      <el-aside width="isCollapse ? '64px' : '200px'">
        <div class="collapseBtn" @click="isCollapse = !isCollapse">|||</div>
        <el-menu
          background-color="rgb(170, 147, 129)"
          text-color="#000"
          active-text-color="black"

          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item
              :index="'/'+subItem.path "
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavItem(subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 侧边栏结束 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  created: function() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem("path")
  },
  data() {
    return {
      menulist: [],
      iconsObj: {
        "125": "iconfont icon-user logoColor",
        "103": "iconfont icon-tijikongjian logoColor",
        "101": "iconfont icon-shangpin logoColor",
        "102": "iconfont icon-danju logoColor",
        "145": "iconfont icon-baobiao logoColor"
      },
      isCollapse: false,
      activePath:"",
    };
  },
  methods: {
    logout() {
      // 删除
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status != 200)
        return this.$message.error("没找到数据。。。。");
      this.menulist = res.data;
      console.log(this.menulist);
    },
    saveNavItem(index) {
      console.log(index);
      sessionStorage.setItem("path", "/" + index)
    },
  }
};
</script>
<style lang='less' scoped>
.home-container {
  height: 100%;
}
.el-header {
  background: linear-gradient(right, rgb(146, 126, 117), rgb(170, 147, 129));
  display: flex;
  justify-content: space-between;
  font-size: 20px;
  color: #ccc;
  font-weight: 800;
  align-items: center;
  padding-left: 0;
  > div {
    display: flex;
    align-items: center;
    > span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: rgb(170, 147, 129);
}
.el-main {
  background: linear-gradient(bottom, rgb(240, 228, 202), rgb(229, 213, 180));
  // background-color: rgb(240, 228, 202);
}
.el-menu {
  border-right: none;
}
.iconfont {
  margin-right: 15px;
}
.logoColor {
  color: rgb(146, 126, 117);
}
.collapseBtn {
  text-align: center;
  color: rgb(146, 126, 117);
  cursor: pointer;
}
.slogo {
  height: 60px;
}
.el-submenu span {
  color: #ccc;
}
.el-menu-item span {
  color: #ccc;
}
</style>