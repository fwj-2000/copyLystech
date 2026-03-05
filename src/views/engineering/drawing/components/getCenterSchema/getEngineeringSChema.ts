import { FormSchema } from '/@/components/VxeTable/ui-kit/form-ui/src/types';
import { useI18n } from '/@/hooks/web/useI18n';
import { useUserStore } from '/@/store/modules/user';
import { computed } from 'vue';

const { t } = useI18n();
const userStore = useUserStore();
const getUserInfo = computed(() => userStore.getUserInfo || {});

/**
 * 工程作业 reviewNode --> Engineering
 * @param getForm
 */
export default function getEngineWorkSchema(getForm): FormSchema[] {
  return [
    {
      // 评审结论
      fieldName: 'reviewResult',
      label: t('dict.DrawingsReview.ReviewResult'),
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '通过',
            value: 1,
          },
          {
            label: '不通过',
            value: 2,
          },
        ],
        onChange: async e => {
          const form = await getForm();
          if (e == 1) {
            form.setFieldValue('makeEngineeringInfo', 1);
          } else if (e == 2) {
            form.setFieldValue('dfm', 1);
          }
        },
      },
    },
    {
      fieldName: 'makeEngineeringInfo',
      label: '工程资料能否制作',
      component: 'Select',
      componentProps: {
        dynamicDisabled: row => {
          // 评审结论通过一定能制作工程资料
          if (row.reviewResult == '1') {
            return true;
          } else {
            return false;
          }
        },
        options: [
          {
            label: '能',
            value: 1,
          },
          {
            label: '不能',
            value: 2,
          },
        ],
      },
    },
    {
      fieldName: 'dfm',
      label: '是否提DFM',
      component: 'Select',
      componentProps: {
        dynamicDisabled: row => {
          // 评审结论不通过一定能不能提DFM
          if (row.reviewResult == '2') {
            return true;
          } else {
            return false;
          }
        },
        options: [
          {
            label: '是',
            value: 1,
          },
          {
            label: '否',
            value: 2,
          },
        ],
      },
    },
    {
      fieldName: 'pdLeader',
      label: '下一节点处理人(PD Leader)',
      component: 'CustomUserSelect',
      componentProps: {
        disabled: true,
        defaultValue: getUserInfo.value.managerId,
      },
    },
    {
      fieldName: 'epm',
      label: 'EPM',
      component: 'CustomUserSelect',
      componentProps: {},
    },
  ];
}
