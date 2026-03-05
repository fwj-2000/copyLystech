<script lang="tsx">
  import type { CSSProperties, PropType } from 'vue';
  import { computed, defineComponent, nextTick, ref, toRaw, unref, watchEffect } from 'vue';
  import type { BasicColumn } from '../../types/table';
  import type { EditRecordRow } from './index';
  import { CheckOutlined, CloseOutlined, FormOutlined } from '@ant-design/icons-vue';
  import { CellComponent } from './CellComponent';
  import { useI18n } from 'vue-i18n';

  import { useDesign } from '/@/hooks/web/useDesign';
  import { useTableContext } from '../../hooks/useTableContext';

  import clickOutside from '/@/directives/clickOutside';

  import { propTypes } from '/@/utils/propTypes';
  import { isArray, isBoolean, isEmpty, isFunction, isNumber, isString } from '/@/utils/is';
  import { createPlaceholderMessage } from './helper';
  import { get, pick, set } from 'lodash-es';
  import { Spin } from 'ant-design-vue';

  export default defineComponent({
    name: 'EditableCell',
    components: { FormOutlined, CloseOutlined, CheckOutlined, CellComponent, Spin },
    directives: {
      clickOutside,
    },
    props: {
      value: {
        type: [String, Number, Boolean, Object] as PropType<string | number | boolean | Recordable>,
        default: '',
      },
      record: {
        type: Object as PropType<EditRecordRow>,
      },
      column: {
        type: Object as PropType<BasicColumn>,
        default: () => ({}),
      },
      index: propTypes.number,
    },
    setup(props) {
      const table = useTableContext();
      const isEdit = ref(false);
      const elRef = ref();
      const ruleVisible = ref(false);
      const ruleMessage = ref('');
      const optionsRef = ref<LabelValueOptions>([]);
      const currentValueRef = ref<any>(props.value);
      const defaultValueRef = ref<any>(props.value);
      const spinning = ref<boolean>(false);

      const { prefixCls } = useDesign('editable-cell');

      const getComponent = computed(() => props.column?.editComponent || 'Input');
      const getRule = computed(() => props.column?.editRule);

      const getRuleVisible = computed(() => {
        return unref(ruleMessage) && unref(ruleVisible);
      });
      const { t } = useI18n();

      const getIsCheckComp = computed(() => {
        const component = unref(getComponent);
        return ['Checkbox', 'Switch'].includes(component);
      });

      const getDisable = computed(() => {
        const { editDynamicDisabled } = props.column;
        let disabled = false;
        if (isBoolean(editDynamicDisabled)) {
          disabled = editDynamicDisabled;
        }
        if (isFunction(editDynamicDisabled)) {
          const { record } = props;
          disabled = editDynamicDisabled({ record, currentValue: currentValueRef.value });
        }
        return disabled;
      });

      const getComponentProps = computed(() => {
        const isCheckValue = unref(getIsCheckComp);
        let compProps = props.column?.editComponentProps ?? ({} as any);
        const { checkedValue, unCheckedValue } = compProps;

        const valueField = isCheckValue ? 'checked' : 'value';
        const val = unref(currentValueRef);

        let value = val;
        if (isCheckValue) {
          if (typeof checkedValue !== 'undefined') {
            value = val === checkedValue ? checkedValue : unCheckedValue;
          } else if (typeof unCheckedValue !== 'undefined') {
            value = val === unCheckedValue ? unCheckedValue : checkedValue;
          } else {
            value = isNumber(val) || isBoolean(val) ? val : !!val;
          }
        }

        const { record, column, index } = props;

        if (isFunction(compProps)) {
          compProps = compProps({ text: val, record, column, index }) ?? {};
        }

        // 用临时变量存储 onChange方法 用于 handleChange方法 获取，并删除原始onChange, 防止存在两个 onChange
        const originOnChange = compProps.onChange || compProps.onChangeTemp;
        if (originOnChange) {
          compProps.onChangeTemp = (...rest) => {
            return originOnChange(...rest, record);
          };
        }
        delete compProps.onChange;

        const component = unref(getComponent);
        const apiSelectProps: Record<string, any> = {};
        compProps.disabled = false;
        if (component === 'ApiSelect') {
          apiSelectProps.cache = true;
          if (compProps?.originParams) {
            const formatParams = {};
            Object.entries(compProps.originParams).forEach(([key, value]) => {
              if (typeof value === 'string' && value.includes('record.')) {
                const [_, field] = value.split('.');
                formatParams[key] = record[field];
              } else {
                formatParams[key] = value;
              }
            });
            compProps.params = formatParams;
          }
          if (compProps.originDefaultLabel) {
            compProps.defaultLabel = record[compProps.originDefaultLabel];
          }
          const { params, api, resultField, memoInputVal, memoInputFormat, nameFormat } = compProps;
          // 修复编辑表格Apiselect重复请求问题
          if (!record.editable) {
            api(params).then(ret => {
              let options;
              if (Array.isArray(ret)) {
                options = ret;
              } else {
                options = get(ret, resultField);
              }
              handleOptionsChange(options);
            });
          }

          // 处理没有options时需要本地的值
          if (memoInputVal && isFunction(memoInputFormat)) {
            const option = toRaw(unref(optionsRef));
            if (option.length === 1 && (option[0]?.label == '' || option?.label == undefined) && option[0]?.isMemorize) {
              const formatList = memoInputFormat(option, record);
              // handleOptionsChange(formatList);
              compProps.options = formatList;
            }
          }
        }
        upEditDynamicDisabled(record, column, value);
        // 新增表格动态disabled
        if (record?.disabled && !isEmpty(record?.disabled)) {
          Object.entries(record.disabled).forEach(([key, value]) => {
            if (column.dataIndex === key) {
              compProps.disabled = typeof value === 'boolean' && value == true ? value : false;
              if (value) {
                compProps.placeholder = compProps.placeholder ?? t('component.basicTable.NotNeedFill');
              } else {
                compProps.placeholder = column.customTitle;
              }
            }
          });
        }
        return {
          size: 'default',
          getPopupContainer: () => unref(table?.wrapRef.value) ?? document.body,
          placeholder: createPlaceholderMessage(unref(getComponent)),
          disabled: unref(getDisable),
          ...apiSelectProps,
          ...compProps,
          [valueField]: value,
        } as any;
      });

      function upEditDynamicDisabled(record, column, value) {
        if (!record) return false;
        const { key, dataIndex } = column;
        if (!key && !dataIndex) return;
        const dataKey = (dataIndex || key) as string;
        set(record, dataKey, value);
      }

      const getValues = computed(() => {
        const { editValueMap } = props.column;

        const value = unref(currentValueRef);

        if (editValueMap && isFunction(editValueMap)) {
          return editValueMap(value);
        }

        const component = unref(getComponent);
        if (!component.includes('Select') && !component.includes('Radio') && !component.includes('ApiSelect') && !component.includes('CustomUserSelect')) {
          return value;
        }

        const componentProps = unref(getComponentProps);

        const options = unref(getComponentProps)?.options ?? (unref(optionsRef) || []);

        if (component.includes('ApiSelect')) {
          const { valueField, nameFormat, labelField } = componentProps;
          const target = options.find(item => {
            return `${item[valueField]}` === `${value}`;
          });
          let label = '';
          if (!target) return value;
          if (nameFormat && nameFormat.length > 0) {
            nameFormat.forEach((field, i) => {
              if (i % 2 === 0) {
                label += get(target, [field]) || '';
              } else {
                label += field;
              }
            });
          } else {
            label = get(target, labelField);
          }
          return label;
        }
        if (component.includes('CustomUserSelect')) {
          // console.log(componentProps, 'CustomUserSelect');
        }
        const option = options.find(item => `${item.value}` === `${value}`);

        return option?.label ?? value;
        // return option?.Name ?? value;
      });

      const getRowEditable = computed(() => {
        const { editable } = props.record || {};
        return !!editable;
      });

      const getWrapperStyle = computed((): CSSProperties => {
        if (unref(getIsCheckComp) || unref(getRowEditable)) {
          return {};
        }
        return {
          width: 'calc(100% - 48px)',
        };
      });

      const getWrapperClass = computed(() => {
        const { align = 'center' } = props.column;
        return `edit-cell-align-${align}`;
      });

      watchEffect(() => {
        currentValueRef.value = props.value;
      });

      watchEffect(() => {
        const { editable } = props.column;
        if (isBoolean(editable) || isBoolean(unref(getRowEditable))) {
          isEdit.value = !!editable || unref(getRowEditable);
        }
      });

      function handleEdit(e) {
        e.stopPropagation();
        if (unref(getRowEditable) || unref(props.column?.editRow) || unref(getDisable)) return;
        ruleMessage.value = '';
        isEdit.value = true;
        nextTick(() => {
          const el = unref(elRef);
          el?.focus?.();
        });
      }

      async function handleChange(e: any, index, ...rest: any[]) {
        const component = unref(getComponent);
        if (!e) {
          currentValueRef.value = e;
        } else if (component === 'Checkbox') {
          currentValueRef.value = e.target.checked;
        } else if (component === 'Switch') {
          currentValueRef.value = e;
        } else if (e?.target && Reflect.has(e.target, 'value')) {
          currentValueRef.value = e.target.value;
        } else if (isString(e) || isBoolean(e) || isNumber(e) || isArray(e)) {
          currentValueRef.value = e;
        }
        const onChange = unref(getComponentProps)?.onChangeTemp;
        if (onChange && isFunction(onChange)) onChange(e, ...rest);

        table.emit?.('edit-change', {
          column: props.column,
          value: unref(currentValueRef),
          record: toRaw(props.record),
          data: { ...rest },
          index,
        });
        handleSubmitRule();
      }

      async function handleSubmitRule() {
        const { column, record } = props;
        const { editRule } = column;
        const currentValue = unref(currentValueRef);

        if (editRule) {
          if (isBoolean(editRule) && !currentValue && !isNumber(currentValue)) {
            ruleVisible.value = true;
            const component = unref(getComponent);
            ruleMessage.value = createPlaceholderMessage(component);
            return false;
          }
          if (isFunction(editRule)) {
            const res = await editRule(currentValue, record);
            if (res) {
              ruleMessage.value = res;
              ruleVisible.value = true;
              return false;
            } else {
              ruleMessage.value = '';
              return true;
            }
          }
        }
        ruleMessage.value = '';
        return true;
      }

      async function handleSubmit(needEmit = true, valid = true) {
        if (valid) {
          const isPass = await handleSubmitRule();
          if (!isPass) return false;
        }

        const { column, index, record } = props;
        if (!record) return false;
        const { key, dataIndex } = column;
        const value = unref(currentValueRef);
        if (!key && !dataIndex) return;

        const dataKey = (dataIndex || key) as string;

        if (!record.editable) {
          const { getBindValues } = table;

          const { beforeEditSubmit, columns, rowKey } = unref(getBindValues);

          const rowKeyParsed = parseRowKey(rowKey, record);

          if (beforeEditSubmit && isFunction(beforeEditSubmit)) {
            spinning.value = true;
            const keys: string[] = columns.map(_column => _column.dataIndex).filter(field => !!field) as string[];

            let result: any = true;
            try {
              result = await beforeEditSubmit({
                record: pick(record, [rowKeyParsed, ...keys]),
                index,
                key: dataKey as string,
                value,
              });
            } catch (e) {
              result = false;
              warn(e);
            } finally {
              spinning.value = false;
            }
            if (result === false) {
              return;
            }
          }
        }
        set(record, dataKey, value);
        defaultValueRef.value = value;
        //const record = await table.updateTableData(index, dataKey, value);
        needEmit && table.emit?.('edit-end', { record, index, key: dataKey, value });
        isEdit.value = false;
      }

      async function handleEnter() {
        if (props.column?.editRow) {
          return;
        }
        handleSubmit();
      }

      function handleSubmitClick() {
        handleSubmit();
      }

      function handleCancel() {
        isEdit.value = false;
        currentValueRef.value = defaultValueRef.value;
        const { column, index, record } = props;
        const { key, dataIndex } = column;
        table.emit?.('edit-cancel', {
          record,
          index,
          key: dataIndex || key,
          value: unref(currentValueRef),
        });
      }

      function onClickOutside() {
        if (props.column?.editable || unref(getRowEditable)) {
          return;
        }
        const component = unref(getComponent);

        if (component.includes('Input')) {
          handleCancel();
        }
      }

      // only ApiSelect or TreeSelect
      function handleOptionsChange(options) {
        const { replaceFields } = unref(getComponentProps);
        const component = unref(getComponent);
        if (component === 'ApiTreeSelect') {
          const { title = 'title', value = 'value', children = 'children' } = replaceFields || {};
          let listOptions = treeToList(options, { children });
          listOptions = listOptions.map(item => {
            return {
              label: item[title],
              value: item[value],
            };
          });
          optionsRef.value = listOptions;
        } else {
          optionsRef.value = options;
        }
      }
      function initCbs(cbs: 'submitCbs' | 'validCbs' | 'cancelCbs', handle) {
        if (props.record) {
          /* eslint-disable  */
          isArray(props.record[cbs]) ? props.record[cbs]?.push(handle) : (props.record[cbs] = [handle]);
        }
      }

      if (props.record) {
        initCbs('submitCbs', handleSubmit);
        initCbs('validCbs', handleSubmitRule);
        initCbs('cancelCbs', handleCancel);

        if (props.column.dataIndex) {
          if (!props.record.editValueRefs) props.record.editValueRefs = {};
          props.record.editValueRefs[props.column.dataIndex as any] = currentValueRef;
        }
        props.record.onCancelEdit = () => {
          isArray(props.record?.cancelCbs) && props.record?.cancelCbs.forEach(fn => fn());
        };
        props.record.onSubmitEdit = async () => {
          if (isArray(props.record?.submitCbs)) {
            if (!props.record?.onValid?.()) return;
            const submitFns = props.record?.submitCbs || [];
            submitFns.forEach(fn => fn(false, false));
            table.emit?.('edit-row-end');
            return true;
          }
        };
      }

      return {
        isEdit,
        prefixCls,
        handleEdit,
        currentValueRef,
        handleSubmit,
        handleChange,
        handleCancel,
        elRef,
        getComponent,
        getRule,
        onClickOutside,
        ruleMessage,
        getRuleVisible,
        getComponentProps,
        handleOptionsChange,
        getWrapperStyle,
        getWrapperClass,
        getRowEditable,
        getValues,
        handleEnter,
        handleSubmitClick,
        spinning,
        getDisable,
      };
    },
    render() {
      return (
        <div class={this.prefixCls}>
          <div v-show={!this.isEdit} class={{ [`${this.prefixCls}__normal`]: true, 'ellipsis-cell': this.column.ellipsis }} onClick={this.handleEdit}>
            <div class='cell-content' title={this.column.ellipsis ? this.getValues ?? '' : ''}>
              {this.column.editRender
                ? this.column.editRender({
                    text: this.value,
                    record: this.record as Recordable,
                    column: this.column,
                    index: this.index,
                    currentValue: this.currentValueRef,
                  })
                : this.getValues ?? '\u00A0'}
            </div>
            {!this.column.editRow && !this.getDisable && <FormOutlined class={`${this.prefixCls}__normal-icon`} />}
          </div>
          {this.isEdit && (
            <Spin spinning={this.spinning} onClick={e => e.stopPropagation()}>
              <div class={`${this.prefixCls}__wrapper`} v-click-outside={this.onClickOutside} onClick={e => e.stopPropagation()}>
                <CellComponent
                  {...this.getComponentProps}
                  component={this.getComponent}
                  style={this.getWrapperStyle}
                  popoverVisible={this.getRuleVisible}
                  rule={this.getRule}
                  ruleMessage={this.ruleMessage}
                  class={this.getWrapperClass}
                  ref='elRef'
                  onChange={(e, data) => {
                    this.handleChange(e, this.index, data);
                  }}
                  onOptionsChange={this.handleOptionsChange}
                  onPressEnter={this.handleEnter}
                />
                {!this.getRowEditable && (
                  <div class={`${this.prefixCls}__action`}>
                    <CheckOutlined class={[`${this.prefixCls}__icon`, 'mx-2']} onClick={this.handleSubmitClick} />
                    <CloseOutlined class={`${this.prefixCls}__icon `} onClick={this.handleCancel} />
                  </div>
                )}
              </div>
            </Spin>
          )}
        </div>
      );
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-editable-cell';

  .edit-cell-align-left {
    text-align: left;

    input:not(.ant-calendar-picker-input, .ant-time-picker-input) {
      text-align: left;
    }
  }

  .edit-cell-align-center {
    text-align: center;

    input:not(.ant-calendar-picker-input, .ant-time-picker-input) {
      text-align: center;
    }
  }

  .edit-cell-align-right {
    text-align: right;

    input:not(.ant-calendar-picker-input, .ant-time-picker-input) {
      text-align: right;
    }
  }

  .edit-cell-rule-popover {
    .ant-popover-inner-content {
      padding: 4px 8px;
      color: @error-color;
      // border: 1px solid @error-color;
      border-radius: 2px;
    }
  }
  .@{prefix-cls} {
    position: relative;
    min-height: 24px; //设置高度让其始终可被hover

    &__wrapper {
      display: flex;
      align-items: center;
      justify-content: center;

      > .ant-select {
        min-width: calc(100% - 50px);
      }
    }

    &__icon {
      &:hover {
        transform: scale(1.2);

        svg {
          color: @primary-color;
        }
      }
    }

    .ellipsis-cell {
      .cell-content {
        overflow-wrap: break-word;
        word-break: break-word;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    &__normal {
      &-icon {
        position: absolute;
        top: 4px;
        right: 0;
        display: none;
        width: 20px;
        cursor: pointer;
      }
    }

    &:hover {
      .@{prefix-cls}__normal-icon {
        display: inline-block;
      }
    }
  }
</style>
