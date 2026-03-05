<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="false"
    okText="保存"
    :showCancelBtn="true"
    title="PCC"
    destroyOnClose
    @ok="handleSubmit"
    class="full-popup p-10px">
    <template #title>
      <!--      <a-space>-->
      <!--        <a-button @click="" danger>引用历史记录</a-button>-->
      <!--        <a-button @click="handleAddTemplate">添加为模版</a-button>-->
      <!--        <a-button @click="" type="primary" ghost>调用模版</a-button>-->
      <!--      </a-space>-->
    </template>
    <template #insertToolbar>
      <a-space :size="10">
        <!--        <a-button @click="handleSubmit('save')" type="primary" ghost>暂存</a-button>-->
        <a-button v-if="mode === 'edit'" @click="handleSubmit('commit')" ghost type="primary">{{ mode === 'view' ? '编辑' : '保存' }}</a-button>
        <a-button v-else @click="handleInvoke" type="primary">调用</a-button>
      </a-space>
    </template>
    <template #appendToolbar>
      <div class="toggle-current">
        <a-button preIcon="icon-ym icon-ym-left" @click="changeCurrent('pre')"></a-button>
        <div class="state-box">
          <span>{{ index + 1 }}</span>
          / {{ cacheList.length }}
        </div>
        <a-button preIcon="icon-ym icon-ym-right" @click="changeCurrent('next')"></a-button>
      </div>
    </template>
    <a-card class="info">
      <Subtitle title="模版信息" />
      <BasicForm @register="registerTemplateInfo"></BasicForm>
    </a-card>
    <div ref="container" class="container-box">
      <div ref="mainContent" class="main-content">
        <ScrollContainer ref="mainScroll" style="margin-top: 39px" class="mb-120px">
          <a-card class="lydc-content-wrapper-search-box p-12px mb-16px" style="border-bottom: 1px solid #dbdbdb">
            <!--            <Subtitle title="基础信息" id="base-info" style="margin-top: 40px" />-->
            <a-row :gutter="20">
              <a-col :span="12">
                <a-row :gutter="20">
                  <a-col :span="12">
                    <Subtitle title="基础信息" id="base-info" />
                    <BasicForm @register="registerBaseInfoForm"></BasicForm>
                  </a-col>
                  <a-col :span="12">
                    <Subtitle title="生产信息" />
                    <BasicForm @register="registerProdInfoForm"></BasicForm>
                  </a-col>
                </a-row>
              </a-col>
              <a-col :span="6">
                <Subtitle title="工艺信息" />
                <BasicForm @register="registerTechnologyForm">
                  <template #addTechnology="{ model, field }">
                    <a-button v-if="state.mode == 'edit'" type="link" @click="handleAddTechnology">
                      <template #icon>
                        <PlusOutlined />
                      </template>
                      步距组号
                    </a-button>
                  </template>
                </BasicForm>
                <ScrollContainer class="technology-box">
                  <a-row :gutter="[5, 0]" v-for="(item, index) in technologyList" class="item-box">
                    <a-col :span="8">{{ index + 1 }}、{{ index === 0 ? '主' : '' }}步距(MM)</a-col>
                    <a-col :span="5">
                      <Input :disabled="mode !== 'edit'" v-model:value="item.stepDistance" placeholder="主步距" />
                    </a-col>
                    <a-col :span="3">模数</a-col>
                    <a-col :span="5">
                      <Input :disabled="mode !== 'edit'" v-model:value="item.modulus" placeholder="模数" />
                    </a-col>
                    <a-col :span="3">
                      <a-button v-if="state.mode == 'edit'" type="link" style="width: 30px" @click="handleDeleteTechnology(index)">
                        <DeleteOutlined />
                      </a-button>
                    </a-col>
                  </a-row>
                </ScrollContainer>
              </a-col>
              <a-col :span="6" class="mold">
                <Subtitle title="模具编号" />
                <a-row style="margin-bottom: 12px">
                  <a-col :span="21">
                    <a-input v-model:value="moldGenerate" :disabled="state.mode !== 'edit'" @keydown.enter.native="handleMoldGenerate" />
                  </a-col>
                  <a-col :span="3">
                    <a-button v-if="state.mode == 'edit'" @click="handleMoldGenerate" type="link">生成 </a-button>
                  </a-col>
                </a-row>
                <ScrollContainer class="scroll-bar">
                  <div class="mold-box content">
                    <div class="to-be-generate" v-for="(item, index) in toBeGenerateList">
                      <div>
                        <div class="item-box">{{ item.code }}</div>
                      </div>
                      <div>
                        <a-button v-if="state.mode == 'edit'" type="link" style="width: 30px" @click="handleDeleteMold(index)">
                          <DeleteOutlined />
                        </a-button>
                      </div>
                    </div>
                  </div>
                  <!--                  <a-row>-->
                  <!--                    <div v-for="(item, index) in toBeGenerateListLeft"></div>-->
                  <!--                  </a-row>-->
                </ScrollContainer>
              </a-col>
            </a-row>
          </a-card>
          <a-card class="lydc-content-wrapper-search-box p-12px" style="border-bottom: 1px solid #dbdbdb; margin-top: 10px">
            <div class="material">
              <div style="display: flex; flex-direction: row; align-items: center">
                <Subtitle title="工艺流程" id="process-flow" />
                <BasicForm @register="registerTechnologyTableForm"></BasicForm>
              </div>
              <AddCustomRows v-if="mode == 'edit'" :defaultValue="2" @submit="handleChangeTechnology('add', { rows: $event })" />
            </div>
            <div>
              <BasicTable @register="registerTechnologyEditTable">
                <template #bodyCell="{ column, record, index }">
                  <template v-if="column.dataIndex === 'stepDistanceNumber'">
                    <a-select v-model:value="record[column.dataIndex]">
                      <a-select-option v-for="(item, index) in technologyList" :key="index" :value="index">
                        {{ `${index + 1}` }}
                      </a-select-option>
                    </a-select>
                  </template>
                  <template v-else-if="column.dataIndex === 'action'">
                    <TableAction :actions="getTechnologyTableActions(index, record)" />
                  </template>
                </template>
                <template #summary>
                  <a-table-summary fixed="bottom">
                    <a-table-summary-row>
                      <a-table-summary-cell :index="0" :col-span="2">合计: </a-table-summary-cell>
                      <!--                      <a-table-summary-cell :index="4">{{ getTechnologyDataSource().reduce((acc, curr) => acc + curr.adjustmentTime || 0); }}-->
                      <!--                      </a-table-summary-cell>-->
                      <a-table-summary-cell :index="4" :col-span="3"
                        >{{
                          getTechnologyDataSource()
                            .reduce((pre, next) => {
                              pre += Number(next.adjustmentTime || 0);
                              return pre;
                            }, 0)
                            .toFixed(2)
                        }}
                      </a-table-summary-cell>
                      <a-table-summary-cell :index="4"
                        >{{
                          getTechnologyDataSource()
                            .reduce((pre, next) => {
                              pre += Number(next.defectRate || 0);
                              return pre;
                            }, 0)
                            .toFixed(2)
                        }}%
                      </a-table-summary-cell>
                    </a-table-summary-row>
                  </a-table-summary>
                </template>
              </BasicTable>
            </div>
          </a-card>
          <a-card class="lydc-content-wrapper-search-box p-12px" style="border-bottom: 1px solid #dbdbdb; margin-top: 10px">
            <div class="material">
              <Subtitle title="材料" id="material" />
              <AddCustomRows v-if="mode == 'edit'" :defaultValue="2" @submit="handleChangeMaterial('add', { rows: $event })" />
            </div>
            <div>
              <BasicTable @register="registerMaterialEditTable">
                <template #bodyCell="{ column, record, index, text }">
                  <template v-if="column.dataIndex === 'stepDistanceNumber'">
                    <template v-if="mode === 'edit'">
                      <a-select v-model:value="record[column.dataIndex]" @change="handleTechnologyChange($event, record)">
                        <a-select-option v-for="(item, index) in technologyList" :key="index" :value="index">
                          {{ `${index + 1}` }}
                        </a-select-option>
                      </a-select>
                    </template>

                    <template v-else>{{ record[column.dataIndex] + 1 }}</template>
                  </template>
                  <template v-else-if="column.dataIndex === 'processCode'">
                    <template v-if="mode === 'edit'">
                      <a-select v-model:value="record[column.dataIndex]">
                        <a-select-option v-for="(item, index) in getTechnologyDataSource()" :key="index" :value="`${index + 1}`">
                          {{ index + 1 }}、{{ item.processName || '工序' }}
                        </a-select-option>
                      </a-select>
                    </template>
                  </template>
                  <template v-else-if="column.dataIndex === 'action'">
                    <TableAction :actions="getMaterialTableActions(index, record)" />
                  </template>
                </template>
              </BasicTable>
            </div>
          </a-card>

          <a-card class="lydc-content-wrapper-search-box p-12px" style="border-bottom: 1px solid #dbdbdb; margin-top: 10px">
            <Package ref="packageRef" mode="view" />
          </a-card>
          <div class="detail-wrapper">
            <div class="left-detail">
              <BasicTable @register="registerTechnologyDetailTable">
                <template #bodyCell="{ column, record, index, text }">
                  <template v-if="column.dataIndex === 'processCode'"> {{ index + 1 }}、{{ record.processName }}</template>
                  <!--                      <template v-else-if="column.dataIndex === 'description' && record.processCode?.startsWith('5')">-->
                  <!--                        <div class="custom-wrapper">-->
                  <!--                          <div class="box">-->
                  <!--                            <div class="item" v-for="(item, i) in record.manualPackagingList">-->
                  <!--                              <a-input-group compact>-->
                  <!--                                <lydc-input-number-->
                  <!--                                  placeholder="包装数量"-->
                  <!--                                  @change="-->
                  <!--                                    e => {-->
                  <!--                                      if (regex.test(e)) {-->
                  <!--                                        item.qty = e;-->
                  <!--                                      } else {-->
                  <!--                                        return;-->
                  <!--                                      }-->
                  <!--                                    }-->
                  <!--                                  "-->
                  <!--                                  :disabled="mode !== 'edit'"-->
                  <!--                                  :value="item.qty"-->
                  <!--                                  style="width: 100px" />-->
                  <!--                                <ApiSelect-->
                  <!--                                  placeholder="包装单位"-->
                  <!--                                  :api="getUnitListByKeyword"-->
                  <!--                                  :show-search="true"-->
                  <!--                                  :api-search="{-->
                  <!--                                    show: true,-->
                  <!--                                    searchName: 'keyword',-->
                  <!--                                  }"-->
                  <!--                                  :disabled="mode !== 'edit'"-->
                  <!--                                  style="min-width: 100px; border-right: 0"-->
                  <!--                                  result-field="data"-->
                  <!--                                  :filter-option="false"-->
                  <!--                                  not-found-content="null"-->
                  <!--                                  :immediate="false"-->
                  <!--                                  v-model:value="item.unit"-->
                  <!--                                  label-field="Name"-->
                  <!--                                  value-field="Code"-->
                  <!--                                  :name-format="['Name', '(', 'Code', ')']" />-->
                  <!--                              </a-input-group>-->
                  <!--                              <div class="img-box" @click.stop="handleDeteleManualPackaging(record, i)">-->
                  <!--                                <img style="width: 12px; height: 14px" :src="DeleteSvg" alt="删除" />-->
                  <!--                              </div>-->
                  <!--                            </div>-->
                  <!--                          </div>-->
                  <!--                          <div class="right-btn">-->
                  <!--                            &lt;!&ndash;                            <a-button :disabled="record?.manualPackagingList?.length >= 2" type="link" @click="handleAddHandWorkProcess(record, index)">&ndash;&gt;-->
                  <!--                            <a-button type="link" @click="handleAddHandWorkProcess(record, index)">-->
                  <!--                              <template #icon>-->
                  <!--                                <PlusOutlined />-->
                  <!--                              </template>-->
                  <!--                              包装-->
                  <!--                            </a-button>-->
                  <!--                          </div>-->
                  <!--                        </div>-->
                  <!--                      </template>-->
                  <template v-else-if="column.dataIndex === 'imageList'">
                    <ImageUpload
                      :disabled="mode !== 'edit'"
                      :api="uploadPCCImg"
                      width="120px"
                      height="120px"
                      :value="record.imageList"
                      style="min-height: 115px; margin-bottom: 0"
                      :maxNumber="3"
                      @change="handleFileChange($event, index, record)" />
                  </template>
                </template>
              </BasicTable>
            </div>
            <!--                <div class="right-detail">-->
            <!--                  <Subtitle title="资料上传" />-->
            <!--                  <a-row style="align-items: center">-->
            <!--                    <a-col :span="3">-->
            <!--                      <div class="agn-center">装机图:</div>-->
            <!--                    </a-col>-->
            <!--                    <a-col :span="18">-->
            <!--                      <div v-if="installImageList.length > 0"-->
            <!--                           class="message"-->
            <!--                      >-->
            <!--                        <div class="name">{{ installImageList[0]?.fileName }}</div>-->
            <!--                        <i @click="downloadInstallFile"-->
            <!--                           class="icon-ym icon-ym-btn-download"-->
            <!--                           style="color: #ff7b00; cursor: pointer"-->
            <!--                        ></i>-->
            <!--                      </div>-->
            <!--                      <div v-else>-->
            <!--                        <div class="message"-->
            <!--                             style="color: #dbdbdb"-->
            <!--                        >请上传文件-->
            <!--                        </div>-->
            <!--                      </div>-->
            <!--                    </a-col>-->
            <!--                    <a-col :span="3"-->
            <!--                           style="display: flex; justify-content: flex-end"-->
            <!--                    >-->
            <!--                      <a-upload v-feature :multiple="false"-->
            <!--                                :before-upload="beforeInstallUpload"-->
            <!--                                :showUploadList="false"-->
            <!--                      >-->
            <!--                        <a-button :disabled="mode !== 'edit'"-->
            <!--                                  class="agn-center"-->
            <!--                                  style="text-align: right"-->
            <!--                        >上传-->
            <!--                        </a-button>-->
            <!--                      </a-upload>-->
            <!--                    </a-col>-->
            <!--                  </a-row>-->
            <!--                  <div class="engine-upload-wrapper"-->
            <!--                       v-if="state.bomType != 4"-->
            <!--                  >-->
            <!--                    <div class="engine-upload">-->
            <!--                      <Subtitle title="工程图纸" />-->
            <!--                    </div>-->
            <!--                    <div class="upload-wrapper-item">-->
            <!--                      <a-upload v-feature class="btn-upload"-->
            <!--                                :multiple="true"-->
            <!--                                v-bind="customerUploadOption"-->
            <!--                      ></a-upload>-->
            <!--                      <a-upload-dragger v-feature-->
            <!--                        :multiple="true"-->
            <!--                        :disabled="mode !== 'edit' || customerFileList.findIndex(item => item.status == 1) !== -1"-->
            <!--                        :class="customerState.uploadStatus === UploadStatus.Error ? 'upload-pic upload-error' : 'upload-pic'"-->
            <!--                        v-bind="customerUploadOption"-->
            <!--                      >-->
            <!--                        &lt;!&ndash;    上传前      &ndash;&gt;-->
            <!--                        <template v-if="customerState.uploadStatus === UploadStatus.BeforeUploading">-->
            <!--                          <div v-if="state.customerFileList.length <= 0"-->
            <!--                               class="before-box"-->
            <!--                          > 可直接将文件拖拽到此处上传-->
            <!--                          </div>-->
            <!--                          <div v-else>-->
            <!--                            <a-table :data-source="state.customerFileList"-->
            <!--                                     bordered-->
            <!--                                     :columns="engineColumns"-->
            <!--                                     :pagination="false"-->
            <!--                                     class="pic-list"-->
            <!--                            >-->
            <!--                              <template #bodyCell="{ column, record, text, index }">-->
            <!--                                <template v-if="column.dataIndex === 'flagVersion'"> T{{ record.flagVersion }}</template>-->
            <!--                                <template v-else-if="column.dataIndex === 'status'">-->
            <!--                                  &lt;!&ndash;                                  <template v-if="record.flagVersion == 0">&ndash;&gt;-->
            <!--                                  &lt;!&ndash;                                    <a-tag>已上传</a-tag>&ndash;&gt;-->
            <!--                                  &lt;!&ndash;                                  </template>&ndash;&gt;-->
            <!--                                  <template v-if="record.status == 1">-->
            <!--                                    <LydcTag style="min-width: 70px"-->
            <!--                                             theme="gray"-->
            <!--                                    >{{ record.flagVersion == 0 ? "已上传" : "" }} 待审核-->
            <!--                                    </LydcTag>-->
            <!--                                  </template>-->
            <!--                                  <template v-if="record.status == 2">-->
            <!--                                    <LydcTag style="min-width: 70px"-->
            <!--                                             theme="green"-->
            <!--                                    >{{ record.flagVersion == 0 ? "已上传" : "" }} 启用-->
            <!--                                    </LydcTag>-->
            <!--                                  </template>-->
            <!--                                  <template v-if="record.status == 3">-->
            <!--                                    <LydcTag style="min-width: 70px"-->
            <!--                                             theme="red"-->
            <!--                                    >{{ record.flagVersion == 0 ? "已上传" : "" }} 失效-->
            <!--                                    </LydcTag>-->
            <!--                                  </template>-->
            <!--                                </template>-->
            <!--                                <template v-else-if="column.dataIndex === 'name'">-->
            <!--                                  <a style="width: 120px"-->
            <!--                                     @click.stop="handlePreview(record)"-->
            <!--                                  >{{ record.name }}</a>-->
            <!--                                </template>-->
            <!--                                <template v-else-if="column.dataIndex === 'action'">-->
            <!--                                  <a-button type="link"-->
            <!--                                            :disabled="record.flagVersion == 0"-->
            <!--                                            @click.stop="handleDownload(record)"-->
            <!--                                  >下载-->
            <!--                                  </a-button>-->
            <!--                                </template>-->
            <!--                                <template v-else-if="column.dataIndex === 'delete'">-->
            <!--                                  <a-button type="link"-->
            <!--                                            :disabled="record.flagVersion != 0"-->
            <!--                                            @click.stop="handleDeletePic(index)"-->
            <!--                                  >删除-->
            <!--                                  </a-button>-->
            <!--                                </template>-->
            <!--                              </template>-->
            <!--                            </a-table>-->
            <!--                          </div>-->
            <!--                        </template>-->
            <!--                        &lt;!&ndash;    上传中      &ndash;&gt;-->
            <!--                        <template v-if="customerState.uploadStatus === UploadStatus.Uploading">-->
            <!--                          &lt;!&ndash;              <template v-if="state.uploadStatus === UploadStatus.BeforeUploading">&ndash;&gt;-->
            <!--                          <div class="uploading">-->
            <!--                            <a-progress style="width: 80%"-->
            <!--                                        :percent="customerState.procedure"-->
            <!--                                        size="small"-->
            <!--                            />-->
            <!--                          </div>-->
            <!--                        </template>-->
            <!--                        &lt;!&ndash;    上传失败      &ndash;&gt;-->
            <!--                        <template v-if="customerState.uploadStatus === UploadStatus.Error">-->
            <!--                          <div class="error-info">-->
            <!--                            <p class="filename flex ct-start">-->
            <!--                              {{ customerState.uploadFileInfo.name }}-->
            <!--                              <img :src="errorSvg"-->
            <!--                                   style="margin-left: 12px"-->
            <!--                              />-->
            <!--                            </p>-->
            <!--                            <p class="info">文件大小： {{ formatFileSize(customerState.uploadFileInfo.size || 0) }}</p>-->
            <!--                            <p class="info"-->
            <!--                               style="margin-bottom: 0"-->
            <!--                            >上传日期： {{ dayjs().tz().format("YYYY/MM/DD HH:mm:ss") }}</p>-->
            <!--                            <div class="btn-container">-->
            <!--                              <a-upload v-feature v-bind="customerUploadOption">-->
            <!--                                &lt;!&ndash;                    <a-button>重新选择</a-button>&ndash;&gt;-->
            <!--                              </a-upload>-->
            <!--                              <a-button danger-->
            <!--                                        style="margin-left: 20px"-->
            <!--                                        @click="handleRemoveCustomerFile"-->
            <!--                              >删除-->
            <!--                              </a-button>-->
            <!--                            </div>-->
            <!--                          </div>-->
            <!--                        </template>-->
            <!--                        &lt;!&ndash;    上传成功      &ndash;&gt;-->
            <!--                        <template v-if="customerState.uploadStatus === UploadStatus.Success">-->
            <!--                          <div class="error-info">-->
            <!--                            <div style="display: flex; flex-direction: row; align-items: center; margin-bottom: 10px">-->
            <!--                              <img :src="successSvg"-->
            <!--                                   style="height: 22px; margin-right: 12px"-->
            <!--                              />-->
            <!--                              <div class="info"-->
            <!--                                   style="margin-bottom: 0"-->
            <!--                              >上传成功-->
            <!--                              </div>-->
            <!--                            </div>-->
            <!--                            <p class="info"-->
            <!--                               style="margin-bottom: 0"-->
            <!--                            >上传日期： {{ dayjs().tz().format("YYYY/MM/DD HH:mm:ss") }}</p>-->
            <!--                            <div class="btn-container">-->
            <!--                              <a-button ghost-->
            <!--                                        type="primary"-->
            <!--                                        style="margin-left: 20px"-->
            <!--                                        @click="handleRemoveCustomerFile"-->
            <!--                              >继续上传-->
            <!--                              </a-button>-->
            <!--                            </div>-->
            <!--                          </div>-->
            <!--                        </template>-->
            <!--                      </a-upload-dragger>-->
            <!--                    </div>-->
            <!--                  </div>-->
            <!--                  <div v-else-->
            <!--                       class="engine-upload-wrapper"-->
            <!--                  >-->
            <!--                    <div class="engine-upload">-->
            <!--                      <Subtitle title="样品图纸" />-->
            <!--                    </div>-->
            <!--                    <div class="upload-wrapper-item">-->
            <!--                      <a-upload v-feature class="btn-upload"-->
            <!--                                :multiple="true"-->
            <!--                                v-bind="customerUploadOption"-->
            <!--                      ></a-upload>-->
            <!--                      <a-upload-dragger v-feature-->
            <!--                        :multiple="true"-->
            <!--                        :disabled="mode !== 'edit' || customerFileList.findIndex(item => item.status == 1) !== -1"-->
            <!--                        :class="customerState.uploadStatus === UploadStatus.Error ? 'upload-pic upload-error' : 'upload-pic'"-->
            <!--                        v-bind="customerUploadOption"-->
            <!--                      >-->
            <!--                        &lt;!&ndash;    上传前      &ndash;&gt;-->
            <!--                        <template v-if="customerState.uploadStatus === UploadStatus.BeforeUploading">-->
            <!--                          <div v-if="state.customerFileList.length <= 0"-->
            <!--                               class="before-box"-->
            <!--                          > 可直接将文件拖拽到此处上传-->
            <!--                          </div>-->
            <!--                          <div v-else>-->
            <!--                            <a-table :data-source="state.customerFileList"-->
            <!--                                     bordered-->
            <!--                                     :columns="sampleColumns"-->
            <!--                                     :pagination="false"-->
            <!--                                     class="pic-list"-->
            <!--                            >-->
            <!--                              <template #bodyCell="{ column, record, text, index }">-->
            <!--                                <template v-if="column.dataIndex === 'name'">-->
            <!--                                  <a @click.stop="handlePreview(record)">{{ record.name }}</a>-->
            <!--                                </template>-->
            <!--                                <template v-else-if="column.dataIndex === 'delete'">-->
            <!--                                  <a-button type="link"-->
            <!--                                            :disabled="record.flagVersion != 0"-->
            <!--                                            @click.stop="handleDeletePic(index)"-->
            <!--                                  >删除-->
            <!--                                  </a-button>-->
            <!--                                </template>-->
            <!--                              </template>-->
            <!--                            </a-table>-->
            <!--                          </div>-->
            <!--                        </template>-->
            <!--                        &lt;!&ndash;    上传中      &ndash;&gt;-->
            <!--                        <template v-if="customerState.uploadStatus === UploadStatus.Uploading">-->
            <!--                          &lt;!&ndash;              <template v-if="state.uploadStatus === UploadStatus.BeforeUploading">&ndash;&gt;-->
            <!--                          <div class="uploading">-->
            <!--                            <a-progress style="width: 80%"-->
            <!--                                        :percent="customerState.procedure"-->
            <!--                                        size="small"-->
            <!--                            />-->
            <!--                          </div>-->
            <!--                        </template>-->
            <!--                        &lt;!&ndash;    上传失败      &ndash;&gt;-->
            <!--                        <template v-if="customerState.uploadStatus === UploadStatus.Error">-->
            <!--                          <div class="error-info">-->
            <!--                            <p class="filename flex ct-start">-->
            <!--                              {{ customerState.uploadFileInfo.name }}-->
            <!--                              <img :src="errorSvg"-->
            <!--                                   style="margin-left: 12px"-->
            <!--                              />-->
            <!--                            </p>-->
            <!--                            <p class="info">文件大小： {{ formatFileSize(customerState.uploadFileInfo.size || 0) }}</p>-->
            <!--                            <p class="info"-->
            <!--                               style="margin-bottom: 0"-->
            <!--                            >上传日期： {{ dayjs().tz().format("YYYY/MM/DD HH:mm:ss") }}</p>-->
            <!--                            <div class="btn-container">-->
            <!--                              <a-upload v-feature v-bind="customerUploadOption">-->
            <!--                                &lt;!&ndash;                    <a-button>重新选择</a-button>&ndash;&gt;-->
            <!--                              </a-upload>-->
            <!--                              <a-button danger-->
            <!--                                        style="margin-left: 20px"-->
            <!--                                        @click="handleRemoveCustomerFile"-->
            <!--                              >删除-->
            <!--                              </a-button>-->
            <!--                            </div>-->
            <!--                          </div>-->
            <!--                        </template>-->
            <!--                        &lt;!&ndash;    上传成功      &ndash;&gt;-->
            <!--                        <template v-if="customerState.uploadStatus === UploadStatus.Success">-->
            <!--                          <div class="error-info">-->
            <!--                            <div style="display: flex; flex-direction: row; align-items: center; margin-bottom: 10px">-->
            <!--                              <img :src="successSvg"-->
            <!--                                   style="height: 22px; margin-right: 12px"-->
            <!--                              />-->
            <!--                              <div class="info"-->
            <!--                                   style="margin-bottom: 0"-->
            <!--                              >上传成功-->
            <!--                              </div>-->
            <!--                            </div>-->
            <!--                            <p class="info"-->
            <!--                               style="margin-bottom: 0"-->
            <!--                            >上传日期： {{ dayjs().tz().format("YYYY/MM/DD HH:mm:ss") }}</p>-->
            <!--                            <div class="btn-container">-->
            <!--                              <a-button ghost-->
            <!--                                        type="primary"-->
            <!--                                        style="margin-left: 20px"-->
            <!--                                        @click="handleRemoveCustomerFile"-->
            <!--                              >继续上传-->
            <!--                              </a-button>-->
            <!--                            </div>-->
            <!--                          </div>-->
            <!--                        </template>-->
            <!--                      </a-upload-dragger>-->
            <!--                    </div>-->
            <!--                  </div>-->
            <!--                </div>-->
          </div>
        </ScrollContainer>
      </div>
    </div>
    <Preview ref="filePreviewRef" />
  </BasicPopup>
  <!--  <SaveTemplateModal @register="registerSaveTemplateForm" />-->
</template>
<script setup lang="ts">
  import { BasicPopup, usePopupInner } from '/@/components/Popup';
  import { Subtitle } from '/@/components/Subtitle';
  import { ScrollContainer } from '/@/components/Container';
  import { nextTick, reactive, ref, toRaw, toRefs, unref } from 'vue';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import { getChangeHistoryColumns, materialRowData, technologyRowData } from '/@/views/engineering/pcc/pccApply/CONFIG';
  import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
  import Input from '/@/components/Lydc/Input/src/Input.vue';
  import { cloneDeep } from 'lodash-es';
  import { useMessage } from '/@/hooks/web/useMessage';
  import AddCustomRows from './AddCustomRows.vue';
  import BasicTable from '/@/components/Table/src/BasicTable.vue';
  import { ActionItem, BasicColumn, TableAction, useTable } from '/@/components/Table';
  import { buildUUID } from '/@/utils/uuid';
  import { getProcessAllList, getProcessParaList } from '/@/api/engineering/quotatios';
  import { getUnitListByKeyword } from '/@/api/finance/materialPrice';
  import { getFactoryList } from '/@/api/business/shippingspace';
  import { useBaseStore } from '/@/store/modules/base';
  import {
    getBomDetail,
    getBomStructure,
    getFactorySap,
    getMaterialSearchByShortCode,
    getPccDetail,
    getPccRevisionHistory,
    getProductType,
    getTemplatePage,
    updateFinishedPartsBomPcc,
    uploadInstallFile,
  } from '/@/api/engineering/pcc';
  import { downloadByUrl } from '/@/utils/file/download';
  import { UploadStatus } from '/@/views/basicData/productCodeApply/types';
  import { message, UploadFile } from 'ant-design-vue';
  import { getSapFactoryList } from '/@/api/purchase/supplierInformation';
  import Preview from './Preview.vue';
  import { useModal } from '/@/components/Modal';
  import Package from '/@/views/engineering/pcc/pccApply/components/Package.vue';
  import { useUserStore } from '/@/store/modules/user';
  import { uploadPCCImg } from '/@/api/sys/upload';
  import errorSvg from '/@/assets/svg/report/error.svg';
  import successSvg from '/@/assets/svg/report/success.svg';
  import { formatFileSize } from '/@/utils/file/base64Conver';
  import dayjs from 'dayjs';
  import { ImageUpload } from '/@/components/Upload';

  const baseStore = useBaseStore();
  const { createMessage } = useMessage();
  // const [registerSaveTemplateForm, { openModal: openSaveTemplateFormModal }] = useModal();
  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const emit = defineEmits(['reload', 'register']);

  const userStore = useUserStore();

  const divider = ref(null);
  const container = ref(null);
  const bomContent = ref(null);
  const mainContent = ref(null);
  const navBox = ref(null);
  const mainScroll = ref(null);
  const packageRef = ref(null);

  const customerState = reactive({
    procedure: 1,
    uploadStatus: UploadStatus.BeforeUploading,
    uploadFileInfo: {} as UploadFile,
  });

  const customerUpload = async info => {
    customerState.procedure = 1;
    const interval = setInterval(() => {
      if (customerState.procedure >= 99) return clearInterval(interval);
      customerState.procedure += 1;
    }, 100);
    try {
      customerState.uploadFileInfo = info.file;
      console.log(info.file);
      // customerState.uploadStatus = UploadStatus.Uploading;
      // const { msg } = await uploadCustomerDrawings(state.Id, { file: info.file });
      // message.success(msg);
      const params = {
        file: info.file,
        filePath: 'PCC',
      };
      const {
        data: { filePath },
      } = await uploadInstallFile(params);
      console.log(filePath);
      state.customerFileList.forEach(item => {
        if (item.name === info.file.name) {
          console.log(item);
          item.flagPath = filePath;
        }
      });

      console.log(state.customerFileList);
      // 上传成功
      // customerState.procedure = 100;
      // customerState.uploadStatus = UploadStatus.Success;
    } catch (e) {
      customerState.uploadStatus = UploadStatus.Error;
    } finally {
      clearInterval(interval);
    }
  };

  function beforeUpload(file, fileList) {
    if (state.customerFileList.find(item => item.status == 1)) return false;
    customerState.uploadStatus = UploadStatus.BeforeUploading;
    const { customerFileList } = state;
    let flag = false;
    fileList.map(file => {
      if (!customerFileList.find(item => item.uid == file.uid || item.name == file.name)) {
        file.flagVersion = 0;
        customerFileList.unshift(file);
        flag = true;
      }
      console.log(customerFileList);
    });
    return flag;
  }

  const customerUploadOption = {
    name: 'file',
    showUploadList: false,
    customRequest: customerUpload,
    beforeUpload: beforeUpload,
  };

  const { createConfirm } = useMessage();

  let isDragging = false;

  const technologyItem = {
    stepDistance: '',
    modulus: '',
  };
  const filePreviewRef = ref<any | null>(null);
  const state = reactive({
    bomType: '',
    doNotTemplate: '',
    showSubmit: '',
    showReject: false,
    showReview: false,
    mode: 'view',
    showDialog: false,
    customerFileList: [],
    cacheList: [],
    index: 0,
    installImageList: [],
    treeData: [],
    navIndex: 0,
    isPack: true,
    technologyList: [
      {
        stepDistance: '',
        modulus: '',
      },
    ],
    moldGenerate: '',
    toBeGenerateList: [],
    bomId: '',
    halfSign: '',
  });

  const {
    customerFileList,
    showSubmit,
    showReject,
    showReview,
    treeData,
    isPack,
    navIndex,
    installImageList,
    technologyList,
    moldGenerate,
    toBeGenerateList,
    cacheList,
    index,
    mode,
  } = toRefs(state);

  const [
    registerBaseInfoForm,
    {
      setFieldsValue: setBaseInfoFieldsValue,
      validateFields: validateBaseInfoFields,
      resetFields: resetBaseInfoFields,
      updateSchema: updateBaseInfoSchema,
      getFieldsValue: getBaseInfoFieldsValue,
      setProps: setBaseInfoProps,
    },
  ] = useForm({
    schemas: getBaseInfoFormSchema(),
    layout: 'horizontal',
    // labelWidth: 90,
    baseColProps: {
      span: 24,
    },
  });
  const [
    registerTechnologyTableForm,
    {
      setFieldsValue: setTechnologyTableFieldsValue,
      validateFields: validateTechnologyTableFields,
      updateSchema: updateTechnologyTableSchema,
      getFieldsValue: getTechnologyTableFieldsValue,
      setProps: setTechnologyTableFieldsProps,
    },
  ] = useForm({
    schemas: getTechnologyTableFormSchema(),
    layout: 'horizontal',
    baseColProps: {
      span: 8,
    },
    // labelWidth: 120,
    labelAlign: 'right',
  });

  function beforeInstallUpload(file) {
    console.log(file);
    const params = {
      file: file,
      filePath: 'PCC',
    };
    uploadInstallFile(params)
      .then(({ code, msg, data }) => {
        if (code == 200) {
          state.installImageList = [data];
          createMessage.success(msg);
        }
      })
      .catch(() => {
        changeLoading(false);
      });

    // 使用 axios 或者其他的 HTTP 库上传文件
    // axios.post(uploadPCCImg, formData, {
    //   headers: { "Content-Type": "multipart/form-data" }  // 重要的步骤，设置请求头
    // }).then(response => {
    //   // 处理上传后的操作
    //   console.log(response);
    // });

    // 返回 false，阻止自动上传
    return false;
  }

  function downloadInstallFile() {
    console.log('downloadInstallFile');
    downloadByUrl({
      url: state.installImageList[0].filePath,
      target: '_blank',
      fileName: state.installImageList[0].fileName,
    });
  }

  const [
    registerProdInfoForm,
    {
      setFieldsValue: setProdInfoFieldsValue,
      validateFields: validateProdInfoFields,
      resetFields: resetProdInfoFields,
      updateSchema: updateProdInfoSchema,
      getFieldsValue: getProdInfoFieldsValue,
      setProps: setProdInfoProps,
    },
  ] = useForm({
    schemas: getProdInfoFormSchema(),
    layout: 'horizontal',
    baseColProps: {
      span: 24,
    },
  });

  const [
    registerTechnologyForm,
    {
      setFieldsValue: setTechnologyFieldsValue,
      validateFields: validateTechnologyFields,
      resetFields: resetTechnologyFields,
      updateSchema: updateTechnologySchema,
      getFieldsValue: getTechnologyFieldsValue,
      setProps: setTechnologyProps,
    },
  ] = useForm({
    schemas: getTechnologyFormSchema(),
    layout: 'horizontal',
    baseColProps: {
      span: 24,
    },
  });

  const [
    registerTemplateInfo,
    {
      setFieldsValue: setTemplateFieldsValue,
      validateFields: validateTemplateFields,
      resetFields: resetTemplateFields,
      updateSchema: updateTemplateSchema,
      getFieldsValue: getTemplateFieldsValue,
      setProps: setTemplateProps,
    },
  ] = useForm({
    schemas: getTemplateFormSchema(),
    layout: 'horizontal',
    baseColProps: {
      span: 12,
    },
  });
  // 材料
  const [
    registerMaterialEditTable,
    {
      setTableData: setMaterTableData,
      setProps: setMaterialTableProps,
      getDataSource: getMaterialDataSource,
      updateTableDataRecord: updateMaterialTableDataRecord,
      insertTableDataRecord: insertMaterialTableDataRecord,
      deleteTableDataRecord: deleteMaterialTableDataRecord,
    },
  ] = useTable({
    columns: getMaterialColumns(),
    pagination: false,
    showTableSetting: false,
    striped: true,
    rowKey: 'uuid',
    isCanResizeParent: true,
    canResize: false,
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
    },
  });

  function getMaterialTableActions(index, record): ActionItem[] {
    return [
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-btn-add',
        onClick: handleChangeMaterial.bind(null, 'addBaseIndex', { index }),
      },
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-btn-copy',
        onClick: handleChangeMaterial.bind(null, 'copy', { index }),
      },
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          onOk: handleChangeMaterial.bind(null, 'delete', { uuid: record.uuid }),
        },
      },
    ];
  }

  function getTechnologyFormSchema(): FormSchema[] {
    return [
      {
        field: 'numberOfKnives',
        label: '模切刀数',
        component: 'InputNumber',
        componentProps: {
          placeholder: '模切刀数',
          onChange: numberOfKnives => {
            const { process } = getTechnologyFieldsValue();
            calcNumberOfKnives(numberOfKnives, process);
          },
        },
      },
      {
        field: 'process',
        label: '生产工艺',
        component: 'ApiSelect',
        componentProps: {
          placeholder: '生产工艺',
          api: () => {
            return baseStore.getDictionaryData('PCC.ProcessType', true);
          },
          labelField: 'fullName',
          valueField: 'enCode',
          onChange: process => {
            const { numberOfKnives } = getTechnologyFieldsValue();
            calcNumberOfKnives(numberOfKnives, process);
            console.log(process, 'process');
            const list = getTechnologyDataSource();
            if (process == 1) {
              // 平板
              list.forEach(item => {
                const { editValueRefs, processCode } = item;
                if (!processCode) return;
                if (processCode.startsWith('2') || processCode.startsWith('3')) editValueRefs.speedUnit = 'K/H';
              });
            } else if (process == 2) {
              // 圆刀
            } else {
              // 其他
            }
          },
        },
      },
      {
        field: 'processCode',
        label: '工艺代码',
        component: 'Input',
        componentProps: { placeholder: '工艺代码' },
      },
      {
        field: 'adjustmentMetres',
        label: '调机米数',
        component: 'InputNumber',
        componentProps: {
          placeholder: '调机米数',
        },
        colProps: {
          span: 16,
        },
      },
      {
        field: 'addTechnology',
        label: '',
        component: 'Input',
        slot: 'addTechnology',
        colProps: {
          span: 8,
        },
      },
    ];
  }

  // 工艺流程
  const [
    registerTechnologyEditTable,
    {
      setTableData: setTechnologyTableData,
      setProps: setTechnologyTableProps,
      getDataSource: getTechnologyDataSource,
      setCacheColumnsByField: setTechnologyCacheColumnsByField,
      updateTableDataRecord: updateTechnologyTableDataRecord,
      updateTableData: updateTechnologyTableData,
      insertTableDataRecord: insertTechnologyTableDataRecord,
      deleteTableDataRecord: deleteTechnologyTableDataRecord,
    },
  ] = useTable({
    columns: getTechnologyColumns(),
    pagination: false,
    showTableSetting: false,
    striped: true,
    isCanResizeParent: true,
    canResize: false,
    rowKey: 'uuid',
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
    },
  });

  function getTechnologyTableActions(index, record): ActionItem[] {
    return [
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-btn-add',
        onClick: handleChangeTechnology.bind(null, 'addBaseIndex', { index }),
      },
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-btn-copy',
        onClick: handleChangeTechnology.bind(null, 'copy', { index }),
      },
      {
        label: '',
        color: 'error',
        icon: 'icon-ym icon-ym-delete',
        modelConfirm: {
          onOk: handleChangeTechnology.bind(null, 'delete', { uuid: record.uuid }),
        },
      },
    ];
  }

  // 工艺流程
  const [
    registerTechnologyDetailTable,
    {
      setTableData: setTechnologyDetailTableData,
      getDataSource: getTechnologyDetailDataSource,
      setCacheColumnsByField: setTechnologyDetailCacheColumnsByField,
      updateTableDataRecord: updateTechnologyDetailTableDataRecord,
      updateTableData: updateTechnologyDetailTableData,
      insertTableDataRecord: insertTechnologyDetailTableDataRecord,
      deleteTableDataRecord: deleteTechnologyDetailTableDataRecord,
    },
  ] = useTable({
    columns: getTechnologyDetailColumns(),
    pagination: false,
    showTableSetting: false,
    striped: true,
    showIndexColumn: false,
    isCanResizeParent: true,
    canResize: false,
    rowKey: 'uuid',
    // actionColumn: {
    //   width: 120,
    //   title: "操作",
    //   dataIndex: "action"
    // }
  });

  // function getTreeData(data) {
  //   getBomStructure(data)
  //     .then(({ code, data }) => {
  //       if (code == 200) {
  //         state.treeData = data;
  //       }
  //     })
  //     .then(() => {
  //       // changeLoading(false);
  //     });
  // }

  function handleDeteleManualPackaging(record, i) {
    if (state.mode !== 'edit') return;
    record.manualPackagingList.splice(i, 1);
  }

  function initData(data) {
    console.log(data);
    console.log('-----------------------------------');
    // state.customerFileList = [];
    if (data.id) {
      nextTick(() => {
        state.bomId = data.id;
      });
      const managerId = userStore.getUserInfo?.managerId;
      const { cacheList, index } = toRaw(state);
      // const cacheList = state.cacheList;
      // const index = state.index;
      // 请求Bom结构
      const bomDetail = getBomDetail(toRaw(data));
      // 请求PCC
      const pccDetail = getPccDetail({ id: cacheList[index].id });
      Promise.all([bomDetail, pccDetail])
        .then(([domDetailRes, pccDetailRes]) => {
          const { code: bomCode, data: bomData } = domDetailRes;
          const { code: pccCode, data: pccData } = pccDetailRes;
          // bomData
          console.log(state.mode, 'state.modestate.modestate.mode');
          const editMode = {
            onEdit: state.mode == 'edit',
            editable: state.mode == 'edit',
          };
          if (bomCode == 200) {
            const {
              parentPartInfo,
              packingMaterialCustomList,
              packingMaterialFixedList,
              installationDiagramList,
              materialList,
              moldList,
              processList,
              stepDistanceList,
              engineeringDataList,
            } = bomData;
            if (!processList || processList?.length <= 0) {
              state.halfSign = 'add';
              resetTableData();
            } else {
              state.halfSign = 'edit';
              engineeringDataList.map(item => {
                state.customerFileList.push({
                  ...item,
                  delete: false,
                  name: item.fileName,
                  flagPath: item.filePath,
                  flagVersion: item.version,
                });
              });
              setProdInfoFieldsValue({
                ...parentPartInfo,
                workshopEnv: parentPartInfo.workshopEnv + '',
                process: parentPartInfo.process + '',
                // mainOperatorSkills: parentPartInfo.mainOperatorSkills + '',
                // auxiliaryOperatorSkills: parentPartInfo.auxiliaryOperatorSkills + '',
                businessType: parentPartInfo.businessType ? parentPartInfo.businessType + '' : '',
                isBonded: parentPartInfo.isBonded + '',
              });
              setProdInfoProps({
                disabled: state.mode !== 'edit',
              });
              setBaseInfoProps({
                disabled: state.mode !== 'edit',
              });
              setTechnologyFieldsValue({
                ...parentPartInfo,
                // utilizationRate: parentPartInfo.utilizationRate * 100,
              });
              setTechnologyProps({
                disabled: state.mode !== 'edit',
              });
              setTechnologyTableFieldsValue({
                ...parentPartInfo,
                utilizationRate: parentPartInfo.utilizationRate * 100,
              });
              setTechnologyTableFieldsProps({
                disabled: state.mode !== 'edit',
              });
              state.installImageList = installationDiagramList;
              state.technologyList = stepDistanceList?.map(item => {
                return {
                  ...item,
                  uuid: item.id,
                  stepDistance: item.stepDistance + '',
                  modulus: item.modulus + '',
                  ...editMode,
                };
              });
              state.toBeGenerateList = moldList;
              setMaterTableData(
                materialList.map(item => ({
                  ...item,
                  ...editMode,
                  origin: {
                    ...item,
                  },
                  uuid: item.id,
                  utilizationRate: mode.value == 'edit' ? item.utilizationRate * 100 : item.utilizationRate * 100 + '%',
                  disabled: {
                    partNumber: true,
                  },
                })),
              );

              console.log(cacheList[index], 'cacheList[index]');
              unref(packageRef).setTableData({
                packingMaterialCustomList: packingMaterialCustomList.map(item => ({ ...item, uuid: item.id })),
                packingMaterialFixedList: packingMaterialFixedList.map(item => ({ ...item, uuid: item.id })),
                packageSpecQty: parentPartInfo.packSpecQtyR || parentPartInfo.packSpecQtyPN,
                config: {
                  mode: state.mode,
                  source: 'PCC',
                  shipPattern: packingMaterialCustomList.length > 0 ? 'R' : '',
                },
              });
              const processTableData = processList.map(item => {
                const target = {
                  ...item,
                  imageList: item.imageList.map(v => v.filePath),
                  isMain: item.isMain ? 1 : 0,
                  defectRate: item.defectRate * 100,
                  uuid: item.id,
                  ...editMode,
                };
                if (target.processCode.startsWith('1') || target.processCode.startsWith('4') || target.processCode.startsWith('5')) {
                  target.disabled = {
                    speed: true,
                    speedUnit: true,
                  };
                }
                return target;
              });
              console.log(processTableData, 'processTableDataprocessTableDataprocessTableData');
              setTechnologyTableData(processTableData);
              setTechnologyDetailTableData(processTableData);
              console.log('dddddddddddddd');
            }
            console.log(123123123);
            if (pccCode == 200) {
              const {
                insidePartNumber,
                revisionRemark,
                creatorTime,
                productDesc,
                productType,
                isBonded,
                version,
                bomType,
                effectiveDate,
                creatorUserName,
                handlerId,
                remark,
                docNumber,
              } = pccData;
              console.log(pccData, 'pccData----------------');
              state.bomType = bomType;
              console.log(isBonded);
              if (typeof isBonded === 'boolean') {
                setProdInfoFieldsValue({
                  isBonded: isBonded + '',
                });
              }
              console.log(productType, 'productTypeproductTypeproductTypeproductType');
              setBaseInfoFieldsValue({
                insidePartNumber,
                productDesc,
                productType,
                version,
                bomType,
                docNumber,
                effectiveDate,
                creatorUserName,
                handlerId: mode.value == 'edit' ? managerId : handlerId,
                remark,
              });
              setBaseInfoProps({
                disabled: state.mode !== 'edit',
              });
              getPccRevisionHistory({
                PartNumber: cacheList[index].insidePartNumber,
              })
                .then(({ code, data }) => {
                  if (code == 200) {
                    const reviewList = [...data];
                    reviewList.unshift({
                      version: `T${version || reviewList.length}`,
                      creatorTime: creatorTime || new Date().getTime(),
                      revisionRemark: revisionRemark || '',
                      onEdit: state.mode === 'edit',
                      editable: state.mode === 'edit',
                    });
                  }
                })
                .catch(() => {
                  changeLoading(false);
                });
            }
          }
          changeLoading(false);
        })
        .catch(e => {
          console.log(e);
          changeLoading(false);
        });
    } else {
      resetTableData();
    }
  }

  function resetTableData() {
    const managerId = userStore.getUserInfo?.managerId;
    const { cacheList, index } = state;
    resetBaseInfoFields();
    resetProdInfoFields();
    resetTechnologyFields();
    state.technologyList = [
      {
        stepDistance: '',
        modulus: '',
      },
    ];
    console.log(cacheList[index], 'cacheList[index]cacheList[index]cacheList[index]');
    // const {factory: factoryCode, } = cacheList[index];

    setBaseInfoFieldsValue({
      ...cacheList[index],
      bomType: cacheList[index].demandType == 'BusinessSamples' || cacheList[index].demandType == 'EngineeringSamples' ? 4 : null,
      handlerId: managerId,
    });
    setProdInfoFieldsValue({
      ...cacheList[index],
    });

    state.toBeGenerateList = [];
    state.installImageList = [];
    setMaterTableData([
      {
        ...materialRowData,
        uuid: buildUUID(),
        origin: {
          ...materialRowData,
        },
        disabled: {
          partNumber: true,
        },
      },
    ]);
    // setPackageTableData([
    //   {
    //     ...packageRowData,
    //     uuid: buildUUID(),
    //   },
    // ]);
    console.log(123123123123);
    unref(packageRef).init({
      shipPattern: cacheList[index].shipPattern,
      source: 'PCC',
    });

    const rowData = [
      {
        ...technologyRowData,
        processCode: '101',
        processName: '备料',
        uuid: buildUUID(),
        isMain: 0,
      },
      {
        ...technologyRowData,
        processCode: null,
        processName: null,
        disabled: {
          speed: false,
          speedUnit: false,
        },
        uuid: buildUUID(),
        isMain: 1,
      },
      {
        ...technologyRowData,
        processCode: '401',
        processName: '普通环境整理',
        uuid: buildUUID(),
        isMain: 0,
      },
      {
        ...technologyRowData,
        processCode: '501',
        processName: '人工包装',
        uuid: buildUUID(),
        isMain: 0,
      },
    ];
    console.log(rowData);
    setTechnologyTableData(rowData);
    setTechnologyDetailTableData(rowData);
    setChangeHistoryTableData([
      {
        version: 'T0',
        revisionRemark: '',
        creatorTime: new Date().getTime(),
        onEdit: true,
        editable: true,
      },
    ]);
    changeLoading(false);
  }

  async function init(data) {
    // changeLoading(true);
    // state.isPack = true;
    // state.mode = toRaw(data.mode);
    if (data.mode) {
      state.mode = data.mode;
    }
    if (data.doNotTemplate) {
      state.doNotTemplate = data.doNotTemplate;
    }
    const ifShow = data.mode === 'edit' ? true : false;
    setMaterialTableProps({
      actionColumn: {
        width: 120,
        title: '操作',
        dataIndex: 'action',
        ifShow: ifShow,
      },
    });
    setTechnologyTableProps({
      actionColumn: {
        width: 120,
        title: '操作',
        dataIndex: 'action',
        ifShow: ifShow,
      },
    });
    state.showSubmit = data.showSubmit;
    state.showReject = data.showReject;
    state.showReview = data.showReview;
    const { cacheList, index } = data;
    console.log(cacheList, index, 'cachelist index');
    state.cacheList = cacheList;
    console.log(state.cacheList);
    state.index = index;
    state.bomId = cacheList[index]?.bomId;
    initData({
      id: cacheList[index]?.bomId,
    });
    nextTick(() => {
      setTemplateFieldsValue({
        templateName: cacheList[index].templateName,
        templateRemark: cacheList[index].templateRemark,
      });
    });
  }

  function handleInvoke() {
    const params = buildParams();
    emit('submit', params);
    closePopup();
  }

  function getTechnologyTableFormSchema(): FormSchema[] {
    return [
      // {
      //   field: 'numberOfKnives',
      //   label: '模切刀数',
      //   component: 'InputNumber',
      //   componentProps: { placeholder: '模切刀数' },
      //   labelWidth: 110,
      // },
      {
        field: 'singleRefuelingDuration',
        label: '单次换料时长(MIN/次)',
        component: 'InputNumber',
        componentProps: {
          placeholder: '单次换料时长',
          onChange: singleRefuelingDuration => {
            const technology = getTechnologyDetailDataSource();
            const mainTechnogy = technology.find(item => item.isMain);
            calcDowntimeOneHourUtilizationRate(mainTechnogy.speed, singleRefuelingDuration);
          },
          step: 0.1,
          precision: 1,
        },
        labelWidth: 140,
      },
      // 1H停机时长
      // (60*主工序速度*小时数)
      // /
      // (
      //  (
      //      1/(
      //          (1/材料1长度)+...+  (1/材料n长度)
      //      )
      //  )+(主工序速度*小时数)
      // )
      {
        field: 'downtimeOneHour',
        label: '1H停机时长(MIN)',
        helpMessage: ['1H停机时长(MIN)', '60*主工序速度*单次换料时长/(1/(1/材料1长度)+...+  (1/材料n长度))+(主工序速度*单次换料时长)'],
        component: 'InputNumber',
        componentProps: { placeholder: '系统计算', disabled: true },
        labelWidth: 130,
      },
      {
        field: 'utilizationRate',
        label: '设备稼动率(%)',
        component: 'InputNumber',
        helpMessage: ['设备稼动率', '(60 - 1H停机时长)/60 * 100'],
        componentProps: {
          placeholder: '系统计算',
          disabled: true,
          rate: true,
        },
        labelWidth: 110,
      },
    ];
  }

  function getProdInfoFormSchema(): FormSchema[] {
    return [
      {
        field: 'factory',
        label: '生产工厂',
        component: 'ApiSelect',
        componentProps: {
          disabled: true,
          placeholder: '生产工厂',
          api: getFactoryList,
          apiSearch: {
            show: true,
            searchName: 'factoryCode',
          },
          resultField: 'data',
          labelField: 'Name',
          valueField: 'Code',
          nameFormat: ['Name', '(', 'Code', ')'],
          showSearch: true,
          immediate: true,
          filterOption: false,
          notFoundContent: null,
          onChange: factoryCode => {
            const { businessType: materialType, isBonded } = getProdInfoFieldsValue();
            setBaseInfoFieldsValue({
              productType: null,
            });
            const { code, data } = getFactorySap({
              isBonded,
              materialType,
              factoryCode,
            }).then(({ code }) => {
              if (code == 200) {
                setProdInfoFieldsValue({
                  sapFactory: data?.Code,
                });
              }
            });
          },
        },
      },
      {
        field: 'businessType',
        label: '业务类型',
        component: 'ApiSelect',
        componentProps: {
          placeholder: '业务类型',
          api: () => {
            return baseStore.getDictionaryData('SapFactoryMaterial');
          },
          labelField: 'fullName',
          valueField: 'enCode',
          onChange: async materialType => {
            const { factory: factoryCode } = getProdInfoFieldsValue();
            const { isBonded } = getBaseInfoFieldsValue();
            const { code, data } = await getFactorySap({
              isBonded,
              materialType,
              factoryCode,
            });
            if (code == 200) {
              setProdInfoFieldsValue({
                sapFactory: data?.Code,
              });
            }
          },
        },
      },
      {
        field: 'isBonded',
        label: '是否保税',
        component: 'Select',
        defaultValue: 'false',
        componentProps: {
          placeholder: '保税',
          options: [
            {
              fullName: '是',
              enCode: 'true',
            },
            {
              fullName: '否',
              enCode: 'false',
            },
          ],
          fieldNames: {
            label: 'fullName',
            value: 'enCode',
          },
          onChange: async isBonded => {
            const { businessType: materialType, factory: factoryCode } = getProdInfoFieldsValue();
            const { code, data } = await getFactorySap({
              isBonded,
              materialType,
              factoryCode,
            });
            if (code == 200) {
              setProdInfoFieldsValue({
                sapFactory: data?.Code,
              });
            }
          },
        },
      },
      {
        field: 'sapFactory',
        label: 'SAP工厂代码',
        component: 'ApiSelect',
        componentProps: {
          disabled: true,
          placeholder: 'SAP工厂代码',
          api: getSapFactoryList,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          // disabled: true,
          resultField: 'data',
          labelField: 'name',
          valueField: 'code',
          nameFormat: ['name', '(', 'code', ')'],
          showSearch: true,
          immediate: true,
          filterOption: false,
          notFoundContent: null,
        },
      },
      {
        field: 'workshopEnv',
        label: '车间环境',
        component: 'ApiSelect',
        defaultValue: '1',
        componentProps: {
          placeholder: '车间环境',
          api: () => {
            return baseStore.getDictionaryData('PCC.WorkshopEnv');
          },
          labelField: 'fullName',
          valueField: 'enCode',
        },
      },
      // {
      //   field: 'process',
      //   label: '生产工艺',
      //   component: 'ApiSelect',
      //   componentProps: {
      //     placeholder: '生产工艺',
      //     api: () => {
      //       return baseStore.getDictionaryData('PCC.ProcessType');
      //     },
      //     labelField: 'fullName',
      //     valueField: 'enCode',
      //     onChange: e => {
      //       console.log(e);
      //     },
      //   },
      // },
      {
        field: 'standardManpower',
        label: '标准人力',
        component: 'InputNumber',
        dynamicDisabled: true,
        componentProps: { placeholder: '标准人力' },
      },
      {
        field: 'mainOperatorSkills',
        label: '主机手技能',
        component: 'ApiSelect',
        componentProps: {
          placeholder: '主机手技能',
          api: () => baseStore.getDictionaryData('SkillLevel', true),
          labelField: 'fullName',
          valueField: 'enCode',
          showSearch: true,
          filterOption: (value, option) => {
            return option.label.includes(value);
          },
        },
      },
      {
        field: 'mainOperatorNumber',
        label: '主机手人数',
        component: 'InputNumber',
        componentProps: {
          placeholder: '主机手人数',
          min: 0,
          step: 1,
          precision: 0,
          onChange: e => {
            const { auxiliaryOperatorNumber } = getProdInfoFieldsValue();
            setProdInfoFieldsValue({
              standardManpower: e + auxiliaryOperatorNumber || 0,
            });
          },
        },
      },
      {
        field: 'auxiliaryOperatorSkills',
        label: '辅机手技能',
        component: 'ApiSelect',
        componentProps: {
          placeholder: '辅机手技能',
          api: () => baseStore.getDictionaryData('SkillLevel', true),
          labelField: 'fullName',
          valueField: 'enCode',
          showSearch: true,
          filterOption: (value, option) => {
            return option.label.includes(value);
          },
        },
      },
      {
        field: 'auxiliaryOperatorNumber',
        label: '辅机手人数',
        component: 'InputNumber',
        componentProps: {
          placeholder: '辅机手人数',
          min: 0,
          step: 1,
          precision: 0,
          onChange: e => {
            const { mainOperatorNumber } = getProdInfoFieldsValue();
            setProdInfoFieldsValue({
              standardManpower: e + mainOperatorNumber || 0,
            });
          },
        },
      },
    ];
  }

  function handleDblClick(event, value) {
    console.log(event, value);
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: '如数据未进行保存,该操作将清空已编辑的数据, 是否确认继续?',
      onOk: async () => {
        initData({
          id: value.id,
        });
      },
    });
  }

  function handleUnpack() {
    bomContent.value.style.transition = 'all 0.5s';

    setTimeout(() => {
      if (state.isPack) {
        bomContent.value.style.flex = `0 0 10px`;
        mainContent.value.style.flex = `1 1 auto`;
        bomContent.value.style.transition = 'none';
        state.isPack = !state.isPack;
      } else {
        bomContent.value.style.flex = `0 0 280px`;
        mainContent.value.style.flex = `1 1 auto`;
        bomContent.value.style.transition = 'none';
        state.isPack = !state.isPack;
      }
    }, 100);
  }

  function getRowSpan(record, index) {
    // 根据Version判断行合并
    if (index === 0 || record?.flagVersion !== state.customerFileList[index - 1]?.flagVersion) {
      const count = state.customerFileList.slice(index).filter(item => item.flagVersion === record.flagVersion).length;
      return count;
    }
    return 0;
  }

  const engineColumns: BasicColumn[] = [
    {
      title: '版本',
      dataIndex: 'flagVersion',
      key: 'flagVersion',
      customCell: (record, index, column) => {
        const rowSpan = getRowSpan(record, index);
        return { rowSpan };
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      customCell: (record, index, column) => {
        const rowSpan = getRowSpan(record, index);
        return { rowSpan };
      },
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '操作',
      dataIndex: 'action',
      colSpan: 2,
      // customCell: (record, index, column) => {
      //   const rowSpan = getRowSpan(record, index);
      //   return { rowSpan };
      // }
    },
    {
      title: '',
      colSpan: 0,
      dataIndex: 'delete',
    },
  ];

  async function handlePreview(item) {
    console.log(item);
    if (!item.flagPath) {
      const params = {
        file: item,
        filePath: 'PCC',
      };
      const {
        data: { filePath },
      } = await uploadInstallFile(params);
      item.flagPath = filePath;
    }
    const params = {
      name: item.name,
      url: item.flagPath,
      previewType: 'localPreview',
      noCache: false,
      isCopy: 0,
    };
    filePreviewRef.value?.init(params);
  }

  function handleDownload(record) {
    downloadByUrl({
      url: record.flagPath,
      fileName: record.name,
      target: '_blank',
    });
  }

  function handleDeletePic(index) {
    state.customerFileList.splice(index, 1);
  }

  function handleDeleteTechnology(index) {
    const tableData = getMaterialDataSource();
    console.log(tableData);
    const v = tableData.find(item => item.stepDistanceNumber === index);
    if (v) return createMessage.warning('该工艺已被使用，不能删除');
    state.technologyList.splice(index, 1);
  }

  function handleAddTechnology() {
    state.technologyList.push(cloneDeep(technologyItem));
  }

  function handleMoldGenerate() {
    // const {start, end, before, after} = state.moldGenerateInfo
    // if(start.length !== 2) return createMessage.warning('请输入第一个输入框正确的值，如：AF');
    // if(before.length!== 7) return createMessage.warning('请输入中左的输入框正确的值，如：BAZZ125');
    // if(after.length >= 0) return createMessage.warning('请输入中右输入框的值');
    // if(end.length!== 5) return createMessage.warning('请输入最后一个输入框正确的值，如：AA001');

    const arr = state.moldGenerate.split('-');
    if (arr.length !== 3) return createMessage.warning('请输入正确的值，如：AF-BAZZ125B-AA001');
    if (arr[0].length !== 2) return createMessage.warning('请输入前两位正确的值，如：AF');
    if (arr[2].length !== 5) return createMessage.warning('请输入后五位正确的值，如：AA001');

    if (arr[1].length < 8) {
      createMessage.warning('请输入中间正确的值，如：BAZZ125A');
    } else {
      const str = arr[1].slice(7);
      console.log(str);
      if (hasDuplicates(str)) return createMessage.warning('中间数据尾部有重复数值');
      for (let i = 0; i < str.length; i++) {
        console.log(str[i]);
        state.toBeGenerateList.push({
          code: `${arr[0]}-${arr[1].slice(0, 7)}${str[i]}-${arr[2]}`,
        });
      }
    }
    // state.toBeGenerateList.push({
    //   code: state.moldGenerate,
    // });
    state.moldGenerate = '';
    createMessage.success('校验并生成成功');
  }

  function hasDuplicates(str) {
    const chars = str.split('');
    const uniqueChars = _.uniq(chars);
    return uniqueChars.length < chars.length;
  }

  function handleDeleteMold(index) {
    state.toBeGenerateList.splice(index, 1);
  }

  function changeCurrent(type: 'pre' | 'next') {
    const { cacheList, index } = state;
    // 上一个
    if (type === 'pre') {
      if (index === 0) {
        return message.warning('当前已经是第一个');
      }
      state.index = index - 1;
      initData({ id: cacheList[index - 1].bomId });
    }
    // 下一个
    if (type === 'next') {
      if (index === state.cacheList.length - 1) {
        return message.warning('当前已经是最后一个');
      }
      state.index = index + 1;
      initData({ id: cacheList[index + 1].bomId });
    }
  }

  function handleScroll(e) {
    const NAV_MAP = {
      'base-info': 0,
      material: 1,
      packaging: 2,
      'process-flow': 3,
      'process-flow-and-upload': 4,
      changeResume: 5,
    };
    const ele = e.target;
    const dataIndex = ele.getAttribute('data-index');
    const list = navBox.value.children;

    if (dataIndex == null || NAV_MAP[dataIndex] === state.navIndex) return;
    ele.classList.add('active');
    list[state.navIndex].classList.remove('active');
    state.navIndex = NAV_MAP[dataIndex];

    const target = document.querySelector(`#${dataIndex}`);
    // target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    const warp = mainScroll.value.getScrollWrap();
    mainScroll.value.scrollTo(warp.scrollTop + top - 230);
  }

  function handleChangeMaterial(type: 'add' | 'update' | 'copy' | 'delete' | 'addBaseIndex', data) {
    console.log(data);
    switch (type) {
      case 'add':
        const dataList = [];
        for (let i = 0; i < data.rows; i++) {
          dataList.push({
            ...materialRowData,
            uuid: buildUUID(),
          });
        }
        insertMaterialTableDataRecord(dataList);
        break;
      case 'addBaseIndex':
        insertMaterialTableDataRecord(
          {
            ...materialRowData,
            uuid: buildUUID(),
          },
          data.index + 1,
        );
        break;
      case 'copy':
        const copyData = getMaterialDataSource()[data.index];
        console.log(copyData);
        insertMaterialTableDataRecord(
          {
            ...toRaw(copyData),
            uuid: buildUUID(),
          },
          data.index + 1,
        );
        break;
      case 'delete':
        deleteMaterialTableDataRecord(data.uuid);
        break;
      case 'update':
        // updateMaterialTableDataRecord(data);
        break;
    }
  }

  function handleChangeTechnology(type: 'add' | 'update' | 'copy' | 'delete' | 'addBaseIndex', data) {
    switch (type) {
      case 'add':
        const dataList = [];
        for (let i = 0; i < data.rows; i++) {
          dataList.push({
            ...technologyRowData,
            uuid: buildUUID(),
          });
        }
        insertTechnologyTableDataRecord(dataList);
        // insertTechnologyDetailTableDataRecord(dataList);
        break;
      case 'addBaseIndex':
        const rowData = {
          ...technologyRowData,
          uuid: buildUUID(),
        };
        insertTechnologyTableDataRecord(rowData, data.index + 1);
        // insertTechnologyDetailTableDataRecord(
        //   rowData,
        //   data.index + 1,
        // );
        break;
      case 'copy':
        const copyData = getTechnologyDataSource()[data.index];
        insertTechnologyTableDataRecord(
          {
            ...toRaw(copyData),
            uuid: buildUUID(),
          },
          data.index + 1,
        );
        // insertTechnologyDetailTableDataRecord(
        //   {
        //     ...toRaw(copyData),
        //     id: buildUUID(),
        //   },
        //   data.index + 1,
        // );
        break;
      case 'delete':
        deleteTechnologyTableDataRecord(data.uuid);
        // deleteTechnologyDetailTableDataRecord(data.id)
        break;
      case 'update':
        // updateMaterialTableDataRecord(data);
        break;
    }
  }

  function validateParams(params) {
    const {
      insidePartNumber,
      effectiveDate,
      parentPartInfo,
      materialList,
      moldList,
      packingMaterialList,
      stepDistanceList,
      processList,
      installationDiagramList,
    } = params;
    const { factory } = parentPartInfo;
    if (!insidePartNumber) {
      createMessage.warning('请输入基本信息内部料号');
      return false;
    }
    // if (!effectiveDate) {
    //   createMessage.warning('请输入生效日期');
    //   return false;
    // }

    return true;
  }

  function buildParams() {
    const { cacheList, index } = state;

    const baseInfo = getBaseInfoFieldsValue();

    const prodInfo = getProdInfoFieldsValue();

    const technology = getTechnologyFieldsValue();
    const technologyTable = getTechnologyTableFieldsValue();
    const technologyList = state.technologyList.map((item, index) => {
      return {
        ...item,
        isMain: index === 0,
      };
    });
    const toBeGenerateList = state.toBeGenerateList;

    const materialData = getMaterialDataSource();
    const packageData = unref(packageRef).getDataSource();
    const technologyTableData = getTechnologyDataSource().map(item => {
      return {
        ...item,
        defectRate: item.defectRate / 100,
        imageList: (item.editValueRefs?.imageList || item.imageList).map((item, index) => {
          return {
            seqNumber: index,
            filePath: item,
          };
        }),
      };
    });

    const params = {
      ...baseInfo,
      drawingsReviewId: cacheList[index].drawingsReviewId || cacheList[index].id,
      insidePartNumber: cacheList[index].insidePartNumber,
      parentPartInfo: {
        ...prodInfo,
        ...technology,
        ...technologyTable,
        packSpecQtyR: packageData.packSpecQtyR,
        packSpecQtyPN: packageData.packSpecQtyPN,
      },
      materialList: materialData,
      moldList: toBeGenerateList,
      ...packageData,
      stepDistanceList: technologyList.map((item, index) => {
        return {
          ...item,
          seqNumber: index,
        };
      }),
      processList: technologyTableData,
    };

    return params;
  }

  async function handleSubmit(type: 'save' | 'commit') {
    const { index, cacheList } = state;

    // if(state.mode === 'view'){
    //   state.mode = 'edit'
    //   initData({
    //     id: cacheList[index].bomId
    //   })
    //   return
    // }
    changeLoading(true);

    const params = buildParams();
    console.log(params);
    if (!validateParams(params)) return changeLoading(false);
    updateFinishedPartsBomPcc({
      ...params,
      id: cacheList[index].id,
    })
      .then(({ code, msg }) => {
        if (code !== 200) return createMessage.error(msg);
        createMessage.success(msg);
        closePopup();
        emit('reload');
      })
      .catch(() => {
        changeLoading(false);
      });
  }

  function getTechnologyColumns(): BasicColumn[] {
    return [
      {
        title: '工序',
        dataIndex: 'processCode',
        editComponent: 'ApiSelect',
        editComponentProps: {
          api: getProcessAllList,
          showSearch: true,
          originParams: {
            mainProcess: 1,
          },
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          resultField: 'data',
          labelField: 'code',
          valueField: 'code',
          nameFormat: ['code', '(', 'name', ')'],
          immediate: true,
          filterOption: false,
          notFoundContent: null,
          placeholder: '工序',
          onChange: (_, data, record) => {
            if (!data) return;
            const index = getTechnologyDataSource().findIndex(item => item.uuid === record.uuid);
            const { name, value } = data;
            const { editValueRefs } = record;
            editValueRefs.processName = name;
            const valueStr = value.toString();
            if (valueStr.startsWith('1') || valueStr.startsWith('4') || valueStr.startsWith('5')) {
              // const index = getTechnologyDataSource().findIndex(item => item.uuid === record.uuid);
              updateTechnologyTableData(index, 'disabled', {
                ...record.disabled,
                speed: true,
                speedUnit: true,
                capacity: false,
              });
              editValueRefs.adjustmentTime = 0;
            } else {
              // editValueRefs.speedUnit = ''
              const { process } = getTechnologyFieldsValue();
              // 激光、圆刀单位默认：M/min，平板默认：冲次/min
              if (process == 1) {
                // 平板
                editValueRefs.speedUnit = '冲次/min';
              } else {
                // 圆刀 激光
                editValueRefs.speedUnit = 'M/min';
              }
              updateTechnologyTableData(index, 'disabled', {
                ...record.disabled,
                speed: false,
                speedUnit: false,
                capacity: true,
              });
            }
            // console.log(index.value, 'index');
            console.log(index, 'index');
            console.log(name, 'processName');
            console.log(_, 'processCode');
            // updateTechnologyTableData(index, 'processName', name);
            updateTechnologyDetailTableData(index, 'processName', name);
            console.log(record);
            // updateTechnologyDetailTableData(index.value, 'processCode', _);
          },
        },
        editRow: true,
        width: 180,
      },
      {
        title: '调机时间(H)',
        dataIndex: 'adjustmentTime',
        editRow: true,
        editComponent: 'InputNumber',
        editComponentProps: {
          placeholder: '自动带入',
          min: 0,
        },
        width: 100,
      },
      {
        title: '速度',
        dataIndex: 'speed',
        editRow: true,
        editComponentProps: {
          placeholder: '',
          onChange: (_, data, record) => {
            const { isMain } = record;
            if (!isMain) return;
            const { process } = getTechnologyFieldsValue();
            const materialList = getMaterialDataSource();
            // const wholeLengthSum = materialList.reduce((a, b) => {
            //   return a + b.wholeLength;
            // }, 0);
            let speed = _;
            if (!process) {
              return createMessage.warning('暂无生成工艺信息');
            }
            if (process == '2') {
              const stepDistance = state.technologyList[0].stepDistance;
              if (!stepDistance) return createMessage.warning('请先设置主步距');
              speed = speed * stepDistance || 0;
            } else {
            }
            calcDowntimeOneHourUtilizationRate(speed);
            // const downtimeOneHour = ((60 * speed * 1) / (1 / (1 / wholeLengthSum + speed * 1))).toFixed(5);
            // const utilizationRate = (((60 - downtimeOneHour) / 60) * 100).toFixed(5);
            // console.log(' downtimeOneHour', downtimeOneHour);
            // console.log(' utilizationRate', utilizationRate);
            // setTechnologyTableFieldsValue({
            //   downtimeOneHour,
            //   utilizationRate,
            // });
          },
        },
        editComponent: 'InputNumber',
        width: 120,
      },
      {
        title: '单位',
        dataIndex: 'speedUnit',
        editRow: true,
        editComponentProps: {
          placeholder: '',
          api: getUnitListByKeyword,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          resultField: 'data',
          filterOption: false,
          notFoundContent: null,
          immediate: true,
          labelField: 'Name',
          valueField: 'Code',
          nameFormat: ['Name', '(', 'Code', ')'],
        },
        editComponent: 'ApiSelect',
        width: 200,
      },
      {
        title: '不良率',
        dataIndex: 'defectRate',
        editRow: true,
        editComponent: 'InputNumber',
        editComponentProps: {
          placeholder: '自动带入',
          rate: true,
          // safe: false,
        },
        width: 100,
      },
      {
        title: '产能',
        dataIndex: 'capacity',
        editComponent: 'InputNumber',
        helpMessage: ['(60*速度*稼动率)/主步距*模数'],
        editRow: true,
        editComponentProps: {
          placeholder: '产能',
          // onChange: (capacity, data, record) => {
          //   if (record.isMain) {
          //     const materialDataList = getMaterialDataSource();
          //     materialDataList.forEach(item => {
          //       const { editValueRefs, useQty } = item;
          //       editValueRefs.metersTenHour = (capacity || 0) * 10 * useQty;
          //     });
          //   }
          // },
        },
        width: 120,
      },
      {
        title: '单位',
        dataIndex: 'capacityUnit',
        editRow: true,
        editComponentProps: {
          placeholder: '单位',
          api: getUnitListByKeyword,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          resultField: 'data',
          filterOption: false,
          notFoundContent: null,
          immediate: false,
          labelField: 'Name',
          valueField: 'Code',
          nameFormat: ['Name', '(', 'Code', ')'],
        },
        editComponent: 'ApiSelect',
        width: 200,
      },
      {
        title: '主工序',
        dataIndex: 'isMain',
        editRow: true,
        editComponentProps: {
          placeholder: '选择主工序',
          options: [
            {
              label: '是',
              value: 1,
            },
            {
              label: '否',
              value: 0,
            },
          ],
          onChange: (e, _, record) => {
            const index = getTechnologyDataSource().findIndex(item => item.uuid === record.uuid);
            const { capacity, speed, editValueRefs } = record;

            console.log(speed, 'speed');
            if (!!e && !record.speedUnit) {
              // if (!!e) {
              createMessage.warning('请先选择速度单位');
              console.log('change isMain', e);
              const materialDataList = getMaterialDataSource();
              nextTick(() => {
                updateTechnologyTableData(index, 'isMain', 0);
                materialDataList.forEach(item => {
                  const { editValueRefs, useQty } = item;
                  editValueRefs.metersTenHour = (capacity || 0) * 10 * useQty;
                });
              });
              return;
            }
            updateTechnologyTableData(index, 'disabled', {
              ...record.disabled,
              speed: true,
              speedUnit: true,
            });
            getTechnologyDataSource().forEach((item, index) => {
              if (item.uuid === record.uuid) return;
              updateTechnologyTableData(index, 'isMain', 0);
              updateTechnologyTableData(index, 'disabled', {
                ...record.disabled,
                speedUnit: false,
                speed: false,
              });
            });
            calcDowntimeOneHourUtilizationRate(speed);
            getMaterialDataSource().forEach(item => {
              const { editValueRefs, useQty } = item;
              calcMetersTenHour(useQty, item);
            });
          },
        },
        editComponent: 'Select',
        width: 100,
      },
    ];
  }

  function getTechnologyDetailColumns(): BasicColumn[] {
    return [
      {
        title: '工序',
        dataIndex: 'processCode',
        width: 60,
      },
      {
        title: '工序描述',
        dataIndex: 'description',
        editRow: true,
        customRender: ({ text }) => {
          return text;
        },
        editComponentProps: {
          placeholder: '工序描述',
          autoSize: { minRows: 5, maxRows: 100 },
        },
        editComponent: 'Textarea',
        editDynamicDisabled: false,
        width: 180,
      },
      {
        title: '工艺示意图',
        dataIndex: 'imageList',
        width: 140,
      },
    ];
  }

  function calcDowntimeOneHourUtilizationRate(speed, singleRefuelingDuration) {
    const { process } = getTechnologyFieldsValue();
    // const { singleRefuelingDuration } = getTechnologyTableFieldsValue();
    if (!singleRefuelingDuration) {
      singleRefuelingDuration = getTechnologyTableFieldsValue().singleRefuelingDuration;
    }
    const materialList = getMaterialDataSource();
    const wholeLengthSum = materialList.reduce((a, b) => {
      return 1 / (a + b.wholeLength);
    }, 0);
    if (process == '2') {
      const stepDistance = state.technologyList[0].stepDistance || 0;
      if (!stepDistance) return createMessage.warning('请先设置主步距');
      speed = speed * stepDistance || 0;
    } else {
    }
    console.log(speed, 'speed');
    console.log(singleRefuelingDuration, 'singleRefuelingDuration');
    const downtimeOneHour = (60 * speed * singleRefuelingDuration) / (1 / wholeLengthSum + speed * singleRefuelingDuration);
    const utilizationRate = ((60 - downtimeOneHour) / 60) * 100;
    console.log(utilizationRate, 'utilizationRate');
    nextTick(() => {
      setTechnologyTableFieldsValue({
        downtimeOneHour: (downtimeOneHour || 0.01)?.toFixed(1),
        utilizationRate: (utilizationRate || 0.01)?.toFixed(1),
      });
    });
    console.log(downtimeOneHour, 'downtimeOneHour');
    console.log(utilizationRate, 'utilizationRate');
    if (downtimeOneHour && utilizationRate) {
      const list = getTechnologyDataSource();
      const { process } = getTechnologyFieldsValue();
      list.forEach(item => {
        const { editValueRefs, speed, isMain, processCode } = item;
        let _speed = speed;
        if (process == 1) {
          // 平板工艺：速度=(速度*主步距)/1000
          _speed = (_speed * (state.technologyList[0].stepDistance || 0)) / 1000;
        }
        // modulus
        if (processCode.startsWith('2') || processCode.startsWith('3')) {
          const capacity = Number(
            ((60 * _speed * utilizationRate) / 100 / (state.technologyList[0].stepDistance || 0)) * (state.technologyList[0].modulus ?? 0),
          ).toFixed(2);
          editValueRefs.capacity = capacity;

          if (isMain) {
            const materialDataList = getMaterialDataSource();
            materialDataList.forEach(item => {
              const { editValueRefs: materialEditValueRefs, useQty } = item;
              materialEditValueRefs.metersTenHour = (capacity || 0) * 10 * useQty;
            });
          }
        }
      });
    }
  }

  function handleTechnologyChange(e, record) {
    const data = technologyList[e];
    const { editValueRefs, unit } = record;
    const defectRate = getTechnologyDataSource().reduce((pre, next) => {
      pre += Number(next.defectRate || 0);
      return pre;
    }, 0);
    let useQty;
    if (unit === 'M') {
      useQty = (1 / (1 - defectRate / 100)) * 1000;
    } else if (unit === 'PCS') {
      const { stepDistance, modulus } = data;
      useQty = stepDistance / modulus / (1 - defectRate / 100);
    }
    editValueRefs.useQty = useQty;
    calcMetersTenHour(useQty, record);
  }

  function getMaterialColumns(): BasicColumn[] {
    return [
      {
        title: '步距组号',
        dataIndex: 'stepDistanceNumber',
        editRow: true,
        width: 80,
      },
      {
        title: '材料八码',
        dataIndex: 'eightCode',
        editRow: true,
        editComponent: 'Input',
        editComponentProps: {
          placeholder: '材料八码',
          onChange: (eightCode, data, record) => {
            const { editValueRefs } = record;
            editValueRefs.originPartNumber = '';
            editValueRefs.partNumber = '';
          },
        },
        width: 100,
      },
      {
        title: '宽度(MM)',
        dataIndex: 'width',
        editRow: true,
        width: 100,
        editComponent: 'InputNumber',
        editComponentProps: {
          placeholder: '宽度(MM)',
          onChange: (width, data, record) => {
            const { wholeWidth, wholeLength } = record;
            const { editValueRefs } = record;
            console.log(wholeLength);
            console.log(width);
            // 【 ( 原材整支长度 / 使用宽度) 去小数位取整】/ 【 原材整支长度 / 使用宽度)】
            const utilizationRate = Math.floor(wholeWidth / width) / (wholeWidth / width);
            editValueRefs.utilizationRate = utilizationRate * 100;
            editValueRefs.originPartNumber = '';
            editValueRefs.partNumber = '';
          },
          min: 0,
        },
      },
      {
        title: '查询结果',
        dataIndex: 'originPartNumber',
        editComponent: 'ApiSelect',
        editComponentProps: {
          api: getMaterialSearchByShortCode,
          originParams: {
            shortMaterialCode: 'record.eightCode',
            materialWidth: 'record.width',
            toleranceNegative: 1,
          },
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          resultField: 'data',
          labelField: 'materialCode',
          valueField: 'materialCode',
          immediate: true,
          // alwaysLoad: true,
          placeholder: '查询结果',
          onChange: (materialCode, data, record) => {
            if (!data) return;
            const [startCode, eightCode, calcWidth] = materialCode.split('-');
            // const calcWidth = materialCodeArr[materialCodeArr.length - 1];
            const index = getMaterialDataSource().findIndex(item => item.uuid === record.uuid);
            const { materialDesc, materialName, materialLength, materialWidth, purchaseUnit, materialColor, width } = data;
            const { editValueRefs, stepDistanceNumber, unit } = record;
            editValueRefs.description = materialDesc || materialName || null;
            // editValueRefs.unit = purchaseUnit;
            editValueRefs.wholeLength = materialLength;
            editValueRefs.wholeWidth = materialWidth;
            editValueRefs.color = materialColor;
            if (!record.width) {
              createMessage.warning('请输入宽度');
            }
            editValueRefs.eightCode = eightCode;
            // 料号带出的宽度 - 输入的宽度 需要在-1~3范围内 直接用
            // 输入 500 查询100-xxx-504 504 - 500 > 3 转600
            // 输入 498 查询100-xxx-500 500 - 498 < 3 保留
            const retNum = Number(calcWidth) - editValueRefs.width;
            console.log(calcWidth, editValueRefs.width, retNum);
            if (retNum > 3) {
              editValueRefs.partNumber = `600-${eightCode}-${editValueRefs.width?.toString()?.padStart(4, 0)}`;
            } else {
              editValueRefs.partNumber = materialCode;
            }
            const defectRate = getTechnologyDataSource().reduce((pre, next) => {
              pre += Number(next.defectRate || 0);
              return pre;
            }, 0);
            let useQty;
            if (unit == 'PCS') {
              useQty = (1 / (1 - defectRate / 100)) * 1000;
            } else if (unit == 'M') {
              // 步距/模数/(1-不良率)
              const { stepDistance, modulus } = state.technologyList[stepDistanceNumber];
              useQty = stepDistance / modulus / (1 - defectRate / 100);
            } else {
              updateMaterialTableDataRecord(index, 'disabled', {
                ...record.disabled,
                useQty: false,
              });
            }
            editValueRefs.useQty = useQty;
            record.origin.useQty = useQty;

            if (record.width) {
              // 利用率
              const utilizationRate = (Math.floor(materialWidth / record.width) / (materialWidth / record.width)).toFixed(4);
              editValueRefs.utilizationRate = Number(utilizationRate) * 100;
            }
          },
        },
        editRow: true,
        width: 180,
      },
      {
        title: '材料料号',
        dataIndex: 'partNumber',
        editComponent: 'Input',
        editRow: true,
      },
      {
        title: '使用工序',
        dataIndex: 'processCode',
        width: 180,
        editRow: true,
      },
      {
        title: '出货材料',
        dataIndex: 'shippingMaterial',
        editComponent: 'ApiSelect',
        editComponentProps: {
          api: () => baseStore.getDictionaryData('PCC.ShippingMaterial', true),
          labelField: 'fullName',
          valueField: 'enCode',
          immediate: true,
        },
        editRow: true,
        width: 120,
      },
      {
        title: '描述',
        dataIndex: 'description',
        editRow: true,
        editComponentProps: {
          placeholder: '自动带入',
        },
        width: 200,
      },
      {
        title: '用量倍数',
        dataIndex: 'useQtyMultiple',
        editComponent: 'InputNumber',
        editComponentProps: {
          onChange: (useQtyMultiple, data, record) => {
            const { editValueRefs, origin } = record;
            editValueRefs.useQty = origin.useQty * useQtyMultiple;
          },
        },
        editRow: true,
        width: 100,
      },
      {
        title: '颜色',
        dataIndex: 'color',
        editRow: true,
        editComponent: 'Input',
        editComponentProps: {
          placeholder: '自动带入',
        },
        editDynamicDisabled: true,
        width: 100,
      },
      {
        title: '用量/KPCS',
        dataIndex: 'useQty',
        helpMessage: ['当单位为M或PCS时，系统计算', 'PCS：1/（1-不良率）*1000', 'M：步距/模数/(1-不良率)'],
        editRow: true,
        editComponent: 'InputNumber',
        editComponentProps: {
          placeholder: '系统计算',
          onChange: (useQty, data, record) => {
            calcMetersTenHour(useQty, record);
            const { origin } = record;
            origin.useQty = useQty;
          },
        },
        width: 120,
      },
      {
        title: '单位',
        dataIndex: 'unit',
        editRow: true,
        editComponentProps: {
          placeholder: '',
          onChange: (unit, data, record) => {
            const { stepDistanceNumber, editValueRefs, origin } = record;
            const defectRate = getTechnologyDataSource().reduce((pre, next) => {
              pre += Number(next.defectRate || 0);
              return pre;
            }, 0);
            let useQty;
            if (unit == 'PCS') {
              useQty = (1 / (1 - defectRate / 100)) * 1000;
            } else if (unit == 'M') {
              // 步距/模数/(1-不良率)
              const { stepDistance, modulus } = state.technologyList[stepDistanceNumber];
              useQty = stepDistance / modulus / (1 - defectRate / 100);
            } else {
              updateMaterialTableDataRecord(index, 'disabled', {
                ...record.disabled,
                useQty: false,
              });
            }
            editValueRefs.useQty = useQty;
            origin.useQty = useQty;
            calcMetersTenHour(useQty, record);
          },
          api: getUnitListByKeyword,
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          resultField: 'data',
          filterOption: false,
          notFoundContent: null,
          immediate: false,
          labelField: 'Name',
          valueField: 'Code',
          nameFormat: ['Name', '(', 'Code', ')'],
        },
        editComponent: 'ApiSelect',
        editDynamicDisabled: true,
        width: 100,
      },
      {
        title: '原材整支长度(M)',
        dataIndex: 'wholeLength',
        editRow: true,
        editComponentProps: {
          placeholder: '自动带入',
        },
        editDynamicDisabled: true,
        width: 100,
      },
      {
        title: '原材整支宽度(MM)',
        dataIndex: 'wholeWidth',
        editRow: true,
        editDynamicDisabled: true,
        editComponentProps: {
          placeholder: '自动带入',
        },
        width: 100,
      },
      {
        title: '利用率',
        dataIndex: 'utilizationRate',
        editRow: true,
        helpMessage: ['((整支宽度/使用宽度)向下取整后 * 使用宽度)/整支宽度*100%'],
        editDynamicDisabled: true,
        editComponent: 'InputNumber',
        editComponentProps: {
          placeholder: '系统计算',
          rate: true,
        },
        width: 100,
      },
      {
        title: '机台运行10H所需米数(M)',
        dataIndex: 'metersTenHour',
        helpMessage: ['主工序产能(KPCS/H)*KCPS用量*10H=米数'],
        editRow: true,
        editDynamicDisabled: true,
        editComponentProps: {
          placeholder: '系统计算',
        },
        width: 120,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        editRow: true,
        width: 200,
      },
    ];
  }

  function getTemplateFormSchema(): FormSchema[] {
    return [
      {
        field: 'templateName',
        label: '选择模版',
        component: 'ApiSelect',
        componentProps: {
          api: getTemplatePage,
          placeholder: '选择模版',
          showSearch: true,
          apiSearch: {
            show: true,
            searchName: 'keyword',
          },
          resultField: 'data.list',
          labelField: 'templateName',
          valueField: 'templateName',
          filterOption: false,
          notFoundContent: null,
          immediate: true,
          onChange: (e, data) => {
            console.log('temp change');
            init({
              index: 0,
              cacheList: [
                {
                  ...data,
                  templateName: e,
                },
              ],
            });
          },
        },
      },
      {
        field: 'templateRemark',
        label: '模板备注',
        component: 'Textarea',
        componentProps: {
          placeholder: '模板备注',
          autosize: {
            minRows: 1,
          },
        },
      },
    ];
  }

  function getBaseInfoFormSchema(): FormSchema[] {
    return [
      {
        field: 'insidePartNumber',
        label: '内部料号',
        component: 'Input',
        componentProps: {
          placeholder: '内部料号',
          disabled: true,
        },
      },
      {
        field: 'productDesc',
        label: '产品描述',
        component: 'Textarea',
        componentProps: {
          placeholder: '产品描述',
          autoSize: {
            minRows: 2,
            maxRows: 5,
          },
          disabled: true,
        },
      },
      {
        field: 'productType',
        label: '产品类型',
        component: 'ApiSelect',
        componentProps: {
          placeholder: '产品类型',
          api: getProductType,
          apiSearch: {
            show: true,
            searchName: 'ProductCategory',
          },
          beforeFetch: params => {
            const { factory } = getProdInfoFieldsValue();
            if (factory) {
              params.factory = factory;
            }
            return params;
          },
          resultField: 'data',
          labelField: 'productCategory',
          valueField: 'id',
          showSearch: true,
          immediate: true,
          alwaysLoad: true,
          filterOption: false,
          notFoundContent: null,
        },
      },

      {
        field: 'version',
        label: '文件版本',
        component: 'Input',
        componentProps: { placeholder: '0', disabled: true, prefix: 'T' },
        dynamicDisabled: true,
      },
      {
        field: 'bomType',
        label: 'BOM类型',
        component: 'ApiSelect',
        componentProps: {
          placeholder: 'BOM类型',
          api: () => baseStore.getDictionaryData('PCC.BomType', true),
          onChange: e => {
            console.log(e);
            if (state.bomType == 4 || e == 4) {
              state.customerFileList = [];
            }
            state.bomType = e;
            if (e == 4) {
              state.customerFileList = [];
            }
          },
          labelField: 'fullName',
          valueField: 'enCode',
          immediate: true,
        },
      },
      {
        field: 'docNumber',
        label: '文件编号',
        // dynamicDisabled: false,
        component: 'Input',
        componentProps: { placeholder: '' },
      },
      {
        field: 'applyCode',
        label: '系统编号',
        dynamicDisabled: true,
        component: 'Input',
        componentProps: { placeholder: '系统生成' },
      },
      {
        field: 'effectiveDate',
        label: '生效日期',
        component: 'DatePicker',
        componentProps: {
          placeholder: '生效日期',
          disabled: true,
        },
      },
      {
        field: 'creatorUserName',
        label: '制作人',
        component: 'CustomUserSelect',
        componentProps: {
          placeholder: '制作人',
          allowClear: true,
          showSearch: true,
        },
      },
      {
        field: 'handlerId',
        label: '审批人',
        component: 'CustomUserSelect',
        componentProps: {
          placeholder: '审批人',
        },
      },
      {
        field: 'remark',
        label: '特殊备注',
        component: 'Textarea',
        componentProps: { placeholder: '特殊备注', autoSize: { minRows: 1, maxRows: 5 } },
      },
    ];
  }

  function calcNumberOfKnives(numberOfKnives, process) {
    setProdInfoFieldsValue({
      mainOperatorSkills: null,
      auxiliaryOperatorSkills: null,
    });
    // const stepDistance = state.technologyList[0].stepDistance;
    if (!process || !numberOfKnives) return;
    getProcessParaList({
      numberOfKnives,
      typeCode: process,
    }).then(({ code, data }) => {
      if (code == 200) {
        console.log(data);
        if (data) {
          setTechnologyFieldsValue({
            adjustmentMetres: data.suggestedAdjustmentMetres,
          });
          const auxiliaryOperatorNumber = data.auxiliaryOperatorStaffing ? 1 : null;
          const mainOperatorNumber = data.mainOperatorStaffing ? 1 : null;
          setProdInfoFieldsValue({
            mainOperatorSkills: data.mainOperatorStaffing,
            auxiliaryOperatorSkills: data.auxiliaryOperatorStaffing,
            // 辅机手人数
            auxiliaryOperatorNumber: auxiliaryOperatorNumber,
            // 主机手人数
            mainOperatorNumber: mainOperatorNumber,
            standardManpower: (auxiliaryOperatorNumber || 0) + (mainOperatorNumber || 0),
          });

          const datalist = getTechnologyDataSource();
          datalist.forEach(item => {
            const { editValueRefs, processCode } = item;
            if (!processCode) return;
            if (processCode.startsWith('2') || processCode.startsWith('3')) {
              editValueRefs.speed = data.suggestedStartupSpeed;
              editValueRefs.speedUnit = data.suggestedStartupSpeedUnit;
            }
            //   1/(a + Number(b.wholeLength))
            //   1/(a + Number(b.wholeWidth))
          });
        }
      }
    });
  }

  function calcMetersTenHour(useQty, record) {
    // 主工序产能10(KPCS/H)*KCPS用量*10H=米数（四舍五入取整数）
    const { origin, unit, editValueRefs } = record;
    if (unit == 'M') {
      const mainTechnology = getTechnologyDataSource().find(item => item.isMain);
      console.log(mainTechnology, 'mainTechnology');
      if (mainTechnology) {
        const { capacity } = mainTechnology;
        console.log(capacity, 'capacity');
        const metersTenHour = Math.round(capacity * useQty * 10);
        editValueRefs.metersTenHour = metersTenHour;
        console.log(metersTenHour, 'metersTenHour');
      } else {
        createMessage.warning('请先选择主工序');
      }
    }
  }
</script>
<style scoped lang="less">
  .container-box {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
    padding-bottom: 110px;
  }

  .bom-content {
    //width: 20%;
    flex: 0 0 280px;
    padding: 0 16px 16px 0;
    //margin-top: 45px;
    min-width: 5%;
    max-width: 60%;
    height: 100%;
    overflow-x: auto;
    position: relative;

    .drag-box {
      position: absolute;
      right: 10px;
      height: 100%;
      display: flex;
      align-items: center;

      .drag-ctrl {
        width: 3px;
        height: 190px;
        background: #ccc;
        cursor: ew-resize;
        top: 50%;
        transform: translate(-50%);
      }
    }
  }

  .main-content {
    flex: 5;
    overflow: auto hidden;
    height: 100%;
    flex-direction: column;
    position: relative;
    padding-bottom: 40px;

    :deep(.ant-btn) {
      padding: 4px;
    }
  }

  .line {
    height: 1px;
    width: 100%;
    background: rgb(219 219 219);
    margin-bottom: 8px;
  }

  .icon-color {
    display: block;
    width: 40px;
    text-align: center;
    color: #ff7b00;
  }

  .bom-header {
    position: relative;
    height: 100%;

    & > .title {
      display: flex;
      //flex-direction: row;
      flex-flow: row-reverse wrap;
      justify-content: space-between;
      align-items: center;
      //padding-bottom: 5px;
      padding: 8px 0;
      background: #fff;
    }
  }

  .bom-list {
    //border-top: 1px solid #333;
    box-sizing: border-box;
    //height: 100%;
    //height: 600px;
  }

  .main-nav {
    display: flex;
    flex-direction: row;
    position: absolute;
    z-index: 11;
    align-items: center;
    justify-content: center;
    width: 100%;
    background: rgb(255 255 255 / 80%);
    border-bottom: 1px solid #dbdbdb;

    .nav-item {
      display: flex;
      padding: 8px 16px;
      flex-direction: column;
      align-items: center;
      gap: -3px;
      color: #666;
      cursor: pointer;
    }

    .active {
      border-bottom: 1px solid #ff7b00;
      color: #1a1a1a;
      transition: all 0.3s;
    }
  }

  :deep(.lydc-basic-form .ant-form-item:not(.ant-form-item-with-help)) {
    margin-bottom: 10px;
  }

  :deep(.ant-form-vertical .ant-form-item-label) {
    padding: 0 0 3px;
  }

  :deep(.subtitle-container) {
    padding-bottom: 0;
  }

  .technology-box {
    display: flex;
    height: 280px;
    width: 100%;
    box-sizing: border-box;
    background: #fafafa;
    padding: 0 5px;

    .item-box {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-top: 5px;
      margin-bottom: 5px;
    }
  }

  .mold-box {
    margin-top: 12px;
    display: flex;
    width: 100%;
    box-sizing: border-box;
    background: #fafafa;
    padding: 8px;
    padding-top: 0;
    height: 308px;
    flex-flow: column wrap;

    .content {
      //display: flex;
      //flex-direction: column;
      //flex-wrap: wrap;
      height: 320px;
      overflow: auto;
    }

    .to-be-generate {
      display: flex;
      flex-direction: row;
    }

    .item-box {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-bottom: 5px;
      background: #f2f2f2;
      padding: 4px 8px;
    }
  }

  .center {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .material {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    :deep(.lydc-basic-form .ant-form-item:not(.ant-form-item-with-help)) {
      margin-bottom: 0;
    }

    :deep(.subtitle-container .title) {
      width: max-content;
    }

    :deep(.basic-content-wrap div) {
      width: max-content;
    }
  }

  .technology-detail-wrapper {
    display: flex;
    flex-direction: column;

    .detail-wrapper {
      display: flex;
      flex-direction: row;
    }

    .left-detail {
      flex: 4;
    }

    .right-detail {
      flex: 2;
      display: flex;
      flex-direction: column;

      .agn-center {
        display: flex;
        align-items: center;
      }

      .message {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 4px 15px;
        border: 1px solid #dbdbdb;
        border-radius: 3px;
        margin: 0 5px;

        .name {
          color: #ff7b00;
        }
      }

      .engine-upload {
        margin: 5px 0;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
      }
    }
  }

  .engine-upload-wrapper {
    display: flex;
    flex-direction: column;
  }

  :deep(.lydc-tree) {
    background: #fafafa;
  }

  .scroll-bar {
    height: auto !important;
    background: #fafafa !important;
    //:deep(.scroll-container){
    //  height: auto;
    //}
  }

  .mold {
    :deep(.scroll-container) {
      height: auto;
    }

    :deep(.scroll-container .scrollbar__wrap) {
      margin-bottom: 0 !important;
      //padding-top: 15px;
      //box-sizing: border-box;
    }
  }

  :deep(.ant-tree) {
    background: transparent;
  }

  :deep(.ant-tree-show-line .ant-tree-switcher) {
    background: transparent;
  }

  .upload-wrapper {
    height: 520px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
  }

  :deep(.upload-wrapper > span) {
    width: 48%;
    margin-left: 10px;
    margin-right: 10px;
  }

  :deep(.upload-pic) {
    width: 100%;
  }

  .logo-tip {
    color: #ccc;
    text-align: center;
    font-size: 24px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px; /* 91.667% */
    margin-bottom: 24px;
  }

  // 上传前
  .before-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: #999;
  }

  // 上传中
  .uploading {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .uploading-title {
      display: flex;
      flex-direction: row;
      width: 100%;
      justify-content: center;
      align-items: center;
      margin-bottom: 10px;
    }

    .upload-name {
      margin-right: 20px;
      width: 200px;
    }
  }

  .item-gray {
    color: #999;
  }

  // 上传失败
  .error-info {
    display: flex;
    flex-direction: column;
    text-align: start;
    align-items: center;
    height: 100%;
    justify-content: center;

    .btn-container {
      margin-top: 24px;
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    .filename {
      color: #1a1a1a;
      margin-bottom: 16px;
      flex-wrap: wrap;

      & > div {
        width: max-content;
      }
    }

    .info {
      color: #999;
      margin-bottom: 8px;
    }
  }

  .upload-wrapper-item {
    display: flex;
    flex-direction: column;
    width: 100%;

    & > span:last-of-type {
      height: max-content;
      min-height: 200px;
    }

    .upload-btn-wrapper {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-bottom: 10px;

      .tip {
        margin-left: 8px;
      }
    }
  }

  .break {
    word-break: break-all;
    text-align: start;
  }

  .ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
  }

  .file-item {
    padding: 3px 10px;
    box-sizing: border-box;
  }

  .toggle-current {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: 10px;
  }

  .state-box {
    margin: 0 10px;
  }

  .custom-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;

    .box {
      display: flex;
      flex-flow: row wrap;

      .item {
        margin: 3px;
        display: flex;
        flex-direction: row;
        align-items: center;
      }

      :deep(.ant-input-number-input) {
        width: 90px;
      }
    }

    .img-box {
      width: 30px;
      height: 30px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }

    .right-btn {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  :deep(.ant-upload.ant-upload-drag .ant-upload) {
    padding: 0;
  }

  :deep(.ant-input-prefix) {
    margin-right: 0;
  }

  :deep(.ant-upload.ant-upload-select-picture-card) {
    margin-bottom: 0;
  }

  :deep(.ant-input-number-input) {
    min-width: 90px;
  }

  :deep(.ant-input-group.ant-input-group-compact > *:not(:last-child)) {
    border-right-width: 0;
  }

  :deep(.lydc-tag) {
    width: 70px;
  }

  :deep(.ant-card .ant-card-body) {
    padding: 12px;
  }
</style>
