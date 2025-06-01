<template>
  <h2 class="mb-5">銷售分析</h2>
  <v-row class="align-center mb-6">
    <v-col cols="12" sm="6" md="8">
      <h3>{{ periodTitle }}</h3>
    </v-col>
    <v-col class="d-flex justify-sm-end" cols="12" sm="6" md="4">
      <v-select v-model="query.period" :items="periodItems" max-width="200" hide-details density="compact" />
    </v-col>
  </v-row>
  <div class="chart_container">
    <div class="chart_wrapper">
      <Line :options="chartOptions" :data="chartData" />
    </div>
  </div>
  <div>
    <v-row>
      <v-col sm="6" lg="4">
        <h3 class="mb-5">熱銷商品排行 (本月)</h3>
        <template v-for="({ count, name }, index) in sellCountList" :key="index">
          <div class="count_container">
            <span>{{ index + 1 }}.</span>
            <span class="ms-3">{{ name }}</span>
            <span class="ms-auto text-blue-darken-3">{{ count }}件</span>
          </div>
        </template>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
  import { shallowReactive, computed, reactive, ref, inject } from 'vue';
  import type { Select, UserInfo, Period, SellCount } from '@/types/interface';
  import { apiGetSystemSetting, apiChartDateItem, apiChartData, apiGetSellCount } from '@/utils/apiClient';
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, 
    CategoryScale, LinearScale, PointElement, LineElement, Filler } from 'chart.js'
  import { Line, Bar } from 'vue-chartjs'
  import type { ChartData, ChartOptions  } from 'chart.js';
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, Filler)
  enum PeriodEnum {
    month = '月銷售額趨勢',
    season = '季銷售額趨勢',
    halfYear = '半年銷售額趨勢',
    year = '年銷售額趨勢'
  }
  const userInfo = inject<UserInfo>('userInfo')!;
  const { id: userId } = userInfo;
  const periodItems: Select[] = shallowReactive([]);
  const query: { period: Period } = reactive({
    period: 'month'
  })
  const periodTitle = computed(() => {
    return PeriodEnum[query.period] ?? '';
  })
  const sellCountList: SellCount[] = shallowReactive([]);
  // 取得日期區間下拉選單API
  const getPeriodList = async () => {
    const res = await apiGetSystemSetting('period');
    const data = res.data.map(row => {
      return {
        title: row.name,
        value: row.prop
      }
    })
    periodItems.splice(0, periodItems.length, ...data);
    query.period = periodItems[0].value as Period;

  }
  // 取得銷售數量API
  const getSellCount = async (userId: string) => {
    const res = await apiGetSellCount(userId);
    return res.data;
  }
  // 初始化
  const init = async () => {
    await getPeriodList();
    const [data, label, countList] = await Promise.all([
      getChartData(query.period), 
      getDateItems(query.period), 
      getSellCount(userId)
    ]);
    sellCountList.splice(0, sellCountList.length, ...countList);
    chartData.value = {
      labels: label,
      datasets: [renderDataset(data)]
    }
  }
  // chart
  // chartData
  const chartData = ref<ChartData<'line'>>({
    labels: [],
    datasets: []
  });

  // 圖表配置
  const chartOptions = ref<ChartOptions<'line'>>({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        display: false,
      },
      title: {
        display: true,
        align: 'start',
        text: '銷售金額(NT$)',
        padding: 30
      }
    },
    
    elements: {
      line: {
        tension: 0.3
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          // value 是刻度的原始數值
          // index 是刻度的索引
          // ticks 是所有刻度的陣列
          callback: function(value, index, ticks) {
            if (typeof value === 'number') {
              // 使用 toLocaleString 來加上千分位分隔符號 (例如 4,000)
              // 'en-US' 通常會使用逗號作為千分位
              // minimumFractionDigits 和 maximumFractionDigits 設為 0 以去除小數部分
              const formattedValue = value.toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              });
              return `NT$ ${formattedValue}`;
            }
            return value; // 如果不是數字，直接回傳原值
          }
        }
      }
    }
  });
  // 渲染Dataset
  const renderDataset = (data: number[]) => {
    return {
      borderColor: 'rgb(79, 70, 229)',
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      data: data,
      fill: true,
      label: '銷售額 (NT$)'
    }
  }
  // 取得chartData API
  const getChartData = async (period: Period): Promise<number[]> => {
    const data = {
      userId: userId,
      period: period
    }
    const res = await apiChartData(data);
    return res.data
  }
  // 取得chartItem API
  const getDateItems = async (period: string) => {
    const res = await apiChartDateItem(period);
    return res.data;
  }
  watch(() => query.period, async (val) => {
    const [data, label] = await Promise.all([getChartData(val), getDateItems(val)])
    chartData.value = {
      labels: label,
      datasets: [renderDataset(data)]
    }
  })
  onMounted(async() => {
    init();
  })
</script>

<style scoped lang="scss">
.chart_container {
  width: 100%;
  height: 400px;
  overflow-x: auto;
  margin-bottom: 3rem;
  .chart_wrapper {
    min-width: 600px;
    height: 100%;
  }
}
.count_container {
  display: flex;
  font-size: 1.15rem;
  font-weight: 500;
  margin-bottom: .5rem;
  color: #585858;
}
</style>