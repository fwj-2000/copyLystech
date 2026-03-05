<!-- 联机率图表 -->
<template>
  <svg viewBox="0 0 135 200" fill="none" xmlns="http://www.w3.org/2000/svg">
    <mask :id="`mask0_5552_28916_${props.orgCode}`" style="mask-type: alpha" maskUnits="userSpaceOnUse" x="16" y="31" width="85" height="159">
      <path d="M16.6504 189.25L16.6504 31.75H100.35L100.35 189.25H16.6504Z" fill="#D9D9D9" />
    </mask>
    <g :mask="`url(#mask0_5552_28916_${props.orgCode})`">
      <circle
        cx="79.0614"
        cy="79.0614"
        r="78.4624"
        transform="matrix(0 -1 -1 0 93.4102 189.51)"
        stroke="#608BEE"
        stroke-opacity="0.58"
        stroke-width="1.1979"
        stroke-dasharray="2.4 2.4">
        <animate attributeName="stroke-dashoffset" values="0; -493" dur="15s" repeatCount="indefinite" begin="0s" />
      </circle>
      <circle cx="57.15" cy="57.15" r="57.15" transform="matrix(0 -1 -1 0 71.5508 167.65)" fill="url(#paint0_linear_5552_28916)" />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M-58.7229 110.449C-58.7229 70.0921 -26.0075 37.3767 14.349 37.3767C54.7055 37.3767 87.4209 70.0921 87.4209 110.449C87.4209 150.805 54.7055 183.521 14.349 183.521C-26.0075 183.521 -58.7229 150.805 -58.7229 110.449ZM-49.9495 110.5C-49.9495 74.9606 -21.139 46.1501 14.4005 46.1501C49.94 46.1501 78.7505 74.9606 78.7505 110.5C78.7505 146.04 49.94 174.85 14.4005 174.85C-21.139 174.85 -49.9495 146.04 -49.9495 110.5Z"
        fill="#668FEF"
        fill-opacity="0.15" />

      <clipPath :id="`mask1_5552_28916_${props.orgCode}`" style="mask-type: alpha" maskUnits="userSpaceOnUse" x="13" y="50" width="86" height="137">
        <rect x="16" y="28" width="85" height="170" fill="#f06" :transform="`rotate(${angle}, 16, 113)`">
          <animateTransform attributeName="transform" type="rotate" from="180 16 113" :to="`${angle} 16 113`" dur="1s" fill="freeze" />
        </rect>
      </clipPath>
      <g :clip-path="`url(#mask1_5552_28916_${props.orgCode})`">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M-58.7229 110.449C-58.7229 70.0921 -26.0075 37.3767 14.349 37.3767C54.7055 37.3767 87.4209 70.0921 87.4209 110.449C87.4209 150.805 54.7055 183.521 14.349 183.521C-26.0075 183.521 -58.7229 150.805 -58.7229 110.449ZM-49.9495 110.5C-49.9495 74.9606 -21.139 46.1501 14.4005 46.1501C49.94 46.1501 78.7505 74.9606 78.7505 110.5C78.7505 146.04 49.94 174.85 14.4005 174.85C-21.139 174.85 -49.9495 146.04 -49.9495 110.5Z"
          fill="url(#paint1_linear_5552_28916)" />
      </g>
    </g>

    <mask :id="`mask_line_111_${props.orgCode}`" maskUnits="userSpaceOnUse">
      <rect width="100%" height="100%" fill="white" />
      <circle cx="16" cy="110.15" r="63.5" fill="black" />
    </mask>
    <g :mask="`url(#mask_line_111_${props.orgCode})`">
      <path d="M 16 113 L 16 28" stroke="#7B9FF1" stroke-width="1" :transform="`rotate(${angle}, 16,113)`">
        <animateTransform attributeName="transform" type="rotate" from="180 16 113" :to="`${angle} 16 113`" dur="1s" fill="freeze" />
      </path>
    </g>
    <text :x="pointInfo.x" :y="pointInfo.y" fill-opacity="0" font-size="12" fill="#666666" text-anchor="start">
      {{ rate }}%
      <animate attributeName="fill-opacity" values="0;1" begin="1s" dur="500ms" fill="freeze" />
    </text>
    <text x="40" y="118" font-size="22" fill="url(#paint2_linear_5552_28916)" text-anchor="middle" class="text-hover" @click="goDetail('1')">
      {{ props.onlineNum }}
    </text>
    <path d="M7 32L7 68.0395M7.00001 190L7 148.96" stroke="#7CCAFF" />
    <text x="6" y="78" font-size="12" fill="#1A1A1A" text-anchor="start" writing-mode="vertical-rl" style="letter-spacing: 1.2">{{ props.name }}</text>
    <defs>
      <linearGradient id="paint0_linear_5552_28916" x1="57.15" y1="0" x2="57.15" y2="57.1498" gradientUnits="userSpaceOnUse">
        <stop stop-color="#4B7BEC" stop-opacity="0.8" />
        <stop offset="1" stop-color="white" stop-opacity="0" />
      </linearGradient>
      <linearGradient id="paint1_linear_5552_28916" x1="87.3122" y1="93.568" x2="14.3492" y2="177.965" gradientUnits="userSpaceOnUse">
        <stop stop-color="#5986EE" />
        <stop offset="1" stop-color="#F4F8FF" />
      </linearGradient>
      <linearGradient id="paint2_linear_5552_28916" x1="42" y1="101" x2="42" y2="118" gradientUnits="userSpaceOnUse">
        <stop stop-color="#001764" />
        <stop offset="1" stop-color="#6F8CED" />
      </linearGradient>
    </defs>
  </svg>
</template>

<script lang="ts" setup>
  import { computed, inject } from 'vue';
  import { useGo } from '/@/hooks/web/usePage';

  const go = useGo();
  const props = defineProps({
    rate: {
      type: Number,
      default: 0,
    },
    onlineNum: {
      type: Number,
      default: 0,
    },
    name: {
      type: String,
      default: '',
    },
    orgCode: {
      type: String,
      default: '',
    },
  });

  const angle = computed(() => {
    return 180 - Math.min((props.rate * 180) / 100, 180);
  });

  const pointInfo = computed(() => {
    return calculatePointOnCircle(16, 113.3, 85, angle.value - 90);
  });

  // 计算刻度点位
  const calculatePointOnCircle = (cx, cy, r, angleDegrees) => {
    const angleRadians = angleDegrees * (Math.PI / 180);
    const x = cx + r * Math.cos(angleRadians);
    const y = cy + r * Math.sin(angleRadians);
    return { x: x + 2, y: y + 2 };
  };

  // 去详情页
  const getSearchFormValue = inject('getSearchFormValue', () => {});
  const goDetail = (isonline = '') => {
    const orgCode = props.orgCode || 'MQ';
    const { date } = getSearchFormValue() as any;
    let dateParam = date;
    go(`/dashboard/operate/uptime/machineDetails?orgCode=${orgCode}&date=${dateParam.format('YYYY-MM-DD')}&isonline=${isonline}`);
  };
</script>
