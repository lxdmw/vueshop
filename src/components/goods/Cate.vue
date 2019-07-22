<template>
  <div>
     <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>商品管理</el-breadcrumb-item>
    <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 分类添加区域 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加分类</el-button>
          
        </el-col>
      </el-row>

      <!-- 分类列表区域 -->
      <tree-table :data="goodList"></tree-table>
        

      
      
      <!-- 分页区域 -->
      <!-- <el-pagination 
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 5]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination> -->


    </el-card>
  </div>
</template>
<script>
export default {
  created() {
    // 获取商品分类列表
    this.getGoodsList()
  },
  data () {
    return {
      // 查询条件
      queryInfo:{
        type:3,
        pagenum:1,
        pagesize:5
      },

      // 商品分类的数据列表,默认为空
      goodList:[]
    };
  },
  methods:{
    // 获取商品分类列表
    async getGoodsList(){
      const {data:res} = await this.$http.get('categories', {params: this.queryInfo})
      if(res.meta.status != 200) return this.$message.error('获取商品分类列表失败')

      this.$message.success('获取商品分类列表数据success!!!oye')
      console.log(res.data.result);
      
      // 把数据列表 赋值给goodList
      this.goodList = res.data.result

      //为总条数赋值
      this.total = res.data.total
    }
  }
}
</script>
<style lang='less' scoped>
  .el-button {
    margin-bottom: 15px;
  }
</style>