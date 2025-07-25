<script setup lang="ts">
import { ref, reactive, onMounted, h } from 'vue';
import type { DataTableColumns, FormInst } from 'naive-ui';
import { NButton, useMessage, useDialog } from 'naive-ui';
import apis from '@/api/holidays';
import type { HolidayItem } from '@/api/holidays';

const message = useMessage();
const dialog = useDialog();

interface Holiday {
  id: number
  name: string
  day: number
  img: string
  date: string,
  week: string
};

interface Query {
  page: number
  pageSize: number
}

const query = reactive<Query>({
  page: 1,
  pageSize: 10
});
const total = ref<number>(0);

const tableData = ref<HolidayItem[]>([]);
const tableLoading = ref(false);

const showModal = ref(false);
const isEdit = ref(false);
const editingId = ref<number | null>(null);

const form = reactive<Partial<Holiday>>({
  name: '',
  day: 1,
  img: '',
  date: new Date().toISOString(),
  week: ''
});

const formRef = ref<FormInst | null>(null);

const rules = {
  name: { required: true, message: '请输入名称', trigger: 'blur' },
  day: { required: true, type: 'number', message: '请输入放假天数', trigger: ['blur', 'change'] },
  date: { required: true, type: 'string', message: '请选择日期', trigger: 'change' }
};

// 获取列表
function getList() {
  tableLoading.value = true;

  apis.getHolidayList({ ...query })
    .then((res) => {
      if (res.code === 200 && res.data && Array.isArray(res.data.data)) {
        tableData.value = res.data.data;
        total.value = res.data.total;
      } else {
        message.error(res.message || '获取列表失败');
      }
    })
    .finally(() => {
      tableLoading.value = false;
    });
}

function onPageChange(page: number) {
  query.page = page;
  getList();
}

function onPageSizeChange(size: number) {
  query.pageSize = size;
  query.page = 1; // 切换分页大小时建议回到第一页
  getList();
}

function handleAdd() {
  isEdit.value = false;
  Object.assign(form, {
    name: '',
    day: 1,
    img: '',
    date: new Date().toISOString()
  });
  showModal.value = true;
}

function handleEdit(row: Holiday) {
  isEdit.value = true;
  editingId.value = row.id;
  Object.assign(form, { ...row, day: Number(row.day) });
  showModal.value = true;
}

function handleDelete(row: Holiday) {
  dialog.warning({
    title: '确认删除？',
    content: `是否删除「${row.name}」？`,
    positiveText: '删除',
    negativeText: '取消',
    onPositiveClick: async () => {
      const res = await apis.deleteHoliday(row.id);
      if (res.code === 200) {
        message.success('已删除');
        showModal.value = false;
        await getList();
      } else {
        message.error(res.message || '删除失败');
      }
    }
  });
}

async function handleSave() {
  await formRef.value?.validate();

  const payload = {
    ...form,
    day: form.day,
  };

  let res;
  if (isEdit.value && editingId.value) {
    res = await apis.updateHoliday({ ...(payload as HolidayItem), id: editingId.value });
  } else {
    res = await apis.createHoliday(payload as HolidayItem);
  }

  if (res.code === 200) {
    message.success(isEdit.value ? '修改成功' : '新增成功');
    showModal.value = false;
    await getList();
  } else {
    message.error(res.message || '保存失败');
  }
}

onMounted(() => {
  getList();
});

const columns: DataTableColumns<Holiday> = [
  { title: 'ID', key: 'id', width: 100, align: 'center' },
  { title: '名称', key: 'name', width: 150, align: 'center' },
  { title: '放假天数', key: 'day', width: 100, align: 'center' },
  {
    title: '星期图片',
    key: 'img',
    width: 100,
    align: 'center',
    render: row => h('img', { src: row.img, width: 40 })
  },
  {
    title: '节假日日期',
    key: 'date',
    width: 100,
    align: 'center',
    render: row => new Date(row.date).toLocaleDateString()
  },
  {
    title: '操作',
    key: 'actions',
    width: 150,
    align: 'center',
    render: row =>
      h('div', {}, [
        h(
          NButton,
          { size: 'small', onClick: () => handleEdit(row) },
          { default: () => '编辑' }
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            style: { marginLeft: '8px' },
            onClick: () => handleDelete(row)
          },
          { default: () => '删除' }
        )
      ])
  }
];
</script>

<template>
  <div>
    <BaseCard customClass="!mb-2.5">
      <n-button ghost type="primary" @click="handleAdd">
        <template #icon>
          <SvgIcon icon="material-symbols:add-2" :font-size="40" />
        </template>
        新增节假日
      </n-button>
    </BaseCard>
    <BaseCard>
      <n-data-table style="height: calc(100dvh - 205px)" flex-height striped :columns="columns" :data="tableData"
        :loading="tableLoading" :scroll-x="800" />
      <n-pagination class="!mt-[10px] flex justify-end" :item-count="total" v-model:page="query.page"
        v-model:page-size="query.pageSize" @update:page="onPageChange" @update:page-size="onPageSizeChange"
        show-size-picker :page-sizes="[10, 20, 30, 40]">
        <template #prefix="{ itemCount }">
          共 {{ itemCount }} 条
        </template>
      </n-pagination>
    </BaseCard>

    <n-modal v-model:show="showModal" title="节假日信息" preset="dialog">
      <n-form :model="form" :rules="rules" ref="formRef" label-width="80">
        <n-form-item label="名称" path="name">
          <n-input v-model:value="form.name" />
        </n-form-item>
        <n-form-item label="天数" path="day">
          <n-input-number v-model:value="form.day" :min="1" />
        </n-form-item>
        <n-form-item label="图片路径" path="img">
          <n-input v-model:value="form.img" />
        </n-form-item>
        <n-form-item label="日期" path="date">
          <n-date-picker v-model:value="form.date" type="date" />
        </n-form-item>
      </n-form>
      <template #action>
        <n-button @click="showModal = false">取消</n-button>
        <n-button type="primary" @click="handleSave">保存</n-button>
      </template>
    </n-modal>
  </div>
</template>
