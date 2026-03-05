<template>
  <BasicPopup
    v-bind="$attrs"
    @register="registerPopup"
    :showOkBtn="false"
    :okText="t('common.temporarySave')"
    :showCancelBtn="true"
    destroyOnClose
    @ok="handleSubmit"
    class="full-popup p-10px">
    <template #title>
      <a-space>
        <p>PCC</p>
        <a-button v-auth="'btn_edit'" @click="handleDrawView">{{ t('dict.MoldApplyColumn.drawingshistory') }} </a-button>
        <template v-if="cacheList[index]?.currentNode != 'LeaderReview'">
          <a-button v-auth="'btn_print'" @click="handlePrint">{{ t('common.printText') }} </a-button>
          <a-button v-auth="'btn_edit'" v-if="mode === 'edit'" @click="handleHistory">{{ t('dict.PCCApplyColumn.referenceHistoryRecord') }} </a-button>
          <a-button v-auth="'btn_edit'" v-if="mode === 'edit'" @click="handleAddTemplate">{{ t('dict.PCCApplyColumn.addAsTemplate') }} </a-button>
          <a-button v-auth="'btn_edit'" v-if="mode === 'edit'" @click="handleTemplateList" type="primary" ghost
            >{{ t('dict.PCCApplyColumn.invokeTemplate') }}
          </a-button>
        </template>
      </a-space>
    </template>
    <template #insertToolbar>
      <a-space :size="10">
        <a-button
          v-auth="'btn_edit'"
          v-if="mode === 'edit'"
          @click="
            () => {
              const { numberOfKnives, process } = getTechnologyFieldsValue();
              calcNumberOfKnives(numberOfKnives, process, true);
              calcUseQty();
              calcDowntimeOneHourUtilizationRate();
            }
          "
          type="primary"
          ghost
          >{{ t('common.calText') }}
        </a-button>
        <a-button v-auth="'btn_edit'" v-if="mode === 'edit'" @click="handleSubmit('save')" type="primary" ghost>{{ t('common.temporarySave') }} </a-button>
        <a-button v-auth="'btn_edit'" v-if="!!showSubmit && !showReview" @click="handleSubmit('commit')" type="primary">{{ t('common.submit') }} </a-button>
        <a-button
          v-auth="'btn_edit'"
          v-if="!!showReject && (cacheList[index].currentNode == 'PCCLeaderReview' || cacheList[index].currentNode == 'LeaderReview')"
          @click="handleReject"
          type="primary"
          >{{ t('common.rejectText') }}
        </a-button>
        <a-button
          v-auth="'btn_edit'"
          v-if="!!showReview && (cacheList[index].currentNode == 'PCCLeaderReview' || cacheList[index].currentNode == 'LeaderReview')"
          @click="handleSubmit('commit')"
          type="primary"
          >{{ t('dict.Flow.NodeAction.1') }}
          <!--					@click="handleReview"-->
        </a-button>
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
    <div ref="container" class="container-box">
      <div ref="bomContent" class="bom-content">
        <div class="drag-box">
          <div ref="divider" class="drag-ctrl"></div>
        </div>
        <ScrollContainer style="background: #fafafa">
          <div class="bom-header">
            <div class="title">
              <div style="cursor: pointer" @click="handleUnpack">
                <i v-if="isPack" class="icon-ym icon-ym-nav-prev icon-color" />
                <i v-else class="icon-ym icon-ym-nav-next icon-color" />
              </div>
              <Subtitle :title="t('common.Bom')" />
            </div>
            <!--            <div class="line"></div>-->
            <div class="bom-list">
              <BasicTree
                :treeData="treeData"
                :checkable="false"
                :showLine="true"
                :defaultExpandAll="true"
                @dblclick="handleDblClick"
                :clickRowToExpand="true"
                :fieldNames="{
                  children: 'children',
                  title: 'code',
                  key: 'id',
                }" />
            </div>
          </div>
        </ScrollContainer>
      </div>
      <div ref="mainContent" class="main-content">
        <div ref="navBox" class="main-nav" @click="handleScroll">
          <div class="nav-item active" data-index="base-info">{{ t('common.baseinfo') }} </div>
          <div class="nav-item" data-index="process-flow">{{ t('common.process') }} </div>
          <div class="nav-item" data-index="material">{{ t('common.metaria') }} </div>
          <div class="nav-item" data-index="packaging">{{ t('common.packageMetaria') }} </div>
          <div class="nav-item" data-index="process-flow-and-upload">{{ t('dict.PCCApplyColumn.processFlowDetailsAndDocumentUpload') }} </div>
          <div class="nav-item" data-index="changeResume">{{ t('dict.PCCApplyColumn.changeHistory') }} </div>
        </div>

        <ScrollContainer ref="mainScroll" style="margin-top: 39px">
          <a-card class="lydc-content-wrapper-search-box p-12px mb-16px" style="border-bottom: 1px solid #dbdbdb">
            <!--            <Subtitle title="基础信息" id="base-info" style="margin-top: 40px" />-->
            <a-row :gutter="20">
              <a-col :span="12">
                <a-row :gutter="20">
                  <a-col :span="12">
                    <Subtitle :title="t('common.baseinfo')" id="base-info" />
                    <BasicForm @register="registerBaseInfoForm"></BasicForm>
                  </a-col>
                  <a-col :span="12">
                    <Subtitle :title="t('dict.PCCApplyColumn.productionInformation')" />
                    <BasicForm @register="registerProdInfoForm"></BasicForm>
                  </a-col>
                </a-row>
              </a-col>
              <a-col :span="6">
                <Subtitle :title="t('dict.PCCApplyColumn.processInformation')" />
                <BasicForm @register="registerTechnologyForm">
                  <template #addTechnology="{ model, field }">
                    <a-button v-if="state.mode == 'edit'" type="link" class="flex self-center items-center" @click="handleAddTechnology">
                      <template #icon>
                        <PlusOutlined />
                      </template>
                      <!-- 步距组号 -->
                      {{ t('common.stepNumber') }}
                    </a-button>
                  </template>
                </BasicForm>
                <ScrollContainer class="technology-box">
                  <a-row :gutter="[5, 0]" v-for="(item, index) in technologyList" class="item-box">
                    <!--                    <a-col :span="8"></a-col>-->
                    <a-col :span="13">
                      <span :class="index == 0 ? 'span-required' : ''"
                        >{{ index + 1 }}、{{ index === 0 ? t('dict.ProcessLevelEnum.Main') : '' }}{{ t('common.step') }}(MM)</span
                      >
                      <LydcInputNumber
                        :disabled="mode !== 'edit'"
                        v-model:value="item.stepDistance"
                        :placeholder="t('common.step')"
                        @change="
                          () => {
                            if (index !== 0) return;
                            nextTick(() => {
                              const { numberOfKnives, process } = getTechnologyFieldsValue();
                              calcNumberOfKnives(numberOfKnives, process, true);
                              calcUseQty();
                              calcDowntimeOneHourUtilizationRate();
                            });
                          }
                        " />
                    </a-col>
                    <!--                    <a-col :span="3"></a-col>-->
                    <a-col :span="8">
                      <span :class="index == 0 ? 'span-required' : ''">{{ t('common.modules') }}</span>
                      <LydcInputNumber
                        :disabled="mode !== 'edit'"
                        v-model:value="item.modulus"
                        @change="
                          () => {
                            if (index !== 0) return;
                            nextTick(() => {
                              const { numberOfKnives, process } = getTechnologyFieldsValue();
                              calcNumberOfKnives(numberOfKnives, process, true);
                              calcUseQty();
                              calcDowntimeOneHourUtilizationRate();
                            });
                          }
                        "
                        :placeholder="t('common.modules')" />
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
                <div class="flex justify-between">
                  <Subtitle :title="t('dict.CommonCol.moldNo')" />
                  <a-switch v-model:checked="chooseNewPartNumType" :checked-children="t('dict.WorkOrder.Type.3')" :un-checked-children="t('common.oldModel')" />
                </div>
                <a-row style="margin-bottom: 12px">
                  <a-col :span="19">
                    <a-input
                      :placeholder="`${t('common.example')}:${chooseNewPartNumType ? 'AF-BAZZ125ABCD-AA' : 'AF-BAZ125ABCD-AA'}`"
                      v-model:value="moldGenerate"
                      :disabled="state.mode !== 'edit'"
                      @keydown.enter.native="handleMoldGenerate" />
                  </a-col>
                  <a-col :span="5">
                    <a-button v-if="state.mode == 'edit'" @click="handleMoldGenerate" type="link">{{ t('dict.PCCApplyColumn.generate') }} </a-button>
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
          <!-- 工艺流程  -->
          <a-card class="lydc-content-wrapper-search-box p-12px" style="border-bottom: 1px solid #dbdbdb; margin-top: 10px">
            <div class="material">
              <div class="flex flex-row items-center">
                <Subtitle :title="t('common.process')" id="process-flow" />
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
                      <a-table-summary-cell :index="0" :col-span="2">{{ t('dict.WageRateColumn.total') }}: </a-table-summary-cell>
                      <!--                      <a-table-summary-cell :index="4">{{ getTechnologyDataSource().reduce((acc, curr) => acc + curr.adjustmentTime || 0); }}-->
                      <!--                      </a-table-summary-cell>-->
                      <a-table-summary-cell :index="4" :col-span="4"
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
              <Subtitle :title="t('dict.ProcessSchedulingColumn.material')" id="material" />
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
                          {{ index + 1 }}、{{ item.processCode }}
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
            <Package ref="packageRef" />
          </a-card>

          <a-card class="lydc-content-wrapper-search-box p-12px" style="border-bottom: 1px solid #dbdbdb; margin-top: 10px">
            <div class="technology-detail-wrapper">
              <Subtitle :title="t('dict.PCCApplyColumn.processFlowDetailsAndDocumentUpload')" id="process-flow-and-upload" />
              <div class="detail-wrapper">
                <div class="left-detail">
                  <BasicTable @register="registerTechnologyDetailTable">
                    <template #bodyCell="{ column, record, index, text }">
                      <template v-if="column.dataIndex === 'imageList'">
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
                <div class="right-detail">
                  <Subtitle :title="t('dict.PCCApplyColumn.documentUpload')" />
                  <a-row style="align-items: center">
                    <a-col :span="3">
                      <div class="agn-center">{{ t('dict.PCCApplyColumn.installationDiagram') }}:</div>
                    </a-col>
                    <a-col :span="18">
                      <div v-if="installImageList.length > 0" class="message">
                        <div
                          class="name cursor-pointer"
                          @click="handlePreview({ ...installImageList[0], flagPath: installImageList[0].filePath, name: installImageList[0].fileName })"
                          >{{ installImageList[0]?.fileName }}
                        </div>
                        <i @click="downloadInstallFile" class="icon-ym icon-ym-btn-download" style="color: #ff7b00; cursor: pointer"></i>
                      </div>
                      <div v-else>
                        <div class="message" style="color: #dbdbdb">{{ t('dict.PCCApplyColumn.uploadFile') }}} </div>
                      </div>
                    </a-col>
                    <a-col :span="3" style="display: flex; justify-content: flex-end">
                      <a-upload v-feature :multiple="false" :before-upload="beforeInstallUpload" :showUploadList="false">
                        <a-button :disabled="mode !== 'edit'" class="agn-center" style="text-align: right">{{ t('common.uploadText') }} </a-button>
                      </a-upload>
                    </a-col>
                  </a-row>
                  <div class="engine-upload-wrapper" v-loading="engineLoading" v-if="state.bomType != 4">
                    <div class="engine-upload flex justify-around">
                      <Subtitle :title="t('dict.PriceInquiryColumn.engineeringDrawingsName')" />
                      <a-button @click="getVersion">{{ t('common.quoteText') }}</a-button>
                    </div>
                    <div class="upload-wrapper-item">
                      <a-upload v-feature class="btn-upload" :multiple="true" v-bind="customerUploadOption"></a-upload>
                      <a-upload-dragger
                        v-feature
                        :multiple="true"
                        :disabled="mode !== 'edit' || customerFileList.findIndex(item => item.status == 1) !== -1"
                        :class="customerState.uploadStatus === UploadStatus.Error ? 'upload-pic upload-error' : 'upload-pic'"
                        v-bind="customerUploadOption">
                        <!--    上传前      -->
                        <template v-if="customerState.uploadStatus === UploadStatus.BeforeUploading">
                          <div v-if="state.customerFileList.length <= 0" class="before-box"> {{ t('component.upload.canDragToUpload') }} </div>
                          <div v-else>
                            <a-table :data-source="state.customerFileList" bordered :columns="engineColumns" :pagination="false" class="pic-list">
                              <template #bodyCell="{ column, record, text, index }">
                                <template v-if="column.dataIndex === 'flagVersion'"> T{{ record.flagVersion }}</template>
                                <template v-else-if="column.dataIndex === 'status'">
                                  <!--                                  <template v-if="record.flagVersion == 0">-->
                                  <!--                                    <a-tag>已上传</a-tag>-->
                                  <!--                                  </template>-->
                                  <template v-if="record.status == 1">
                                    <LydcTag style="min-width: 70px" theme="gray"
                                      >{{ record.flagVersion == 0 ? t('component.upload.uploaded') : '' }} {{ t('common.waitAuditText') }}
                                    </LydcTag>
                                  </template>
                                  <template v-if="record.status == 2">
                                    <LydcTag style="min-width: 70px" theme="green"
                                      >{{ record.flagVersion == 0 ? t('component.upload.uploaded') : '' }} {{ t('dict.enableStatus.1') }}
                                    </LydcTag>
                                  </template>
                                  <template v-if="record.status == 3">
                                    <LydcTag style="min-width: 70px" theme="red"
                                      >{{ record.flagVersion == 0 ? t('component.upload.uploaded') : '' }} {{ t('dict.PurchaseQuotation.Status.2') }}
                                    </LydcTag>
                                  </template>
                                </template>
                                <template v-else-if="column.dataIndex === 'name'">
                                  <a style="width: 120px" @click.stop="handlePreview(record)">{{ record.name }}</a>
                                </template>
                                <template v-else-if="column.dataIndex === 'action'">
                                  <!--                                  <a-button type="link" :disabled="record.flagVersion == 0" @click.stop="handleDownload(record)">下载 </a-button>-->
                                  <a-button type="link" @click.stop="handleDownload(record)">{{ t('component.upload.download') }} </a-button>
                                </template>
                                <template v-else-if="column.dataIndex === 'delete'">
                                  <a-button type="link" :disabled="record.flagVersion != 0" @click.stop="handleDeletePic(index)"
                                    >{{ t('common.delText') }}
                                  </a-button>
                                </template>
                              </template>
                            </a-table>
                          </div>
                        </template>
                        <!--    上传中      -->
                        <template v-if="customerState.uploadStatus === UploadStatus.Uploading">
                          <!--              <template v-if="state.uploadStatus === UploadStatus.BeforeUploading">-->
                          <div class="uploading">
                            <a-progress style="width: 80%" :percent="customerState.procedure" size="small" />
                          </div>
                        </template>
                        <!--    上传失败      -->
                        <template v-if="customerState.uploadStatus === UploadStatus.Error">
                          <div class="error-info">
                            <p class="filename flex ct-start">
                              {{ customerState.uploadFileInfo.name }}
                              <img :src="errorSvg" style="margin-left: 12px" />
                            </p>
                            <p class="info">{{ t('component.upload.fileSize') }}： {{ formatFileSize(customerState.uploadFileInfo.size || 0) }}</p>
                            <p class="info" style="margin-bottom: 0">{{ t('common.uploadDate') }}： {{ dayjs().tz().format('YYYY/MM/DD HH:mm:ss') }}</p>
                            <div class="btn-container">
                              <a-upload v-feature v-bind="customerUploadOption">
                                <!--                    <a-button>重新选择</a-button>-->
                              </a-upload>
                              <a-button danger style="margin-left: 20px" @click="handleRemoveCustomerFile">{{ t('common.delText') }} </a-button>
                            </div>
                          </div>
                        </template>
                        <!--    上传成功      -->
                        <template v-if="customerState.uploadStatus === UploadStatus.Success">
                          <div class="error-info">
                            <div style="display: flex; flex-direction: row; align-items: center; margin-bottom: 10px">
                              <img :src="successSvg" style="height: 22px; margin-right: 12px" />
                              <div class="info" style="margin-bottom: 0">{{ t('component.upload.uploadSuccess') }} </div>
                            </div>
                            <p class="info" style="margin-bottom: 0">{{ t('common.uploadDate') }}： {{ dayjs().tz().format('YYYY/MM/DD HH:mm:ss') }}</p>
                            <div class="btn-container">
                              <a-button ghost type="primary" style="margin-left: 20px" @click="handleRemoveCustomerFile"
                                >{{ t('common.continueUpload') }}
                              </a-button>
                            </div>
                          </div>
                        </template>
                      </a-upload-dragger>
                    </div>
                  </div>
                  <div v-else class="engine-upload-wrapper">
                    <div class="engine-upload flex justify-around">
                      <Subtitle :title="t('dict.PCCApplyColumn.sampleDrawing')" />
                      <a-button @click="getVersion">{{ t('common.quoteText') }}</a-button>
                    </div>
                    <div class="upload-wrapper-item">
                      <a-upload v-feature class="btn-upload" :multiple="true" v-bind="customerUploadOption"></a-upload>
                      <a-upload-dragger
                        v-feature
                        :multiple="true"
                        :disabled="mode !== 'edit' || customerFileList.findIndex(item => item.status == 1) !== -1"
                        :class="customerState.uploadStatus === UploadStatus.Error ? 'upload-pic upload-error' : 'upload-pic'"
                        v-bind="customerUploadOption">
                        <!--    上传前      -->
                        <template v-if="customerState.uploadStatus === UploadStatus.BeforeUploading">
                          <div v-if="state.customerFileList.length <= 0" class="before-box"> {{ t('component.upload.canDragToUpload') }} </div>
                          <div v-else>
                            <a-table :data-source="state.customerFileList" bordered :columns="sampleColumns" :pagination="false" class="pic-list">
                              <template #bodyCell="{ column, record, text, index }">
                                <template v-if="column.dataIndex === 'name'">
                                  <a @click.stop="handlePreview(record)">{{ record.name }}</a>
                                </template>
                                <template v-else-if="column.dataIndex === 'action'">
                                  <!--                                  <a-button type="link" :disabled="record.flagVersion == 0" @click.stop="handleDownload(record)">下载 </a-button>-->
                                  <a-button type="link" @click.stop="handleDownload(record)">{{ t('common.downloadText') }} </a-button>
                                </template>
                                <template v-else-if="column.dataIndex === 'delete'">
                                  <a-button type="link" :disabled="record.flagVersion != 0" @click.stop="handleDeletePic(index)">删除 </a-button>
                                </template>
                              </template>
                            </a-table>
                          </div>
                        </template>
                        <!--    上传中      -->
                        <template v-if="customerState.uploadStatus === UploadStatus.Uploading">
                          <!--              <template v-if="state.uploadStatus === UploadStatus.BeforeUploading">-->
                          <div class="uploading">
                            <a-progress style="width: 80%" :percent="customerState.procedure" size="small" />
                          </div>
                        </template>
                        <!--    上传失败      -->
                        <template v-if="customerState.uploadStatus === UploadStatus.Error">
                          <div class="error-info">
                            <p class="filename flex ct-start">
                              {{ customerState.uploadFileInfo.name }}
                              <img :src="errorSvg" style="margin-left: 12px" />
                            </p>
                            <p class="info">{{ t('component.upload.fileSize') }}： {{ formatFileSize(customerState.uploadFileInfo.size || 0) }}</p>
                            <p class="info" style="margin-bottom: 0">{{ t('common.uploadDate') }}： {{ dayjs().tz().format('YYYY/MM/DD HH:mm:ss') }}</p>
                            <div class="btn-container">
                              <a-upload v-feature v-bind="customerUploadOption">
                                <!--                    <a-button>重新选择</a-button>-->
                              </a-upload>
                              <a-button danger style="margin-left: 20px" @click="handleRemoveCustomerFile">{{ t('component.upload.del') }} </a-button>
                            </div>
                          </div>
                        </template>
                        <!--    上传成功      -->
                        <template v-if="customerState.uploadStatus === UploadStatus.Success">
                          <div class="error-info">
                            <div style="display: flex; flex-direction: row; align-items: center; margin-bottom: 10px">
                              <img :src="successSvg" style="height: 22px; margin-right: 12px" />
                              <div class="info" style="margin-bottom: 0">{{ t('component.upload.uploadSuccess') }} </div>
                            </div>
                            <p class="info" style="margin-bottom: 0">{{ t('common.uploadDate') }}： {{ dayjs().tz().format('YYYY/MM/DD HH:mm:ss') }}</p>
                            <div class="btn-container">
                              <a-button ghost type="primary" style="margin-left: 20px" @click="handleRemoveCustomerFile">继续上传 </a-button>
                            </div>
                          </div>
                        </template>
                      </a-upload-dragger>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a-card>

          <a-card class="lydc-content-wrapper-search-box p-12px" style="border-bottom: 1px solid #dbdbdb; margin-top: 10px">
            <Subtitle :title="t('dict.PCCApplyColumn.changeHistory')" id="changeResume" />
            <BasicTable @register="registerChangeHistoryTable"></BasicTable>
          </a-card>
        </ScrollContainer>
      </div>
    </div>
    <Preview ref="filePreviewRef" />
    <SaveTemplateModal @register="registerSaveTemplateForm" />
    <TemplateList @register="registerTemplateList" @submit="handleTmpListSubmit" />
    <DrawViewModal @register="registerDrawViewModal" />
  </BasicPopup>
  <Template @register="registerTemplate" @submit="handleTemplateSubmit" />
  <Upgrade @register="registerUpgradeModal" @submit="handleUpgradeSubmit" @openAttachUpload="openAttachUpload(true, $event)" />
  <ECNModal
    @register="registerECNModal"
    @submit="handleECNSubmit"
    @close="
      () => {
        emit('reload');
        closePopup();
      }
    " />
  <RejectModal
    @register="registerRejectModal"
    @reload="
      () => {
        emit('reload');
        closePopup();
      }
    " />
</template>
<script setup lang="ts">
  import { BasicPopup, usePopup, usePopupInner } from '/@/components/Popup';
  import { Subtitle } from '/@/components/Subtitle';
  import BasicTree from '/@/components/Tree/src/BasicTree.vue';
  import { ScrollContainer } from '/@/components/Container';
  import { nextTick, reactive, ref, toRaw, toRefs, unref } from 'vue';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form';
  import SaveTemplateModal from '/@/views/engineering/pcc/pccApply/components/SaveTemplateModal.vue';
  import TemplateList from './TemplateList.vue';
  import Template from './Template.vue';
  import { getChangeHistoryColumns, materialRowData, technologyRowData } from '/@/views/engineering/pcc/pccApply/CONFIG';
  import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';
  import { cloneDeep, uniqBy } from 'lodash-es';
  import { useMessage } from '/@/hooks/web/useMessage';
  import AddCustomRows from './AddCustomRows.vue';
  import BasicTable from '/@/components/Table/src/BasicTable.vue';
  import { ActionItem, BasicColumn, TableAction, useTable } from '/@/components/Table';
  import { buildUUID } from '/@/utils/uuid';
  import { getProcessAllList, getProcessParaList, postHistoryRecord } from '/@/api/engineering/quotatios';
  import { getUnitListByKeyword } from '/@/api/finance/materialPrice';
  import { uploadPCCImg } from '/@/api/sys/upload';
  import { ImageUpload } from '/@/components/Upload';
  import { getViewportOffset } from '/@/utils/domUtils';
  import { getFactoryList } from '/@/api/business/shippingspace';
  import { useBaseStore } from '/@/store/modules/base';
  import Package from './Package.vue';
  import {
    addFinishedPartsBomPcc,
    addHalfFinishedPartsBomPcc,
    bulkCommitPcc,
    commitPcc,
    getBomDetail,
    getBomStructure,
    getECNByPartNumber,
    getEngineeringDrawingsHistory,
    getFactorySap,
    getIsOngoing,
    getMaterialSearchByShortCode,
    getPccDetail,
    getPccRevisionHistory,
    getProductType,
    rejectPcc,
    updateFinishedPartsBomPcc,
    updateHalfFinishedPartsBomPcc,
    uploadInstallFile,
  } from '/@/api/engineering/pcc';
  import { downloadByUrl } from '/@/utils/file/download';
  import { UploadStatus } from '/@/views/basicData/productCodeApply/types';
  import errorSvg from '/@/assets/svg/report/error.svg';
  import successSvg from '/@/assets/svg/report/success.svg';
  import { formatFileSize } from '/@/utils/file/base64Conver';
  import dayjs from 'dayjs';
  import { message, UploadFile } from 'ant-design-vue';
  import { getSapFactoryList } from '/@/api/purchase/supplierInformation';
  import ApiSelect from '/@/components/Form/src/components/ApiSelect.vue';
  import Preview from './Preview.vue';
  import { useModal } from '/@/components/Modal';
  import Upgrade from '/@/views/engineering/pcc/pccApply/components/HistoryModal.vue';
  import ECNModal from '/@/views/engineering/pcc/pccApply/components/ECNModal.vue';
  import { useUserStore } from '/@/store/modules/user';
  import { RejectModal } from '/@/components/CustomComponents';
  import { isNullAndUnDef, isNullOrUnDef } from '/@/utils/is';
  import DrawViewModal from './DrawViewModal.vue';
  import { http2s } from '/@/adapter/utils';
  import { createFromPcc } from '/@/api/business/quota';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { bignumber, multiply } from 'mathjs';
  import { printPCCDetail } from './print/index';

  const baseStore = useBaseStore();
  const { createMessage } = useMessage();

  const [registerECNModal, { openModal: ecnOpenModal, closeModal: ecnCloseModal }] = useModal();
  const [registerSaveTemplateForm, { openModal: openSaveTemplateFormModal }] = useModal();
  const [registerTemplateList, { openModal: openTemplateListModal }] = useModal();
  const [registerPopup, { closePopup, changeLoading }] = usePopupInner(init);
  const [registerTemplate, { openPopup: openTemplate }] = usePopup();
  const [registerUpgradeModal, { openModal: openUpgradeModal, closeModal: closeUpgradeModal }] = useModal();
  const [registerRejectModal, { openModal: openRejectModal }] = useModal();
  const [registerDrawViewModal, { openModal: openDrawViewModal }] = useModal();

  const emit = defineEmits(['reload', 'register']);

  const divider = ref(null);
  const container = ref(null);
  const bomContent = ref(null);
  const mainContent = ref(null);
  const navBox = ref(null);
  const mainScroll = ref(null);
  const packageRef = ref(null);

  const userStore = useUserStore();

  const customerState = reactive({
    procedure: 1,
    uploadStatus: UploadStatus.BeforeUploading,
    uploadFileInfo: {} as UploadFile,
  });

  const { t } = useI18n();

  const regex = /^(|[1-9][0-9]*)$/;

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
    return new Promise((resolve, reject) => {
      if (state.customerFileList.find(item => item.status == 1)) return false;
      customerState.uploadStatus = UploadStatus.BeforeUploading;
      const { customerFileList, index, cacheList } = state;
      getIsOngoing({
        PartNumber: cacheList[index].insidePartNumber,
      }).then(({ data }) => {
        console.log(data);
        if (data) {
          // flag = false
          createMessage.warning('该料号有工程图纸在审核中，不能上传新的工程图纸');
          resolve();
        } else {
          // 判断重复
          fileList.map(file => {
            if (!customerFileList.find(item => item.uid == file.uid || item.name == file.name)) {
              file.flagVersion = 0;
              file.isNewUpload = true;
              customerFileList.unshift(file);
              reject();
            }
          });
        }
      });
    });
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
    chooseNewPartNumType: true,
    engineLoading: false,
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
    chooseNewPartNumType,
    engineLoading,
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
    layout: 'vertical',
    labelWidth: 220,
    baseColProps: {
      span: 24,
    },
    i18nConfig: {
      moduleCode: 'PCCColumn',
      transferRange: ['placeholder', 'label'],
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
    labelAlign: 'right',
    i18nConfig: {
      moduleCode: 'PCCApplyColumn',
      transferRange: ['placeholder', 'label'],
    },
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
    downloadByUrl({
      url: http2s(state.installImageList[0].filePath),
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
    layout: 'vertical',
    labelWidth: 220,
    baseColProps: {
      span: 24,
    },
    i18nConfig: {
      moduleCode: 'PCCColumn',
      transferRange: ['placeholder', 'label'],
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
    labelWidth: 220,
    layout: 'vertical',
    baseColProps: {
      span: 24,
    },
    i18nConfig: {
      moduleCode: 'PCCColumn',
      transferRange: ['placeholder', 'label'],
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
      title: t('common.action'),
      dataIndex: 'action',
    },
    i18nConfig: {
      moduleCode: 'PCCColumn',
    },
  });

  function handleTmpListSubmit(data) {
    openTemplate(true, {
      index: 0,
      mode: 'view',
      cacheList: [data],
    });
  }

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
          onOk: handleChangeMaterial.bind(null, 'delete', { uuid: record.uuid, index }),
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
      title: t('common.action'),
      dataIndex: 'action',
    },
    i18nConfig: {
      moduleCode: 'PCCColumn',
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
          onOk: handleChangeTechnology.bind(null, 'delete', { uuid: record.uuid, index }),
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
    i18nConfig: {
      moduleCode: 'PCCColumn',
    },
    // actionColumn: {
    //   width: 120,
    //   title: "操作",
    //   dataIndex: "action"
    // }
  });

  // 变更履历
  const [
    registerChangeHistoryTable,
    {
      setTableData: setChangeHistoryTableData,
      getDataSource: getChangeHistoryDataSource,
      setCacheColumnsByField: setChangeHistoryCacheColumnsByField,
      updateTableDataRecord: updateChangeHistoryTableDataRecord,
      updateTableData: updateChangeHistoryTableData,
      insertTableDataRecord: insertChangeHistoryTableDataRecord,
      deleteTableDataRecord: deleteChangeHistoryTableDataRecord,
    },
  ] = useTable({
    columns: getChangeHistoryColumns(),
    pagination: false,
    showTableSetting: false,
    striped: true,
    showIndexColumn: false,
    isCanResizeParent: true,
    canResize: false,
    i18nConfig: {
      moduleCode: 'PCCColumn',
    },
  });

  function getTreeData(data) {
    getBomStructure(data).then(({ code, data }) => {
      if (code == 200) {
        state.treeData = data;
      }
    });
  }

  function handleDeteleManualPackaging(record, i) {
    if (state.mode !== 'edit') return;
    record.manualPackagingList.splice(i, 1);
  }

  function initData(data) {
    changeLoading(true);
    state.technologyList = [
      {
        stepDistance: '',
        modulus: '',
      },
    ];
    setTimeout(() => {
      changeLoading(false);
    }, 1000);
    const managerId = userStore.getUserInfo?.managerId;
    state.customerFileList = [];
    console.log('data.iddata.iddata.iddata.iddata.iddata.iddata.iddata.id', data);
    console.log(data.id, 'data.iddata.iddata.iddata.id');

    console.log('获取工程图纸获取工程图纸获取工程图纸获取工程图纸获取工程图纸');

    if (data.id) {
      state.bomId = data.id;
      const cacheList = state.cacheList;
      const index = state.index;
      console.log(mode.value, '-----------555mode');
      // if (mode.value == "view") {
      //   // 获取工程图纸

      // }
      // 请求Bom结构
      const bomDetail = getBomDetail(data);
      // 请求PCC
      const pccDetail = getPccDetail({ id: cacheList[index].id });
      Promise.all([bomDetail, pccDetail])
        .then(([domDetailRes, pccDetailRes]) => {
          console.log('promiseAllpromiseAllpromiseAllpromiseAllpromiseAll');
          const { code: bomCode, data: bomData } = domDetailRes;
          const { code: pccCode, data: pccData } = pccDetailRes;
          // bomData
          console.log(bomData);
          console.log(pccData);
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
              console.log('333333333333333333333333');
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
              console.log('--------isBonded----------');
              console.log(parentPartInfo.isBonded);
              setProdInfoFieldsValue({
                ...parentPartInfo,
                workshopEnv: isNullOrUnDef(parentPartInfo.workshopEnv) ? undefined : parentPartInfo.workshopEnv + '',
                process: parentPartInfo.process + '',
                // mainOperatorSkills: parentPartInfo.mainOperatorSkills + '',
                // auxiliaryOperatorSkills: parentPartInfo.auxiliaryOperatorSkills + '',
                businessType: parentPartInfo.businessType ? parentPartInfo.businessType + '' : '',
                isBonded: isNullOrUnDef(parentPartInfo.isBonded) ? undefined : parentPartInfo.isBonded + '',
              });
              setProdInfoProps({
                disabled: state.mode !== 'edit',
              });
              setTechnologyFieldsValue({
                ...parentPartInfo,
                // utilizationRate: parentPartInfo.utilizationRate * 100,
              });
              console.log(materialList, 66666666666);
              setTechnologyProps({
                disabled: state.mode !== 'edit',
              });
              setTechnologyTableFieldsValue({
                ...parentPartInfo,
                // utilizationRate: parentPartInfo.utilizationRate * 100,
                downtimeOneHour: Number(parentPartInfo.downtimeOneHour).toFixed(2),
                utilizationRate: (Number(parentPartInfo.utilizationRate) * 100).toFixed(2),
              });
              setTechnologyTableFieldsProps({
                disabled: state.mode !== 'edit',
              });
              console.log(materialList, 777777777777);
              state.installImageList = installationDiagramList;
              state.technologyList = stepDistanceList?.map(item => {
                return {
                  ...item,
                  uuid: item.id,
                  stepDistance: item.stepDistance ? item.stepDistance + '' : null,
                  modulus: item.modulus ? item.modulus + '' : null,
                  ...editMode,
                };
              });
              console.log(materialList, 8888888888);
              state.toBeGenerateList = moldList;
              console.log(materialList, 99999999999);
              const s = materialList.map(item => ({
                ...item,
                ...editMode,
                // origin: {
                // 	...item,
                // 	useQty: item.useQty / item.useQtyMultiple,
                // },
                uuid: item.id,
                utilizationRate: mode.value == 'edit' ? item.utilizationRate * 100 : item.utilizationRate * 100 + '%',
                disabled: {
                  partNumber: true,
                  description: true,
                  color: true,
                  utilizationRate: true,
                  metersTenHour: true,
                  useQty: true,
                },
              }));
              console.log(s, 'ssssssssssssss');
              setMaterTableData(s);

              if (packingMaterialCustomList.length == 0 && packingMaterialFixedList == 0) {
                unref(packageRef).init({
                  shipPattern: cacheList[index].shipPattern,
                  source: 'PCC',
                });
              } else {
                unref(packageRef).setTableData({
                  packingMaterialCustomList: packingMaterialCustomList.map(item => ({ ...item, uuid: item.id })),
                  packingMaterialFixedList: packingMaterialFixedList.map(item => ({ ...item, uuid: item.id })),
                  packageSpecQty: parentPartInfo.packSpecQtyR || parentPartInfo.packSpecQtyPN,
                  config: {
                    mode: state.mode,
                    source: state.source,
                    shipPattern: cacheList[index].shipPattern,
                  },
                });
              }

              console.log(666666);
              console.log(processList, 'processListprocessList');
              const processTableData = processList.map(item => {
                console.log(item, 'itemitemitemitemitemitemitemitem');
                try {
                  console.log(
                    {
                      ...item,
                      imageList: item.imageList.map(v => v.filePath),
                      isMain: item.isMain ? 1 : 0,
                      defectRate: item.defectRate * 100,
                      uuid: item.id,
                      ...editMode,
                    },
                    '0000000000000000000000',
                  );
                } catch (e) {
                  console.log(e, 8888888888888);
                }
                const target = {
                  ...item,
                  imageList: item.imageList.map(v => v.filePath),
                  isMain: item.isMain ? 1 : 0,
                  defectRate: item.defectRate * 100,
                  uuid: item.id,
                  ...editMode,
                };
                if (target?.processCode?.startsWith('1') || target?.processCode?.startsWith('4') || target?.processCode?.startsWith('5')) {
                  target.disabled = {
                    speed: true,
                    speedUnit: true,
                  };
                } else {
                  target.disabled = {
                    capacity: true,
                  };
                }
                return target;
              });
              console.log(processTableData, 'processTableDataprocessTableDataprocessTableData');
              setTechnologyTableData(processTableData);
              setTechnologyDetailTableData(processTableData);
            }
            console.log('check pccCode--------------', pccCode);
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
                applyCode,
              } = pccData;
              console.log(pccData, 'pccData----------------');
              state.bomType = bomType;
              console.log(isBonded);
              if (typeof isBonded === 'boolean') {
                setProdInfoFieldsValue({
                  // isBonded:  isBonded + '',
                  isBonded: isNullOrUnDef(isBonded) ? undefined : isBonded + '',
                });
              }
              setBaseInfoFieldsValue({
                insidePartNumber,
                productDesc,
                productType,
                bomType,
                docNumber,
                effectiveDate,
                creatorUserName,
                applyCode,
                handlerId: mode.value == 'edit' && !state.showReview ? managerId : handlerId,
                remark,
              });
              setBaseInfoProps({
                disabled: state.mode !== 'edit',
              });

              getVersion(creatorTime, revisionRemark);
            }
          }
          changeLoading(false);
        })
        .catch(() => {
          changeLoading(false);
        });
    } else {
      resetTableData();
    }
  }

  function getVersion(creatorTime, revisionRemark) {
    state.engineLoading = true;
    if (creatorTime || revisionRemark) {
      state.creatorTime = creatorTime;
      state.revisionRemark = revisionRemark;
    }
    const { cacheList, index } = state;
    getPccRevisionHistory({
      PartNumber: cacheList[index].insidePartNumber,
      bomType: state.bomType,
    })
      .then(({ code, data }) => {
        if (code == 200) {
          const reviewList: any = [];
          console.log(cacheList[index]['currentNode'] != 'End', cacheList[index]['status'], "cacheList[index]['status'] != 3");
          if (cacheList[index]['currentNode'] != 'End') {
            reviewList.push({
              originVersion: data.length,
              version: `T${data.length}`,
              creatorTime: creatorTime || new Date().getTime(),
              revisionRemark: data.length == 0 ? t('dict.PCCApplyColumn.initialRelease') : revisionRemark || '',
              onEdit: state.mode === 'edit',
              editable: state.mode === 'edit',
            });
          }
          data.forEach((item, index) => {
            const target = {
              ...item,
              version: `T${item.version}`,
              originVersion: item.version,
            };
            reviewList.push(target);
          });
          // if (mode == 'edit') {
          // 	reviewList.unshift({
          // 		version: `T${version || reviewList.length}`,
          // 		creatorTime: creatorTime || new Date().getTime(),
          // 		revisionRemark: revisionRemark || '',
          // 		onEdit: state.mode === 'edit',
          // 		editable: state.mode === 'edit',
          // 	});
          // }
          const fromVersion = state.mode === 'edit' ? data.length : data.length - 1;
          setBaseInfoFieldsValue({
            version: fromVersion,
          });
          console.log(reviewList, 'reviewListreviewListreviewList');
          setChangeHistoryTableData(reviewList);
          state.engineLoading = false;
        }
      })
      .catch(() => {
        changeLoading(false);
      });

    if (!state.bomType) return;
    // 获取工程图纸
    getEngineeringDrawingsHistory({
      PartNumber: state.cacheList[state.index].insidePartNumber,
      bomType: state.bomType,
    }).then(({ code, data }) => {
      if (code == 200) {
        console.log('获取工程图纸获取工程图纸获取工程图纸获取工程图纸获取工程图纸111111111111', data);
        data.map(item => {
          if (!state.customerFileList.find(file => item.uid == file.uid || item.name == file.name)) {
            state.customerFileList.push({
              ...item,
              isNewUpload: false,
              // delete: false,
              // origin: "interface",
              name: item.fileName,
              flagPath: item.filePath,
              flagVersion: item.version,
            });
          }
        });
      }
    });
  }

  function resetTableData() {
    const managerId = userStore.getUserInfo?.managerId;
    const userId = userStore.getUserInfo?.userId;
    console.log(managerId);
    const { cacheList, index } = state;
    const demandType = cacheList[index].demandType;
    if (demandType == 'BusinessSamples' || demandType == 'EngineeringSamples') {
      setBaseInfoFieldsValue({
        bomType: 4,
        // creatorUserName: userId,
        // handlerId: managerId,
      });
      state.bomType = 4;
    } else {
      setBaseInfoFieldsValue({
        bomType: 1,
        // creatorUserName: userId,
        // handlerId: managerId,
      });
      state.bomType = 1;
    }
    resetBaseInfoFields();
    resetProdInfoFields();
    resetTechnologyFields();
    state.technologyList = [
      {
        stepDistance: '',
        modulus: '',
      },
    ];
    // console.log(cacheList[index]);
    // const {factory: factoryCode, } = cacheList[index];

    setBaseInfoFieldsValue({
      ...cacheList[index],
      bomType: cacheList[index].demandType == 'BusinessSamples' || cacheList[index].demandType == 'EngineeringSamples' ? 4 : null,
      creatorUserName: userId,
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
          description: true,
          color: true,
          utilizationRate: true,
          metersTenHour: true,
          useQty: true,
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
        processName: t('dict.PCCApplyColumn.ordinaryEnvironmentTidying'),
        uuid: buildUUID(),
        isMain: 0,
      },
      {
        ...technologyRowData,
        processCode: '501',
        processName: t('dict.PCCApplyColumn.manualPackaging'),
        uuid: buildUUID(),
        isMain: 0,
      },
    ];
    setTechnologyTableData(rowData);

    nextTick(() => {
      console.log(getTechnologyDataSource());
      insertTechnologyTableDataRecord(
        {
          ...technologyRowData,
          processCode: '101',
          processName: t('dict.PCCApplyColumn.materialPreparation'),
          uuid: buildUUID(),
          isMain: 0,
        },
        0,
      );
    });
    setTechnologyDetailTableData(rowData);
    // setChangeHistoryTableData([
    //   {
    //     version: 'T0',
    //     revisionRemark: '初版发行',
    //     creatorTime: new Date().getTime(),
    //     onEdit: true,
    //     editable: true,
    //   },
    // ]);
    getVersion();
    changeLoading(false);
  }

  async function init(data) {
    // console.log(data, "init pcc apply data");
    // ecnOpenModal(true, {id: data.cacheList[data.index].id});
    // return
    console.log(data, 'data--------------------');
    changeLoading(true);
    state.isPack = true;
    state.mode = data.mode;
    state.doNotTemplate = data.doNotTemplate;
    const ifShow = data.mode === 'edit' ? true : false;
    state.showDialog = data.showDialog;
    setMaterialTableProps({
      actionColumn: {
        width: 120,
        title: t('common.action'),
        dataIndex: 'action',
        ifShow: ifShow,
      },
    });
    setTechnologyTableProps({
      actionColumn: {
        width: 120,
        title: t('common.action'),
        dataIndex: 'action',
        ifShow: ifShow,
      },
    });
    state.showSubmit = data.showSubmit;
    state.showReject = data.showReject;
    state.showReview = data.showReview;
    const { cacheList, index } = data;
    state.cacheList = cacheList;
    console.log(state.cacheList);
    state.index = index;
    state.bomId = cacheList[index]?.bomId;
    console.log('99999999');
    getTreeData({
      id: cacheList[index]?.bomId,
    });
    console.log(44444);
    initData({
      id: cacheList[index]?.bomId,
    });
    registerMouseEvent();
  }

  function getTechnologyTableFormSchema(): FormSchema[] {
    return [
      {
        field: 'singleRefuelingDuration',
        label: '单次换料时长(MIN/次)',
        className: 'form-required',
        component: 'InputNumber',
        componentProps: {
          onChange: singleRefuelingDuration => {
            const technology = getTechnologyDetailDataSource();
            const mainTechnogy = technology.find(item => item.isMain);
            calcDowntimeOneHourUtilizationRate(mainTechnogy.speed, singleRefuelingDuration);
          },
          step: 0.1,
          precision: 1,
        },
        labelWidth: 164,
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
        component: 'Input',
        helpMessage: [t('dict.PCCApplyColumn.downtimeOneHour'), t('dict.PCCApplyColumn.downtimeOneHourTip2')],
        componentProps: { placeholder: t('common.systemCalculation'), disabled: true },
        labelWidth: 140,
      },
      {
        field: 'utilizationRate',
        label: '设备稼动率',
        component: 'InputNumber',
        helpMessage: [t('dict.PCCApplyColumn.utilizationRate'), t('dict.PCCApplyColumn.utilizationRateTip2')],
        componentProps: {
          placeholder: t('common.systemCalculation'),
          disabled: true,
          rate: true,
        },
        labelWidth: 130,
      },
    ];
  }

  function getProdInfoFormSchema(): FormSchema[] {
    return [
      {
        field: 'factory',
        label: '生产工厂',
        className: 'form-required',
        component: 'ApiSelect',
        componentProps: {
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
        className: 'form-required',
        componentProps: {
          placeholder: '业务类型',
          api: () => {
            return baseStore.getDictionaryData('SapFactoryMaterial');
          },
          labelField: 'fullName',
          valueField: 'enCode',
          onChange: async materialType => {
            const { factory: factoryCode, isBonded } = getProdInfoFieldsValue();
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
        className: 'form-required',
        defaultValue: 'false',
        componentProps: {
          placeholder: t('common.bonded'),
          options: [
            {
              fullName: t('common.yes'),
              enCode: 'true',
            },
            {
              fullName: t('common.no'),
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
        defaultValue: '1',
        component: 'ApiSelect',
        className: 'form-required',
        componentProps: {
          api: () => {
            return baseStore.getDictionaryData('PCC.WorkshopEnv');
          },
          labelField: 'fullName',
          valueField: 'enCode',
        },
      },

      {
        field: 'standardManpower',
        label: '标准人力',
        defaultValue: 1,
        component: 'InputNumber',
        dynamicDisabled: true,
      },
      {
        field: 'mainOperatorSkills',
        label: '主机手技能',
        component: 'ApiSelect',
        className: 'form-required',
        componentProps: {
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
        className: 'form-required',
        componentProps: {
          min: 0,
          step: 1,
          precision: 0,
          onChange: e => {
            const { auxiliaryOperatorNumber } = getProdInfoFieldsValue();
            setProdInfoFieldsValue({
              standardManpower: e + (auxiliaryOperatorNumber || 0),
            });
          },
        },
      },
      {
        field: 'auxiliaryOperatorSkills',
        label: '辅机手技能',
        component: 'ApiSelect',
        componentProps: {
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
          min: 0,
          step: 1,
          precision: 0,
          onChange: e => {
            const { mainOperatorNumber } = getProdInfoFieldsValue();
            setProdInfoFieldsValue({
              standardManpower: e + (mainOperatorNumber || 0),
            });
          },
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
        className: 'form-required',
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
        className: 'form-required',
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
        transferRange: ['label'],
        componentProps: {
          placeholder: t('common.autoCarry'),
        },
        // colProps: {
        //   span: 16,
        // },
      },
      {
        field: 'addTechnology',
        label: '',
        transferRange: ['placeholder'],
        component: 'Input',
        slot: 'addTechnology',
        // colProps: {
        //   span: 8,
        // },
      },
    ];
  }

  function handleDblClick(event, value) {
    console.log(event, value);
    createConfirm({
      iconType: 'warning',
      title: t('common.tipTitle'),
      content: t('dict.QuotationColumn.enterClearConfirm'),
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
      width: 280,
      customCell: (record, index, column) => {
        const rowSpan = getRowSpan(record, index);
        return { rowSpan };
      },
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 120,
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

  const sampleColumns: BasicColumn[] = [
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
      url: http2s(record.flagPath),
      fileName: record.name,
      target: '_blank',
    });
  }

  function handleTemplateSubmit(data) {
    console.log(data);
    console.log('tmp list');
    const { cacheList, index } = state;
    changeLoading(true);
    setTimeout(() => {
      changeLoading(false);
    }, 300);
    const editMode = {
      onEdit: state.mode == 'edit',
      editable: state.mode == 'edit',
    };
    // 基础数据
    const { productType, isBonded, bomType, remark, docNumber } = data;
    setBaseInfoFieldsValue({
      productType,
      bomType,
      remark,
      docNumber,
    });
    state.bomType = bomType;
    // 生产信息
    const { parentPartInfo } = data;
    setProdInfoFieldsValue({
      ...parentPartInfo,
      isBonded: (isBonded || false) + '',
      workshopEnv: isNullOrUnDef(parentPartInfo.workshopEnv) ? undefined : parentPartInfo.workshopEnv + '',
      // mainOperatorSkills: parentPartInfo.mainOperatorSkills + '',
      // auxiliaryOperatorSkills: parentPartInfo.auxiliaryOperatorSkills + '',
      businessType: parentPartInfo.businessType ? parentPartInfo.businessType + '' : '',
      utilizationRate: parentPartInfo.utilizationRate * 100,
    });
    // 工艺信息
    const {
      parentPartInfo: { processCode, adjustmentMetres, numberOfKnives, process, singleRefuelingDuration, downtimeOneHour, utilizationRate },
      stepDistanceList,
    } = data;
    console.log(processCode, adjustmentMetres, 'adjustmentMetres adjustmentMetres');
    setTechnologyFieldsValue({
      // process,
      processCode,
      adjustmentMetres,
      process,
      numberOfKnives,
    });
    setTechnologyTableFieldsValue({
      downtimeOneHour,
      utilizationRate,
      singleRefuelingDuration,
    });
    state.technologyList = stepDistanceList?.map(item => {
      delete item.id;
      delete item.parentPartsId;
      return {
        ...item,
        stepDistance: item.stepDistance + '',
        modulus: item.modulus + '',
      };
    });
    // 模具编号
    const { moldList } = data;
    state.toBeGenerateList = moldList.map(item => {
      delete item.id;
      delete item.parentPartsId;
      return {
        ...item,
        ...editMode,
      };
    });
    // 材料
    const { materialList } = data;
    setMaterTableData(
      materialList.map(item => {
        delete item.id;
        delete item.parentPartsId;
        return {
          ...item,
          utilizationRate: mode.value == 'edit' ? item.utilizationRate * 100 : item.utilizationRate * 100 + '%',
          origin: {
            ...item,
          },
          ...editMode,
          disabled: {
            partNumber: true,
            description: true,
            color: true,
            utilizationRate: true,
            metersTenHour: true,
            useQty: true,
          },
        };
      }),
    );
    // 包材
    console.log(data, 'data----------------');
    const { packingMaterialCustomList, packingMaterialFixedList } = data;
    unref(packageRef).setTableData({
      packingMaterialCustomList: packingMaterialCustomList.map(item => ({ ...item, uuid: item.id })),
      packingMaterialFixedList: packingMaterialFixedList.map(item => ({ ...item, uuid: item.id })),
      packageSpecQty: parentPartInfo.packSpecQtyR || parentPartInfo.packSpecQtyPN,
      config: {
        mode: state.mode,
        source: state.source,
        shipPattern: cacheList[index].shipPattern,
      },
    });
    // const { packingMaterialList } = data;
    // setPackageTableData(
    //   packingMaterialList.map(item => {
    //     delete item.id;
    //     delete item.parentPartsId;
    //     return {
    //       ...item,
    //       ...editMode,
    //     };
    //   }),
    // );
    // 工艺流程
    const { processList } = data;
    const processTableData = processList.map(item => {
      if (item?.manualPackagingList.length == 0 || !item?.manualPackagingList) {
        item.manualPackagingList = [];
      }
      return {
        ...item,
        imageList: item.imageList.map(v => v.filePath),
        manualPackagingList: item.manualPackagingList.map(v => ({ qty: v.qty, unit: v.unit })),
        isMain: item.isMain ? 1 : 0,
        defectRate: item.defectRate * 100,
        ...editMode,
      };
    });
    setTechnologyTableData(processTableData);
    setTechnologyDetailTableData(processTableData);
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
    // if(end.length!== 5) return createMessage.warning('请输入最后一个输入框正确的值，如：AA');

    const arr = state.moldGenerate.split('-');
    if (arr.length !== 3) return createMessage.warning(`请输入正确的值，如：${state.chooseNewPartNumType ? 'AF-BAZZ125ABCD-AA' : 'AF-BAZZ12ABCD-AA'}`);
    if (arr[0].length !== 2) return createMessage.warning('请输入前两位正确的值，如：AF');
    if (arr[2].length !== 2) return createMessage.warning('请输入后五位正确的值，如：AA');

    if (state.chooseNewPartNumType) {
      // 新模具
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
    } else {
      // 旧模具
      if (arr[1].length < 7) {
        createMessage.warning('请输入中间正确的值，如：BAZZ12A');
      } else {
        const str = arr[1].slice(6);
        console.log(str);
        if (hasDuplicates(str)) return createMessage.warning('中间数据尾部有重复数值');
        for (let i = 0; i < str.length; i++) {
          console.log(str[i]);
          state.toBeGenerateList.push({
            code: `${arr[0]}-${arr[1].slice(0, 6)}${str[i]}-${arr[2]}`,
          });
        }
      }
    }
    // state.toBeGenerateList.push({
    //   code: state.moldGenerate,
    // });
    state.moldGenerate = '';
    createMessage.success('校验并生成成功');
  }

  function handleDeleteMold(index) {
    state.toBeGenerateList.splice(index, 1);
  }

  function hasDuplicates(str) {
    const chars = str.split('');
    const uniqueChars = _.uniq(chars);
    return uniqueChars.length < chars.length;
  }

  function registerMouseEvent() {
    divider.value.addEventListener('mousedown', e => {
      isDragging = true;
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'ew-resize';
    });
    document.addEventListener('mousemove', e => {
      if (!isDragging) return;

      const containerRect = container.value.getBoundingClientRect();
      const offsetX = e.clientX - containerRect.left;
      bomContent.value.style.flex = `0 0 ${offsetX}px`;
      mainContent.value.style.flex = `1 1 auto`;
      state.isPack = offsetX >= 140;
    });
    document.addEventListener('mouseup', () => {
      isDragging = false;
      document.body.style.userSelect = 'auto';
      document.body.style.cursor = 'default';
    });
  }

  function changeCurrent(type: 'pre' | 'next') {
    const { cacheList, index } = state;
    // 上一个
    if (type === 'pre') {
      if (index === 0) {
        return message.warning('当前已经是第一个');
      }
      state.bomId = cacheList[index + 1].bomId;
      state.index = index - 1;
      initData({ id: cacheList[index - 1].bomId });
    }
    // 下一个
    if (type === 'next') {
      if (index === state.cacheList.length - 1) {
        return message.warning('当前已经是最后一个');
      }
      state.bomId = cacheList[index + 1].bomId;
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
    const { top } = getViewportOffset(target);
    const warp = mainScroll.value.getScrollWrap();
    mainScroll.value.scrollTo(warp.scrollTop + top - 230);
  }

  function handleChangeMaterial(type: 'add' | 'update' | 'copy' | 'delete' | 'addBaseIndex', data) {
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
        const copyData = cloneDeep(getMaterialDataSource()[data.index]);
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

  function handleAddTemplate() {
    if (state.doNotTemplate) return createMessage.warning('请先保存数据');
    const { index, cacheList } = state;
    openSaveTemplateFormModal(true, {
      id: cacheList[index].id,
    });
  }

  function handleTemplateList() {
    openTemplateListModal(true, {});
  }

  function handleChangeTechnology(type: 'add' | 'update' | 'copy' | 'delete' | 'addBaseIndex', data) {
    console.log(data, '----------data-----------');
    switch (type) {
      case 'add':
        const dataList = [];
        for (let i = 0; i < data.rows; i++) {
          dataList.push({
            ...technologyRowData,
            uuid: buildUUID(),
            disabled: {
              speed: false,
              speedUnit: false,
            },
          });
        }
        insertTechnologyTableDataRecord(dataList);
        break;
      case 'addBaseIndex':
        const rowData = {
          ...technologyRowData,
          uuid: buildUUID(),
          disabled: {
            speed: false,
            speedUnit: false,
          },
        };
        insertTechnologyTableDataRecord(rowData, data.index + 1);
        break;
      case 'copy':
        const copyData = cloneDeep(getTechnologyDataSource()[data.index]);
        insertTechnologyTableDataRecord(
          {
            ...toRaw(copyData),
            uuid: buildUUID(),
            isMain: 0,
          },
          data.index + 1,
        );
        break;
      case 'delete':
        const index = getTechnologyDataSource().findIndex(v => v.uuid == data.uuid);
        const datalist = getMaterialDataSource();
        datalist.map((item, i) => {
          const { processCode } = item;
          if (processCode == index + 1) {
            nextTick(() => {
              console.log(i);
              item.processCode = '';
            });
          }
        });
        deleteTechnologyTableDataRecord(data.uuid);
        break;
      case 'update':
        break;
    }
  }

  function validateParams(params) {
    console.log(params, 'paramsparamsparamsparamsparams');
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
      productType,
      docNumber,
      saveAndCommit,
      bomType,
      creatorUserName,
      handlerId,
      packingMaterialFixedList,
      engineeringDataList,
    } = params;
    if (!saveAndCommit) return true;
    const { factory, businessType, isBonded, workshopEnv, mainOperatorSkills, numberOfKnives, process, mainOperatorNumber, singleRefuelingDuration } =
      parentPartInfo;
    if (!insidePartNumber) {
      createMessage.warning(t('dict.PCCColumn.enterInfoPartNum'));
      return false;
    }
    if (!productType) {
      createMessage.warning(t('dict.PCCColumn.enterProdType'));
      return false;
    }
    if (!bomType) {
      createMessage.warning(t('dict.PCCColumn.enterBOMType'));
      return false;
    }
    if (!creatorUserName) {
      createMessage.warning(t('dict.PCCColumn.enterChooseProder'));
      return false;
    }
    if (!handlerId) {
      createMessage.warning(t('dict.PCCColumn.enterApprover'));
      return false;
    }
    if (!businessType) {
      createMessage.warning(t('dict.PCCColumn.enterBusinessType'));
      return false;
    }
    if (!factory) {
      createMessage.warning(t('dict.PCCColumn.enterProdFactory'));
      return false;
    }
    if (!isBonded) {
      createMessage.warning(t('dict.PCCColumn.enterIsBonded'));
      return false;
    }
    if (!workshopEnv) {
      createMessage.warning(t('dict.PCCColumn.enterWorkEnv'));
      return false;
    }
    if (!numberOfKnives) {
      createMessage.warning(t('dict.PCCColumn.enterBlades'));
      return false;
    }
    if (!process) {
      createMessage.warning(t('dict.PCCColumn.enterProdProcess'));
      return false;
    }
    if (!mainOperatorSkills) {
      createMessage.warning(t('dict.PCCColumn.enterMainSkill'));
      return false;
    }
    if (!mainOperatorNumber) {
      createMessage.warning(t('dict.PCCColumn.enterMainNum'));
      return false;
    }
    if (!stepDistanceList[0].stepDistance) {
      createMessage.warning(t('dict.PCCColumn.enterMainDistance'));
      return false;
    }
    if (!stepDistanceList[0].modulus) {
      createMessage.warning(t('dict.PCCColumn.enterMainDistanceModulus'));
      return false;
    }

    if (engineeringDataList.length < 1) {
      createMessage.warning('必须要有工程图纸');
      return false;
    }

    try {
      let mainProcess = '';
      if (!singleRefuelingDuration) throw new Error(t('dict.PCCColumn.enterChangeTime'));
      processList.forEach((item, index) => {
        console.log(item.adjustmentTime);
        if (isNullOrUnDef(item.adjustmentTime)) {
          throw new Error(t('dict.PCCColumn.inputProcessFlowSetupTime', [index + 1]));
        }
        if (item.processCode) {
          if (item.processCode.startsWith('2') || item.processCode.startsWith('3')) {
            if (isNullOrUnDef(item.speed)) {
              throw new Error(t('dict.PCCColumn.inputProcessFlowSpeed', [index + 1]));
            }
          }
        } else {
          throw new Error(t('dict.PCCColumn.selectProcessFlowProcess', [index + 1]));
        }
        if (isNullAndUnDef(item.defectRate)) {
          throw new Error(t('dict.PCCColumn.selectProcessFlowDefectRate', [index + 1]));
        }
        if (isNullAndUnDef(item.capacity)) {
          throw new Error(t('dict.PCCColumn.selectProcessFlowProductionCapacity', [index + 1]));
        }
        if (isNullAndUnDef(item.capacityUnit)) {
          throw new Error(t('dict.PCCColumn.selectProcessFlowProductionCapacityUnit', [index + 1]));
        }
        if (item.isMain == 1) {
          mainProcess = item;
        }
      });
      if (!mainProcess) {
        throw new Error(t('dict.PCCColumn.selectMainProcess'));
      }

      materialList.forEach((item, index) => {
        if (isNullOrUnDef(item.stepDistanceNumber)) {
          throw new Error(t('dict.PCCColumn.inputMaterialStepPitchGroupNumber', [index + 1]));
        } else if (!item.eightCode) {
          throw new Error(t('dict.PCCColumn.inputMaterialEightDigitCode', [index + 1]));
        } else if (!item.width) {
          throw new Error(t('dict.PCCColumn.inputMaterialWidthMM', [index + 1]));
        } else if (!item.useQtyMultiple) {
          throw new Error(t('dict.PCCColumn.inputMaterialUsageMultiplier', [index + 1]));
        } else if (!item.useQty) {
          throw new Error(t('dict.PCCColumn.inputMaterialUsageMultiplierTip', [index + 1]));
        } else if (!item.unit) {
          throw new Error(t('dict.PCCColumn.inputMaterialUnit', [index + 1]));
        }
      });

      packingMaterialFixedList.forEach((item, index) => {
        if (isNullOrUnDef(item.type)) {
          throw new Error(t('dict.PCCColumn.selectPackagingMaterialRowType', [index + 1]));
        } else if (!item.packQty) {
          throw new Error(t('dict.PCCColumn.selectPackagingQty', [index + 1]));
        } else if (!item.unit) {
          throw new Error(t('dict.PCCColumn.selectPackagingUnit', [index + 1]));
        } else if (!item.partNumber) {
          throw new Error(t('dict.PCCColumn.selectPackagingMaterialNumber', [index + 1]));
        } else if (!item.description) {
          throw new Error(t('dict.PCCColumn.selectPackageDesc', [index + 1]));
        } else if (!item.useQtyMultiple) {
          throw new Error(t('dict.PCCColumn.selectPackageUsageMult', [index + 1]));
        } else if (isNullOrUnDef(item.packUnit)) {
          throw new Error(t('dict.PCCColumn.selectPackageUnit', [index + 1]));
        }
      });
    } catch (e) {
      createMessage.warning(e.message);
      return false;
    }

    return true;
  }

  async function handleSubmit(type: 'save' | 'commit') {
    console.log(type, 'typetypetypetypetype');
    changeLoading(true);
    console.log(state);
    const { index, cacheList } = state;
    console.log(state.bomId);
    console.log(state.halfSign);
    console.log(state.treeData);
    console.log(state.showDialog, 'state.showDialog');
    console.log(cacheList[index], 'cache index');

    const baseInfo = getBaseInfoFieldsValue();

    const prodInfo = getProdInfoFieldsValue();

    const technology = getTechnologyFieldsValue();
    const technologyTable = getTechnologyTableFieldsValue();
    console.log(technologyTable, 'technologyTable');
    const technologyList = state.technologyList.map((item, index) => {
      return {
        ...item,
        isMain: index === 0,
      };
    });
    const toBeGenerateList = state.toBeGenerateList;

    const materialData = getMaterialDataSource();
    // const packageData = getPackageDataSource();
    const packageData = unref(packageRef).getDataSource();

    console.log(packageData, 'packageData----------');
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
        isMain: item.isMain === 1,
      };
    });

    let revisionRemark;
    const revisionRemarkList = getChangeHistoryDataSource();

    if (revisionRemarkList.length > 0) {
      revisionRemark = revisionRemarkList[0]?.revisionRemark;
    }
    const notUploadList = state.customerFileList.filter(item => item.flagVersion == 0).filter(item => !item.flagPath);
    let p;
    if (notUploadList.length > 0) {
      const promiseList = [];
      notUploadList.forEach(async item => {
        const params = {
          file: item,
          filePath: 'PCC',
        };
        promiseList.push(uploadInstallFile(params));
      });
      p = new Promise((res, rej) => {
        Promise.all(promiseList).then(values => {
          notUploadList.forEach((item, index) => {
            item.flagPath = values[index].data.filePath;
          });
          res();
        });
      });
    } else {
      p = new Promise((res, rej) => {
        res();
      });
    }
    const res = await p;

    const params = {
      revisionRemark: revisionRemark,
      ...baseInfo,
      originType: cacheList[index].originType,
      drawingsReviewId: cacheList[index].drawingsReviewId || cacheList[index].id,
      insidePartNumber: cacheList[index].insidePartNumber,
      parentPartInfo: {
        ...prodInfo,
        ...technology,
        ...technologyTable,
        packSpecQtyR: packageData.packSpecQtyR,
        packSpecQtyPN: packageData.packSpecQtyPN,
      },
      materialList: materialData.map(item => {
        return {
          ...item,
          utilizationRate: item.utilizationRate / 100,
        };
      }),
      // moldList: toBeGenerateList.map((item, index) => {
      //   return {
      //     seqNumber: index,
      //     code: item,
      //   };
      // }),
      moldList: toBeGenerateList,
      ...packageData,
      // packingMaterialList: packageData,
      stepDistanceList: technologyList.map((item, index) => {
        return {
          ...item,
          seqNumber: index,
        };
      }),
      processList: technologyTableData,
      installationDiagramList: state.installImageList,
      engineeringDataList: state.customerFileList
        .map((item, index) => {
          return {
            seqNumber: index,
            filePath: item.flagPath,
            fileName: item.name,
            ...item,
          };
        })
        .filter(item => item.origin !== 'interface'),
    };

    if (type === 'commit') {
      params.saveAndCommit = true;
    }
    if (!validateParams(params)) return changeLoading(false);

    if (!cacheList[index]?.bomId) {
      // 如果没有BOMID，则是新增
      addFinishedPartsBomPcc(params)
        .then(({ code, msg, data: dataId }) => {
          // console.log(res);
          if (code !== 200) return createMessage.error(msg);
          createMessage.success(msg);
          initData({ id: state.bomId });
          getPccDetail({ id: dataId }).then(({ code: detailCode, data }) => {
            changeLoading(true);
            console.log(data);
            state.cacheList[index] = data;
            getTreeData({ id: data.bomId });
            // closePopup();
            // emit('reload');
            // changeLoading(false);
            console.log(state.showDialog, 'state.showDialog');
            console.log(params.saveAndCommit, 'params.saveAndCommit');
            if (state.showDialog && !!params.saveAndCommit) {
              console.log(11111);
              const { cacheList, index } = state;
              console.log(22222);
              const { version } = getBaseInfoFieldsValue();
              console.log(33333, version, 'version');
              if (cacheList[index].id && version != 0 && state.bomType != 4) {
                getECNByPartNumber({
                  insidePartNumber: cacheList[index].insidePartNumber,
                  version: cacheList[index].version,
                }).then(({ code, data: dataFlag }) => {
                  console.log(8888888888888, 'dataFlag', dataFlag);
                  if (!dataFlag) {
                    ecnOpenModal(true, {
                      id: cacheList[index].id,
                    });
                  } else {
                    changeLoading(false);
                    emit('reload');
                    closePopup();
                  }
                });
              } else {
                emit('reload');
                closePopup();
              }
            } else {
              //  暂存
              emit('reload');
              if (cacheList.length == index + 1) {
                closePopup();
              }
            }
          });
        })
        .catch(() => {
          changeLoading(false);
        })
        .finally(() => {
          changeLoading(false);
        });
    } else {
      // 有BOMID，则是修改
      console.log('修改 && 新增||修改bom');
      // 修改 && 新增||修改bom
      const { treeData } = state;
      console.log(treeData);
      if (treeData[0]?.id === state?.bomId) {
        // 如果是BOM的根节点，则是修改BOM
        if (state.mode === 'view') {
          commitPcc({ id: cacheList[index].id })
            .then(res => {
              if (code !== 200) return createMessage.error(msg);
              createMessage.success(msg);
              getTreeData({ id: treeData[0].id });
              closePopup();
              emit('reload');
            })
            .catch(e => {
              changeLoading(false);
            })
            .finally(() => {
              changeLoading(false);
            });
        } else {
          updateFinishedPartsBomPcc({
            ...params,
            id: cacheList[index].id,
          })
            .then(({ code, msg }) => {
              if (code !== 200) return createMessage.error(msg);
              createMessage.success(msg);
              getTreeData({ id: treeData[0].id });
              console.log(state.showDialog, 'state.showDialog');
              console.log(params.saveAndCommit, 'params.saveAndCommit');
              console.log(state.showDialog && !!params.saveAndCommit, 'state.showDialog && !!params.saveAndCommit');
              if (state.showDialog && !!params.saveAndCommit) {
                console.log('ifififififififififififif');
                const { cacheList, index } = state;
                const { version } = getBaseInfoFieldsValue();
                console.log(version, 'versionversionversionversion');
                if (cacheList[index].id && version != 0 && state.bomType != 4) {
                  getECNByPartNumber({
                    insidePartNumber: cacheList[index].insidePartNumber,
                    version: cacheList[index].version,
                  }).then(({ code, data: dataFlag }) => {
                    if (!dataFlag) {
                      ecnOpenModal(true, {
                        id: cacheList[index].id,
                      });
                    } else {
                      changeLoading(false);
                      emit('reload');
                      if (cacheList.length == index + 1) {
                        closePopup();
                      }
                    }
                  });
                } else {
                  emit('reload');
                  if (cacheList.length == index + 1) {
                    closePopup();
                  }
                }
              } else {
                console.log('elseelseelseelseelseelse');
                if (!state.showReview) {
                  if (cacheList.length == index + 1) {
                    closePopup();
                  }
                }
                if (!!state.showReview && cacheList.length == index + 1) {
                  if (cacheList.length == index + 1) {
                    closePopup();
                  }
                }
                emit('reload');
                // closePopup();
              }
            })
            .catch(() => {
              changeLoading(false);
            })
            .finally(() => {
              changeLoading(false);
            });
        }
      } else {
        // 新增|| 修改数据
        if (state.halfSign == 'add') {
          addHalfFinishedPartsBomPcc({
            ...params,
            PCCId: cacheList[index].id,
            bomId: state.bomId,
          })
            .then(({ code, msg }) => {
              if (code !== 200) return createMessage.error(msg);
              createMessage.success(msg);
              initData({ id: state.bomId });
              getTreeData({ id: treeData[0].id });
              emit('reload');
              // （如果是审核 && cacheList是最后一天 ）|| 不是审核
              if (!state.showReview) {
                if (cacheList.length == index + 1) {
                  closePopup();
                }
              }
              if (!!state.showReview && cacheList.length == index + 1) {
                if (cacheList.length == index + 1) {
                  closePopup();
                }
              }
              // if(!!state.showReview && (cacheList.length == index + 1))
              // closePopup();
            })
            .catch(() => {
              changeLoading(false);
            });
        } else {
          if (state.mode === 'view') {
            commitPcc({ id: cacheList[index].id })
              .then(res => {
                if (code !== 200) return createMessage.error(msg);
                createMessage.success(msg);
                getTreeData({ id: treeData[0].id });
                emit('reload');
                if (cacheList.length == index + 1) {
                  closePopup();
                }
              })
              .catch(e => {
                changeLoading(false);
              });
          } else {
            updateHalfFinishedPartsBomPcc({
              ...params,
              PCCId: cacheList[index].id,
              bomId: state.bomId,
            })
              .then(({ code, msg }) => {
                if (code !== 200) return createMessage.error(msg);
                createMessage.success(msg);
                initData({ id: state.bomId });
                getTreeData({ id: treeData[0].id });
                emit('reload');
                if (cacheList.length == index + 1) {
                  closePopup();
                }
              })
              .catch(() => {
                changeLoading(false);
              });
          }
        }
      }
    }
  }

  function getTechnologyColumns(): BasicColumn[] {
    return [
      {
        title: '工序',
        dataIndex: 'processCode',
        i18nField: 'productionProcess',
        editComponent: 'ApiSelect',
        className: 'table-required',
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
          autoSelect: true,
          resultField: 'data',
          labelField: 'code',
          valueField: 'code',
          nameFormat: ['code', '(', 'name', ')'],
          immediate: true,
          filterOption: false,
          notFoundContent: null,
          placeholder: t('dict.PCCColumn.productionProcess'),
          onChange: (_, data, record) => {
            if (!data) return;
            const index = getTechnologyDataSource().findIndex(item => item.uuid === record.uuid);
            const { name, value } = data;
            const { editValueRefs, isMain } = record;
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
              if (isMain == 1) {
                nextTick(() => {
                  updateTechnologyTableData(index, 'disabled', {
                    ...record.disabled,
                    speed: false,
                    speedUnit: true,
                    capacity: true,
                  });
                });
              } else {
                nextTick(() => {
                  updateTechnologyTableData(index, 'disabled', {
                    ...record.disabled,
                    speed: false,
                    speedUnit: false,
                    capacity: true,
                  });
                });
              }
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
        className: 'table-required',
        editRow: true,
        editComponent: 'InputNumber',
        editComponentProps: {
          placeholder: t('common.autoCarry'),
          min: 0,
        },
        width: 120,
      },
      {
        title: '产能(K/H)',
        dataIndex: 'capacity',
        className: 'table-required',
        editComponent: 'InputNumber',
        helpMessage: [t('dict.PCCColumn.capacityTip')],
        editRow: true,
        editComponentProps: {
          placeholder: t('dict.PCCColumn.capacity'),
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
        title: '速度',
        dataIndex: 'speed',
        editRow: true,
        className: 'table-required',
        editComponentProps: {
          placeholder: '',
          onChange: (_, data, record) => {
            const { isMain } = record;
            if (!isMain) return;
            const { process } = getTechnologyFieldsValue();
            // const materialList = getMaterialDataSource();
            // const wholeLengthSum = materialList.reduce((a, b) => {
            //   return a + b.wholeLength;
            // }, 0);
            let speed = _;
            if (!process) {
              return createMessage.warning(t('dict.PCCColumn.noProcessInformationHasBeenGeneratedYet'));
            }
            if (process == 2) {
              const stepDistance = state.technologyList[0].stepDistance;
              if (!stepDistance) return createMessage.warning(t('dict.PCCColumn.pleaseSetTheMainStepDistanceFirst'));
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
        },
        editComponent: 'ApiSelect',
        width: 200,
      },
      {
        title: '不良率',
        dataIndex: 'defectRate',
        editRow: true,
        className: 'table-required',
        editComponent: 'InputNumber',
        editComponentProps: {
          placeholder: t('common.autoCarry'),
          rate: true,
          // safe: false,
          onChange: (defectRate, data, record) => {
            calcUseQty();
          },
        },
        width: 100,
      },

      // {
      //   title: '单位',
      //   dataIndex: 'capacityUnit',
      //   editRow: true,
      //   className: 'table-required',
      //   editComponentProps: {
      //     placeholder: '单位',
      //     api: getUnitListByKeyword,
      //     showSearch: true,
      //     apiSearch: {
      //       show: true,
      //       searchName: 'keyword',
      //     },
      //     resultField: 'data',
      //     filterOption: false,
      //     notFoundContent: null,
      //     immediate: false,
      //     labelField: 'Name',
      //     valueField: 'Code',
      //     onChange: e => {
      //       console.log(e);
      //     },
      //     // nameFormat: ['Name', '(', 'Code', ')'],
      //   },
      //   editComponent: 'ApiSelect',
      //   width: 200,
      // },
      {
        title: '主工序',
        dataIndex: 'isMain',
        editRow: true,
        editComponentProps: {
          placeholder: t('dict.PCCColumn.isMain'),
          options: [
            {
              label: t('common.yes'),
              value: 1,
            },
            {
              label: t('common.no'),
              value: 0,
            },
          ],
          onChange: (e, _, record) => {
            const index = getTechnologyDataSource().findIndex(item => item.uuid === record.uuid);
            const { capacity, speed, editValueRefs } = record;

            console.log(speed, 'speed');
            if (!!e && !record.speedUnit) {
              // if (!!e) {
              createMessage.warning(t('dict.PCCColumn.PleaseSelectTheSpeedUnitFirst'));
              console.log('change isMain', e);
              const materialDataList = getMaterialDataSource();
              nextTick(() => {
                updateTechnologyTableData(index, 'isMain', 0);
                materialDataList.forEach(item => {
                  const { editValueRefs, useQty } = item;
                  editValueRefs.metersTenHour = isNaN((capacity || 0) * 10 * useQty) ? 0 : (capacity || 0) * 10 * useQty;
                });
              });
              return;
            }
            updateTechnologyTableData(index, 'disabled', {
              ...record.disabled,
              // speed: true,
              speedUnit: true,
            });
            getTechnologyDataSource().forEach((item, index) => {
              console.log(record.disabled, 'record.disabled');
              if (item.uuid === record.uuid) {
                updateTechnologyTableData(index, 'disabled', {
                  ...record.disabled,
                  speedUnit: true,
                });
                return;
              } else {
                updateTechnologyTableData(index, 'isMain', 0);
                if (item.processCode?.startsWith('2') || item.processCode?.startsWith('3')) {
                  updateTechnologyTableData(index, 'disabled', {
                    ...record.disabled,
                    speedUnit: false,
                  });
                }
              }
              // updateTechnologyTableData(index, 'disabled', {
              //   ...record.disabled,
              //   speedUnit: false,
              //   // speed: false,
              // });
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

  function calcDowntimeOneHourUtilizationRate(speed, singleRefuelingDuration) {
    const { process } = getTechnologyFieldsValue();
    // const { singleRefuelingDuration } = getTechnologyTableFieldsValue();
    if (!speed) {
      const mainTechnogy = getTechnologyDetailDataSource().find(item => item.isMain);
      speed = mainTechnogy?.speed || 0;
    }
    if (!singleRefuelingDuration) {
      singleRefuelingDuration = getTechnologyTableFieldsValue().singleRefuelingDuration;
    }
    const materialList = getMaterialDataSource();
    const wholeLengthSum = materialList.reduce((a, b) => {
      return 1 / (a + b.wholeLength);
    }, 0);
    // if (process == '2') {
    //   const stepDistance = state.technologyList[0].stepDistance || 0;
    //   if (!stepDistance) return createMessage.warning('请先设置主步距');
    //   speed = speed * stepDistance || 0;
    // } else {
    // }
    console.log(speed, 'speed');
    console.log(singleRefuelingDuration, 'singleRefuelingDuration');
    console.log(wholeLengthSum, 'wholeLengthSum');
    if (wholeLengthSum == Infinity) return;
    let calcSpeed = speed;
    if (process == 1) {
      calcSpeed = (speed * (state.technologyList[0].stepDistance || 0)) / 1000;
    }
    const downtimeOneHour = (60 * calcSpeed * singleRefuelingDuration) / (1 / wholeLengthSum + calcSpeed * singleRefuelingDuration);
    const utilizationRate = ((60 - downtimeOneHour) / 60) * 100;
    console.log(downtimeOneHour, 'downtimeOneHour');
    console.log(utilizationRate, 'utilizationRate');
    setTechnologyTableFieldsValue({
      downtimeOneHour: (downtimeOneHour || 0.01)?.toFixed(2),
      utilizationRate: (utilizationRate || 0.01)?.toFixed(2),
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
        console.log(_speed, '_speed');
        if (processCode.startsWith('2') || processCode.startsWith('3')) {
          const capacity = Number(
            ((60 * _speed * utilizationRate) / 100 / (state.technologyList[0].stepDistance || 0)) * (state.technologyList[0].modulus ?? 0),
          ).toFixed(2);
          editValueRefs.capacity = capacity;

          if (isMain) {
            const materialDataList = getMaterialDataSource();
            materialDataList.forEach(item => {
              const { editValueRefs: materialEditValueRefs, useQty } = item;
              materialEditValueRefs.metersTenHour = parseInt((capacity || 0) * 10 * useQty);
            });
          }
        }
      });
    }
  }

  function handleAddHandWorkProcess(record, index) {
    // if (record.manualPackagingList.length >= 2) return;
    updateTechnologyDetailTableData(index, 'manualPackagingList', [
      ...record.manualPackagingList,
      {
        qty: '',
        unit: '',
      },
    ]);
  }

  function getTechnologyDetailColumns(): BasicColumn[] {
    return [
      {
        title: '工序',
        dataIndex: 'processCode',
        i18nField: 'productionProcess',
        width: 60,
        customRender: ({ text, index, record }) => {
          return `${index + 1}、${record.processName || ''}`;
        },
      },
      {
        title: '工序描述',
        dataIndex: 'description',
        editRow: true,
        customRender: ({ text }) => {
          return text;
        },
        editComponentProps: {
          placeholder: t('common.processDescription'),
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

  function handleHistory() {
    openUpgradeModal(true, {
      menuDocType: 'PCC',
    });
  }

  async function handleUpgradeSubmit(row) {
    changeLoading(true);
    const { cacheList, index } = state;
    const { factory } = getProdInfoFieldsValue();
    // const row = selectRow[0];
    // console.log(row, 'row');
    if (!row) return createMessage.warning(t('common.selectText'));
    const params = {
      docType: row.docType,
      docId: row.docId,
      // drawingsReviewId: '',
      // // 如果是to make 则没有bomId
      // id: cacheList[index].bomId ? cacheList[index].id : null,
      qrApplyCode: cacheList[index].qrApplyCode,
      insidePartNumber: cacheList[index].insidePartNumber,
      originType: cacheList[index].originType,
    };
    if (cacheList[index].bomId) {
      params.id = cacheList[index].id;
      params.drawingsReviewId = cacheList[index].drawingsReviewId;
    } else {
      params.drawingsReviewId = cacheList[index].id;
    }
    let code, data, ret;
    try {
      ret = await postHistoryRecord(params);
    } catch (e) {
      return changeLoading(false);
    }
    code = ret.code;
    data = ret.data;
    console.log(data, 'datatatatatattatatatatata');
    if (code != 200) return;
    state['cacheList'][state.index] = {
      ...state['cacheList'][state.index],
      ...data,
    };
    getPccDetail({ id: data.id }).then(({ code, data }) => {
      console.log(data, 'resresresresresdatadatadatadatadata');
      delete data.insidePartNumber;
      delete data.creatorUserName;
      delete data.handlerId;
      setBaseInfoFieldsValue({ ...data });
    });
    state.bomId = data.bomId;
    state.bomType = data.bomType;
    getTreeData({
      id: data.bomId,
    });
    getBomDetail({ id: data.bomId }).then(({ code, data }) => {
      if (code === 200) {
        const { parentPartInfo, stepDistanceList, moldList, materialList, packingMaterialCustomList, packingMaterialFixedList, processTableData } =
          clearData(data);
        console.log(parentPartInfo);
        const { engineeringDataList, installationDiagramList } = data;
        console.log(data, 'datadatadatadatadata');
        // if(factory !== parentPartInfo.factory){
        //   delete parentPartInfo.businessType
        //   delete parentPartInfo.productType
        // }
        setBaseInfoFieldsValue({ ...parentPartInfo });

        setProdInfoFieldsValue({
          ...parentPartInfo,
          businessType: parentPartInfo.businessType ? parentPartInfo.businessType + '' : '',
        });
        console.log(factory, 'factory');
        console.log(factory, 'factory');
        console.log(factory !== parentPartInfo.factory, 'factory !== parentPartInfo.factory');
        if (factory !== parentPartInfo.factory) {
          setBaseInfoFieldsValue({
            productType: '',
          });
          setProdInfoFieldsValue({
            businessType: '',
          });
        }
        setTechnologyFieldsValue({ ...parentPartInfo });
        setTechnologyTableFieldsValue({
          ...parentPartInfo,
          downtimeOneHour: Number(parentPartInfo.downtimeOneHour).toFixed(2),
          utilizationRate: (Number(parentPartInfo.utilizationRate) * 100).toFixed(2),
        });
        state.technologyList = stepDistanceList;
        state.installImageList = installationDiagramList;
        engineeringDataList.map(item => {
          state.customerFileList.push({
            ...item,
            delete: false,
            name: item.fileName,
            flagPath: item.filePath,
            flagVersion: item.version,
          });
        });
        state.toBeGenerateList = moldList;
        setMaterTableData(materialList);
        // setPackageTableData(packingMaterialList);
        console.log(packingMaterialCustomList, 'packingMaterialCustomList');
        console.log(packingMaterialFixedList, 'packingMaterialFixedList');
        if (packingMaterialCustomList.length <= 0 && packingMaterialFixedList <= 0) {
          unref(packageRef).init({
            shipPattern: cacheList[index].shipPattern,
            source: 'PCC',
          });
        } else {
          unref(packageRef).setTableData({
            packingMaterialCustomList: packingMaterialCustomList.map(item => ({ ...item, uuid: item.id })),
            packingMaterialFixedList: packingMaterialFixedList.map(item => ({ ...item, uuid: item.id })),
            packageSpecQty: parentPartInfo.packSpecQtyR || parentPartInfo.packSpecQtyPN,
            config: {
              mode: state.mode,
              source: state.source,
              shipPattern: row.shipPattern,
            },
          });
        }
        // unref(packageRef).setTableData({
        //   packingMaterialCustomList: packingMaterialCustomList.map(item => ({ ...item, uuid: item.id })),
        //   packingMaterialFixedList: packingMaterialFixedList.map(item => ({ ...item, uuid: item.id })),
        //   packageSpecQty: parentPartInfo.packSpecQtyR || parentPartInfo.packSpecQtyPN,
        //   config: {
        //     mode: state.mode,
        //     source: state.source,
        //     shipPattern: cacheList[index].shipPattern,
        //   },
        // });
        setTechnologyTableData(processTableData);
        setTechnologyDetailTableData(processTableData);
        changeLoading(false);
        getVersion();
        closeUpgradeModal();
      }
    });
  }

  function clearData(data) {
    const { parentPartInfo, packingMaterialCustomList, packingMaterialFixedList, materialList, moldList, processList, stepDistanceList, engineeringDataList } =
      data;
    const editMode = {
      onEdit: true,
      editable: true,
    };
    const processTableData = processList.map(item => {
      delete item.id;
      delete item.parentPartsId;
      if (item?.manualPackagingList.length == 0 || !item?.manualPackagingList) {
        item.manualPackagingList = [];
      } else {
        item.manualPackagingList = item.manualPackagingList.map(v => {
          delete v.id;
          delete v.processId;
          return {
            ...v,
            ...editMode,
          };
        });
      }
      const target = {
        ...item,
        imageList: item.imageList.map(v => v.filePath),
        isMain: item.isMain ? 1 : 0,
        defectRate: multiply(bignumber(item.defectRate), bignumber(100)).toNumber().toFixed(2),
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
    return {
      parentPartInfo: {
        ...parentPartInfo,
        workshopEnv: isNullOrUnDef(parentPartInfo.workshopEnv) ? undefined : parentPartInfo.workshopEnv + '',
        // mainOperatorSkills: parentPartInfo.mainOperatorSkills + '',
        // auxiliaryOperatorSkills: parentPartInfo.auxiliaryOperatorSkills + '',
        isBonded: isNullOrUnDef(parentPartInfo.isBonded) ? undefined : parentPartInfo.isBonded + '',
      },
      stepDistanceList: stepDistanceList?.map(item => {
        delete item.id;
        delete item.parentPartsId;
        return {
          ...item,
          stepDistance: item.stepDistance,
          modulus: item.modulus,
          ...editMode,
        };
      }),
      moldList: moldList?.map(item => {
        delete item.id;
        delete item.parentPartsId;
        return {
          ...item,
          ...editMode,
        };
      }),
      materialList: materialList?.map(item => {
        delete item.id;
        delete item.parentPartsId;
        return {
          ...item,
          utilizationRate: mode.value == 'edit' ? item.utilizationRate * 100 : item.utilizationRate * 100 + '%',
          origin: { ...item },
          ...editMode,
          disabled: {
            partNumber: true,
            description: true,
            color: true,
            utilizationRate: true,
            metersTenHour: true,
            useQty: true,
          },
        };
      }),
      packingMaterialCustomList: packingMaterialCustomList.map(item => {
        return {
          ...item,
          ...editMode,
          uuid: buildUUID(),
          disabled: {
            unit: true,
          },
        };
      }),
      packingMaterialFixedList: packingMaterialFixedList.map(item => {
        return {
          ...item,
          ...editMode,
          uuid: buildUUID(),
          disabled: {
            unit: true,
          },
        };
      }),
      // packingMaterialList: packingMaterialList?.map(item => {
      //   delete item.id;
      //   delete item.parentPartsId;
      //   return {
      //     ...item,
      //     ...editMode,
      //     disabled: {
      //       unit: true,
      //     },
      //   };
      // }),
      processTableData,
    };
  }

  function handleTechnologyChange(e, record) {
    const data = technologyList[e];
    console.log(handleTechnologyChange, 'handleTechnologyChangehandleTechnologyChange');
    const { editValueRefs, unit } = record;
    const defectRate = getTechnologyDataSource().reduce((pre, next) => {
      pre += Number(next.defectRate || 0);
      return pre;
    }, 0);
    let useQty;
    if (unit == 'PCS') {
      useQty = (1 / (1 - defectRate / 100)) * 1000;
    } else if (unit == 'M') {
      const { stepDistance, modulus } = data;
      useQty = stepDistance / modulus / (1 - defectRate / 100);
    }
    editValueRefs.useQty = isNaN(useQty) ? 0 : useQty.toFixed(5);
    record.origin = {
      ...(record.origin || {}),
      useQty,
    };
    calcMetersTenHour(useQty, record);
  }

  function getMaterialColumns(): BasicColumn[] {
    return [
      {
        title: '步距组号',
        dataIndex: 'stepDistanceNumber',
        className: 'table-required',
        editRow: true,
        width: 100,
      },
      {
        title: '材料八码',
        dataIndex: 'eightCode',
        editRow: true,
        editComponent: 'Input',
        className: 'table-required',
        editComponentProps: {
          placeholder: t('dict.PCCColumn.eightCode'),
          onChange: (eightCode, data, record) => {
            const { editValueRefs } = record;
            editValueRefs.originPartNumber = '';
            editValueRefs.partNumber = '';
          },
        },
        width: 120,
      },
      {
        title: '宽度(MM)',
        dataIndex: 'width',
        editRow: true,
        className: 'table-required',
        width: 100,
        editComponent: 'InputNumber',
        editComponentProps: {
          placeholder: t('dict.PCCColumn.width'),
          onChange: (width, data, record) => {
            const { wholeWidth, wholeLength } = record;
            const { editValueRefs } = record;
            console.log(wholeLength);
            console.log(width);
            // 【 ( 原材整支宽度 / 使用宽度) 取小数位取整*使用宽度】/ 【 原材整支宽度 】
            const utilizationRate = Math.floor(wholeWidth / width) / (wholeWidth / width);
            console.log(utilizationRate, 'utilizationRate');
            editValueRefs.utilizationRate = (utilizationRate * 100).toFixed(1);
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
        width: 200,
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
          singleDefaultFirst: true,
          preciseParam: 'materialWidth',
          resultField: 'data',
          labelField: 'materialCode',
          valueField: 'materialCode',
          immediate: true,
          // alwaysLoad: true,
          placeholder: t('dict.PCCColumn.originPartNumber'),
          onChange: (materialCode, data, record) => {
            console.log(materialCode, data, record, 'materialCode, data, record');
            if (!data || !materialCode) return;
            const [startCode, eightCode, calcWidth] = materialCode?.split('-');
            // const calcWidth = materialCodeArr[materialCodeArr.length - 1];
            const index = getMaterialDataSource().findIndex(item => item.uuid === record.uuid);
            const { materialDesc, materialName, materialLength, materialWidth, purchaseUnit, materialColor, width } = data;
            const { editValueRefs, stepDistanceNumber, unit, useQtyMultiple } = record;
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
            console.log('useQtychangeuseQtychangeuseQtychangeuseQtychange');
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
            console.log(useQty, 'useQtyuseQtyuseQty');
            console.log(useQtyMultiple, 'useQtyMultipleuseQtyMultiple');
            const calcUseQty = useQty * useQtyMultiple;
            console.log(calcUseQty, 'calcUseQtycalcUseQtycalcUseQty');
            // editValueRefs.useQty = isNaN(useQty) ? 0 : useQty.toFixed(5) * useQtyMultiple;
            editValueRefs.useQty = isNaN(calcUseQty) ? 0 : calcUseQty;
            calcMetersTenHour(useQty, record);
            record.origin = {
              ...(record.origin || {}),
              useQty,
            };

            if (record.width) {
              // 利用率
              const utilizationRate = (Math.floor(materialWidth / record.width) / (materialWidth / record.width)).toFixed(4);
              editValueRefs.utilizationRate = Number(utilizationRate) * 100;
            }
          },
        },
        editRow: true,
      },
      {
        title: '材料料号',
        dataIndex: 'partNumber',
        editComponent: 'Input',
        editRow: true,
      },
      {
        title: '利用率',
        dataIndex: 'utilizationRate',
        editRow: true,
        helpMessage: ['((整支宽度/使用宽度)向下取整后 * 使用宽度)/整支宽度*100%'],
        editDynamicDisabled: true,
        editComponent: 'InputNumber',
        editComponentProps: {
          placeholder: t('common.systemCalculation'),
          rate: true,
        },
        width: 100,
      },
      {
        title: '使用工序',
        dataIndex: 'processCode',
        i18nField: 'process1',
        width: 120,
        editComponentProps: {
          placeholder: t('dict.PCCColumn.process1'),
        },
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
        title: '备料信息',
        dataIndex: 'prepareMaterialInfo',
        editRow: true,
        editComponentProps: {
          placeholder: t('dict.PCCColumn.prepareMaterialInfo'),
        },
        width: 200,
      },

      {
        title: '用量倍数',
        dataIndex: 'useQtyMultiple',
        editComponent: 'InputNumber',
        className: 'table-required',
        editComponentProps: {
          onChange: (useQtyMultiple, data, record) => {
            const { editValueRefs, origin } = record;
            const calcUseQty = origin.useQty * useQtyMultiple;
            editValueRefs.useQty = isNaN(calcUseQty) ? 0 : calcUseQty;
          },
        },
        editRow: true,
        width: 100,
      },

      {
        title: '用量/KPCS',
        dataIndex: 'useQty',
        helpMessage: ['当单位为M或PCS时，系统计算', 'PCS：【1/（1-不良率）*1000】*用量倍数', 'M：【步距/模数/（1-不良率）】*用量倍数'],
        editRow: true,
        className: 'table-required',
        editComponent: 'InputNumber',
        editComponentProps: {
          placeholder: t('common.systemCalculation'),
          precision: 5,
          step: 0.00001,
          onChange: (useQty, data, record) => {
            console.log('changechangechangechangechangechangechange');
            calcMetersTenHour(useQty, record);
            const { origin } = record;
            origin.useQty = isNaN(useQty) ? 0 : useQty;
          },
        },
        width: 120,
      },
      {
        title: '单位',
        dataIndex: 'unit',
        editRow: true,
        className: 'table-required',
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
            editValueRefs.useQty = isNaN(useQty) ? 0 : useQty.toFixed(5);
            origin.useQty = isNaN(useQty) ? 0 : useQty.toFixed(5);
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
          // nameFormat: ['Name', '(', 'Code', ')'],
        },
        editComponent: 'ApiSelect',
        editDynamicDisabled: true,
        width: 100,
      },
      {
        title: '描述',
        dataIndex: 'description',
        editRow: true,
        editComponentProps: {
          placeholder: t('common.autoCarry'),
        },
        width: 200,
      },
      {
        title: '颜色',
        dataIndex: 'color',
        editRow: true,
        editComponent: 'Input',
        editComponentProps: {
          placeholder: t('common.autoCarry'),
        },
        editDynamicDisabled: true,
        width: 100,
      },
      {
        title: '原材整支长度(M)',
        dataIndex: 'wholeLength',
        editRow: true,
        editComponent: 'InputNumber',
        editComponentProps: {
          placeholder: t('common.autoCarry'),
          onChange: () => {
            calcDowntimeOneHourUtilizationRate();
          },
        },
        editDynamicDisabled: true,
        width: 140,
      },
      {
        title: '原材整支宽度(MM)',
        dataIndex: 'wholeWidth',
        editRow: true,
        // editDynamicDisabled: true,
        editComponent: 'InputNumber',
        editComponentProps: {
          placeholder: t('common.autoCarry'),
          onChange: (wholeWidth, data, record) => {
            const { width, editValueRefs } = record;
            console.log(wholeWidth, width);
            const utilizationRate = Math.floor(wholeWidth / width) / (wholeWidth / width);
            editValueRefs.utilizationRate = (utilizationRate * 100).toFixed(1);
            record.utilizationRate = (utilizationRate * 100).toFixed(1);
          },
        },
        width: 140,
      },

      {
        title: '机台运行10H所需米数(M)',
        dataIndex: 'metersTenHour',
        helpMessage: [t('dict.PCCColumn.metersTenHourTip')],
        editRow: true,
        editDynamicDisabled: true,
        editComponentProps: {
          placeholder: t('common.systemCalculation'),
        },
        width: 220,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        editRow: true,
        width: 200,
      },
    ];
  }

  function handleFileChange(e, index, record) {
    const { editValueRefs } = record;
    editValueRefs.imageList = e;
    updateTechnologyDetailTableDataRecord(index, 'imageList', e);
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
        className: 'form-required',
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
        className: 'form-required',
        dynamicDisabled: () => {
          const { cacheList, index } = state;
          return (
            cacheList[index]?.demandType == 'BusinessSamples' ||
            cacheList[index]?.demandType == 'EngineeringSamples' ||
            cacheList[index]?.currentNode == 'LeaderReview'
          );
        },
        componentProps: {
          placeholder: 'BOM类型',
          api: () => baseStore.getDictionaryData('PCC.BomType', true),
          onChange: e => {
            const { cacheList, index } = state;
            if (e == 4 && cacheList[index]?.demandType == 'Quantitative') {
              setBaseInfoFieldsValue({
                bomType: 1,
              });
              return createMessage.warning('量试需求不能选择样品BOM');
            }
            console.log(e);
            if (state.bomType == 4 || e == 4) {
              state.customerFileList = [];
            }
            state.bomType = e;
            if (e == 4) {
              state.customerFileList = [];
            }
            getVersion();
          },
          labelField: 'fullName',
          valueField: 'enCode',
          immediate: true,
        },
      },
      {
        field: 'docNumber',
        label: '文件编号',
        component: 'Input',
        dynamicDisabled: true,
        // className: 'form-required',
        componentProps: { placeholder: '' },
      },
      {
        field: 'applyCode',
        label: '系统编号',
        // dynamicDisabled: () => {
        //   return mode == 'view';
        // },
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
        className: 'form-required',
        componentProps: {
          placeholder: '制作人',
          allowClear: true,
          showSearch: true,
        },
      },
      {
        field: 'handlerId',
        label: '审批人',
        className: 'form-required',
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

  function calcNumberOfKnives(numberOfKnives, process, updateMeters) {
    if (!updateMeters) {
      setProdInfoFieldsValue({
        mainOperatorSkills: null,
        auxiliaryOperatorSkills: null,
      });
    }
    // const stepDistance = state.technologyList[0].stepDistance;
    if (!process || !numberOfKnives) return;
    const params = {
      numberOfKnives,
      typeCode: process,
    };
    if (updateMeters) {
      const stepDistance = state.technologyList[0].stepDistance;
      params.stepDistance = stepDistance;
    }
    getProcessParaList(params).then(({ code, data }) => {
      if (code == 200) {
        console.log(data);
        if (data) {
          if (updateMeters) {
            setTechnologyFieldsValue({
              adjustmentMetres: data.suggestedAdjustmentMetres,
            });
          } else {
            setTechnologyFieldsValue({
              adjustmentMetres: null,
            });
          }
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
            const { editValueRefs, processCode, speed, speedUnit } = item;
            if (!processCode) return;
            if (processCode.startsWith('2') || processCode.startsWith('3')) {
              console.log(66666);
              // 如果没有速度或速度单位，则填充
              if (!speed) {
                editValueRefs.speed = data.suggestedStartupSpeed;
              }
              if (!speedUnit) {
                editValueRefs.speedUnit = data.suggestedStartupSpeedUnit;
              }
            }
            //   1/(a + Number(b.wholeLength))
            //   1/(a + Number(b.wholeWidth))
          });
        }
      }
    });
  }

  function handleReject() {
    const { cacheList, index } = state;
    console.log(cacheList, index);
    openRejectModal(true, {
      api: rejectPcc,
      ids: [cacheList[index].id],
    });
  }

  function handleReview() {
    changeLoading(true);
    const { cacheList, index } = state;
    bulkCommitPcc([cacheList[index].id])
      .then(({ code, msg }) => {
        if (code == 200) {
          // state.showReject = false;
          // state.showReview = false;
          cacheList[index].status = 3;
          createMessage.success(msg);
          emit('reload');
        } else {
          createMessage.error(msg);
        }
      })
      .finally(() => {
        changeLoading(false);
      });
  }

  function handleECNSubmit() {
    console.log('handleECNSubmit');
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
        const metersTenHour = parseInt(Math.round(capacity * useQty * 10));
        editValueRefs.metersTenHour = isNaN(metersTenHour) ? 0 : metersTenHour;
        console.log(metersTenHour, 'metersTenHour');
      } else {
        createMessage.warning('请先选择主工序');
      }
    }
  }

  function calcUseQty() {
    nextTick(() => {
      const defectRate = getTechnologyDataSource().reduce((pre, next) => {
        pre += Number(next.defectRate || 0);
        return pre;
      }, 0);
      const datalist = getMaterialDataSource();
      datalist.map(record => {
        const { editValueRefs, unit } = record;
        let useQty;
        if (unit == 'PCS') {
          useQty = (1 / (1 - defectRate / 100)) * 1000;
        } else if (unit == 'M') {
          const stepDistance = state.technologyList[0].stepDistance;
          const modulus = state.technologyList[0].modulus;
          useQty = stepDistance / modulus / (1 - defectRate / 100);
        }
        editValueRefs.useQty = isNaN(useQty) ? 0 : useQty.toFixed(5);
        record.origin.useQty = isNaN(useQty) ? 0 : useQty;
        calcMetersTenHour(useQty, record);
      });
    });
  }

  // 脱敏图纸处理
  function handleDrawView() {
    const { cacheList, index } = state;
    openDrawViewModal(true, {
      id: cacheList[index].desensitizedDrawingsId,
    });
  }

  async function handlePrint() {
    // 基础信息
    const baseInfo = await validateBaseInfoFields();
    // 生产信息
    const prodInfo = await validateProdInfoFields();
    // 工艺信息
    const technologyInfo = await validateTechnologyFields();
    technologyInfo.technologyList = technologyList.value || [];
    // 模具料号
    const moldNoList = toBeGenerateList.value.map(item => item.code);
    // 工艺流程
    const technologyTableData = getTechnologyDataSource();
    const technologyTableForm = getTechnologyTableFieldsValue();
    // 材料表格数据
    const materialTableData = getMaterialDataSource();
    // 包规 & 包材
    const packageData = unref(packageRef)?.getDataSource() ?? {};
    // 工艺流程详述
    const technologyDetailTableData = getTechnologyDetailDataSource();
    // 变更履历
    const changeHistoryTableData = getChangeHistoryDataSource();

    changeLoading(true);
    printPCCDetail({
      baseInfo,
      prodInfo,
      technologyInfo,
      moldNoList,
      technologyTableData,
      technologyTableForm,
      materialTableData,
      packageData: { ...(state.cacheList[state.index] || {}), ...packageData },
      technologyDetailTableData,
      changeHistoryTableData,
    }).finally(() => {
      changeLoading(false);
    });
  }
</script>
<style scoped lang="less">
  .container-box {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
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
    line-height: 1;
  }

  :deep(.ant-form-item-no-colon) {
    line-height: 1;
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

  .span-required::before {
    display: inline-block;
    margin-inline-end: 4px;
    color: #ed6f6f;
    font-size: 14px;
    font-family: SimSun, sans-serif;
    line-height: 1;
    content: '*';
  }

  :deep(.form-required) {
    & > div > div > label::before {
      display: inline-block;
      margin-inline-end: 4px;
      color: #ed6f6f;
      font-size: 14px;
      font-family: SimSun, sans-serif;
      line-height: 1;
      content: '*';
    }
  }

  :deep(.table-required) {
    & > span:first-child::before {
      display: inline-block;
      margin-inline-end: 4px;
      color: #ed6f6f;
      font-size: 14px;
      font-family: SimSun, sans-serif;
      line-height: 1;
      content: '*';
    }
  }

  :deep(.material span) {
    line-height: 1;
  }
</style>
