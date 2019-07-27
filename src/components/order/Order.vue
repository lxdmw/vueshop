<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
  
    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <!-- 搜索框 -->
        <el-col :span=8>
           <el-input placeholder="请输入内容" 
            v-model="queryInfo.query" 
            clearable 
            @clear="getOrderList()"
            @keyup.enter.native="getOrderList()"
            >
            <el-button slot="append" icon="el-icon-search" @click="getOrderList()"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table
        :data="orderList"
        border
        stripe
        style="width: 100%">
        <el-table-column
          type="index">
        </el-table-column>
        <el-table-column
          prop="order_number"
          label="订单编号"
          width="260">
        </el-table-column>
        <el-table-column
          prop="order_price"
          label="订单价格">
        </el-table-column>

        <el-table-column label="是否付款">
          <template slot-scope="scope" prop="order_pay">
            <el-tag type="danger" v-if="scope.row.pay_status === '0' ">未付款</el-tag>
            <el-tag type="success" v-else>已付款</el-tag>

          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send">

        </el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改地址按钮 -->
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showAdr()"></el-button>
            <!-- 查物流信息按钮 -->
            <el-button size="mini" type="success" icon="el-icon-location" @click="showProgress()"></el-button>
          </template>
        </el-table-column>

      </el-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>


    <!-- 修改地址弹出框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressVisible"
      width="50%"
      @close="addressDialogClosed">
      <el-form ref="addressFormRef" :rules="addressFormRules" :model="addressForm" label-width="100px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="addressForm.address1"
            :options="cityData"
            >
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>


    <!-- 物流进度对话框 -->
    <el-dialog
      title="物流信息"
      :visible.sync="progressVisible"
      width="50%"
      >
      <!-- 时间线 -->
      <el-timeline reverse>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.ftime">
          {{activity.context}}
        </el-timeline-item>
      </el-timeline>
      
    </el-dialog>

  </div>
</template>
<script>

import cityData from './citydata.js'
export default {
  created(){
    this.getOrderList()
  },
  data () {
    return {
      queryInfo:{
        query:'',
        pagenum:1,
        pagesize:10
      },
      // 订单数据列表
      orderList:[],
      // 所有数据条数
      total:0,
      // 修改地址对话框显示隐藏
      addressVisible: false,
      // 修改地址表单
      addressForm:{
        address1:[],
        address2:''
      },
      // 修改地址表单验证规则
      addressFormRules:{
        address1:[
          {required:true,message:'请选择地址',trigger:'blur'}
        ],
        address2:[
          {required:true,message:'请填写详细地址',trigger:'blur'}
        ]
      },
      cityData,
      // 物流信息对话框显示隐藏
      progressVisible:false,
      // 物流进度信息
      progressInfo:[]
    };
  },
  methods:{
    // 获取订单列表
    async getOrderList(){
      const {data:res} = await this.$http.get('orders',{params:this.queryInfo})

      if (res.meta.status !== 200) {
        return this.$message.error('获取订单列表fail')
      }
      this.$message.success('获取订单列表success')
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange(newSize){
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    handleCurrentChange(newPage){
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    // 展示修改地址对话框
    showAdr(){
      this.addressVisible = true
    },
    // 清空地址对话框中的数据
    addressDialogClosed(){
      this.$refs.addressFormRef.resetFields()
    },
    // 展示物流进度对话框
    async showProgress(){
      const {data:res} = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) return this.$message.error('获取物流进度失败')

      this.progressInfo = res.data
      this.progressVisible = true
      console.log(this.progressInfo);
      
    }
  }
}
</script>
<style lang='less' scoped>
  @import '../../plugins/timeline/timeline.css';
  @import '../../plugins/timeline-item/timeline-item.css';
  .el-table{
    margin-top: 20px
 }
 .el-cascader{
   width: 100%
 }
</style>