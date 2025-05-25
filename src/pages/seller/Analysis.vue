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
    <h3>熱銷商品排行 (本月)</h3>
  </div>
</template>

<script setup lang="ts">
  import { shallowReactive, computed, reactive, ref, inject } from 'vue';
  import type { Select, UserInfo, Period } from '@/types/interface';
  import { apiGetSystemSetting, apiChartDateItem, apiChartData } from '@/utils/apiClient';
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement
  } from 'chart.js'
  import { Line, Bar } from 'vue-chartjs'
  import type { ChartData } from 'chart.js';
  ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement)
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
  // 初始化
  const init = async () => {
    await getPeriodList();
    const [data, label] = await Promise.all([getChartData(query.period), getDateItems(query.period)])
    chartData.value = {
      labels: label,
      datasets: [renderDataset(data)]
    }
  }
  // chart
  // chartData
  const chartData = ref<ChartData>({
    labels: [],
    datasets: []
  });

  // 圖表配置
  const chartOptions = ref({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        display: false
      },
      title: {
        display: true,
        align: 'start',
        text: '銷售金額'
      }
    },
    tension: 0.3,
    borderColor: '#19B3E3'
  });
  // 渲染Dataset
  const renderDataset = (data: number[]) => {
    return {
      borderColor: 'rgb(79, 70, 229)',
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      data: data,
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
</style>