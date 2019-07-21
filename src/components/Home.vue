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
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="rgb(170, 147, 129)"
          text-color="#000"
          active-text-color="orange"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单的模版区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
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
        "125": "iconfont icon-user ",
        "103": "iconfont icon-tijikongjian ",
        "101": "iconfont icon-shangpin ",
        "102": "iconfont icon-danju ",
        "145": "iconfont icon-baobiao "
      },
      isCollapse: false,
      // 被选中的当前项目的路径
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
      // console.log(this.menulist);
    },
    // 保存链接的激活状态
    saveNavItem(index) {
      // console.log(index);
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
  // color: #ccc;
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
// 侧边栏颜色
.el-aside {
  background-color: rgb(170, 147, 129);
}
// 主题区域背景色
.el-main {
  background: linear-gradient(bottom, rgb(240, 228, 202), rgb(229, 213, 180));
}
//消除侧边栏选中白色条
.el-menu {
  border-right: none;
}
// 给字体图标添加外右边距
.iconfont {
  margin-right: 15px;
}
// 展开按钮设置颜色
.collapseBtn {
  text-align: center;
  color: rgb(146, 126, 117);
  cursor: pointer;
}
// logo大小
.slogo {
  height: 60px;
}

</style>