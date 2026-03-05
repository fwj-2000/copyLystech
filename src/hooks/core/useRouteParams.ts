// src/hooks/useRouteParams.ts
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';

type ParamConfig = {
  source?: 'params' | 'query'; // 默认 query
  type?: 'string' | 'number' | 'boolean'; // 默认 string
  default?: any;
};

export function useRouteParams<T extends Record<string, ParamConfig>>(config: T, handler: (parsedParams: { [K in keyof T]: any }) => void) {
  const route = useRoute();

  onMounted(() => {
    const parsedParams = {} as any;

    Object.entries(config).forEach(([key, cfg]) => {
      // 设置默认值：source=query / type=string
      const source = cfg?.source ?? 'query';
      const type = cfg?.type ?? 'string';

      const rawValue = source === 'params' ? route.params[key] : route.query[key];

      // 处理数组参数（兼容路由参数数组形式）
      const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;

      parsedParams[key] = transformValue(
        value ?? cfg?.default, // 空值使用默认值
        type,
      );
    });

    handler(parsedParams);
  });

  function transformValue(value: any, type: string) {
    if (value === undefined || value === null) return undefined;
    switch (type) {
      case 'number':
        return Number.isNaN(Number(value)) ? undefined : Number(value);
      case 'boolean':
        return value === 'true' || value === true;
      default: // string 类型直接返回原始字符串
        return value.toString();
    }
  }
}
