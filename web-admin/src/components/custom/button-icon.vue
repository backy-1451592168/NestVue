<script setup lang="ts">
import type { PopoverPlacement } from 'naive-ui';

defineOptions({
  name: 'ButtonIcon',
  inheritAttrs: false
});

interface Props {
  /** Button class */
  class?: string;
  defaultClass?: string;
  /** Iconify icon name */
  icon?: string;
  /** Tooltip content */
  tooltipContent?: string;
  /** Tooltip placement */
  tooltipPlacement?: PopoverPlacement;
  zIndex?: number;
  /** 图标大小（单位 px），可传数字或字符串，默认 14 */
  iconSize?: number | string;
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
  defaultClass: '',
  icon: '',
  tooltipContent: '',
  tooltipPlacement: 'bottom',
  zIndex: 98,
  iconSize: 14
});

const DEFAULT_CLASS = 'h-[36px] text-icon';

</script>

<template>
  <NTooltip :placement="tooltipPlacement" :z-index="zIndex" :disabled="!tooltipContent">
    <template #trigger>
      <NButton quaternary :class="[DEFAULT_CLASS, props.defaultClass]" v-bind="$attrs">
        <div class="flex-center gap-8px" :class="props.class">
          <slot>
            <SvgIcon :icon="icon" :font-size="iconSize" />
          </slot>
        </div>
      </NButton>
    </template>
    {{ tooltipContent }}
  </NTooltip>
</template>

<style scoped></style>
