<template>
  <div style="min-height: 300px">
    <BasicForm @register="registerForm"></BasicForm>
    <div style="text-align: right">
      <a-button @click="emits('cancel')" style="margin-right: 10px">取 消</a-button>
      <a-button type="primary" @click="save" :loading="lodingBtn">提 交</a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { watch, nextTick, ref } from 'vue';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form';
  import { analysisAddOrUpdate } from '/@/api/dataAnalysis/financial';
  import { useMessage } from '/@/hooks/web/useMessage';
  import type { Rule } from 'ant-design-vue/es/form';
  import { getText, isNull } from '../utils';
  const emits = defineEmits(['submit', 'cancel']);
  const { createMessage } = useMessage();
  let lodingBtn = ref<boolean>(false);
  const props = withDefaults(
    defineProps<{
      info: {
        analysis: string;
        id: string | null;
        orgCode: string;
        dateStr: string;
        dateType: number;
        title: string;
      };
    }>(),
    {
      info: () => ({
        analysis: '',
        id: null,
        orgCode: '',
        dateStr: '',
        dateType: 0,
        title: '',
      }),
    },
  );

  const schemas: FormSchema[] = [
    // {
    //   label: '分析',
    //   field: 'analysis',
    //   component: 'Textarea',
    //   componentProps: { placeholder: '分析', autosize: { minRows: 8 }, showCount: true, allowClear: true },
    // },
    {
      label: '分析',
      field: 'analysis',
      component: 'Editor',
      rules: [{ required: true, validator: checkanalysis, trigger: 'change' }],
      componentProps: {
        showFooter: true,
        editorHeight: '350px',
        mode: 'simple',
        // onChange: editor => {
        //   // console.log('editor', editor);
        // },
        toolbarConfig: {
          toolbarKeys: [
            'bold',
            'underline',
            'italic',
            'through',
            'sub',
            'sup',
            'clearStyle',
            'color',
            'bgColor',
            'fontSize',
            'fontFamily',
            'indent',
            'delIndent',
            'justifyLeft',
            'justifyRight',
            'justifyCenter',
            'justifyJustify',
            'lineHeight',
          ],
          // excludeKeys: [],
        },
      },
    },
  ];

  const [registerForm, { setFieldsValue, validate, resetFields }] = useForm({
    layout: 'vertical',
    labelWidth: 400,
    schemas: schemas,
  });

  init();

  watch(
    () => props.info,
    () => {
      init();
    },
    {
      deep: true,
    },
  );

  const save = async () => {
    const values = await validate();
    // console.log(values, 'values');
    if (!values) return;
    const { title, ...resData } = values;
    lodingBtn.value = true;
    analysisAddOrUpdate(resData)
      .then(res => {
        if (res.code === 200) {
          createMessage.success(res.msg);
          emits('submit');
          resetFields();
        } else {
          createMessage.warning(res.msg);
        }
      })
      .catch(() => {})
      .finally(() => {
        lodingBtn.value = false;
      });
  };
  async function init() {
    await nextTick();
    props.info.analysis = props.info.analysis === '暂无分析' ? '' : props.info.analysis;
    setFieldsValue(props.info);
  }

  /**
   * @description  富文本编辑器wangeditor必填判断
   * @param _rule
   * @param value
   */
  async function checkanalysis(_rule: Rule, value: string) {
    // console.log(value, _rule, 'checkanalysis');
    if (isNull(getText(value))) {
      return Promise.reject('请输入内容');
    } else {
      return Promise.resolve();
    }
  }
</script>
